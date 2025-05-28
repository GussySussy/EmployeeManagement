import { NextFunction, Request, Response, Router } from "express";
import EmployeeService from "../services/employee.service";
import HttpException from "../exception/httpException";
import { isEmail } from "../validators/emailValidator";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { UpdateEmployeeDto } from "../dto/update-employee.dto";
import authorizationMiddleware from "../middlewares/authorization.middleware";
import { EmployeeRole } from "../entities/employee.entity";
import { CreateDepartmentDto } from "../dto/create-department.dto";
import DepartmentService from "../services/department.services";
import { UpdateDepartmentDto } from "../dto/update-department.dto";
import { logger } from "../app";

class DepartmentController {
  constructor(private departmentService: DepartmentService, router: Router) {
    router.put(
      "/:id",
      authorizationMiddleware([EmployeeRole.HR]),
      this.updateDepartmentById.bind(this)
    );
    router.get("/:id", this.getDepartmentById.bind(this));
    router.get("/", this.getAllDepartments.bind(this));
    router.post(
      "/",
      authorizationMiddleware([EmployeeRole.HR]),
      this.createDepartment.bind(this)
    );
    router.delete(
      "/:id",
      authorizationMiddleware([EmployeeRole.HR]),
      this.deleteDepartment.bind(this)
    );
  }

  public async createDepartment(req: Request, res: Response, next) {
    try {
      const createDepartmentDto = plainToInstance(
        CreateDepartmentDto,
        req.body
      );
      const errors = await validate(createDepartmentDto);
      if (errors.length > 0) {
        console.log(JSON.stringify(errors));
        throw new HttpException(400, JSON.stringify(errors));
      }
      const savedDepartment = await this.departmentService.createDepartment(
        createDepartmentDto.name
      );
      logger.info(`Created department successfully`);
      res.status(201).send(savedDepartment);
    } catch (error) {
      next(error);
    }
  }

  async getAllDepartments(req: Request, res: Response) {
    const employees = await this.departmentService.getAllDepartments();
    logger.info(`Fetched all departments details`);
    res.status(200).send(employees);
  }

  async getDepartmentById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params["id"]);
      const department = await this.departmentService.getDepartmentById(id);
      if (!department) {
        throw new HttpException(404, `Department with id : ${id} not found`);
      }
      logger.info(`Fetched department with id : ${id}`);
      res.status(200).send(department);
    } catch (err) {
      next(err);
    }
  }

  async updateDepartmentById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      const updateDepartmentDto = plainToInstance(
        UpdateDepartmentDto,
        req.body
      );
      const errors = await validate(updateDepartmentDto);
      if (errors.length > 0) {
        console.log(JSON.stringify(errors));
        throw new HttpException(400, JSON.stringify(errors));
      }
      const savedDepartment = await this.departmentService.updateDepartment(
        id,
        updateDepartmentDto
      );
      if (!savedDepartment) {
        throw new HttpException(404, `Department with id : ${id} not found`);
      }
      logger.info(`Updated department with id : ${id}`);
      res
        .status(200)
        .send("Entry Updated Successfully as : " + savedDepartment.name);
    } catch (e) {
      next(e);
    }
  }

  async deleteDepartment(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params["id"]);
      const department = await this.departmentService.deleteDepartment(id);
      if (!department) {
        throw new HttpException(404, `Department with id : ${id} not found`);
      }
      logger.info(`Deleted departments with id : ${id}`);
      res.status(200).send("Department Deleted Successfully");
    } catch (e) {
      logger.warn("Cannot delete department with existing employees");
      next(e);
    }
  }
}

export default DepartmentController;
