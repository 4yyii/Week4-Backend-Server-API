import mongoose from "mongoose";
import { ResponseError } from "../error/response.error";
import { User, type IUser } from "../model/user.model";
import { Todo } from "../model/todo.model";
import { UserValidation } from "../validation/user.validation";
import { Validation } from "../validation/validation";

export class UserService {
  private static async checkUserIfExists<K>(key: string, value: K) {
    return await User.countDocuments({
      [key]: value,
    });
  }

  public static async register(request: Partial<IUser>) {
    const registerRequest = Validation.validate(UserValidation.REGISTER, request);
    const totalWithSameName = await this.checkUserIfExists<string>("name", request.name!);

    if (totalWithSameName !== 0) {
      throw new ResponseError(400, "Validation Error", {
        name: "Name already exist",
      });
    }

    const user = await User.create(registerRequest);
    return user;
  }

  public static async update(id: string, request: Partial<IUser>) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new ResponseError(404, "Not found", {
        user: `User with id ${id} not found`,
      });
    }

    const updateRequest = Validation.validate(UserValidation.UPDATE, request);
    const isUserExist = await this.checkUserIfExists<string>("_id", id);

    if (isUserExist === 0) {
      throw new ResponseError(404, "Not found", {
        user: `User with id ${id} not found`,
      });
    }

    if (updateRequest.name) {
      const nameUsedByOthers = await User.countDocuments({
        name: updateRequest.name,
        _id: { $ne: id },
      });

      if (nameUsedByOthers !== 0) {
        throw new ResponseError(400, "Validation Error", {
          name: "Name already exist",
        });
      }
    }

    const user = await User.findByIdAndUpdate(id, updateRequest, {
      returnDocument: "after",
      runValidators: true,
    });

    return user;
  }

  public static async delete(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new ResponseError(404, "Not found", {
        user: `User with id ${id} not found`,
      });
    }

    const isUserExist = await this.checkUserIfExists<string>("_id", id);

    if (!isUserExist) {
      throw new ResponseError(404, "Not found", {
        user: `User with id ${id} not found`,
      });
    }

    // Cascade delete todos belonging to this user
    await Todo.deleteMany({ userId: id });

    const user = await User.findByIdAndDelete(id, {
      returnDocument: "after",
    });

    return user;
  }

  public static async findUsers() {
    const users = await User.find();
    return users;
  }

  public static async findUserById(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new ResponseError(404, "Not found", {
        user: `User with id ${id} not found`,
      });
    }

    const user = await User.findById(id);

    if (!user) {
      throw new ResponseError(404, "Not found", {
        user: `User with id ${id} not found`,
      });
    }

    const todos = await Todo.find({ userId: id });
    return {
      ...user.toObject(),
      todos,
    };
  }
}