import type { User } from "../db/schema.js";

export type PublicUser = Omit<User, "password">;

export const toPublicUser = ({ password: _password, ...user }: User): PublicUser => user;
