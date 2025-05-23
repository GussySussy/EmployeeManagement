import express from "express";
import employeeRouter from "./routes/employee.routes";
import loggerMiddleware from "./middlewares/loggerMiddleware";
import { datasource } from "./db/data-source";
import { errorMiddleware } from "./middlewares/errorMiddleware";
import authRouter from "./routes/auth.routes";
import authMiddleware from "./middlewares/auth.middleware";
import { LoggerService } from "./services/logger.service";

const { Client } = require("pg");

const server = express();
const logger = LoggerService.getInstance("app()");
server.use(express.json());
server.use(loggerMiddleware);

server.use("/employee", authMiddleware, employeeRouter);
server.use("/auth", authRouter);
server.use(errorMiddleware);

server.get("/", (req, res) => {
  console.log(req.url);
  res.status(200).send("Hello world typescript");
});

(async () => {
  try {
    await datasource.initialize();
    logger.info("Database connected");
    server.listen(3000, () => {
      logger.info("server running on http://localhost:3000");
    });
  } catch(e) {
    logger.error(`Failed to connect to db -${e}`);
    process.exit(1);
  }
})();
