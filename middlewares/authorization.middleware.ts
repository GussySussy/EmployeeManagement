import { NextFunction, Request, Response } from "express";
import { EmployeeRole } from "../entities/employee.entity";
import HttpException from "../exception/httpException";

const authorizationMiddleware = (role: EmployeeRole) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const userRole = req.user?.role;
    if (role !== userRole) {
      throw new HttpException(
        403,
        "User has no privilege to access the specified resource"
      );
    }
    next();
  };
};

export default authorizationMiddleware;
