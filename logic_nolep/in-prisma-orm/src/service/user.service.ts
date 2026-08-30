import { db } from "../application/database";
import { users } from "../db/schema";
import { eq } from "drizzle-orm";
import { ResponseError } from "../error/response.error";
import {
  type CreateUserRequest,
  toUserResponse,
  toUserWithTodoResponse,
  type UpdateUserRequest,
  type UserResponse,
  type UserWithTodoResponse,
} from "../model/user.model";
import { UserValidation } from "../validation/user.validation";
import { Validation } from "../validation/validation";

export class UserService {
  private static async checkUserIfExistByName(name: string): Promise<boolean> {
    const found = await db.select().from(users).where(eq(users.name, name));
    return found.length > 0;
  }

  private static async checkUserById(userId: number): Promise<boolean> {
    const found = await db.select().from(users).where(eq(users.id, userId));
    return found.length > 0;
  }

  public static async register(
    request: CreateUserRequest,
  ): Promise<UserResponse> {
    const registerRequest = Validation.validate(
      UserValidation.REGISTER,
      request,
    );

    const nameExists = await this.checkUserIfExistByName(registerRequest.name);
    if (nameExists) {
      throw new ResponseError(400, "Validation Error", {
        name: "Name already exist",
      });
    }

    const [user] = await db.insert(users).values(registerRequest).returning();
    if (!user) {
      throw new ResponseError(500, "Failed to register user");
    }

    return toUserResponse(user);
  }

  public static async update(
    userId: number,
    request: UpdateUserRequest,
  ): Promise<UserResponse> {
    const updateRequest = Validation.validate(UserValidation.UPDATE, request);
    const isUserExist = await this.checkUserById(userId);

    if (!isUserExist) {
      throw new ResponseError(404, "Not found", {
        user: `User with id ${userId} not found`,
      });
    }

    const [user] = await db
      .update(users)
      .set(updateRequest)
      .where(eq(users.id, userId))
      .returning();

    if (!user) {
      throw new ResponseError(500, "Failed to update user");
    }

    return toUserResponse(user);
  }

  public static async delete(userId: number) {
    const isUserExist = await this.checkUserById(userId);

    if (!isUserExist) {
      throw new ResponseError(404, "Not found", {
        user: `User with id ${userId} not found`,
      });
    }

    const [user] = await db
      .delete(users)
      .where(eq(users.id, userId))
      .returning();

    if (!user) {
      throw new ResponseError(500, "Failed to delete user");
    }

    return toUserResponse(user);
  }

  public static async findUsers(): Promise<UserResponse[]> {
    const allUsers = await db.select().from(users);
    return allUsers.map((user) => toUserResponse(user));
  }

  public static async findUserById(
    userId: number,
  ): Promise<UserWithTodoResponse> {
    const user = await db.query.users.findFirst({
      where: eq(users.id, userId),
      with: {
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
