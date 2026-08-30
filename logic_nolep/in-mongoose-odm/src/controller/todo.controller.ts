import type { Response, Request, NextFunction } from "express";
import { ITodo } from "../model/todo.model";
import { TodoService } from "../service/todo.service";

export class TodoController {
  public static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req.params.userId || req.body.userId) as string;
      const createTodoRequest: ITodo = req.body as ITodo;
      const response = await TodoService.create(userId, createTodoRequest);
      res.status(201).json({
        status: "Success",
        message: "Create todo success",
        data: response,
      });
    } catch (err) {
      next(err);
    }
  }

  public static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.params.userId as string | undefined;
      const todoId = req.params.todoId as string;
      const request: ITodo = req.body as ITodo;
      const response = await TodoService.update(userId, todoId, request);
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
      const userId = req.params.userId as string | undefined;
      const todoId = req.params.todoId as string;
      await TodoService.delete(userId, todoId);
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
      const response = await TodoService.findTodos();
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
      const todoId = req.params.todoId as string;
      const response = await TodoService.findTodoById(todoId);
      res.status(200).json({
        status: "Success",
        data: response,
      });
    } catch (err) {
      next(err);
    }
  }
}