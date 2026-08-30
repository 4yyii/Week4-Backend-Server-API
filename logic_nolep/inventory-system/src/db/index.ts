import pg from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import { config } from "../config/config.js";
import * as schema from "./schema.js";

const { Pool } = pg;

export const pool = new Pool({
  connectionString: config.databaseUrl,
  max: 10,
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 5_000,
  ssl: config.isProduction ? { rejectUnauthorized: false } : undefined,
});

export const db = drizzle(pool, { schema });
