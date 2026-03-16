import express from "express";
import { publicRouter } from "../routes/public.api";
import { errorMiddleware } from "../middleware/error.middleware";
import { apiRouter } from "../routes/api";

export const web = express();

web.use(express.json());
web.get("/", (req, res) => {
    res.send("HI!")
});

web.use(publicRouter);
web.use(apiRouter)
web.use(errorMiddleware);