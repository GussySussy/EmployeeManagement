import { NextFunction, Request, Response } from "express";
import HttpException from "../exception/httpException";
import { logger } from "../app";

export const errorMiddleware = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (error instanceof HttpException) {
        const status: number = error.status || 500;
        const message: string = error.message || "Something went Wrong"
        logger.error(`${error.status} : ${error.message}`)
        let respbody = {message: message}
        res.status(status).json(respbody)
    }
    else{
        logger.error(error.stack)
        res.status(500).send({error: error.message})
    }
  } catch (error) {
    next(error)
  }
};
