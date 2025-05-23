import {
  AirbagService,
  CrashSensor,
  AirbagIgniter,
  AirbagResult,
} from "../../services/airbag.service";
import Employee, { EmployeeRole } from "../../entities/employee.entity";
import EmployeeRepository from "../../repositories/employee.repository";
import EmployeeService from "../../services/employee.service";
import { MockProxy, mock } from "jest-mock-extended";
import { when } from "jest-when";
import Address from "../../entities/address.entity";
import DepartmentRepository from "../../repositories/department.repository";

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
});
