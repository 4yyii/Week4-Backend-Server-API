import { ZodType } from "zod";
import * as z from "zod";

export class TodoValidation {
  public static readonly CREATE: ZodType = z.object({
    title: z.string().min(1).max(100),
    description: z.string().max(500).optional(),
    status: z.enum(["Pending", "In Progress", "Completed"]).optional().default("Pending"),
  });

  public static readonly UPDATE: ZodType = z.object({
    title: z.string().min(1).max(100).optional(),
    description: z.string().max(500).optional(),
    status: z.enum(["Pending", "In Progress", "Completed"]).optional(),
  });
}