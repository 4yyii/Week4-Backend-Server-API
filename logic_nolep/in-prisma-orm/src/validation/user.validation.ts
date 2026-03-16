import { ZodType } from "zod";
import * as z from "zod";

export class UserValidation {

    public static readonly REGISTER : ZodType = z.object({
        username: z.string().min(1).max(100),
        name: z.string().min(1).max(100),
        password: z.string().min(1).max(100)
    });

    public static readonly LOGIN : ZodType = z.object({
        username: z.string().min(1).max(100),
        password: z.string().min(1).max(100)
    });

    public static readonly UPDATE : ZodType = z.object({
        username: z.string().min(1).max(100).optional(),
        name: z.string().min(1).max(100).optional(),
        password: z.string().min(1).max(100).optional()
    });

}