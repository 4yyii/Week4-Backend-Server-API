import { Todo } from "../../generated/prisma/client";
import { Status } from "../../generated/prisma/enums";
import { toUserResponse, UserResponse } from "./user.model";

export type TodoResponse = {
  id: number;
  title: string;
  description: string;
  status: Status;
};

export type CreateTodoRequest = {
  title: string;
  description: string;
  status: Status;
};

export type UpdateTodoRequest = {
  title: string;
  description: string;
  status: Status;
};

export function toTodoResponse(todo: Todo): TodoResponse {
  return {
    id: todo.id,
    title: todo.title,
    description: todo.description,
    status: todo.status,
  };
}

export type TodoWithUserResponse = TodoResponse & {
  user: UserResponse;
};

export function toTodoWithUserResponse(todo: any): TodoWithUserResponse {
  return {
    ...toTodoResponse(todo),
    user: toUserResponse(todo.user),
  };
}
