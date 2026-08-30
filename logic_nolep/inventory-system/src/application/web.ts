import compression from "compression";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import { config } from "../config/config.js";
import { logger } from "../config/logger.js";
import { errorHandler } from "../middlewares/error.middleware.js";
import { notFound } from "../middlewares/not-found.middleware.js";
import { apiRouter } from "../routes/api.routes.js";

const app = express();

app.disable("x-powered-by");
app.use(helmet());
app.use(cors({ origin: config.corsOrigin === "*" ? true : config.corsOrigin, credentials: true }));
app.use(compression());
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));
app.use(
  morgan("combined", {
    stream: { write: (message) => logger.http(message.trim()) },
  }),
);

app.get("/", (_request, response) => {
  response.status(200).json({ success: true, message: "Inventory System API is running" });
});
app.get("/health", (_request, response) => {
  response.status(200).json({ success: true, status: "ok", timestamp: new Date().toISOString() });
});

app.use(apiRouter);
app.use(notFound);
app.use(errorHandler);

export default app;
