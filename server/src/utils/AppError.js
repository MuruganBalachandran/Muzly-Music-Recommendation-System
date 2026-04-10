/**
 * @file AppError.js
 * @description Custom Error class for operational (expected) errors in the application.
 */

export class AppError extends Error {
    /**
     * @param {string} message - Error description.
     * @param {number} statusCode - HTTP status code (e.g. 400, 404, 500).
     */
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        
        // Marks the error as operational so the global error handler knows to send the message to the client
        this.isOperational = true;

        Error.captureStackTrace(this, this.constructor);
    }
}
