import type { ErrorRequestHandler } from "express";
import { ZodError } from "zod";
import { config } from "../config/config.js";
import { logger } from "../config/logger.js";
import { ApiError } from "../utils/api-error.js";

type DatabaseError = Error & { code?: string; constraint?: string; detail?: string };

export const errorHandler: ErrorRequestHandler = (error: DatabaseError, _request, response, _next) => {
  let statusCode = 500;
  let message = "Internal server error";
  let details: unknown;

  if (error instanceof ApiError) {
    statusCode = error.statusCode;
    message = error.message;
    details = error.details;
  } else if (error instanceof ZodError) {
    statusCode = 400;
    message = "Validation failed";
    details = error.issues;
  } else if (error.code === "23505") {
    statusCode = 409;
    message = "A record with the same unique value already exists";
    details = error.constraint;
  } else if (error.code === "23503" || error.code === "23514") {
    statusCode = 409;
    message = "This operation conflicts with related data or a database constraint";
    details = error.detail;
  } else if (error.code === "22P02") {
    statusCode = 400;
    message = "Invalid data format";
  }

  if (statusCode >= 500) logger.error(error);

  response.status(statusCode).json({
    success: false,
    message,
    ...(details ? { details } : {}),
    ...(config.isDevelopment && statusCode >= 500 ? { stack: error.stack } : {}),
  });
};
