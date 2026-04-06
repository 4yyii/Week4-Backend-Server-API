import express from "express";
import { UserController } from "../controller/user.controller";
import { TodoController } from "../controller/todo.controller";

export const apiRouter = express.Router();

// User
apiRouter.post("/api/user/register", UserController.register);
apiRouter.get("/api/users", UserController.find);
apiRouter.get("/api/users/:userId", UserController.findById);
apiRouter.patch("/api/user/:userId", UserController.update);
apiRouter.delete("/api/user/:userId", UserController.delete);

// Todo
apiRouter.post("/api/:userId/todo", TodoController.createTodo);
apiRouter.get("/api/todos", TodoController.findTodos);
apiRouter.get("/api/todos/:todoId", TodoController.findTodoById);
apiRouter.patch("/api/:userId/todo/:todoId", TodoController.updateTodo);
apiRouter.delete("/api/:userId/todo/:todoId", TodoController.deleteTodo);
