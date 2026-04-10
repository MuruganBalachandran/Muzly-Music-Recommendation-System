/**
 * @file AuthActivityModel.js
 * @description Mongoose model for authentication activities (Login, Logout, Signup, etc.)
 */

import mongoose from 'mongoose';

const authActivitySchema = new mongoose.Schema(
    {
        // #region Fields
        user: {
            type: mongoose.Schema.ObjectId,
            ref: 'User',
            required: [true, 'Activity must belong to a user'],
        },
        userEmail: {
            type: String,
            required: [true, 'Activity must have user email'],
        },
        action: {
            type: String,
            enum: ['Login', 'Logout', 'Signup', 'Email Verified', 'Password Reset'],
            required: [true, 'Auth activity must have an action'],
        },
        status: {
            type: String,
            enum: ['success', 'failed', 'pending', 'error'],
            default: 'success',
        },
        ipAddress: {
            type: String,
        },
        userAgent: {
            type: String,
        },
        details: {
            type: String,
        },
        metadata: {
            type: mongoose.Schema.Types.Mixed,
        }
        // #endregion
    },
    {
        timestamps: true,
    }
);

// #region Indexes
authActivitySchema.index({ user: 1, createdAt: -1 });
authActivitySchema.index({ userEmail: 1, createdAt: -1 });
authActivitySchema.index({ action: 1, createdAt: -1 });
authActivitySchema.index({ status: 1, createdAt: -1 });
// #endregion

export const AuthActivity = mongoose.model('AuthActivity', authActivitySchema, 'auth_activities');
