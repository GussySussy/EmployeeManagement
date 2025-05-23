import { NextFunction, Request, Response, Router } from "express";
import EmployeeService from "../services/employee.service";
import HttpException from "../exception/httpException";
import { isEmail } from "../validators/emailValidator";
import { CreateEmployeeDto } from "../dto/create-employee.dto";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { UpdateEmployeeDto } from "../dto/update-employee.dto";
import authorizationMiddleware from "../middlewares/authorization.middleware";
import { EmployeeRole } from "../entities/employee.entity";

class EmployeeController {
  constructor(private employeeService: EmployeeService, router: Router) {
    router.put("/:id",authorizationMiddleware(EmployeeRole.HR), this.updateEmployeeById.bind(this));
    router.get("/:id", this.getEmployeeById.bind(this));
    router.get("/", this.getAllEmployees.bind(this));
    router.post("/",authorizationMiddleware(EmployeeRole.HR), this.createEmployee.bind(this));
    router.delete("/:id", authorizationMiddleware(EmployeeRole.HR), this.deleteEmployee.bind(this));
  }

  public async createEmployee(req: Request, res: Response, next) {
    try {
      console.log(req.user)
      const createEmployeeDto = plainToInstance(CreateEmployeeDto, req.body);
      const errors = await validate(createEmployeeDto);
      if (errors.length > 0) {
        console.log(JSON.stringify(errors));
        throw new HttpException(400, JSON.stringify(errors));
      }
      const savedEmployee = await this.employeeService.createEmployee(
        createEmployeeDto.email,
        createEmployeeDto.name,
        createEmployeeDto.age,
        createEmployeeDto.password,
        createEmployeeDto.role,
        createEmployeeDto.address
      );
      res.status(201).send(savedEmployee);
    } catch (error) {
      next(error);
    }
  }

  async getAllEmployees(req: Request, res: Response) {
    console.log(req.user)
    const employees = await this.employeeService.getAllEmployees();
    res.status(200).send(employees);
  }

  async getEmployeeById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params["id"]);
      const employee = await this.employeeService.getEmployeeById(id);
      if (!employee) {
        throw new HttpException(404, `Employee with id : ${id} not found`);
      }
      res.status(200).send(employee);
    } catch (err) {
      console.log(err);
      next(err);
    }
  }

  // TODO: Update Middleware and DTO
  async updateEmployeeById(req: Request, res: Response) {
    const id = Number(req.params.id);
    const updateEmployeeDto = plainToInstance(UpdateEmployeeDto, req.body);
    const errors = await validate(updateEmployeeDto);
    if (errors.length > 0) {
      console.log(JSON.stringify(errors));
      throw new HttpException(400, JSON.stringify(errors));
    }
      const savedEmployee = await this.employeeService.updateEmployee(
        id,
        updateEmployeeDto,
      );
    res.status(200).send("Entry Updated Successfully.");
  }

  async deleteEmployee(req: Request, res: Response) {
    const id = Number(req.params["id"]);
    await this.employeeService.deleteEmployee(id);
    res.status(200).send("Row Deleted Successfully");
  }
}

export default EmployeeController;
