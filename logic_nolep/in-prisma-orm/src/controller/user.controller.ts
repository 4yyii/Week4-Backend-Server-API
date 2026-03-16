import type { Request, Response, NextFunction } from "express";
import type { CreateUserRequest, LoginUserRequest, UpdateUserRequest } from "../model/user.model";
import { UserService } from "../service/user.service";
import { UserRequest } from "../type/user.request";

export class UserController {

    public static async register(req: Request, res: Response, next: NextFunction) {
        try {
            const request: CreateUserRequest = req.body as CreateUserRequest;
            const response = await UserService.register(request);
            res.status(201).json({
                status: "Success",
                message: `Register success, welcome ${request.username}`,
                data: response
            });
        } catch (err) {
            next(err);
        }
    }

    public static async login(req: Request, res: Response, next: NextFunction) {
        try {
            const request: LoginUserRequest = req.body as LoginUserRequest;
            const response = await UserService.login(request);
            res.status(201).json({
                status: "Success",
                message: `Login success, welcome ${request.username}`,
                data: response
            });
        } catch (err) {
            next(err);
        }
    }

    public static async get(req: UserRequest, res: Response, next: NextFunction) {
        try {
            const response = await UserService.get(req.user!);
            res.status(200).json({
                status: "Success",
                message: "Get user success, here the data",
                data: response
            });
        } catch (err) {
            next(err);
        }
    }

    public static async update(req: UserRequest, res: Response, next: NextFunction) {
        try {
            const request: UpdateUserRequest = req.body as UpdateUserRequest;
            const response = await UserService.update(req.user!, request);
            res.status(200).json({
                status: "Success",
                message: "Update user success, here the data",
                data: response
            });
        } catch (err) {
            next(err);
        }
    }

    public static async logout(req: UserRequest, res: Response, next: NextFunction) {
        try {
            await UserService.logout(req.user!);
            res.status(200).json({
                status: "Success",
                message: "Logout success",
            });
        } catch (err) {
            next(err);
        }
    }

}