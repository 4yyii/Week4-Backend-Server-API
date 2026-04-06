import { User } from "../../generated/prisma/client";
import { TodoResponse, toTodoResponse } from "./todo.model";

export type UserResponse = {
  id: number;
  name: string;
  email: string;
  phone: string;
};

export type CreateUserRequest = {
  name: string;
  email?: string;
  phone: string;
};

export type UpdateUserRequest = {
  name: string;
  email?: string;
  phone?: string;
};

export function toUserResponse(user: User): UserResponse {
  return {
    id: user.id,
    name: user.name,
    email: user.email ?? "",
    phone: user.phone,
  };
}

export type UserWithTodoResponse = UserResponse & {
  todos: TodoResponse[];
};

export function toUserWithTodoResponse(user: any): UserWithTodoResponse {
  return {
    ...toUserResponse(user),
    todos: user.todos.map((todo: any) => toTodoResponse(todo)),
  };
}
