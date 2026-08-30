import bcrypt from "bcryptjs";
import { asc, count, eq } from "drizzle-orm";
import { db } from "../db/index.js";
import { users } from "../db/schema.js";
import { ApiError } from "../utils/api-error.js";
import { toPublicUser } from "../utils/user.js";

export const createUser = async (input: {
  name: string;
  email: string;
  password: string;
  role: "user" | "admin";
  isEmailVerified: boolean;
}) => {
  const [user] = await db
    .insert(users)
    .values({ ...input, password: await bcrypt.hash(input.password, 12) })
    .returning();
  if (!user) throw new ApiError(500, "Unable to create user");
  return toPublicUser(user);
};

export const getUsers = async (options: { page?: number; size?: number } = {}) => {
  const page = options.page ? Number(options.page) : 1;
  const size = options.size ? Number(options.size) : 10;
  const offset = (page - 1) * size;

  const [totalResult] = await db.select({ total: count() }).from(users);
  const total = Number(totalResult?.total ?? 0);
  const totalPages = Math.ceil(total / size) || 1;

  const rows = await db
    .select()
    .from(users)
    .orderBy(asc(users.createdAt))
    .limit(size)
    .offset(offset);

  return { items: rows.map(toPublicUser), meta: { page, size, total, totalPages } };
};

export const getUserById = async (id: string) => {
  const [user] = await db.select().from(users).where(eq(users.id, id)).limit(1);
  if (!user) throw new ApiError(404, "User not found");
  return toPublicUser(user);
};

export const updateUser = async (
  id: string,
  input: Partial<{
    name: string;
    email: string;
    password: string;
    role: "user" | "admin";
    isEmailVerified: boolean;
  }>,
) => {
  const values = {
    ...input,
    ...(input.password ? { password: await bcrypt.hash(input.password, 12) } : {}),
    updatedAt: new Date(),
  };
  const [user] = await db.update(users).set(values).where(eq(users.id, id)).returning();
  if (!user) throw new ApiError(404, "User not found");
  return toPublicUser(user);
};

export const deleteUser = async (id: string): Promise<void> => {
  const [deleted] = await db.delete(users).where(eq(users.id, id)).returning({ id: users.id });
  if (!deleted) throw new ApiError(404, "User not found");
};
