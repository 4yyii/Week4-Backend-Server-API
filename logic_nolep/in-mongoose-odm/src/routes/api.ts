import express from "express";
import { UserController } from "../controller/user.controller";
import { TodoController } from "../controller/todo.controller";

export const apiRouter = express.Router();

// User API (RESTful standards)
apiRouter.post("/api/users", UserController.register);
apiRouter.get("/api/users", UserController.find);
apiRouter.get("/api/users/:userId", UserController.findById);
apiRouter.patch("/api/users/:userId", UserController.update);
apiRouter.delete("/api/users/:userId", UserController.delete);

// Todo API (RESTful standards)
apiRouter.post("/api/todos", TodoController.create);
apiRouter.get("/api/todos", TodoController.find);
apiRouter.get("/api/todos/:todoId", TodoController.findById);
apiRouter.patch("/api/todos/:todoId", TodoController.update);
apiRouter.delete("/api/todos/:todoId", TodoController.delete);