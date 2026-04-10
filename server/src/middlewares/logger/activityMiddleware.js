/**
 * @file activityMiddleware.js
 * @description Global middleware to automatically log all user activities
 * Captures requests and logs them to appropriate activity collections
 */

import { serverLogger } from './logger.js';
import { logAuthActivity, logSystemActivity } from '../../utils/commonFunctions/activityLogger.js';

/**
 * Extract IP address from request
 */
const getIpAddress = (req) => {
    let ip;
    
    if (req.ip) {
        ip = req.ip;
    } else if (req.headers['x-forwarded-for']) {
        ip = req.headers['x-forwarded-for'].split(',')[0].trim();
    } else if (req.headers['x-real-ip']) {
        ip = req.headers['x-real-ip'];
    } else if (req.connection?.remoteAddress) {
        ip = req.connection.remoteAddress;
    } else if (req.socket?.remoteAddress) {
        ip = req.socket.remoteAddress;
    } else {
        ip = 'Unknown';
    }
    
    if (ip === '::1' || ip === '::ffff:127.0.0.1') {
        ip = '127.0.0.1';
    }
    
    if (ip && ip.startsWith('::ffff:')) {
        ip = ip.substring(7);
    }
    
    return ip || 'Unknown';
};

/**
 * Global activity logging middleware
 * Automatically logs activities based on route and method
 */
export const globalActivityLogger = async (req, res, next) => {
    // Store original send function
    const originalSend = res.send;
    
    // Override send to capture response
    res.send = function(data) {
        // Only log on successful responses
        if (res.statusCode >= 200 && res.statusCode < 400 && req.user) {
            try {
                logActivityBasedOnRoute(req, res, data);
            } catch (err) {
                serverLogger.error(`[globalActivityLogger] Error logging activity: ${err.message}`);
            }
        }
        
        res.send = originalSend;
        return originalSend.call(this, data);
    };
    
    next();
};

/**
 * Determine activity type and log accordingly
 */
const logActivityBasedOnRoute = async (req, res, responseData) => {
    const method = req.method;
    const path = req.path;
    const user = req.user;
    const ipAddress = getIpAddress(req);
    
    serverLogger.info(`[globalActivityLogger] Logging activity - Method: ${method}, Path: ${path}, User: ${user._id}`);
    
    // Auth activities
    if (path.includes('/auth/')) {
        if (path.includes('/login') && method === 'POST') {
            await logAuthActivity({
                req,
                action: 'Login',
                details: `User logged in from IP: ${ipAddress}`,
                status: 'success'
            });
            serverLogger.info(`[globalActivityLogger] Logged: Login activity`);
        } else if (path.includes('/logout') && method === 'POST') {
            await logAuthActivity({
                req,
                action: 'Logout',
                details: `User logged out from IP: ${ipAddress}`,
                status: 'success'
            });
            serverLogger.info(`[globalActivityLogger] Logged: Logout activity`);
        } else if (path.includes('/signup') && method === 'POST') {
            await logAuthActivity({
                req,
                action: 'Signup',
                details: `New user registered from IP: ${ipAddress}`,
                status: 'success'
            });
            serverLogger.info(`[globalActivityLogger] Logged: Signup activity`);
        } else if (path.includes('/verify-email') && method === 'POST') {
            await logAuthActivity({
                req,
                action: 'Email Verified',
                details: `User verified email from IP: ${ipAddress}`,
                status: 'success'
            });
            serverLogger.info(`[globalActivityLogger] Logged: Email Verified activity`);
        } else if (path.includes('/reset-password') && method === 'POST') {
            await logAuthActivity({
                req,
                action: 'Password Reset',
                details: `User reset password from IP: ${ipAddress}`,
                status: 'success'
            });
            serverLogger.info(`[globalActivityLogger] Logged: Password Reset activity`);
        }
    }
    
    // User profile activities
    if (path.includes('/users/') && method === 'PATCH') {
        await logAuthActivity({
            req,
            action: 'Profile Updated',
            details: `User updated profile from IP: ${ipAddress}`,
            status: 'success'
        });
        serverLogger.info(`[globalActivityLogger] Logged: Profile Updated activity`);
    }
    
    // Admin/System activities
    if (path.includes('/admin/') || path.includes('/songs/') || path.includes('/languages/')) {
        if (user.role === 'admin') {
            let action = 'Admin Action';
            let resource = 'Unknown';
            
            if (path.includes('/songs/')) {
                if (method === 'POST') {
                    action = 'Song Created';
                    resource = 'Song';
                } else if (method === 'PATCH') {
                    action = 'Song Updated';
                    resource = 'Song';
                } else if (method === 'DELETE') {
                    action = 'Song Deleted';
                    resource = 'Song';
                }
            } else if (path.includes('/languages/')) {
                if (method === 'POST') {
                    action = 'Language Created';
                    resource = 'Language';
                } else if (method === 'PATCH') {
                    action = 'Language Updated';
                    resource = 'Language';
                } else if (method === 'DELETE') {
                    action = 'Language Deleted';
                    resource = 'Language';
                }
            }
            
            await logSystemActivity({
                user,
                action,
                resource,
                details: `Admin performed action: ${action} from IP: ${ipAddress}`,
                status: 'success',
                ipAddress
            });
            serverLogger.info(`[globalActivityLogger] Logged: System activity - ${action}`);
        }
    }
};

/**
 * Error activity logger
 * Logs failed activities
 */
export const errorActivityLogger = async (err, req, res, next) => {
    if (req.user) {
        const ipAddress = getIpAddress(req);
        const method = req.method;
        const path = req.path;
        
        serverLogger.error(`[errorActivityLogger] Logging failed activity - Method: ${method}, Path: ${path}, Error: ${err.message}`);
        
        // Log failed auth attempts
        if (path.includes('/auth/login') && method === 'POST') {
            await logAuthActivity({
                req,
                action: 'Login',
                details: `Failed login attempt: ${err.message}`,
                status: 'failed'
            });
            serverLogger.error(`[errorActivityLogger] Logged: Failed login attempt`);
        }
        
        // Log other failed activities
        if (path.includes('/admin/') || path.includes('/songs/') || path.includes('/languages/')) {
            if (req.user.role === 'admin') {
                await logSystemActivity({
                    user: req.user,
                    action: 'Admin Action Failed',
                    resource: 'Unknown',
                    details: `Admin action failed: ${err.message}`,
                    status: 'failed',
                    ipAddress
                });
                serverLogger.error(`[errorActivityLogger] Logged: Failed admin action`);
            }
        }
    }
    
    next(err);
};
