//region imports
import {
    createUserQuery,
    findUserByEmailQuery,
    findUserByOtpQuery,
    saveUserObjectQuery
} from '../../queries/auth/authQueries.js';
import { User } from '../../models/user/UserModel.js';
import { sendVerificationEmailService } from '../../services/email/emailServices.js';
import { catchAsync, AppError, generateToken, sendSuccessResponse } from '../../utils/index.js';
import { envVariables } from '../../config/index.js';
import { logAuthActivity } from '../../utils/commonFunctions/activityLogger.js';
import crypto from 'crypto';
//endregion

//region helper function: sendTokenResponse
/**
 * Utility to generate JWT and send as cookie/response.
 */
const sendTokenResponse = (user, statusCode, res, message) => {
    // create token bundle
    const token = generateToken({ id: user._id, role: user.role });
    
    // set cookie for cross-domain stability
    res.cookie('jwt', token, {
        expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        httpOnly: true,
        secure: envVariables.NODE_ENV === 'production',
        sameSite: 'lax',
    });

    // ensure password doesn't leak
    user.password = undefined;
    sendSuccessResponse(res, statusCode, message, { token, user });
};
//endregion

//region exports

//region authentication flow

//region signUp
/**
 * @route   POST /api/v1/auth/signup
 */
export const signUp = catchAsync(async (req, res, next) => {
    // extract body
    const { name, email, password } = req.body;

    if (!email || !password) return next(new AppError('Please provide email and password', 400));

    // verify uniqueness
    const existingUser = await findUserByEmailQuery(email);
    if (existingUser && existingUser.isVerified) {
        return next(new AppError('A verified user with that email already exists', 400));
    }

    // reuse or create entry
    let user = existingUser;
    if (!user) {
        user = await createUserQuery({ name: name || 'Music Lover', email, password });
    }

    // trigger otp generation
    const otp = user.createEmailVerificationOtp();
    await saveUserObjectQuery(user);

    try {
        // dispatch email service
        await sendVerificationEmailService(user, otp);
        sendSuccessResponse(res, 201, 'Account created! A 6-digit OTP has been sent to your email.');
    } catch (err) {
        // fail-safe cleanup
        user.emailVerificationOtp = undefined;
        user.emailVerificationOtpExpiry = undefined;
        await saveUserObjectQuery(user);
        return next(new AppError('There was an error sending the OTP. Try again later.', 500));
    }
});
//endregion

//region verifyEmail
/**
 * @route   POST /api/v1/auth/verify-email
 */
export const verifyEmail = catchAsync(async (req, res, next) => {
    // extract identifiers
    const { email, otp } = req.body;

    if (!email || !otp) return next(new AppError('Please provide email and OTP', 400));

    // secure hash comparison
    const hashedOtp = crypto.createHash('sha256').update(String(otp)).digest('hex');
    const user = await findUserByOtpQuery(hashedOtp);

    if (!user || user.email !== email.toLowerCase()) {
        return next(new AppError('Invalid OTP or it has expired. Please request a new one.', 400));
    }

    // mark as verified
    user.isVerified = true;
    user.emailVerificationOtp = undefined;
    user.emailVerificationOtpExpiry = undefined;
    await saveUserObjectQuery(user);

    // Log activity
    req.user = user;
    await logAuthActivity({
        req,
        action: 'Email Verified',
        details: 'User verified their email address',
        status: 'success'
    });

    sendTokenResponse(user, 200, res, 'Email verified successfully! You are now logged in.');
});
//endregion

//region resendOtp
/**
 * @route   POST /api/v1/auth/resend-otp
 */
export const resendOtp = catchAsync(async (req, res, next) => {
    // identify user
    const { email } = req.body;
    if (!email) return next(new AppError('Please provide your email', 400));

    const user = await findUserByEmailQuery(email);
    if (!user) return next(new AppError('No account found with that email', 404));
    if (user.isVerified) return next(new AppError('This account is already verified', 400));

    // refresh tokens
    const otp = user.createEmailVerificationOtp();
    await saveUserObjectQuery(user);

    try {
        await sendVerificationEmailService(user, otp);
        sendSuccessResponse(res, 200, 'A new OTP has been sent to your email.');
    } catch (err) {
        return next(new AppError('Error sending OTP. Try again later.', 500));
    }
});
//endregion

