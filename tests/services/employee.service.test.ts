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

describe("EmployeeService", () => {
  let employeeRepository: MockProxy<EmployeeRepository>;
  let employeeService: EmployeeService;

  beforeEach(() => {
    employeeRepository = mock<EmployeeRepository>();
    employeeService = new EmployeeService(employeeRepository);
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
  });
});
