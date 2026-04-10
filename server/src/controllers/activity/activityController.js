//region imports
import { getAuthActivities, countAuthActivities } from '../../queries/activity/authActivityQueries.js';
import { getSongActivities, countSongActivities } from '../../queries/activity/songActivityQueries.js';
import { getSystemActivities, countSystemActivities } from '../../queries/activity/systemActivityQueries.js';
import { catchAsync, sendSuccessResponse, CONSTANTS } from '../../utils/index.js';
import { serverLogger } from '../../middlewares/logger/logger.js';
import { AuthActivity } from '../../models/activity/AuthActivityModel.js';
import { SongActivity } from '../../models/activity/SongActivityModel.js';
import { SystemActivity } from '../../models/activity/SystemActivityModel.js';
//endregion

//region exports

//region User Activities
/**
 * Get user's own auth activities
 */
export const getUserAuthActivities = catchAsync(async (req, res) => {
    serverLogger.info(`[getUserAuthActivities] Starting - User: ${req.user._id}`);
    
    const limit = Number(req.query.limit) || 10;
    const page = Number(req.query.page) || 1;
    const skip = (page - 1) * limit;
    const search = req.query.search || '';
    
    serverLogger.info(`[getUserAuthActivities] Params - limit: ${limit}, page: ${page}, skip: ${skip}, search: ${search}`);
    
    const filters = { user: req.user._id };
    if (req.query.action) filters.action = req.query.action;
    if (req.query.status) filters.status = req.query.status;

    serverLogger.info(`[getUserAuthActivities] Filters: ${JSON.stringify(filters)}`);

    const [activities, total] = await Promise.all([
        getAuthActivities(filters, limit, skip, search),
        countAuthActivities(filters, search)
    ]);

    serverLogger.info(`[getUserAuthActivities] Found ${activities.length} activities, total: ${total}`);

    sendSuccessResponse(res, CONSTANTS.STATUS_CODES.OK, 'User auth activities retrieved', {
        count: activities.length,
        total,
        page,
        pages: Math.ceil(total / limit),
        data: activities
    });
});

/**
 * Get user's own song activities
 */
export const getUserSongActivities = catchAsync(async (req, res) => {
    serverLogger.info(`[getUserSongActivities] Starting - User: ${req.user._id}`);
    
    const limit = Number(req.query.limit) || 10;
    const page = Number(req.query.page) || 1;
    const skip = (page - 1) * limit;
    const search = req.query.search || '';
    
    serverLogger.info(`[getUserSongActivities] Params - limit: ${limit}, page: ${page}, skip: ${skip}, search: ${search}`);
    
    const filters = { user: req.user._id };
    if (req.query.action) filters.action = req.query.action;
    if (req.query.status) filters.status = req.query.status;

    serverLogger.info(`[getUserSongActivities] Filters: ${JSON.stringify(filters)}`);

    const [activities, total] = await Promise.all([
        getSongActivities(filters, limit, skip, search),
        countSongActivities(filters, search)
    ]);

    serverLogger.info(`[getUserSongActivities] Found ${activities.length} activities, total: ${total}`);

    sendSuccessResponse(res, CONSTANTS.STATUS_CODES.OK, 'User song activities retrieved', {
        count: activities.length,
        total,
        page,
        pages: Math.ceil(total / limit),
        data: activities
    });
});

/**
 * Get user's own system activities
 */
export const getUserSystemActivities = catchAsync(async (req, res) => {
    serverLogger.info(`[getUserSystemActivities] Starting - User: ${req.user._id}`);
    
    const limit = Number(req.query.limit) || 10;
    const page = Number(req.query.page) || 1;
    const skip = (page - 1) * limit;
    const search = req.query.search || '';
    
    serverLogger.info(`[getUserSystemActivities] Params - limit: ${limit}, page: ${page}, skip: ${skip}, search: ${search}`);
    
    const filters = { user: req.user._id };
    if (req.query.action) filters.action = req.query.action;
    if (req.query.status) filters.status = req.query.status;

    serverLogger.info(`[getUserSystemActivities] Filters: ${JSON.stringify(filters)}`);

    const [activities, total] = await Promise.all([
        getSystemActivities(filters, limit, skip, search),
        countSystemActivities(filters, search)
    ]);

    serverLogger.info(`[getUserSystemActivities] Found ${activities.length} activities, total: ${total}`);

    sendSuccessResponse(res, CONSTANTS.STATUS_CODES.OK, 'User system activities retrieved', {
        count: activities.length,
        total,
        page,
        pages: Math.ceil(total / limit),
        data: activities
    });
});

/**
 * Get all user activities (deprecated - use specific endpoints)
 */
