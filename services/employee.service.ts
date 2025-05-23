import { CreateAddressDto } from "../dto/create-address.dto";
import { UpdateEmployeeDto } from "../dto/update-employee.dto";
import Address from "../entities/address.entity";
import Employee, { EmployeeRole } from "../entities/employee.entity";
import EmployeeRepository from "../repositories/employee.repository";
import bcrypt from "bcrypt";
import { LoggerService } from "./logger.service";

class EmployeeService {
  private logger = LoggerService.getInstance("app()");
  constructor(private employeeRepository: EmployeeRepository) {}

  async createEmployee(
    email: string,
    name: string,
    age: number,
    password: string,
    role: EmployeeRole,
    address: CreateAddressDto
  ): Promise<Employee> {
    const newEmployee = new Employee(email, name, age);
    newEmployee.password = await bcrypt.hash(password, 10);
    newEmployee.role = role;
    newEmployee.address.line1 = address.line1;
    newEmployee.address.pincode = address.pincode;
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
      const employee = new Employee();
      employee.name = employeeUpdate.name || existingEmployee.name;
      employee.email = employeeUpdate.email || existingEmployee.email;
      employee.age = employeeUpdate.age || existingEmployee.age;
      employee.address.line1 =
        employeeUpdate.address.line1 || existingEmployee.address.line1;
      employee.address.pincode =
        employeeUpdate.address.pincode || existingEmployee.address.pincode;
      await this.employeeRepository.update(id, employee);
      //   return this.employeeRepository.findOneById(id)
    }
  }

  async deleteEmployee(id: number) {
    const existingEmployee = await this.employeeRepository.findOneById(id);
    if (existingEmployee) {
      await this.employeeRepository.remove(existingEmployee);
    }
    // await this.employeeRepository.delete(id);
  }
}

export default EmployeeService;
