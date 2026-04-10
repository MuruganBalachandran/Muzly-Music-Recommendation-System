/**
 * @file UserModel.js
 * @description Mongoose structural definition for the User model. Includes lifecycle hooks and authentication methods.
 */

import mongoose from 'mongoose';
import validator from 'validator';
import { CONSTANTS, hashPassword, verifyPassword } from '../../utils/index.js';
import crypto from 'crypto';

const userSchema = new mongoose.Schema(
    {
        // #region Basic Info
        name: {
            type: String,
            required: [true, 'Please tell us your name!'],
            trim: true,
            maxlength: [50, 'A name must have less or equal than 50 characters'],
            default: 'Music Lover'
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
            enum: [CONSTANTS.USER_ROLES.USER, CONSTANTS.USER_ROLES.ADMIN],
            default: CONSTANTS.USER_ROLES.USER,
        },
        // #endregion

        // #region Security & Authentication
        password: {
            type: String,
            required: [true, 'Please provide a password'],
            minlength: [6, 'A password must have minimum 6 characters'],
            select: false,
        },
        isVerified: {
            type: Boolean,
            default: false,
        },
        emailVerificationOtp: String,
        emailVerificationOtpExpiry: Date,
        passwordResetToken: String,
        passwordResetExpires: Date,
        passwordChangedAt: Date,
        // #endregion

        // #region App Specific Stats
        songsDiscovered: {
            type: Number,
            default: 0
        },
        favorites: [
            {
                songId: String,
                title: String,
                artist: String,
                image: String,
                addedAt: { type: Date, default: Date.now }
            }
        ],
        listeningTimeHours: {
            type: Number,
            default: 0
        },
        // #endregion
    },
    {
        timestamps: true,
    }
);

// #region MIDDLEWARES

/**
 * Pre-save middleware to hash password if modified.
 */
userSchema.pre('save', async function () {
    if (!this.isModified('password')) return;
    this.password = await hashPassword(this.password);
});

/**
 * Pre-save middleware to update passwordChangedAt field for token validation.
 */
userSchema.pre('save', function () {
    if (!this.isModified('password') || this.isNew) return;
    this.passwordChangedAt = Date.now() - 1000;
});

// #endregion

// #region INSTANCE METHODS - Password

/**
 * Validates if the provided password matches the hashed one in the database.
 * @param {string} candidatePassword - Plain text password from user.
 */
userSchema.methods.correctPassword = async function (candidatePassword) {
    return await verifyPassword(candidatePassword, this.password);
};

/**
 * Checks if the user changed the password after a JWT was already issued.
 * @param {number} JWTTimestamp - Created timestamp of the JWT.
 */
userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
    if (this.passwordChangedAt) {
        const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
        return JWTTimestamp < changedTimestamp;
    }
    return false;
};

// #endregion

// #region INSTANCE METHODS - Security Tokens

/**
 * Generates a random 6-digit OTP, hashes it for DB storage, and returns the raw OTP.
 * @returns {string} Raw 6-digit OTP.
 */
userSchema.methods.createEmailVerificationOtp = function () {
    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit
    this.emailVerificationOtp = crypto.createHash('sha256').update(otp).digest('hex');
    this.emailVerificationOtpExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes
    return otp;
};

/**
 * Generates a random string reset token, hashes it, and returns the raw token.
 * @returns {string} Plain-text reset token.
 */
userSchema.methods.createPasswordResetToken = function () {
    const resetToken = crypto.randomBytes(32).toString('hex');
    this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
    return resetToken;
};

// #endregion

export const User = mongoose.model('User', userSchema);
