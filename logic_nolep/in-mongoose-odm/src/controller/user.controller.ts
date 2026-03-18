import type { Response, Request, NextFunction } from "express";
import type { IUser } from "../model/user.model";
import { UserService } from "../service/user.service";

export class UserController {

    public static async register(req: Request, res: Response, next: NextFunction) {
        try {
            const request : IUser = req.body as IUser;
            const response = await UserService.register(request);
            res.status(201).json({
                status: "Success",
                message: `Register success, welcome ${request.name}`,
                data: response
            });
        } catch (err) {
            next(err);
        }
    }

    public static async update(req: Request, res: Response, next: NextFunction) {
        try {
            const id = req.params.userId as string;
            const request : IUser = req.body as IUser;
            const response = await UserService.update(id, request);
            res.status(201).json({
                status: "Success",
                message: `Update success`,
                data: response
            });
        } catch (err) {
            next(err);
        }
    }

    public static async delete(req: Request, res: Response, next: NextFunction) {
        try {
            const id = req.params.userId as string;
            const response = await UserService.delete(id)
            res.status(201).json({
                status: "Success",
                message: "Delete Success"
            })
        } catch (err) {
            next(err);
        }
    }

}