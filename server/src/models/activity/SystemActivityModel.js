/**
 * @file SystemActivityModel.js
 * @description Mongoose model for system/admin activities
 */

import mongoose from 'mongoose';

const systemActivitySchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.ObjectId,
            ref: 'User',
            required: [true, 'Activity must belong to a user'],
        },
        action: {
            type: String,
            required: [true, 'System activity must have an action'],
        },
        resource: {
            type: String,
        },
        details: {
            type: String,
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
        metadata: {
            type: mongoose.Schema.Types.Mixed,
        }
    },
    {
        timestamps: true,
    }
);

systemActivitySchema.index({ user: 1, createdAt: -1 });
systemActivitySchema.index({ action: 1, createdAt: -1 });
systemActivitySchema.index({ status: 1, createdAt: -1 });

export const SystemActivity = mongoose.model('SystemActivity', systemActivitySchema, 'system_activities');
