//region imports
import { AuthActivity } from '../../models/activity/AuthActivityModel.js';
import mongoose from 'mongoose';
import { serverLogger } from '../../middlewares/logger/logger.js';
//endregion

//region exports

//region getAuthActivities
/**
 * Fetch auth activities with pagination and filters
 */
export const getAuthActivities = async (filters = {}, limit = 10, skip = 0, search = '') => {
    try {
        serverLogger.info(`[getAuthActivities] Query - filters: ${JSON.stringify(filters)}, limit: ${limit}, skip: ${skip}, search: ${search}`);
        
        const matchStage = { ...filters };
        
        if (search) {
            matchStage.$or = [
                { userEmail: { $regex: search, $options: 'i' } },
                { action: { $regex: search, $options: 'i' } },
                { ipAddress: { $regex: search, $options: 'i' } }
            ];
        }

        const result = await AuthActivity.aggregate([
            { $match: matchStage },
            { $sort: { createdAt: -1 } },
            { $skip: skip },
            { $limit: limit },
            {
                $project: {
                    _id: 1,
                    user: 1,
                    userEmail: 1,
                    action: 1,
                    status: 1,
                    ipAddress: 1,
                    userAgent: 1,
                    details: 1,
                    createdAt: 1
                }
            }
        ]);

        serverLogger.info(`[getAuthActivities] Found ${result.length} records`);
        return result;
    } catch (error) {
        serverLogger.error(`[getAuthActivities] Error: ${error.message}`);
        throw error;
    }
};
//endregion

//region countAuthActivities
/**
 * Count auth activities matching filters and search
 */
export const countAuthActivities = async (filters = {}, search = '') => {
    try {
        serverLogger.info(`[countAuthActivities] Counting - filters: ${JSON.stringify(filters)}, search: ${search}`);
        
        const matchStage = { ...filters };
        
        if (search) {
            matchStage.$or = [
                { userEmail: { $regex: search, $options: 'i' } },
                { action: { $regex: search, $options: 'i' } },
                { ipAddress: { $regex: search, $options: 'i' } }
            ];
        }

        const count = await AuthActivity.countDocuments(matchStage);
        serverLogger.info(`[countAuthActivities] Total count: ${count}`);
        return count;
    } catch (error) {
        serverLogger.error(`[countAuthActivities] Error: ${error.message}`);
        throw error;
    }
};
//endregion

//endregion
