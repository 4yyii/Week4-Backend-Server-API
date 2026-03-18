import { ResponseError } from "../error/response.error";
import { ITodo, Todo } from "../model/todo.model";
import { User } from "../model/user.model";
import { TodoValidation } from "../validation/todo.validation";
import { Validation } from "../validation/validation";

export class TodoService {

    private static async checkTodoIfExist<K>(clause: Record<string, K>) {
        return await Todo.countDocuments(clause);
    }

    public static async create(request: Partial<ITodo>) {
        const createTodo = Validation.validate(TodoValidation.CREATE, request);
        const todo = await Todo.create({
            title: createTodo.title || "",
            description: createTodo.description || "",
            status: createTodo.status || "",
        });
        return todo;
    }

    public static async update(id: string, request: Partial<ITodo>) {
        const updateTodo = Validation.validate(TodoValidation.UPDATE, request);
        const isTodoExist = await this.checkTodoIfExist<string>({
            _id: id
        });

        if (!isTodoExist) {
            throw new ResponseError(404, "Not found", {
                todo: "Todo not found"
            });
        }

        const todo = await Todo.findByIdAndUpdate(id, updateTodo, {
            returnDocument: 'after',
            runValidators: true
        });

        return todo;
    }

    public static async delete(id: string) {
        const isTodoExist = await this.checkTodoIfExist<string>({
            _id: id
        });

        if (!isTodoExist) {
            throw new ResponseError(404, "Not found", {
                todo: "Todo not found"
            });
        }

        const todo = Todo.findByIdAndDelete(id, {
            returnDocument: "after",
            runValidators: true
        });

        return todo;
    }

}