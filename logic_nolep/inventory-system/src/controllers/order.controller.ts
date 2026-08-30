import type { Request, Response } from "express";
import * as orderService from "../services/order.service.js";
import { getPathParam } from "../utils/request.js";
import { sendPaginated, sendSuccess } from "../utils/response.js";

export const createOrder = async (request: Request, response: Response) =>
  sendSuccess(response, 201, await orderService.createOrder(request.body), "Order created");

export const getOrders = async (request: Request, response: Response) => {
  const result = await orderService.getOrders(request.query as any);
  return sendPaginated(response, 200, result.items, result.meta);
};

export const getOrderById = async (request: Request, response: Response) =>
  sendSuccess(response, 200, await orderService.getOrderById(getPathParam(request, "orderId")));

export const getOrdersByUser = async (request: Request, response: Response) => {
  const result = await orderService.getOrdersByUser(getPathParam(request, "userId"), request.query as any);
  return sendPaginated(response, 200, result.items, result.meta);
};

export const updateOrder = async (request: Request, response: Response) =>
  sendSuccess(
    response,
    200,
    await orderService.updateOrder(getPathParam(request, "orderId"), request.body),
    "Order updated",
  );

export const deleteOrder = async (request: Request, response: Response) => {
  await orderService.deleteOrder(getPathParam(request, "orderId"));
  return sendSuccess(response, 200, null, "Order deleted and stock restored");
};
