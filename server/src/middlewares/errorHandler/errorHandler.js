/**
 * @file errorHandler.js
 * @description Centralized error handling middleware. Converts DB/Auth errors into structured API responses.
 */

import { envVariables } from '../../config/index.js';

// #region Mode-Specific Response Logic

/**
 * Sends a detailed error in dev, or a clean operational error in production.
 */
const sendErrorResponsive = (err, res) => {
    if (envVariables.NODE_ENV === 'development') {
        res.status(err.statusCode).json({
            success: false,
            status: err.status,
            error: err,
            message: err.message,
            stack: err.stack,
        });
    } else {
        // Production: Send clean message to client if the error is operational
        if (err.isOperational) {
            res.status(err.statusCode).json({ success: false, status: err.status, message: err.message });
        } else {
            // Log original error for internal tracking
            console.error('SERVER ERROR 💥', err);
            res.status(500).json({ success: false, status: 'error', message: 'Something went very wrong!' });
        }
    }
};

// #endregion

// #region Database Error Converters

/**
 * Handles Mongoose CastError (e.g., invalid ObjectId).
 */
const handleCastErrorDB = (err) => ({ ...err, message: `Invalid ${err.path}: ${err.value}.`, statusCode: 400, isOperational: true, status: 'fail' });

/**
 * Handles MongoDB 11000 duplicate field error.
 */
const handleDuplicateFieldsDB = (err) => {
    const value = err.errmsg?.match(/([\"'])(\\?.)*?\1/)?.[0] ?? 'value';
    return { ...err, message: `Duplicate field value: ${value}. Please use another value!`, statusCode: 400, isOperational: true, status: 'fail' };
};

/**
 * Handles Mongoose ValidationErrors.
 */
const handleValidationErrorDB = (err) => {
    const errors = Object.values(err.errors).map((el) => el.message);
    return { ...err, message: `Invalid input data. ${errors.join('. ')}`, statusCode: 400, isOperational: true, status: 'fail' };
};

// #endregion

// #region Global Middleware

/**
 * Central Error Middleware
 * Registered as the last handler in app.js
 */
export const globalErrorHandler = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    let error = { ...err, message: err.message, isOperational: err.isOperational || false };

    // Map specific technical errors to user-friendly operational errors
    if (err.name === 'CastError') error = handleCastErrorDB(error);
    if (err.code === 11000) error = handleDuplicateFieldsDB(error);
    if (err.name === 'ValidationError') error = handleValidationErrorDB(error);
    if (err.statusCode && err.statusCode !== 500) error.isOperational = true;

    sendErrorResponsive(error, res);
};

// #endregion


