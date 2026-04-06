import { Request, Response, NextFunction } from "express-serve-static-core";
import type { CreateUserRequest } from "../model/user.model";
import { UserService } from "../service/user.service";

export class UserController {
  public static async register(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const request = req.body as CreateUserRequest;
      const response = await UserService.register(request);
      res.status(201).json({
        message: `Register success, Welcome ${response.name}`,
        data: response,
      });
    } catch (e) {
      next(e);
    }
  }

  public static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = Number(req.params.userId);
      const request = req.body as CreateUserRequest;
      const response = await UserService.update(userId, request);
      res.status(201).json({
        message: `Update user success with id ${userId}`,
        data: response,
      });
    } catch (e) {
      next(e);
    }
  }

  public static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = Number(req.params.userId);
      const response = await UserService.delete(userId);
      res.status(201).json({
        message: `Delete user success with id ${userId}`,
      });
    } catch (e) {
      next(e);
    }
  }

  public static async find(req: Request, res: Response, next: NextFunction) {
    try {
      const users = await UserService.findUsers();
      res.status(201).json({
        data: users,
      });
    } catch (e) {
      next(e);
    }
  }

  public static async findById(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const userId = Number(req.params.userId);
      const response = await UserService.findUserById(userId);
      res.status(201).json({
        data: response,
      });
    } catch (e) {
      next(e);
    }
  }
}
