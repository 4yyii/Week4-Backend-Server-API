import { ZodType } from "zod";
import * as z from "zod";

export class AddressValidation {

    public static readonly CREATE : ZodType = z.object({
        contact_id: z.number().positive(),
        street: z.string().min(1).max(255).optional(),
        city: z.string().min(1).max(100).optional(),
        province: z.string().min(1).max(100).optional(),
        country: z.string().min(1).max(100),
        postal_code: z.string().min(1).max(10)    
    });

    public static readonly GET : ZodType = z.object({
        contact_id: z.number().positive(),
        id: z.number().positive()    
    });

    public static readonly REMOVE : ZodType = z.object({
        contact_id: z.number().positive(),
        id: z.number().positive()    
    });

    public static readonly UPDATE : ZodType = z.object({
        id: z.number().positive(),
        contact_id: z.number().positive(),
        street: z.string().min(1).max(255).optional(),
        city: z.string().min(1).max(100).optional(),
        province: z.string().min(1).max(100).optional(),
        country: z.string().min(1).max(100),
        postal_code: z.string().min(1).max(10)    
    });

}