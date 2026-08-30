import mongoose from "mongoose";
import { ResponseError } from "../error/response.error";
import { ITodo, Todo } from "../model/todo.model";
import { User } from "../model/user.model";
import { TodoValidation } from "../validation/todo.validation";
import { Validation } from "../validation/validation";

export class TodoService {
  private static async checkTodoIfExist<K>(clause: Record<string, K>) {
    return await Todo.countDocuments(clause);
  }

  public static async create(userId: string | undefined, request: Partial<ITodo>) {
    const createTodo = Validation.validate(TodoValidation.CREATE, request);

    const targetUserId = userId || (request.userId ? String(request.userId) : undefined);

    if (targetUserId) {
      if (!mongoose.Types.ObjectId.isValid(targetUserId)) {
        throw new ResponseError(404, "Not found", {
          user: `User with id ${targetUserId} not found`,
        });
      }

      const isUserExist = await User.exists({ _id: targetUserId });
      if (!isUserExist) {
        throw new ResponseError(404, "Not found", {
          user: `User with id ${targetUserId} not found`,
        });
      }
    }

    const todoData: Record<string, unknown> = {
      title: createTodo.title || "",
      description: createTodo.description || "",
      status: createTodo.status || "Pending",
    };

    if (targetUserId) {
      todoData.userId = targetUserId;
    }

    const todo = await Todo.create(todoData);
    return todo;
  }

  public static async update(userId: string | undefined, todoId: string, request: Partial<ITodo>) {
    if (!mongoose.Types.ObjectId.isValid(todoId)) {
      throw new ResponseError(404, "Not found", {
        todo: `Todo with id ${todoId} not found`,
      });
    }

    const updateTodo = Validation.validate(TodoValidation.UPDATE, request);

    const clause: Record<string, string> = { _id: todoId };
    if (userId) {
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        throw new ResponseError(404, "Not found", {
          user: `User with id ${userId} not found`,
        });
      }
      clause.userId = userId;
    }

    const isTodoExist = await this.checkTodoIfExist(clause);
    if (!isTodoExist) {
      throw new ResponseError(404, "Not found", {
        todo: `Todo with id ${todoId} not found`,
      });
    }

    const todo = await Todo.findOneAndUpdate(clause, updateTodo, {
      returnDocument: "after",
      runValidators: true,
    });

    return todo;
  }

  public static async delete(userId: string | undefined, todoId: string) {
    if (!mongoose.Types.ObjectId.isValid(todoId)) {
      throw new ResponseError(404, "Not found", {
        todo: `Todo with id ${todoId} not found`,
      });
    }

    const clause: Record<string, string> = { _id: todoId };
    if (userId) {
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        throw new ResponseError(404, "Not found", {
          user: `User with id ${userId} not found`,
        });
      }
      clause.userId = userId;
    }

    const isTodoExist = await this.checkTodoIfExist(clause);
    if (!isTodoExist) {
      throw new ResponseError(404, "Not found", {
        todo: `Todo with id ${todoId} not found`,
      });
    }

    const todo = await Todo.findOneAndDelete(clause, {
      returnDocument: "after",
    });

    return todo;
  }

  public static async findTodos() {
    const todos = await Todo.find();
    return todos;
  }

  public static async findTodoById(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new ResponseError(404, "Not found", {
        todo: `Todo with id ${id} not found`,
      });
    }

    const todo = await Todo.findById(id).populate("userId");

    if (!todo) {
      throw new ResponseError(404, "Not found", {
        todo: `Todo with id ${id} not found`,
      });
    }

    return todo;
  }
}