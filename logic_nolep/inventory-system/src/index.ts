import type { Server } from "node:http";
import { sql } from "drizzle-orm";
import app from "./application/web.js";
import { config } from "./config/config.js";
import { logger } from "./config/logger.js";
import { db, pool } from "./db/index.js";

let server: Server | undefined;
let shuttingDown = false;

const shutdown = async (signal: string, exitCode: number) => {
  if (shuttingDown) return;
  shuttingDown = true;
  logger.info(`${signal} received; shutting down`);

  if (server) {
    await new Promise<void>((resolve) => server!.close(() => resolve()));
  }
  await pool.end();
  process.exit(exitCode);
};

const start = async () => {
  await db.execute(sql`select 1`);
  logger.info("Connected to PostgreSQL");
  server = app.listen(config.port, () => logger.info(`Listening on port ${config.port}`));
};

process.on("SIGTERM", () => void shutdown("SIGTERM", 0));
process.on("SIGINT", () => void shutdown("SIGINT", 0));
process.on("uncaughtException", (error) => {
  logger.error(error);
  void shutdown("uncaughtException", 1);
});
process.on("unhandledRejection", (error) => {
  logger.error(error);
  void shutdown("unhandledRejection", 1);
});

void start().catch((error) => {
  logger.error("Failed to start server", error);
  void shutdown("startup failure", 1);
});
