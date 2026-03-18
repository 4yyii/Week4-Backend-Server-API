import { ZodType } from "zod";
import * as z from "zod";

export class UserValidation {

    public static readonly REGISTER : ZodType = z.object({
        name: z.string().min(1).max(50),
        phone: z.string().min(1).max(20),
        email: z.string().min(1).max(30).optional()
    });

    public static readonly UPDATE : ZodType = z.object({
        name: z.string().min(1).max(50).optional(),
        phone: z.string().min(1).max(20).optional(),
        email: z.string().min(1).max(30).optional()
    });

}