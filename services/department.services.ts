import { UpdateEmployeeDto } from "../dto/update-employee.dto";
import { LoggerService } from "./logger.service";
import DepartmentRepository from "../repositories/department.repository";
import Department from "../entities/department.entity";
import { UpdateDepartmentDto } from "../dto/update-department.dto";

class DepartmentService {
  private logger = LoggerService.getInstance("app()");
  constructor(private departmentRepository: DepartmentRepository) {}

  async createDepartment(dept_name: string): Promise<Department> {
    const newDepartment = new Department(dept_name);
    return this.departmentRepository.create(newDepartment);
  }

  async getAllDepartments(): Promise<Department[]> {
    return this.departmentRepository.findMany();
  }

  async getDepartmentById(id: number): Promise<Department> {
    return this.departmentRepository.findOneById(id);
  }

  async updateDepartment(id: number, updateDepartmentDto: UpdateDepartmentDto) {
    const existingDepartment = await this.departmentRepository.findOneById(id);
    if (existingDepartment) {
      const department = new Department();
      department.name = updateDepartmentDto.name;
      await this.departmentRepository.update(id, department);
    }
    return this.departmentRepository.findOneById(id);
  }

  async deleteDepartment(id: number) {
    const existingDepartment = await this.departmentRepository.findOneById(id);
    if (existingDepartment) {
      await this.departmentRepository.remove(existingDepartment);
    }
    return existingDepartment
  }
}

export default DepartmentService;
