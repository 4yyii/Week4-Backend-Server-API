import type { Request, Response } from "express";
import * as productService from "../services/product.service.js";
import { ApiError } from "../utils/api-error.js";
import { getPathParam } from "../utils/request.js";
import { sendPaginated, sendSuccess } from "../utils/response.js";

const actor = (request: Request) => {
  if (!request.user) throw new ApiError(401, "Authentication is required");
  return request.user;
};

export const createProduct = async (request: Request, response: Response) =>
  sendSuccess(response, 201, await productService.createProduct(request.body, actor(request)), "Product created");

export const getProducts = async (request: Request, response: Response) => {
  const result = await productService.getProducts(request.query as any);
  return sendPaginated(response, 200, result.items, result.meta);
};

export const getProductById = async (request: Request, response: Response) =>
  sendSuccess(response, 200, await productService.getProductById(getPathParam(request, "productId")));

export const getProductsByUser = async (request: Request, response: Response) => {
  const result = await productService.getProductsByUser(
    getPathParam(request, "userId"),
    actor(request),
    request.query as any,
  );
  return sendPaginated(response, 200, result.items, result.meta);
};

export const updateProduct = async (request: Request, response: Response) =>
  sendSuccess(
    response,
    200,
    await productService.updateProduct(getPathParam(request, "productId"), request.body, actor(request)),
    "Product updated",
  );

export const deleteProduct = async (request: Request, response: Response) => {
  await productService.deleteProduct(getPathParam(request, "productId"), actor(request));
  return sendSuccess(response, 200, null, "Product deleted");
};
