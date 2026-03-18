import { Schema, model, Document, Types } from "mongoose";

export interface ITodo extends Document {
  title: string;
  description?: string;
  status: "Pending" | "In Progress" | "Completed";
}

const todoSchema = new Schema<ITodo>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  status: { 
    type: String, 
    enum: ["Pending", "In Progress", "Completed"], 
    default: "Pending" 
  }
}); 

export const Todo = model<ITodo>("Todo", todoSchema);