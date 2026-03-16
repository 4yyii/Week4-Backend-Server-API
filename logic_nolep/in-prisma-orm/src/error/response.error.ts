export class ResponseError extends Error {
    constructor(public status: number, public message: string, public details?: Record<string, string>) {
        super(message);
    }
}