/**
 * @file requestDebugger.js
 * @description Detailed request debugging middleware for development
 */

import { serverLogger } from './logger.js';

/**
 * Detailed request debugging middleware
 * Logs request details, query params, body, and user info
 */
export const requestDebugger = (req, res, next) => {
    const requestId = `[${new Date().toISOString()}]`;
    
    serverLogger.info(`${requestId} ===== REQUEST START =====`);
    serverLogger.info(`${requestId} METHOD: ${req.method}`);
    serverLogger.info(`${requestId} URL: ${req.originalUrl}`);
    serverLogger.info(`${requestId} PATH: ${req.path}`);
    serverLogger.info(`${requestId} QUERY: ${JSON.stringify(req.query)}`);
    
    if (req.user) {
        serverLogger.info(`${requestId} USER ID: ${req.user._id}`);
        serverLogger.info(`${requestId} USER EMAIL: ${req.user.email}`);
        serverLogger.info(`${requestId} USER ROLE: ${req.user.role}`);
    } else {
        serverLogger.warn(`${requestId} NO USER AUTHENTICATED`);
    }
    
    if (Object.keys(req.body).length > 0) {
        serverLogger.info(`${requestId} BODY: ${JSON.stringify(req.body)}`);
    }
    
    // Log response
    const originalSend = res.send;
    res.send = function(data) {
        serverLogger.info(`${requestId} RESPONSE STATUS: ${res.statusCode}`);
        if (typeof data === 'string') {
            try {
                const parsed = JSON.parse(data);
                serverLogger.info(`${requestId} RESPONSE DATA: ${JSON.stringify(parsed).substring(0, 500)}`);
            } catch (e) {
                serverLogger.info(`${requestId} RESPONSE: ${data.substring(0, 200)}`);
            }
        }
        serverLogger.info(`${requestId} ===== REQUEST END =====`);
        res.send = originalSend;
        return originalSend.call(this, data);
    };
    
    next();
};

/**
 * Activity-specific debug middleware
 */
export const activityDebugger = (req, res, next) => {
    const requestId = `[ACTIVITY-${new Date().toISOString()}]`;
    
    serverLogger.info(`${requestId} Activity Request Received`);
    serverLogger.info(`${requestId} Method: ${req.method}`);
    serverLogger.info(`${requestId} Path: ${req.path}`);
    serverLogger.info(`${requestId} Full URL: ${req.originalUrl}`);
    serverLogger.info(`${requestId} Query Params: ${JSON.stringify(req.query)}`);
    
    if (req.user) {
        serverLogger.info(`${requestId} Authenticated User: ${req.user._id} (${req.user.email})`);
    } else {
        serverLogger.error(`${requestId} NO USER - Request will fail!`);
    }
    
    next();
};

/**
 * Error logging middleware
 */
export const errorLogger = (err, req, res, next) => {
    const requestId = `[ERROR-${new Date().toISOString()}]`;
    
    serverLogger.error(`${requestId} Error occurred`);
    serverLogger.error(`${requestId} Message: ${err.message}`);
    serverLogger.error(`${requestId} Status: ${err.statusCode || 500}`);
    serverLogger.error(`${requestId} Stack: ${err.stack}`);
    
    if (req.user) {
        serverLogger.error(`${requestId} User: ${req.user._id}`);
    }
    
    next(err);
};
