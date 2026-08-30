import type { Response, Request, NextFunction } from "express";
import type { IUser } from "../model/user.model";
import { UserService } from "../service/user.service";

export class UserController {
  public static async register(req: Request, res: Response, next: NextFunction) {
    try {
      const request: IUser = req.body as IUser;
      const response = await UserService.register(request);
      res.status(201).json({
        status: "Success",
        message: `Register success, welcome ${response.name}`,
        data: response,
      });
    } catch (err) {
      next(err);
    }
  }

  public static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.userId as string;
      const request: IUser = req.body as IUser;
      const response = await UserService.update(id, request);
      res.status(200).json({
        status: "Success",
        message: `Update success`,
        data: response,
      });
    } catch (err) {
      next(err);
    }
  }

  public static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.userId as string;
      await UserService.delete(id);
      res.status(200).json({
        status: "Success",
        message: "Delete Success",
      });
    } catch (err) {
      next(err);
    }
  }

  public static async find(req: Request, res: Response, next: NextFunction) {
    try {
      const response = await UserService.findUsers();
      res.status(200).json({
        status: "Success",
        data: response,
      });
    } catch (err) {
      next(err);
    }
  }

  public static async findById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.userId as string;
      const response = await UserService.findUserById(id);
      res.status(200).json({
        status: "Success",
        data: response,
      });
    } catch (err) {
      next(err);
    }
  }
}