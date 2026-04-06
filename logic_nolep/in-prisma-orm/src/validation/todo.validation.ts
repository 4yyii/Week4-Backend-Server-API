import { z, ZodType } from "zod";

export class TodoValidation {
  public static readonly CREATE: ZodType = z.object({
    title: z.string().min(1).max(50),
    description: z.string().min(1),
    status: z.enum(["FINISH", "ACTIVE"]),
  });

  public static readonly UPDATE: ZodType = z.object({
    title: z.string().min(1).max(50),
    description: z.string().min(1),
    status: z.enum(["FINISH", "ACTIVE"]),
  });
}
