import { createHash } from "node:crypto";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { and, eq } from "drizzle-orm";
import { config } from "../config/config.js";
import { db } from "../db/index.js";
import { tokens, users, type User } from "../db/schema.js";
import type { JwtPayload } from "../middlewares/auth.middleware.js";
import { ApiError } from "../utils/api-error.js";
import { toPublicUser } from "../utils/user.js";

const hashToken = (token: string): string => createHash("sha256").update(token).digest("hex");

const signToken = (user: User, type: "access" | "refresh", expiresIn: number): string =>
  jwt.sign(
    { sub: user.id, role: user.role, type, jti: `${Date.now()}_${Math.random().toString(36).substring(2)}` },
    config.jwtSecret,
    { expiresIn },
  );


const buildTokenPair = (user: User) => {
  const accessToken = signToken(user, "access", config.accessExpiresSeconds);
  const refreshToken = signToken(user, "refresh", config.refreshExpiresSeconds);
  return {
    accessToken,
    refreshToken,
    refreshTokenHash: hashToken(refreshToken),
    refreshExpiresAt: new Date(Date.now() + config.refreshExpiresSeconds * 1000),
  };
};

const saveAndFormatTokenPair = async (user: User) => {
  const pair = buildTokenPair(user);
  await db.insert(tokens).values({
    tokenHash: pair.refreshTokenHash,
    userId: user.id,
    expiresAt: pair.refreshExpiresAt,
  });
  return {
    accessToken: pair.accessToken,
    refreshToken: pair.refreshToken,
    accessExpiresIn: config.accessExpiresSeconds,
    refreshExpiresIn: config.refreshExpiresSeconds,
  };
};

export const register = async (input: { name: string; email: string; password: string }) => {
  const [existing] = await db.select({ id: users.id }).from(users).where(eq(users.email, input.email)).limit(1);
  if (existing) throw new ApiError(409, "User with this email already exists");

  const passwordHash = await bcrypt.hash(input.password, 12);
  const [user] = await db
    .insert(users)
    .values({ name: input.name, email: input.email, password: passwordHash, role: "user" })
    .returning();
  if (!user) throw new ApiError(500, "Unable to create user");

  return { user: toPublicUser(user), tokens: await saveAndFormatTokenPair(user) };
};


export const login = async (input: { email: string; password: string }) => {
  const [user] = await db.select().from(users).where(eq(users.email, input.email)).limit(1);
  if (!user || !(await bcrypt.compare(input.password, user.password))) {
    throw new ApiError(401, "Invalid email or password");
  }

  return { user: toPublicUser(user), tokens: await saveAndFormatTokenPair(user) };
};

export const refresh = async (refreshToken: string) => {
  let payload: JwtPayload;
  try {
    payload = jwt.verify(refreshToken, config.jwtSecret) as JwtPayload;
  } catch {
    throw new ApiError(401, "Invalid or expired refresh token");
  }
  if (payload.type !== "refresh" || !payload.sub) throw new ApiError(401, "Invalid refresh token");

  return db.transaction(async (transaction) => {
    const tokenHash = hashToken(refreshToken);
    const [storedToken] = await transaction
      .select()
      .from(tokens)
      .where(
        and(
          eq(tokens.tokenHash, tokenHash),
          eq(tokens.userId, payload.sub),
          eq(tokens.blacklisted, false),
        ),
      )
      .limit(1);

    if (!storedToken || storedToken.expiresAt <= new Date()) {
      throw new ApiError(401, "Refresh token is no longer valid");
    }

    const [user] = await transaction.select().from(users).where(eq(users.id, payload.sub)).limit(1);
    if (!user) throw new ApiError(401, "User for this token no longer exists");

    const pair = buildTokenPair(user);
    await transaction.update(tokens).set({ blacklisted: true, updatedAt: new Date() }).where(eq(tokens.id, storedToken.id));
    await transaction.insert(tokens).values({
      tokenHash: pair.refreshTokenHash,
      userId: user.id,
      expiresAt: pair.refreshExpiresAt,
    });

    return {
      accessToken: pair.accessToken,
      refreshToken: pair.refreshToken,
      accessExpiresIn: config.accessExpiresSeconds,
      refreshExpiresIn: config.refreshExpiresSeconds,
    };
  });
};

export const logout = async (refreshToken: string): Promise<void> => {
  await db
    .update(tokens)
    .set({ blacklisted: true, updatedAt: new Date() })
    .where(and(eq(tokens.tokenHash, hashToken(refreshToken)), eq(tokens.blacklisted, false)));
};
