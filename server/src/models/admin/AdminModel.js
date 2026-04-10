/**
 * @file AdminModel.js
 * @description Mongoose structural definition for the Admin model.
 */

import mongoose from 'mongoose';
import validator from 'validator';
import { CONSTANTS, hashPassword, verifyPassword } from '../../utils/index.js';
import crypto from 'crypto';

const adminSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Please tell us your name!'],
            trim: true,
            maxlength: [50, 'A name must have less or equal than 50 characters'],
        },
        email: {
            type: String,
            required: [true, 'Please provide your email'],
            unique: true,
            lowercase: true,
            validate: [validator.isEmail, 'Please provide a valid email'],
            trim: true,
        },
        role: {
            type: String,
            default: CONSTANTS.USER_ROLES.ADMIN,
        },
        password: {
            type: String,
            required: [true, 'Please provide a password'],
            minlength: [6, 'A password must have minimum 6 characters'],
            select: false,
        },
        isVerified: {
            type: Boolean,
            default: true,
        },
        passwordChangedAt: Date,
    },
    {
        timestamps: true,
    }
);

/**
 * Pre-save middleware to hash password if modified.
 */
adminSchema.pre('save', async function () {
    if (!this.isModified('password')) return;
    this.password = await hashPassword(this.password);
});

/**
 * Validates if the provided password matches the hashed one in the database.
 */
adminSchema.methods.correctPassword = async function (candidatePassword) {
    return await verifyPassword(candidatePassword, this.password);
};

/**
 * Checks if the user changed the password after a JWT was already issued.
 */
adminSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
    if (this.passwordChangedAt) {
        const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
        return JWTTimestamp < changedTimestamp;
    }
    return false;
};

/**
 * Generates a random string reset token, hashes it, and returns the raw token.
 */
adminSchema.methods.createPasswordResetToken = function () {
    const resetToken = crypto.randomBytes(32).toString('hex');
    this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
    return resetToken;
};

export const Admin = mongoose.model('Admin', adminSchema);
