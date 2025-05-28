import { CreateAddressDto } from "../dto/create-address.dto";
import { UpdateEmployeeDto } from "../dto/update-employee.dto";
import Address from "../entities/address.entity";
import Employee, { EmployeeRole, Status } from "../entities/employee.entity";
import EmployeeRepository from "../repositories/employee.repository";
import bcrypt from "bcrypt";
import { LoggerService } from "./logger.service";
import { CreateDepartmentDto } from "../dto/create-department.dto";
import DepartmentRepository from "../repositories/department.repository";
import HttpException from "../exception/httpException";

class EmployeeService {
  private logger = LoggerService.getInstance("app()");
  constructor(
    private employeeRepository: EmployeeRepository,
    private departmentRepository: DepartmentRepository
  ) {}

  async createEmployee(
    email: string,
    name: string,
    age: number,
    password: string,
    role: EmployeeRole,
    experience: number,
    dateOfJoining: Date,
    employeeId: string,
    status: Status,
    address: CreateAddressDto,
    department_id: number
  ): Promise<Employee> {
    const newEmployee = new Employee(email, name, age);
    newEmployee.password = await bcrypt.hash(password, 10);
    newEmployee.role = role;
    newEmployee.employeeId = employeeId;
    newEmployee.experience = experience;
    newEmployee.dateOfJoining = new Date(dateOfJoining);
    newEmployee.status = status;
    newEmployee.address.line1 = address.line1;
    newEmployee.address.houseNo = address.houseNo;
    newEmployee.address.line2 = address.line2;
    newEmployee.address.pincode = address.pincode;
    const department = await this.departmentRepository.findOneById(
      department_id
    );
    if (!department) {
      throw new HttpException(
        400,
        "A department does not exist with the given department id"
      );
    }
    newEmployee.department = department;
    return this.employeeRepository.create(newEmployee);
  }

  async getAllEmployees(): Promise<Employee[]> {
    return this.employeeRepository.findMany();
  }

  async getEmployeeById(id: number): Promise<Employee> {
    return this.employeeRepository.findOneById(id);
  }

  async getEmployeeByEmail(email: string): Promise<Employee> {
    return this.employeeRepository.findOneByEmail(email);
  }

  async updateEmployee(id: number, employeeUpdate: UpdateEmployeeDto) {
    const existingEmployee = await this.employeeRepository.findOneById(id);
    if (existingEmployee) {
      existingEmployee.name = employeeUpdate.name || existingEmployee.name;
      existingEmployee.email = employeeUpdate.email || existingEmployee.email;
      existingEmployee.age = employeeUpdate.age || existingEmployee.age;
      existingEmployee.employeeId =
        employeeUpdate.employeeId || existingEmployee.employeeId;
      existingEmployee.experience =
        employeeUpdate.experience || existingEmployee.experience;
      if (employeeUpdate.dateOfJoining) {
        existingEmployee.dateOfJoining =
          new Date(employeeUpdate.dateOfJoining)
      }
      existingEmployee.status =
        employeeUpdate.status || existingEmployee.status;
      existingEmployee.address.line1 =
        employeeUpdate.address?.line1 || existingEmployee.address.line1;
      existingEmployee.address.houseNo =
        employeeUpdate.address?.houseNo || existingEmployee.address.houseNo;
      existingEmployee.address.line2 =
        employeeUpdate.address?.line2 || existingEmployee.address.line2;
      existingEmployee.address.pincode =
        employeeUpdate.address?.pincode || existingEmployee.address.pincode;
      const department = await this.departmentRepository.findOneById(
        employeeUpdate.department
      );
      if (!department) {
        throw new Error(
          "A department does not exist with the given department id"
        );
      }
      existingEmployee.department = department || existingEmployee.department;
      await this.employeeRepository.update(id, existingEmployee);
      return existingEmployee;
    }
  }

  async deleteEmployee(id: number) {
    const existingEmployee = await this.employeeRepository.findOneById(id);
    if (existingEmployee) {
      await this.employeeRepository.remove(existingEmployee);
    }
    return existingEmployee;
  }
}

export default EmployeeService;
