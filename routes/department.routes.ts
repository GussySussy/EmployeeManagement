import express from "express";
import { datasource } from "../db/data-source";
import department from "../entities/department.entity";
import DepartmentRepository from "../repositories/department.repository";
import DepartmentService from "../services/department.services";
import DepartmentController from "../controller/department.controller";

const departmentRouter = express.Router();

const departmentRepository = new DepartmentRepository(datasource.getRepository(department))
const departmentService = new DepartmentService(departmentRepository)
const departmentController = new DepartmentController(departmentService, departmentRouter)

export { departmentService, departmentRepository}
export default departmentRouter