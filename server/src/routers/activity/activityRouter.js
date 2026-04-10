//region imports
import express from 'express';
import {
    getUserActivities,
    getUserAuthActivities,
    getUserSongActivities,
    getUserSystemActivities,
    getAllActivitiesAdmin,
    getAuthActivitiesAdmin,
    getSongActivitiesAdmin,
    getSystemActivitiesAdmin
} from '../../controllers/activity/activityController.js';
import { logActivity } from '../../controllers/user/userController.js';
import { protect, authorize, activityDebugger } from '../../middlewares/index.js';
import { CONSTANTS } from '../../utils/index.js';
//endregion

const router = express.Router();

//region authentication middleware
/**
 * Require login for all activity-related features.
 */
router.use(protect);
router.use(activityDebugger);
//endregion

//region User Routes
/**
 * Personal interactions.
 */
router.post('/log', logActivity);
router.get('/me', getUserActivities);
router.get('/me/auth', getUserAuthActivities);
router.get('/me/songs', getUserSongActivities);
router.get('/me/system', getUserSystemActivities);
//endregion

//region Admin Routes
/**
 * System-wide visibility for administrators.
 */
router.get('/admin/all', authorize(CONSTANTS.USER_ROLES.ADMIN), getAllActivitiesAdmin);
//endregion

//region exports
export default router;
//endregion
