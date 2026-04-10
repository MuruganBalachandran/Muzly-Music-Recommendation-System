/**
 * @file authRouter.js
 * @description Routes for user registration, login, and profile security management.
 */

import express from 'express';
import { signUp, verifyEmail, resendOtp, signIn, logout, getMe, changePassword, updateProfile } from '../../controllers/auth/authController.js';
import { protect } from '../../middlewares/index.js';

const router = express.Router();

// #region Public Authentication Routes

router.post('/signup', signUp);
router.post('/verify-email', verifyEmail);
router.post('/resend-otp', resendOtp);
router.post('/signin', signIn);

// #endregion

// #region Protected User Profile Routes

router.use(protect); // Middleware to ensure user is logged in for below routes

router.post('/logout', logout);
router.get('/me', getMe);
router.patch('/change-password', changePassword);
router.patch('/update-profile', updateProfile);

// #endregion

export default router;
