import type { Request, Response } from "express";
import * as userService from "../services/user.service.js";
import { getPathParam } from "../utils/request.js";
import { sendPaginated, sendSuccess } from "../utils/response.js";

export const createUser = async (request: Request, response: Response) =>
  sendSuccess(response, 201, await userService.createUser(request.body), "User created");

export const getUsers = async (request: Request, response: Response) => {
  const result = await userService.getUsers(request.query as any);
  return sendPaginated(response, 200, result.items, result.meta);
};

export const getUserById = async (request: Request, response: Response) =>
  sendSuccess(response, 200, await userService.getUserById(getPathParam(request, "userId")));

export const updateUser = async (request: Request, response: Response) =>
  sendSuccess(
    response,
    200,
    await userService.updateUser(getPathParam(request, "userId"), request.body),
    "User updated",
  );

export const deleteUser = async (request: Request, response: Response) => {
  await userService.deleteUser(getPathParam(request, "userId"));
  return sendSuccess(response, 200, null, "User deleted");
};
