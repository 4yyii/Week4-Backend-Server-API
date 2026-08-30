import type { Request } from "express";
import { ApiError } from "./api-error.js";

export const getPathParam = (request: Request, name: string): string => {
  const value = request.params[name];
  if (typeof value !== "string") throw new ApiError(400, `Invalid path parameter: ${name}`);
  return value;
};
