//region imports
import { User } from '../../models/user/UserModel.js';
import { Admin } from '../../models/admin/AdminModel.js';
import mongoose from 'mongoose';
//endregion

//region exports

//region createUserQuery
/**
 * Creates a new user document.
 */
export const createUserQuery = async (userData) => {
    // initialize user data
    try {
        return await User.create(userData);
    } catch (error) {
        throw error;
    }
};
//endregion

//region saveUserObjectQuery
/**
 * Persists an existing user document instance.
 */
export const saveUserObjectQuery = async (userDoc) => {
    // save document with validation bypass for specific fields
    try {
        return await userDoc.save({ validateBeforeSave: false });
    } catch (error) {
        throw error;
    }
};
//endregion

//region findUserByEmailQuery
/**
 * Finds user by email using aggregation to optionally include password.
 */
export const findUserByEmailQuery = async (email, includePassword = false) => {
    try {
        const emailLower = email.toLowerCase();
        
        // Check Admin collection first
        const admins = await Admin.aggregate([{ $match: { email: emailLower } }]);
        if (admins.length > 0) {
            return Admin.hydrate(admins[0]);
        }

        // Check User collection
        const users = await User.aggregate([{ $match: { email: emailLower } }]);
        if (users.length > 0) {
            return User.hydrate(users[0]);
        }

        return null;
    } catch (error) {
        throw error;
    }
};
//endregion

//region findUserByIdQuery
/**
 * Finds user by unique ID using aggregation.
 */
export const findUserByIdQuery = async (userId) => {
    try {
        const id = new mongoose.Types.ObjectId(userId);
        
        // Check Admin
        const admins = await Admin.aggregate([{ $match: { _id: id } }]);
        if (admins.length > 0) return Admin.hydrate(admins[0]);

        // Check User
        const users = await User.aggregate([{ $match: { _id: id } }]);
        if (users.length > 0) return User.hydrate(users[0]);

        return null;
    } catch (error) {
        throw error;
    }
};
//endregion

//region findUserByOtpQuery
/**
 * Finds user via non-expired OTP.
 */
export const findUserByOtpQuery = async (hashedOtp) => {
    try {
        const query = {
            emailVerificationOtp: hashedOtp,
            emailVerificationOtpExpiry: { $gt: new Date() }
        };

        // Check Admin
        const admins = await Admin.aggregate([{ $match: query }]);
        if (admins.length > 0) return Admin.hydrate(admins[0]);

        // Check User
        const users = await User.aggregate([{ $match: query }]);
        if (users.length > 0) return User.hydrate(users[0]);

        return null;
    } catch (error) {
        throw error;
    }
};

export const findUserByPasswordResetTokenQuery = async (hashedToken) => {
    try {
        const query = {
            passwordResetToken: hashedToken,
            passwordResetExpires: { $gt: new Date() }
        };

        // Check Admin
        const admins = await Admin.aggregate([{ $match: query }]);
        if (admins.length > 0) return Admin.hydrate(admins[0]);

        // Check User
        const users = await User.aggregate([{ $match: query }]);
        if (users.length > 0) return User.hydrate(users[0]);

        return null;
    } catch (error) {
        throw error;
    }
};
//endregion

//endregion
