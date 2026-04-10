/**
 * @file index.js
 * @description Main API Router. Aggregates and mounts all feature-specific routers (Auth, User, Songs, Activity).
 */

import express from 'express';
import authRouter from './auth/authRouter.js';
import userRouter from './user/userRouter.js';
import songRouter from './song/songRouter.js';
import activityRouter from './activity/activityRouter.js';
import artistRouter from './artist/artistRouter.js';
import languageRouter from './language/languageRouter.js';
import adminRouter from './admin/adminRouter.js';

const router = express.Router();

// #region Route Sub-Module Mounting

router.use('/auth', authRouter);
router.use('/users', userRouter);
router.use('/songs', songRouter);
router.use('/activity', activityRouter);
router.use('/artists', artistRouter);
router.use('/languages', languageRouter);
router.use('/admin', adminRouter);

// #endregion

export default router;
