import type { Request, Response } from "express";
import * as authService from "../services/auth.service.js";
import { sendSuccess } from "../utils/response.js";

export const register = async (request: Request, response: Response) =>
  sendSuccess(response, 201, await authService.register(request.body), "Registration successful");

export const login = async (request: Request, response: Response) =>
  sendSuccess(response, 200, await authService.login(request.body), "Login successful");

export const refresh = async (request: Request, response: Response) =>
  sendSuccess(response, 200, await authService.refresh(request.body.refreshToken), "Tokens refreshed");

export const logout = async (request: Request, response: Response) => {
  await authService.logout(request.body.refreshToken);
  return sendSuccess(response, 200, null, "Logout successful");
};
