import { z, ZodType } from "zod";

export class UserValidation {
  public static readonly REGISTER: ZodType = z.object({
    name: z.string().min(1).max(50),
    email: z.string().min(1).max(30).optional(),
    phone: z.string().min(1).max(20),
  });

  public static readonly UPDATE: ZodType = z.object({
    name: z.string().min(1).max(50),
    email: z.string().min(1).max(30).optional(),
    phone: z.string().min(1).max(20).optional(),
  });
}