export const getUserActivities = catchAsync(async (req, res) => {
    sendSuccessResponse(res, CONSTANTS.STATUS_CODES.OK, 'User activities retrieved successfully', []);
});
//endregion

export const getAllActivitiesAdmin = catchAsync(async (req, res) => {
    const limit = Number(req.query.limit) || 10;
    const page = Number(req.query.page) || 1;
    const skip = (page - 1) * limit;

    const auth = await AuthActivity.find().limit(limit).skip(skip).sort('-createdAt');
    const song = await SongActivity.find().limit(limit).skip(skip).sort('-createdAt');
    const system = await SystemActivity.find().limit(limit).skip(skip).sort('-createdAt');

    sendSuccessResponse(res, CONSTANTS.STATUS_CODES.OK, 'All activities retrieved', {
        auth, song, system
    });
});

//region exports

//region getAuthActivities
/**
 * Get auth activities with pagination and filters
 */
export const getAuthActivitiesAdmin = catchAsync(async (req, res) => {
    serverLogger.info(`[getAuthActivitiesAdmin] Starting`);
    
    const limit = Number(req.query.limit) || 10;
    const page = Number(req.query.page) || 1;
    const skip = (page - 1) * limit;
    const search = req.query.search || '';
    
    serverLogger.info(`[getAuthActivitiesAdmin] Params - limit: ${limit}, page: ${page}, skip: ${skip}, search: ${search}`);
    
    const filters = {};
    if (req.query.action) filters.action = req.query.action;
    if (req.query.status) filters.status = req.query.status;

    serverLogger.info(`[getAuthActivitiesAdmin] Filters: ${JSON.stringify(filters)}`);

    const [activities, total] = await Promise.all([
        getAuthActivities(filters, limit, skip, search),
        countAuthActivities(filters, search)
    ]);

    serverLogger.info(`[getAuthActivitiesAdmin] Found ${activities.length} activities, total: ${total}`);

    sendSuccessResponse(res, CONSTANTS.STATUS_CODES.OK, 'Auth activities retrieved', {
        count: activities.length,
        total,
        page,
        pages: Math.ceil(total / limit),
        data: activities
    });
});
//endregion

//region getSongActivities
/**
 * Get song activities with pagination and filters
 */
export const getSongActivitiesAdmin = catchAsync(async (req, res) => {
    serverLogger.info(`[getSongActivitiesAdmin] Starting`);
    
    const limit = Number(req.query.limit) || 10;
    const page = Number(req.query.page) || 1;
    const skip = (page - 1) * limit;
    const search = req.query.search || '';
    
    serverLogger.info(`[getSongActivitiesAdmin] Params - limit: ${limit}, page: ${page}, skip: ${skip}, search: ${search}`);
    
    const filters = {};
    if (req.query.action) filters.action = req.query.action;
    if (req.query.status) filters.status = req.query.status;

    serverLogger.info(`[getSongActivitiesAdmin] Filters: ${JSON.stringify(filters)}`);

    const [activities, total] = await Promise.all([
        getSongActivities(filters, limit, skip, search),
        countSongActivities(filters, search)
    ]);

    serverLogger.info(`[getSongActivitiesAdmin] Found ${activities.length} activities, total: ${total}`);

    sendSuccessResponse(res, CONSTANTS.STATUS_CODES.OK, 'Song activities retrieved', {
        count: activities.length,
        total,
        page,
        pages: Math.ceil(total / limit),
        data: activities
    });
});
//endregion

//region getSystemActivities
/**
 * Get system activities with pagination and filters
 */
export const getSystemActivitiesAdmin = catchAsync(async (req, res) => {
    serverLogger.info(`[getSystemActivitiesAdmin] Starting`);
    
    const limit = Number(req.query.limit) || 10;
    const page = Number(req.query.page) || 1;
    const skip = (page - 1) * limit;
    const search = req.query.search || '';
    
    serverLogger.info(`[getSystemActivitiesAdmin] Params - limit: ${limit}, page: ${page}, skip: ${skip}, search: ${search}`);
    
    const filters = {};
    if (req.query.action) filters.action = req.query.action;
    if (req.query.status) filters.status = req.query.status;

    serverLogger.info(`[getSystemActivitiesAdmin] Filters: ${JSON.stringify(filters)}`);

    const [activities, total] = await Promise.all([
        getSystemActivities(filters, limit, skip, search),
        countSystemActivities(filters, search)
    ]);

    serverLogger.info(`[getSystemActivitiesAdmin] Found ${activities.length} activities, total: ${total}`);

    sendSuccessResponse(res, CONSTANTS.STATUS_CODES.OK, 'System activities retrieved', {
        count: activities.length,
        total,
        page,
        pages: Math.ceil(total / limit),
        data: activities
    });
});
//endregion

//endregion