//region signIn
/**
 * @route   POST /api/v1/auth/signin
 */
export const signIn = catchAsync(async (req, res, next) => {
    // credentials check
    const { email, password } = req.body;
    if (!email || !password) return next(new AppError('Please provide email and password!', 400));

    // fetch including password strictly for comparison
    const user = await findUserByEmailQuery(email, true);
    
    // Set req.user early for activity logging
    if (user) {
        req.user = user;
    } else {
        // Create temporary user object for logging failed attempt
        req.user = { email, _id: 'unknown' };
    }

    if (!user || !(await user.correctPassword(password))) {
        // Log failed login attempt
        await logAuthActivity({
            req,
            action: 'Login',
            details: 'Failed login attempt - incorrect password',
            status: 'failed'
        });
        return next(new AppError('Incorrect email or password', 401));
    }
    
    if (!user.isVerified) {
        // Log failed login - unverified
        await logAuthActivity({
            req,
            action: 'Login',
            details: 'Failed login attempt - email not verified',
            status: 'failed'
        });
        return next(new AppError('Please verify your email address to log in', 401));
    }

    // Log successful login activity
    await logAuthActivity({
        req,
        action: 'Login',
        details: 'User logged in successfully',
        status: 'success'
    });

    sendTokenResponse(user, 200, res, 'Logged in successfully!');
});
//endregion

//region logout
/**
 * @route   POST /api/v1/auth/logout
 */
export const logout = catchAsync(async (req, res) => {
    // Log logout activity
    if (req.user) {
        await logAuthActivity({
            req,
            action: 'Logout',
            details: 'User logged out',
            status: 'success'
        });
    }

    // clear token from client
    res.cookie('jwt', 'loggedout', { expires: new Date(Date.now() + 10 * 1000), httpOnly: true });
    sendSuccessResponse(res, 200, 'Logged out successfully');
});
//endregion

//endregion

//region profile management

//region getMe
/**
 * @route   GET /api/v1/auth/me
 */
export const getMe = catchAsync(async (req, res) => {
    // return identity from session
    sendSuccessResponse(res, 200, 'User data retrieved', req.user);
});
//endregion

//region changePassword
/**
 * @route   PATCH /api/v1/auth/change-password
 */
export const changePassword = catchAsync(async (req, res, next) => {
    // verify transition data
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
        return next(new AppError('Please provide current and new password', 400));
    }

    // strict current password validation
    const user = await findUserByEmailQuery(req.user.email, true);
    if (!(await user.correctPassword(currentPassword))) {
        return next(new AppError('Your current password is wrong', 401));
    }

    // commit change
    user.password = newPassword;
    await saveUserObjectQuery(user);

    // Log password change
    req.user = user;
    await logAuthActivity({
        req,
        action: 'Password Reset',
        details: 'User changed their password',
        status: 'success'
    });

    sendTokenResponse(user, 200, res, 'Password updated successfully!');
});
//endregion

//region updateProfile
/**
 * @route   PATCH /api/v1/auth/update-profile
 */
export const updateProfile = catchAsync(async (req, res, next) => {
    // security check
    if (req.body.password || req.body.currentPassword) {
        return next(new AppError('This route is not for password updates. Please use /change-password.', 400));
    }

    // apply updates
    const { name } = req.body;
    const filteredBody = {};
    if (name) filteredBody.name = name;

    const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, { new: true, runValidators: true });

    // Log profile update
    await logAuthActivity({
        req,
        action: 'Profile Updated',
        details: `Updated fields: ${Object.keys(filteredBody).join(', ')}`,
        status: 'success'
    });

    sendSuccessResponse(res, 200, 'Profile updated successfully', updatedUser);
});
//endregion

//endregion

//endregion
