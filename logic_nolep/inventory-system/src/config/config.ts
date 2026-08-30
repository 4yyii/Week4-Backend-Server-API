import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().positive().default(3000),
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
  JWT_SECRET: z.string().min(32, "JWT_SECRET must contain at least 32 characters"),
  JWT_ACCESS_EXPIRES_SECONDS: z.coerce.number().int().positive().default(900),
  JWT_REFRESH_EXPIRES_SECONDS: z.coerce.number().int().positive().default(604800),
  CORS_ORIGIN: z.string().default("http://localhost:3000"),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("Invalid environment variables:", z.flattenError(parsed.error).fieldErrors);
  throw new Error("Invalid environment configuration");
}

const env = parsed.data;

export const config = {
  env: env.NODE_ENV,
  port: env.PORT,
  databaseUrl: env.DATABASE_URL,
  jwtSecret: env.JWT_SECRET,
  accessExpiresSeconds: env.JWT_ACCESS_EXPIRES_SECONDS,
  refreshExpiresSeconds: env.JWT_REFRESH_EXPIRES_SECONDS,
  corsOrigin: env.CORS_ORIGIN,
  isDevelopment: env.NODE_ENV === "development",
  isProduction: env.NODE_ENV === "production",
} as const;
