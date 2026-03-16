import type { NextFunction, Request, Response } from "express";
import { prisma } from "../application/prisma";
import { UserRequest } from "../type/user.request";
import { ResponseError } from "../error/response.error";

export const authMiddleware = async (req: UserRequest, res: Response, next: NextFunction) => {
    const token = req.get('X-API-TOKEN');

    if (token) {
        const user = await prisma.user.findFirst({
            where: {
                token: token
            }
        });

        if (user) {
            req.user = user;
            next();
            return;
        }
    }

    throw new ResponseError(401, "Validation Error", {
        message: "Unauthorized, ..."
    });
}