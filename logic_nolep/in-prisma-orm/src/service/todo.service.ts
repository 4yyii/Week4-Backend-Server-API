import { prisma } from "../application/prisma";
import { ResponseError } from "../error/response.error";
import {
  CreateTodoRequest,
  TodoResponse,
  TodoWithUserResponse,
  toTodoResponse,
  toTodoWithUserResponse,
  UpdateTodoRequest,
} from "../model/todo.model";
import { TodoValidation } from "../validation/todo.validation";
import { Validation } from "../validation/validation";

export class TodoService {
  private static async checkTodoIfExist<K>(clause: Record<string, K>) {
    return await prisma.todo.count({
      where: clause,
    });
  }

  public static async createTodo(
    userId: number,
    request: CreateTodoRequest,
  ): Promise<TodoResponse> {
    const createTodoRequest = Validation.validate(
      TodoValidation.CREATE,
      request,
    );
    const todo = await prisma.todo.create({
      data: {
        title: createTodoRequest.title,
        description: createTodoRequest.description,
        status: createTodoRequest.status,
        userId: userId,
      },
    });

    return toTodoResponse(todo);
  }

  public static async updateTodo(
    userId: number,
    todoId: number,
    request: UpdateTodoRequest,
  ): Promise<TodoResponse> {
    const updateTodoRequest = Validation.validate(
      TodoValidation.UPDATE,
      request,
    );

    const isTodoExist = await this.checkTodoIfExist<number>({
      id: todoId,
      userId: userId,
    });

    if (!isTodoExist) {
      throw new ResponseError(404, "Not found", {
        todo: `Todo with id ${todoId} not found`,
      });
    }

    const todo = await prisma.todo.update({
      where: {
        id: todoId,
        userId: userId,
      },
      data: updateTodoRequest,
    });

    return toTodoResponse(todo);
  }

  public static async deleteTodo(userId: number, todoId: number) {
    const isTodoExist = await this.checkTodoIfExist<number>({
      id: todoId,
      userId: userId,
    });

    if (!isTodoExist) {
      throw new ResponseError(404, "Not found", {
        todo: `Todo with id ${todoId} not found`,
      });
    }

    const todo = await prisma.todo.delete({
      where: {
        id: todoId,
        userId: userId,
      },
    });

    return toTodoResponse(todo);
  }

  public static async findTodos(): Promise<TodoResponse[]> {
    const todos = await prisma.todo.findMany();
    return todos.map((todo) => toTodoResponse(todo));
  }

  public static async findTodoById(
    todoId: number,
  ): Promise<TodoWithUserResponse> {
    const todo = await prisma.todo.findUnique({
      where: { id: todoId },
      include: {
        user: true, // Matches the relation name in schema.prisma
      },
    });

    if (!todo) {
      throw new ResponseError(404, "Not found", {
        todo: `Todo with id ${todoId} not found`,
      });
    }

    return toTodoWithUserResponse(todo);
  }
}
