import type { Request, Response } from "express";
import * as orderItemService from "../services/order-item.service.js";
import { getPathParam } from "../utils/request.js";
import { sendPaginated, sendSuccess } from "../utils/response.js";

export const createOrderItem = async (request: Request, response: Response) =>
  sendSuccess(response, 201, await orderItemService.createOrderItem(request.body), "Order item created");

export const getOrderItems = async (request: Request, response: Response) => {
  const result = await orderItemService.getOrderItems(request.query as any);
  return sendPaginated(response, 200, result.items, result.meta);
};

export const getOrderItemById = async (request: Request, response: Response) =>
  sendSuccess(
    response,
    200,
    await orderItemService.getOrderItemById(getPathParam(request, "orderItemId")),
  );

export const getOrderItemsByOrder = async (request: Request, response: Response) => {
  const result = await orderItemService.getOrderItemsByOrder(getPathParam(request, "orderId"), request.query as any);
  return sendPaginated(response, 200, result.items, result.meta);
};

export const updateOrderItem = async (request: Request, response: Response) =>
  sendSuccess(
    response,
    200,
    await orderItemService.updateOrderItem(getPathParam(request, "orderItemId"), request.body),
    "Order item updated",
  );

export const deleteOrderItem = async (request: Request, response: Response) => {
  await orderItemService.deleteOrderItem(getPathParam(request, "orderItemId"));
  return sendSuccess(response, 200, null, "Order item deleted and stock restored");
};
