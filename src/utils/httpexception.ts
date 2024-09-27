// HttpException.ts
export class HttpException extends Error {
    public statusCode: number;
    
    public message: string;

    constructor(statusCode: number, message: string) {
        super(message);
        this.statusCode = statusCode;
        this.message = message;

        // Maintain proper stack trace (only available on V8)
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, HttpException);
        }
    }
}