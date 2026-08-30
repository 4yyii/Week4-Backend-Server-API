import { db } from "../application/database";
import { todos } from "../db/schema";
import { and, eq } from "drizzle-orm";
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
  private static async checkTodoIfExist(
    todoId: number,
    userId: number,
  ): Promise<boolean> {
    const found = await db
      .select()
      .from(todos)
      .where(and(eq(todos.id, todoId), eq(todos.userId, userId)));
    return found.length > 0;
  }

  public static async createTodo(
    userId: number,
    request: CreateTodoRequest,
  ): Promise<TodoResponse> {
    const createTodoRequest = Validation.validate(
      TodoValidation.CREATE,
      request,
    );
    const [todo] = await db
      .insert(todos)
      .values({
        title: createTodoRequest.title,
        description: createTodoRequest.description,
        status: createTodoRequest.status,
        userId: userId,
      })
      .returning();

    if (!todo) {
      throw new ResponseError(500, "Failed to create todo");
    }

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

    const isTodoExist = await this.checkTodoIfExist(todoId, userId);

    if (!isTodoExist) {
      throw new ResponseError(404, "Not found", {
        todo: `Todo with id ${todoId} not found`,
      });
    }

    const [todo] = await db
      .update(todos)
      .set(updateTodoRequest)
      .where(and(eq(todos.id, todoId), eq(todos.userId, userId)))
      .returning();

    if (!todo) {
      throw new ResponseError(500, "Failed to update todo");
    }

    return toTodoResponse(todo);
  }

  public static async deleteTodo(userId: number, todoId: number) {
    const isTodoExist = await this.checkTodoIfExist(todoId, userId);

    if (!isTodoExist) {
      throw new ResponseError(404, "Not found", {
        todo: `Todo with id ${todoId} not found`,
      });
    }

    const [todo] = await db
      .delete(todos)
      .where(and(eq(todos.id, todoId), eq(todos.userId, userId)))
      .returning();

    if (!todo) {
      throw new ResponseError(500, "Failed to delete todo");
    }

    return toTodoResponse(todo);
  }

  public static async findTodos(): Promise<TodoResponse[]> {
    const allTodos = await db.select().from(todos);
    return allTodos.map((todo) => toTodoResponse(todo));
  }

  public static async findTodoById(
    todoId: number,
  ): Promise<TodoWithUserResponse> {
    const todo = await db.query.todos.findFirst({
      where: eq(todos.id, todoId),
      with: {
        user: true,
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
