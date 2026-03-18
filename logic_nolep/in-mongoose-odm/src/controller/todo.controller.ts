import type { Response, Request, NextFunction } from "express";
import { ITodo } from "../model/todo.model";
import { TodoService } from "../service/todo.service";

export class TodoController {

    public static async create(req: Request, res: Response, next: NextFunction) {
        try {
            const createTodoRequest : ITodo = req.body as ITodo;
            const response = await TodoService.create(createTodoRequest);
            res.status(201).json({
                status: "Success",
                message: "Create todo success",
                data: response
            });
        } catch (err) {
            next(err);
        }
    }

    public static async update(req: Request, res: Response, next: NextFunction) {
        try {
            const id = req.params.todoId as string;
            const request : ITodo = req.body as ITodo;
            const response = await TodoService.update(id, request);
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
            const id = req.params.todoId as string;
            const response = await TodoService.delete(id)
            res.status(201).json({
                status: "Success",
                message: "Delete Success"
            });
        } catch (err) {
            next(err);
        }
    }

}