import type { Request, Response } from "express";
import * as categoryService from "../services/category.service.js";
import { getPathParam } from "../utils/request.js";
import { sendPaginated, sendSuccess } from "../utils/response.js";

export const createCategory = async (request: Request, response: Response) =>
  sendSuccess(response, 201, await categoryService.createCategory(request.body.name), "Category created");

export const getCategories = async (request: Request, response: Response) => {
  const result = await categoryService.getCategories(request.query as any);
  return sendPaginated(response, 200, result.items, result.meta);
};

export const getCategoryById = async (request: Request, response: Response) =>
  sendSuccess(response, 200, await categoryService.getCategoryById(getPathParam(request, "categoryId")));

export const updateCategory = async (request: Request, response: Response) =>
  sendSuccess(
    response,
    200,
    await categoryService.updateCategory(getPathParam(request, "categoryId"), request.body.name),
    "Category updated",
  );

export const deleteCategory = async (request: Request, response: Response) => {
  await categoryService.deleteCategory(getPathParam(request, "categoryId"));
  return sendSuccess(response, 200, null, "Category deleted");
};
