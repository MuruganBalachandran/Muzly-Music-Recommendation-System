/**
 * @file activityLogger.js
 * @description Centralized activity logging utility with separate models for each activity type
 */

import { AuthActivity } from '../../models/activity/AuthActivityModel.js';
import { SongActivity } from '../../models/activity/SongActivityModel.js';
import { SearchHistory } from '../../models/search/SearchHistoryModel.js';
import { FavoriteSong } from '../../models/favorites/FavoriteSongsModel.js';
import { SystemActivity } from '../../models/activity/SystemActivityModel.js';

// #region IP Address Extraction

/**
 * Extract IP address from request with multiple fallbacks
 */
const getIpAddress = (req) => {
    let ip;
    
    if (req.ip) {
        ip = req.ip;
    } else if (req.headers['x-forwarded-for']) {
        ip = req.headers['x-forwarded-for'].split(',')[0].trim();
    } else if (req.headers['x-real-ip']) {
        ip = req.headers['x-real-ip'];
    } else if (req.connection?.remoteAddress) {
        ip = req.connection.remoteAddress;
    } else if (req.socket?.remoteAddress) {
        ip = req.socket.remoteAddress;
    } else {
        ip = 'Unknown';
    }
    
    // Clean up IPv6 localhost
    if (ip === '::1' || ip === '::ffff:127.0.0.1') {
        ip = '127.0.0.1';
    }
    
    // Remove IPv6 prefix
    if (ip && ip.startsWith('::ffff:')) {
        ip = ip.substring(7);
    }
    
    return ip || 'Unknown';
};

// #endregion

// #region Auth Activities

/**
 * Log authentication activities (Login, Logout, Signup, etc.)
 */
export const logAuthActivity = async ({ req, action, details = '', status = 'success', metadata = {} }) => {
    try {
        if (!req || !req.user) {
            console.warn('Auth activity logging skipped: No user in request');
            return null;
        }

        let userEmail = 'Unknown';
        if (req.user?.email) {
            userEmail = req.user.email;
        } else if (req.body?.email) {
            userEmail = req.body.email;
        }

        const ipAddress = getIpAddress(req);
        const userAgent = req.headers['user-agent'] || 'Unknown';

        const activityData = {
            user: req.user._id,
            userEmail,
            action,
            status,
            ipAddress,
            userAgent,
            details,
            metadata
        };

        const activity = await AuthActivity.create(activityData);
        return activity;
    } catch (error) {
        console.error('ERROR - Failed to log auth activity:', error.message);
        return null;
    }
};

// #endregion

// #region System Activities

/**
 * Log system or admin activities
 */
export const logSystemActivity = async ({ user, action, resource = '', details = '', status = 'success', ipAddress = '', metadata = {} }) => {
    try {
        if (!user) {
            console.warn('System activity logging skipped: No user provided');
            return null;
        }

        const activityData = {
            user: user._id || user,
            action,
            resource,
            details,
            status,
            ipAddress,
            metadata
        };

        const activity = await SystemActivity.create(activityData);
        return activity;
    } catch (error) {
        console.error('ERROR - Failed to log system activity:', error.message);
        return null;
    }
};

// #endregion

// #region Song Activities

/**
 * Log song played activity
 */
export const logSongPlayed = async ({ req, songId, songName, artist, duration = 0, metadata = {} }) => {
    try {
        console.log('🎵 [logSongPlayed] Starting to log song played');
        console.log('🎵 [logSongPlayed] Song ID:', songId);
        console.log('🎵 [logSongPlayed] Song Name:', songName);
        console.log('🎵 [logSongPlayed] Artist:', artist);
        
        if (!req || !req.user) {
            console.warn('🎵 [logSongPlayed] Song played activity skipped: No user in request');
            return null;
        }

        const ipAddress = getIpAddress(req);
        const userAgent = req.headers['user-agent'] || 'Unknown';

        const activityData = {
            user: req.user._id,
            userEmail: req.user.email,
            action: 'Played',
            songId,
            songName,
            artist,
            duration,
            status: 'success',
            ipAddress,
            userAgent,
            metadata
        };

        console.log('🎵 [logSongPlayed] Activity data to save:', activityData);

        const activity = await SongActivity.create(activityData);
        console.log('🎵 [logSongPlayed] Song activity saved successfully:', activity._id);
        return activity;
    } catch (error) {
        console.error('🎵 [logSongPlayed] ERROR - Failed to log song played:', error.message);
        console.error('🎵 [logSongPlayed] Error stack:', error.stack);
        return null;
    }
};

/**
 * Log favorite activity (added or removed)
 */
