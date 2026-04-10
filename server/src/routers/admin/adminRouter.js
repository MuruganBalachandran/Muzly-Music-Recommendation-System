/**
 * @file adminRouter.js
 * @description Routes for admin-specific operations like stats, user management, and activity logs.
 */

import express from 'express';
import {
    getAdminStats,
    getAllUsers
} from '../../controllers/admin/adminController.js';
import {
    getAuthActivitiesAdmin,
    getSongActivitiesAdmin,
    getSystemActivitiesAdmin
} from '../../controllers/activity/activityController.js';
import { protect, authorize } from '../../middlewares/index.js';
import { CONSTANTS } from '../../utils/index.js';

const router = express.Router();

// Middleware to protect all routes and require admin role
router.use(protect);
router.use(authorize(CONSTANTS.USER_ROLES.ADMIN));

// #region Admin Stats Routes

router.get('/stats', getAdminStats);
router.get('/users', getAllUsers);

// #endregion

// #region Activity Routes

router.get('/activities/auth', getAuthActivitiesAdmin);
router.get('/activities/songs', getSongActivitiesAdmin);
router.get('/activities/system', getSystemActivitiesAdmin);

// #endregion

export default router;
