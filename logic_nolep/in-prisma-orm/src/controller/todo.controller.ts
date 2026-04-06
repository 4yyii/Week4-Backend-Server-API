import { Request, Response, NextFunction } from "express";
import { CreateTodoRequest, UpdateTodoRequest } from "../model/todo.model";
import { TodoService } from "../service/todo.service";

export class TodoController {
  public static async createTodo(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const request = req.body as CreateTodoRequest;
      const userId = Number(req.params.userId);
      const response = await TodoService.createTodo(userId, request);
      res.status(201).json({
        message: `Todo added success`,
        data: response,
      });
    } catch (e) {
      next(e);
    }
  }

  public static async updateTodo(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const request = req.body as UpdateTodoRequest;
      const userId = Number(req.params.userId);
      const todoId = Number(req.params.todoId);
      const response = await TodoService.updateTodo(userId, todoId, request);
      res.status(201).json({
        message: "Todo updated success",
        data: response,
      });
    } catch (e) {
      next(e);
    }
  }

  public static async deleteTodo(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const userId = Number(req.params.userId);
      const todoId = Number(req.params.todoId);
      const response = await TodoService.deleteTodo(userId, todoId);
      res.status(201).json({
        message: "Todo deleted success",
      });
    } catch (e) {
      next(e);
    }
  }

  public static async findTodos(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const todos = await TodoService.findTodos();
      res.status(201).json({
        data: todos,
      });
    } catch (e) {
      next(e);
    }
  }

  public static async findTodoById(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const todoId = Number(req.params.todoId);
      const response = await TodoService.findTodoById(todoId);
      res.status(201).json({
        data: response,
      });
    } catch (e) {
      next(e);
    }
  }
}
