/**
 * @file logger.js
 * @description Configures Winston for application logging and provides HTTP request logging middleware.
 */

import winston from 'winston';
import { envVariables } from '../../config/index.js';

// #region Winston Configuration

const colors = { error: 'red', warn: 'yellow', info: 'green', http: 'magenta', debug: 'white' };
winston.addColors(colors);

/**
 * Primary logger instance for the application.
 */
export const serverLogger = winston.createLogger({
    level: envVariables.NODE_ENV === 'development' ? 'debug' : 'info',
    format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.errors({ stack: true }),
        winston.format.splat(),
        winston.format.json()
    ),
    transports: [],
});

// If not in production, log to console with colors and custom format
if (envVariables.NODE_ENV !== 'production') {
    serverLogger.add(
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize({ all: true }),
                winston.format.printf((info) => `[${info.timestamp}] ${info.level}: ${info.message}`)
            ),
        })
    );
}

// #endregion

// #region HTTP Middleware

/**
 * Middleware that logs HTTP requests with method, URL, status code, and response time.
 */
export const httpLoggerMiddleware = (req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
        const ms = Date.now() - start;
        const message = `${req.method} ${req.originalUrl} ${res.statusCode} - ${ms}ms`;
        if (res.statusCode >= 500) serverLogger.error(message);
        else if (res.statusCode >= 400) serverLogger.warn(message);
        else serverLogger.info(message);
    });
    next();
};

// #endregion
