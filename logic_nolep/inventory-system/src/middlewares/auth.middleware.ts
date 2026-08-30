import type { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import { eq } from "drizzle-orm";
import { config } from "../config/config.js";
import { db } from "../db/index.js";
import { users } from "../db/schema.js";
import { ApiError } from "../utils/api-error.js";

export type JwtPayload = {
  sub: string;
  role: "user" | "admin";
  type: "access" | "refresh";
};

export const authenticate: RequestHandler = async (request, _response, next) => {
  try {
    const authorization = request.headers.authorization;
    if (!authorization?.startsWith("Bearer ")) {
      throw new ApiError(401, "Authentication token is required");
    }

    const token = authorization.slice(7);
    const decoded = jwt.verify(token, config.jwtSecret) as JwtPayload;
    if (decoded.type !== "access" || !decoded.sub) {
      throw new ApiError(401, "Invalid access token");
    }

    const [user] = await db.select().from(users).where(eq(users.id, decoded.sub)).limit(1);
    if (!user) throw new ApiError(401, "User for this token no longer exists");

    request.user = user;
    next();
  } catch (error) {
    if (error instanceof ApiError) return next(error);
    if (error instanceof jwt.TokenExpiredError) return next(new ApiError(401, "Access token has expired"));
    return next(new ApiError(401, "Invalid access token"));
  }
};

export const authorize = (...roles: Array<"user" | "admin">): RequestHandler => {
  return (request, _response, next) => {
    if (!request.user) return next(new ApiError(401, "Authentication is required"));
    if (!roles.includes(request.user.role)) {
      return next(new ApiError(403, "You do not have permission to perform this action"));
    }
    return next();
  };
};
