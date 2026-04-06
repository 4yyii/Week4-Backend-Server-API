import express from "express";
import { errorMiddleware } from "../middleware/error.middleware";
import { apiRouter } from "../routes/api.route";

export const web = express();

web.use(express.json());
web.get("/", (req, res) => {
  res.send("Hi!");
});

web.use(apiRouter);
web.use(errorMiddleware);
