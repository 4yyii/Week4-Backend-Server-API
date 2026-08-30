import type { RequestHandler } from "express";
import type { ZodType } from "zod";
import { ApiError } from "../utils/api-error.js";

type RequestSchemas = {
  body?: ZodType;
  params?: ZodType;
  query?: ZodType;
};

export const validate = (schemas: RequestSchemas): RequestHandler => {
  return (request, _response, next) => {
    try {
      if (schemas.params) {
        const parsedParams = schemas.params.parse(request.params);
        Object.assign(request.params, parsedParams);
      }
      if (schemas.query) {
        const parsedQuery = schemas.query.parse(request.query);
        Object.assign(request.query, parsedQuery);
      }
      if (schemas.body) {
        request.body = schemas.body.parse(request.body) as unknown;
      }
      next();
    } catch (error: any) {
      next(new ApiError(400, "Validation failed", error));
    }
  };
};
