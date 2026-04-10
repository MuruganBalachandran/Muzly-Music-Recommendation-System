/**
 * @file auth.js
 * @description Authentication & Authorization middlewares for protecting routes.
 */

import jwt from 'jsonwebtoken';
import { envVariables } from '../../config/index.js';
import { AppError } from '../../utils/AppError.js';
import { findUserByIdQuery } from '../../queries/auth/authQueries.js';

// #region Protection Middlewares

/**
 * Middleware to protect routes: verifies the JWT token and attaches the user to the request.
 */
export const protect = async (req, res, next) => {
    try {
        let token;

        // Extract token from Header or Cookie
        if (req.headers.authorization?.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        } else if (req.cookies?.jwt) {
            token = req.cookies.jwt;
        }

        if (!token) {
            return next(new AppError('You are not logged in. Please log in to get access.', 401));
        }

        // Verify token
        let decoded;
        try {
            decoded = jwt.verify(token, envVariables.JWT_SECRET);
        } catch (err) {
            if (err.name === 'TokenExpiredError') {
                return next(new AppError('Your token has expired! Please log in again.', 401));
            }
            return next(new AppError('Invalid token. Please log in again!', 401));
        }

        // Check if user still exists
        const currentUser = await findUserByIdQuery(decoded.id);
        if (!currentUser) {
            return next(new AppError('The account belonging to this token no longer exists.', 401));
        }

        // Check if password was changed after token issuance
        if (currentUser.changedPasswordAfter(decoded.iat)) {
            return next(new AppError('User recently changed password! Please log in again.', 401));
        }

        // Populate request with user
        req.user = currentUser;
        next();
    } catch (error) {
        next(error);
    }
};

// #endregion

// #region RBAC Middlewares (Role Based Access Control)

/**
 * Factory middleware to restrict access to specific user roles.
 * @param {...string} roles - List of allowed roles.
 */
export const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return next(new AppError('You do not have permission to perform this action', 403));
        }
        next();
    };
};

// #endregion
