import express from "express";
import { UserController } from "../controller/user.controller";
import { TodoController } from "../controller/todo.controller";

export const apiRouter = express.Router();

// User API 
apiRouter.post("/api/users", UserController.register);
apiRouter.patch("/api/users/:userId", UserController.update);
apiRouter.delete("/api/users/:userId", UserController.delete);

// Todo API
apiRouter.post("/api/todos", TodoController.create);
apiRouter.patch("/api/todos/:todoId", TodoController.update);
apiRouter.delete("/api/todos/:todoId", TodoController.delete);