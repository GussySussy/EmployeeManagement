import Employee, { EmployeeRole } from "../../entities/employee.entity";
import EmployeeRepository from "../../repositories/employee.repository";
import EmployeeService from "../../services/employee.service";
import { MockProxy, anyNumber, mock } from "jest-mock-extended";
import { when } from "jest-when";
import Address from "../../entities/address.entity";
import DepartmentRepository from "../../repositories/department.repository";
import { UpdateEmployeeDto } from "../../dto/update-employee.dto";
import HttpException from "../../exception/httpException";

describe("EmployeeService", () => {
  let employeeRepository: MockProxy<EmployeeRepository>;
  let departmentRepository: MockProxy<DepartmentRepository>;
  let employeeService: EmployeeService;

  beforeEach(() => {
    employeeRepository = mock<EmployeeRepository>();
    departmentRepository = mock<DepartmentRepository>();
    employeeService = new EmployeeService(
      employeeRepository,
      departmentRepository
    );
  });

  describe("getEmployeeById", () => {
    it("Getting an existing employee with id", async () => {
      const mockEmployee = new Employee(
        "thomas@gmail.com",
        "Thomas",
        19,
        "@charmander123"
      );
      mockEmployee.role = EmployeeRole.DEVELOPER;
      mockEmployee.address.line1 = "On top of the Eiffel Tower";
      mockEmployee.address.pincode = "124619";
      when(employeeRepository.findOneById)
        .calledWith(6)
        .mockReturnValue(mockEmployee);

      const result = await employeeService.getEmployeeById(6);
      expect(employeeRepository.findOneById).toHaveBeenCalledWith(6);
      expect(result).toStrictEqual(mockEmployee);
    });

    it("should throw error when user with provided  id does not exist", async () => {
      //Arrange
      when(employeeRepository.findOneById).calledWith(1).mockReturnValue(null);
      //Act
      expect(employeeService.getEmployeeById(2)).rejects.toThrow(
        "Employee not found"
      );
      //Assert
      expect(employeeRepository.findOneById).toHaveBeenCalledWith(2);
    });
  });

  describe("getAllEmployees", () => {
    it("should return employee list", async () => {
      const mockList = [{ id: 1 }, { id: 2 }] as Employee[];
      when(employeeRepository.findMany).mockReturnValue(mockList);

      const result = await employeeService.getAllEmployees();
      expect(result).toHaveLength(2);
      expect(result).toEqual(mockList);
    });
    it("should not return employee list", async () => {
      when(employeeRepository.findMany).mockResolvedValue(null);
      const result = await employeeService.getAllEmployees();
      expect(result).toBeNull;
    });
  });

  describe("updateEmployeeById", () => {


    it("test for updating employee", async () => {
      const mockUpdateEmployeeDto = {
        name: "New Name",
      } as UpdateEmployeeDto;
      const mockEmployeeBeforeUpdate = {
        id: 10,
        name: "Name",
      } as Employee;
      const mockEmployeeAfterUpdate = {
        id: 10,
        name: "New Name",
      } as Employee;
      when(employeeRepository.findOneById)
        .calledWith(10)
        .mockReturnValue(mockEmployeeBeforeUpdate);
      when(employeeRepository.update)
        .calledWith(10, mockEmployeeAfterUpdate)
        .mockReturnValue(mockEmployeeAfterUpdate);
      const result = await employeeService.updateEmployee(
        10,
        mockUpdateEmployeeDto
      );
      console.log(result);
      expect(result).toStrictEqual(mockEmployeeAfterUpdate);
    });


    it("test for wrong emp id", async () => {
      const mockUpdateEmployeeDto = {
        name: "New Name",
      } as UpdateEmployeeDto;
      const mockError = new HttpException(404, "Employee not found");
      when(employeeRepository.findOneById).calledWith(10).mockResolvedValue(null);
      expect(employeeService.updateEmployee(10, mockUpdateEmployeeDto));
    });
  });

  describe("deleteEmployee", () => {
    it("should call remove if employee exists", async () => {
      const mockEmployee = { id: 1 } as Employee;
      when(employeeRepository.findOneById)
        .calledWith(1)
        .mockReturnValue(mockEmployee);

      await employeeService.deleteEmployee(1);

      expect(employeeRepository.remove).toHaveBeenCalledWith(mockEmployee);
    });
    it("should not call remove if employee does not exist", async () => {
      when(employeeRepository.findOneById).calledWith(99).mockResolvedValue(null);

      await employeeService.deleteEmployee(99);

      expect(employeeRepository.remove).not.toHaveBeenCalled();
    });
  });
});
