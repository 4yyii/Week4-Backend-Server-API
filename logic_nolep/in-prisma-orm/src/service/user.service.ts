import { prisma } from "../application/prisma";
import { ResponseError } from "../error/response.error";
import { toUserResponse, UpdateUserRequest, type CreateUserRequest, type LoginUserRequest, type UserResponse } from "../model/user.model";
import { UserValidation } from "../validation/user.validation";
import { Validation } from "../validation/validation";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import 'dotenv/config';
import { User } from "../../generated/prisma/client";

export class UserService {

    private static async checkUserIfExist<K>(key: string, value: K) {
        return await prisma.user.count({
            where: {
                [key] : value
            }
        });
    }

    public static async register(request: CreateUserRequest) : Promise<UserResponse> {
        const registerRequest = Validation.validate(UserValidation.REGISTER, request);

        const totalUserWithSameUsername = await this.checkUserIfExist<string>("username", registerRequest.username);

        if (totalUserWithSameUsername !== 0) {
            throw new ResponseError(
                400, 
                "Validation Error",
                {
                    username: "Username already exists"
                }
            );
        }

        registerRequest.password = await bcrypt.hash(registerRequest.password, 10);

        const user = await prisma.user.create({
            data: registerRequest
        });

        return toUserResponse(user);
    }

    public static async login(request: LoginUserRequest) : Promise<UserResponse> {
        const loginRequest = Validation.validate(UserValidation.LOGIN, request);

        let user = await prisma.user.findUnique({
            where: {
                username: loginRequest.username
            }
        })

        if (!user) {
            throw new ResponseError(
                401,
                "Validation Error",
                {
                    message: "Username or password is wrong"
                }
            )
        }

        const isPasswordValid = await bcrypt.compare(loginRequest.password, user.password);

        if (!isPasswordValid) {
            throw new ResponseError(
                401,
                "Validation Error",
                {
                    message: "Username or password is wrong"
                }
            )
        }

        user = await prisma.user.update({
            where: {
                username: loginRequest.username
            },
            data : {
                token: jwt.sign(
                    { username: loginRequest.username },
                    process.env.DB_SECRET_KEY!,
                    { expiresIn: "1d" }
                )
            }
        });

        const response = toUserResponse(user);
        response.token = user.token!;
        return response;
    }

    public static async get(user: User) : Promise<UserResponse> {
        return toUserResponse(user);
    }

    public static async update(user: User, request: UpdateUserRequest) : Promise<UserResponse> {
        const updateRequest = Validation.validate(UserValidation.UPDATE, request);

        const updateData: any = {};

        if (updateRequest.name) {
            updateData.name = updateRequest.name;
        }

        if (updateRequest.username) {
            updateData.username = updateRequest.username
        }

        if (updateRequest.password) {
            updateData.password = await bcrypt.hash(updateRequest.password, 10)
        }

        const result = await prisma.user.update({
            where: {
                username: user.username
            },
            data: updateData
        });

        return toUserResponse(result);
    }

    public static async logout(user: User) : Promise<UserResponse> {
        const result = await prisma.user.update({
            where: {
                username: user.username
            },
            data: {
                token: null
            }
        });

        return toUserResponse(result);
    }
    
}