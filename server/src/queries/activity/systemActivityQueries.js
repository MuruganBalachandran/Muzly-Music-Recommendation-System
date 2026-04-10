//region imports
import { SystemActivity } from '../../models/activity/SystemActivityModel.js';
import mongoose from 'mongoose';
//endregion

//region exports

//region getSystemActivities
/**
 * Fetch system activities with pagination and filters
 */
export const getSystemActivities = async (filters = {}, limit = 10, skip = 0, search = '') => {
    try {
        const matchStage = { ...filters };
        
        if (search) {
            matchStage.$or = [
                { action: { $regex: search, $options: 'i' } },
                { resource: { $regex: search, $options: 'i' } },
                { details: { $regex: search, $options: 'i' } },
                { ipAddress: { $regex: search, $options: 'i' } }
            ];
        }

        return await SystemActivity.aggregate([
            { $match: matchStage },
            { $sort: { createdAt: -1 } },
            { $skip: skip },
            { $limit: limit },
            {
                $lookup: {
                    from: 'users',
                    localField: 'user',
                    foreignField: '_id',
                    as: 'userInfo'
                }
            },
            {
                $unwind: { path: '$userInfo', preserveNullAndEmptyArrays: true }
            },
            {
                $project: {
                    _id: 1,
                    user: 1,
                    userEmail: '$userInfo.email',
                    userName: '$userInfo.name',
                    action: 1,
                    resource: 1,
                    details: 1,
                    status: 1,
                    ipAddress: 1,
                    createdAt: 1
                }
            }
        ]);
    } catch (error) {
        throw error;
    }
};
//endregion

//region countSystemActivities
/**
 * Count system activities matching filters and search
 */
export const countSystemActivities = async (filters = {}, search = '') => {
    try {
        const matchStage = { ...filters };
        
        if (search) {
            matchStage.$or = [
                { action: { $regex: search, $options: 'i' } },
                { resource: { $regex: search, $options: 'i' } },
                { details: { $regex: search, $options: 'i' } },
                { ipAddress: { $regex: search, $options: 'i' } }
            ];
        }

        return await SystemActivity.countDocuments(matchStage);
    } catch (error) {
        throw error;
    }
};
//endregion

//endregion
