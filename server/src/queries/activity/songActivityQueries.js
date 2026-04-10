//region imports
import { SongActivity } from '../../models/activity/SongActivityModel.js';
import mongoose from 'mongoose';
//endregion

//region exports

//region getSongActivities
/**
 * Fetch song activities with pagination and filters
 */
export const getSongActivities = async (filters = {}, limit = 10, skip = 0, search = '') => {
    try {
        const matchStage = { ...filters };
        
        if (search) {
            matchStage.$or = [
                { userEmail: { $regex: search, $options: 'i' } },
                { songName: { $regex: search, $options: 'i' } },
                { artist: { $regex: search, $options: 'i' } },
                { ipAddress: { $regex: search, $options: 'i' } }
            ];
        }

        return await SongActivity.aggregate([
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
                    songId: 1,
                    songName: 1,
                    artist: 1,
                    duration: 1,
                    reason: 1,
                    ipAddress: 1,
                    userAgent: 1,
                    status: 1,
                    createdAt: 1
                }
            }
        ]);
    } catch (error) {
        throw error;
    }
};
//endregion

//region countSongActivities
/**
 * Count song activities matching filters and search
 */
export const countSongActivities = async (filters = {}, search = '') => {
    try {
        const matchStage = { ...filters };
        
        if (search) {
            matchStage.$or = [
                { userEmail: { $regex: search, $options: 'i' } },
                { songName: { $regex: search, $options: 'i' } },
                { artist: { $regex: search, $options: 'i' } },
                { ipAddress: { $regex: search, $options: 'i' } }
            ];
        }

        return await SongActivity.countDocuments(matchStage);
    } catch (error) {
        throw error;
    }
};
//endregion

//endregion
