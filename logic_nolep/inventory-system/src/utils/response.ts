import type { Response } from "express";

export type PaginationMeta = {
  page: number;
  size: number;
  total: number;
  totalPages: number;
};

export const sendSuccess = <T>(
  response: Response,
  statusCode: number,
  data: T,
  message?: string,
): Response =>
  response.status(statusCode).json({
    success: true,
    ...(message ? { message } : {}),
    data,
  });

export const sendPaginated = <T>(
  response: Response,
  statusCode: number,
  data: T[],
  meta: PaginationMeta,
  message?: string,
): Response =>
  response.status(statusCode).json({
    success: true,
    ...(message ? { message } : {}),
    data,
    meta,
  });

