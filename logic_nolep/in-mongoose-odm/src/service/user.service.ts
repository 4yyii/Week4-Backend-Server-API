import { ResponseError } from "../error/response.error";
import { User, type IUser } from "../model/user.model";
import { UserValidation } from "../validation/user.validation";
import { Validation } from "../validation/validation";

export class UserService {

    private static async checkUserIfExists<K>(key: string, value: K) {
        return await User.countDocuments({
            [key]: value
        });
    }

    public static async register(request: Partial<IUser>) {
        const registerRequest = Validation.validate(UserValidation.REGISTER, request);
        const totalWithSameName = await this.checkUserIfExists<string>("name", request.name!);

        if (totalWithSameName !== 0) {
            throw new ResponseError(400, "Validation Error", {
                name: "Name already exist"
            });
        }

        const user = await User.create(registerRequest);
        return user;
    }

    public static async update(id: string, request: Partial<IUser>) {
        const updateRequest = Validation.validate(UserValidation.UPDATE, request);
        const isUserExist = await this.checkUserIfExists<string>("_id", id);

        if (isUserExist === 0) {
            throw new ResponseError(400, "Validation Error", {
                name: "Name not found"
            });
        }

        if (updateRequest.name) {
            const nameUsedByOthers = await User.countDocuments({
                name: updateRequest.name,
                _id: { $ne: id }
            });

            if (nameUsedByOthers !== 0) {
                throw new ResponseError(400, "Validation Error", {
                    name: "Name already exist"
                });
            }
        }

        const user = await User.findByIdAndUpdate(id, updateRequest, {
            returnDocument: "after",
            runValidators: true
        });

        return user;
    }

    public static async delete(id: string) {
        const isUserExist = await this.checkUserIfExists<string>("_id", id);

        if (!isUserExist) {
            throw new ResponseError(404, "Not found", {
                name: "Name not found"
            });
        }

        const user = await User.findByIdAndDelete(id, {
            returnDocument: "after",
            runValidators: true
        });

        return user;
    }

}