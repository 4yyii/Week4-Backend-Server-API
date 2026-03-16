import { z, type ZodType } from "zod";
import { ResponseError } from "../error/response.error";

export class Validation {

    public static validate<T>(schema: ZodType, data: T) : T {
        const result = schema.safeParse(data);

        if (!result.success) {
            const fieldErrors = z.flattenError(result.error).fieldErrors as Record<string, string>;
            const errorDetails = Object.keys(fieldErrors).reduce(
                (acc: Record<string, string>, key: string) => {
                    acc[key] = fieldErrors[key]?.[0] ?? "";
                    return acc;
                },
                {},
            );
            console.log(typeof errorDetails);
            throw new ResponseError(400, 'Validation Error', errorDetails)
        }
        return result.data as T;
    }

}