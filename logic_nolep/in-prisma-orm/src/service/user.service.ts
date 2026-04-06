import { prisma } from "../application/prisma";
import { ResponseError } from "../error/response.error";
import {
  type CreateUserRequest,
  toUserResponse,
  toUserWithTodoResponse,
  type UpdateUserRequest,
  type UserResponse,
  UserWithTodoResponse,
} from "../model/user.model";
import { UserValidation } from "../validation/user.validation";
import { Validation } from "../validation/validation";

export class UserService {
  private static async checkUserIfExist<K>(key: string, value: K) {
    return await prisma.user.count({
      where: {
        [key]: value,
      },
    });
  }

  private static async checkUserById(userId: number) {
    return await prisma.user.count({
      where: {
        id: userId,
      },
    });
  }

  public static async register(
    request: CreateUserRequest,
  ): Promise<UserResponse> {
    const registerRequest = Validation.validate(
      UserValidation.REGISTER,
      request,
    );

    const totalUserWithSameName = await this.checkUserIfExist<string>(
      "name",
      request.name,
    );

    if (totalUserWithSameName != 0) {
      throw new ResponseError(400, "Validation Error", {
        name: "Name already exist",
      });
    }

    const user = await prisma.user.create({
      data: registerRequest,
    });

    return toUserResponse(user);
  }

  public static async update(
    userId: number,
    request: UpdateUserRequest,
  ): Promise<UserResponse> {
    const updateRequest = Validation.validate(UserValidation.UPDATE, request);
    const isUserExist = await this.checkUserIfExist<number>("id", userId);

    if (!isUserExist) {
      throw new ResponseError(404, "Not found", {
        user: `User with id ${userId} not found`,
      });
    }

    const user = await prisma.user.update({
      where: {
        id: userId,
      },
      data: updateRequest,
    });

    return toUserResponse(user);
  }

  public static async delete(userId: number) {
    const isUserExist = await this.checkUserIfExist<number>("id", userId);

    if (!isUserExist) {
      throw new ResponseError(404, "Not found", {
        user: `User with id ${userId} not found`,
      });
    }

    const user = await prisma.user.delete({
      where: {
        id: userId,
      },
    });

    return toUserResponse(user);
  }

  public static async findUsers(): Promise<UserResponse[]> {
    const users = await prisma.user.findMany();
    return users.map((user) => toUserResponse(user));
  }

  public static async findUserById(
    userId: number,
  ): Promise<UserWithTodoResponse> {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        todos: true,
      },
    });

    if (!user) {
      throw new ResponseError(404, "Not found", {
        user: `User with id ${userId} not found`,
      });
    }

    return toUserWithTodoResponse(user);
  }
}