export const logFavoriteActivity = async ({ req, songId, songName, artist, isFavorited, metadata = {} }) => {
    try {
        if (!req || !req.user) {
            console.warn('Favorite activity skipped: No user in request');
            return null;
        }

        const ipAddress = getIpAddress(req);
        const userAgent = req.headers['user-agent'] || 'Unknown';
        const action = isFavorited ? 'Favorited' : 'Unfavorited';

        const activityData = {
            user: req.user._id,
            userEmail: req.user.email,
            action,
            songId,
            songName,
            artist,
            status: 'success',
            ipAddress,
            userAgent,
            metadata: { isFavorited, ...metadata }
        };

        const activity = await SongActivity.create(activityData);
        return activity;
    } catch (error) {
        console.error('ERROR - Failed to log favorite activity:', error.message);
        return null;
    }
};

/**
 * Log recommendation activity
 */
export const logRecommendation = async ({ req, songId, songName, artist, reason = '', metadata = {} }) => {
    try {
        if (!req || !req.user) {
            console.warn('Recommendation activity skipped: No user in request');
            return null;
        }

        const ipAddress = getIpAddress(req);
        const userAgent = req.headers['user-agent'] || 'Unknown';

        const activityData = {
            user: req.user._id,
            userEmail: req.user.email,
            action: 'Recommended',
            songId,
            songName,
            artist,
            reason,
            status: 'success',
            ipAddress,
            userAgent,
            metadata
        };

        const activity = await SongActivity.create(activityData);
        return activity;
    } catch (error) {
        console.error('ERROR - Failed to log recommendation:', error.message);
        return null;
    }
};

// #endregion

// #region Search History

/**
 * Log search query to history
 */
export const logSearchHistory = async ({ req, query, type = 'song', results = 0, metadata = {} }) => {
    try {
        if (!req || !req.user) {
            console.warn('Search history logging skipped: No user in request');
            return null;
        }

        const ipAddress = getIpAddress(req);
        const userAgent = req.headers['user-agent'] || 'Unknown';

        const searchData = {
            user: req.user._id,
            query: query.trim(),
            type,
            results,
            ipAddress,
            userAgent,
            metadata
        };

        const search = await SearchHistory.create(searchData);
        return search;
    } catch (error) {
        console.error('ERROR - Failed to log search history:', error.message);
        return null;
    }
};

// #endregion

// #region Favorite Songs CRUD

/**
 * Add song to favorites
 */
export const addFavoriteSong = async ({ req, songId, songName, artist, songImage = '', duration = 0, genre = '', language = '', emotion = '', notes = '', metadata = {} }) => {
    try {
        if (!req || !req.user) {
            console.warn('Add favorite skipped: No user in request');
            return null;
        }

        const favoriteData = {
            user: req.user._id,
            song: songId,
            songName,
            artist,
            songImage,
            duration,
            genre,
            language,
            emotion,
            notes,
            metadata
        };

        const favorite = await FavoriteSong.create(favoriteData);
        return favorite;
    } catch (error) {
        console.error('ERROR - Failed to add favorite song:', error.message);
        return null;
    }
};

/**
 * Remove song from favorites
 */
export const removeFavoriteSong = async ({ userId, songId }) => {
    try {
        const result = await FavoriteSong.findOneAndDelete({
            user: userId,
            song: songId
        });
        return result;
    } catch (error) {
        console.error('ERROR - Failed to remove favorite song:', error.message);
        return null;
    }
};

/**
 * Update favorite song (notes, etc.)
 */
export const updateFavoriteSong = async ({ userId, songId, updates }) => {
    try {
        const result = await FavoriteSong.findOneAndUpdate(
            { user: userId, song: songId },
            { $set: updates },
            { new: true }
        );
        return result;
    } catch (error) {
        console.error('ERROR - Failed to update favorite song:', error.message);
        return null;
    }
};

/**
 * Get user's favorite songs
 */
export const getUserFavoriteSongs = async ({ userId, limit = 50, skip = 0, search = '' }) => {
    try {
        const query = { user: userId };
        
        if (search) {
            query.$or = [
                { songName: { $regex: search, $options: 'i' } },
                { artist: { $regex: search, $options: 'i' } }
            ];
        }

        const favorites = await FavoriteSong.find(query)
            .sort({ createdAt: -1 })
            .limit(limit)
            .skip(skip);

        const total = await FavoriteSong.countDocuments(query);

        return { favorites, total };
    } catch (error) {
        console.error('ERROR - Failed to get favorite songs:', error.message);
        return { favorites: [], total: 0 };
    }
};

// #endregion


