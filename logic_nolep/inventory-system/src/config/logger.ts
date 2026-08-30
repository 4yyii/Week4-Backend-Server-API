import winston from "winston";
import { config } from "./config.js";

const logger = winston.createLogger({
  level: config.isDevelopment ? "debug" : "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    config.isDevelopment ? winston.format.colorize() : winston.format.uncolorize(),
    winston.format.printf(({ timestamp, level, message, stack }) =>
      stack ? `[${timestamp}] ${level}: ${message}\n${stack}` : `[${timestamp}] ${level}: ${message}`,
    ),
  ),
  transports: [new winston.transports.Console()],
});

export { logger };
