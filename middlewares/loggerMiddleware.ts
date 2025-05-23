import { logger } from "../app";

const loggerMiddleware = (req, res, next) => {
  res.on("finish", () => {
    logger.info(
      `[${new Date().toISOString()}] ${req.method} ${req.originalUrl} ${res.statusCode}`,
    );
  });
  // Call next middleware, or handler
  next();
};

export default loggerMiddleware;
