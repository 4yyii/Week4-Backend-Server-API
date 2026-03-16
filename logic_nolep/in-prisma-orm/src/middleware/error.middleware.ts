import type { Request, Response, NextFunction } from "express";
import { ResponseError } from "../error/response.error";

export const errorMiddleware = async (error: Error, req: Request, res: Response, next: NextFunction) => {
    if (error instanceof ResponseError) {
        res.status(error.status).json({
            status: 'Failed',
            message: error.message,
            errors: error.details
        });
    } else {
        res.status(500).json({
            errors: error.message
        });
    }
}