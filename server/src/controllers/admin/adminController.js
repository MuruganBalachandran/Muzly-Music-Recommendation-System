/**
 * @file adminController.js
 * @description Admin-specific controllers for stats and user management.
 */

import { catchAsync, sendSuccessResponse, CONSTANTS } from '../../utils/index.js';
import SongModel from '../../models/song/SongModel.js';
import { User } from '../../models/user/UserModel.js';
import ArtistModel from '../../models/artist/ArtistModel.js';
import LanguageModel from '../../models/language/LanguageModel.js';
import { AuthActivity } from '../../models/activity/AuthActivityModel.js';
import { SongActivity } from '../../models/activity/SongActivityModel.js';

/**
 * Get admin dashboard statistics
 */
export const getAdminStats = catchAsync(async (req, res) => {
    // Fetch all stats in parallel
    const [totalSongs, totalUsers, totalArtists, totalLanguages, authActivities, songActivities] = await Promise.all([
        SongModel.countDocuments(),
        User.countDocuments(),
        ArtistModel.countDocuments(),
        LanguageModel.countDocuments(),
        AuthActivity.countDocuments({ createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } }),
        SongActivity.countDocuments({ createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } })
    ]);

    const stats = {
        totalSongs,
        totalUsers,
        totalArtists,
        totalLanguages,
        recentActivity: authActivities + songActivities
    };

    sendSuccessResponse(res, CONSTANTS.STATUS_CODES.OK, 'Admin stats retrieved', stats);
});

/**
 * Get all users with optional search
 */
export const getAllUsers = catchAsync(async (req, res) => {
    const { search = '' } = req.query;

    // Build search query
    const query = search
        ? {
            $or: [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } }
            ]
        }
        : {};

    // Fetch users without password field
    const users = await User.find(query)
        .select('-password -emailVerificationOtp -emailVerificationOtpExpiry -passwordResetToken -passwordResetExpires')
        .sort({ createdAt: -1 })
        .limit(100);

    sendSuccessResponse(res, CONSTANTS.STATUS_CODES.OK, 'Users retrieved', users);
});
