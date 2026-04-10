//region imports
import {
    updateProfileQuery,
    addFavoriteQuery,
    removeFavoriteQuery,
    updateListeningTimeQuery,
    incrementDiscoveredQuery
} from '../../queries/user/userQueries.js';
import { catchAsync, sendSuccessResponse, CONSTANTS } from '../../utils/index.js';
import { logAuthActivity, logFavoriteActivity, logSongPlayed, logRecommendation, logSearchHistory, addFavoriteSong, removeFavoriteSong, updateFavoriteSong, getUserFavoriteSongs } from '../../utils/commonFunctions/activityLogger.js';
//endregion

//region exports

//region updateProfile
/**
 * Handles profile metadata updates.
 */
export const updateProfile = catchAsync(async (req, res) => {
    // extract update fields
    const { name } = req.body;
    
    // trigger query
    const updatedUser = await updateProfileQuery(req.user._id, { name });

    // Log activity
    await logAuthActivity({
        req,
        action: 'Profile Updated',
        details: `Updated name to: ${name}`,
        status: 'success'
    });

    sendSuccessResponse(res, CONSTANTS.STATUS_CODES.OK, 'Profile updated successfully', updatedUser);
});
//endregion

//region getProfile
/**
 * Returns user profile along with recent activities.
 */
export const getProfile = catchAsync(async (req, res) => {
    // identify user from session
    const user = req.user;
    
    // fetch personal interactions via aggregation-based query
    const activities = await getUserActivitiesQuery(user._id, 10);

    // Log profile view
    await logAuthActivity({
        req,
        action: 'Profile Viewed',
        details: 'User viewed their profile',
        status: 'success'
    });

    sendSuccessResponse(res, CONSTANTS.STATUS_CODES.OK, 'Profile fetched', {
        user,
        activities
    });
});
//endregion

//region toggleFavorite
/**
 * Logic for favoriting/unfavoriting tracks.
 */
export const toggleFavorite = catchAsync(async (req, res) => {
    // extract song details from body
    const { songId, title, artist, image } = req.body;
    const user = req.user;

    // Ensure favorites array exists
    if (!user.favorites) {
        user.favorites = [];
    }

    // determine if already favorited
    const isFavorite = user.favorites.find(f => f.songId === songId);
    let updatedUser;

    if (isFavorite) {
        // remove if exists
        updatedUser = await removeFavoriteQuery(user._id, songId);
        
        // Log unfavorite activity
        await logFavoriteActivity({
            req,
            songId,
            songName: title,
            artist,
            isFavorited: false
        });
    } else {
        // add if new
        updatedUser = await addFavoriteQuery(user._id, { songId, title, artist, image });
        
        // Log favorite activity
        await logFavoriteActivity({
            req,
            songId,
            songName: title,
            artist,
            isFavorited: true
        });
    }

    sendSuccessResponse(res, CONSTANTS.STATUS_CODES.OK,
        isFavorite ? 'Removed from favorites' : 'Added to favorites',
        updatedUser.favorites
    );
});
//endregion

//region logActivity
/**
 * Standard endpoint for logging player interactions (songs played, recommendations).
 */
export const logActivity = catchAsync(async (req, res) => {
    // parse activity details
    const { action, songId, songName, artist, duration = 0, reason = '', query = '', searchType = 'song', results = 0 } = req.body;

    console.log('🎵 [logActivity] Received activity log request');
    console.log('🎵 [logActivity] Action:', action);
    console.log('🎵 [logActivity] Song Name:', songName);
    console.log('🎵 [logActivity] Artist:', artist);
    console.log('🎵 [logActivity] User:', req.user._id);

    let activity;

    // Log activity based on action type
    if (action === 'Played') {
        console.log('🎵 [logActivity] Logging song played activity');
        activity = await logSongPlayed({
            req,
            songId,
            songName,
            artist,
            duration
        });
        console.log('🎵 [logActivity] Song played activity logged:', activity);
        await updateListeningTimeQuery(req.user._id, duration / 3600);
    } else if (action === 'Recommended') {
        console.log('🎵 [logActivity] Logging recommendation activity');
        activity = await logRecommendation({
            req,
            songId,
            songName,
            artist,
            reason
        });
        console.log('🎵 [logActivity] Recommendation activity logged:', activity);
    } else if (action === 'Searched') {
        console.log('🎵 [logActivity] Logging search activity');
        activity = await logSearchHistory({
            req,
            query: query || songName,
            type: searchType,
            results
        });
        console.log('🎵 [logActivity] Search activity logged:', activity);
    } else if (action === 'Favorited' || action === 'Unfavorited') {
        console.log('🎵 [logActivity] Logging favorite activity');
        activity = await logFavoriteActivity({
            req,
            songId,
            songName,
            artist,
            isFavorited: action === 'Favorited'
        });
        console.log('🎵 [logActivity] Favorite activity logged:', activity);
    } else {
        console.log('🎵 [logActivity] Unknown action, logging as song played');
        activity = await logSongPlayed({
            req,
            songId,
            songName,
            artist,
            duration: 0
        });
    }

    sendSuccessResponse(res, CONSTANTS.STATUS_CODES.CREATED, 'Activity logged', activity);
});
//endregion

//region getProfileStats
/**
 * Retrieves aggregate statistics for the dashboard/profile.
 */
export const getProfileStats = catchAsync(async (req, res) => {
    const user = req.user;
    
    // fetch detailed stats if not already in req.user
    // In our system req.user is already hydrated by protect middleware
    
    sendSuccessResponse(res, CONSTANTS.STATUS_CODES.OK, 'Stats fetched', {
        songsDiscovered: user.songsDiscovered || 0,
        favoritesCount: user.favorites?.length || 0,
        listeningTimeHours: (user.listeningTimeHours || 0).toFixed(1),
        activities: await getUserActivitiesQuery(user._id, 5)
    });
});
//endregion

//region getSearchHistory
/**
 * Get user's search history
 */
export const getSearchHistory = catchAsync(async (req, res) => {
    const { SearchHistory } = await import('../../models/search/SearchHistoryModel.js');
    const limit = Number(req.query.limit) || 20;
    
    const searches = await SearchHistory.find({ user: req.user._id })
        .sort({ createdAt: -1 })
        .limit(limit)
        .lean();
    
    sendSuccessResponse(res, CONSTANTS.STATUS_CODES.OK, 'Search history retrieved', searches);
});
//endregion

//region getFavoriteSongs
/**
 * Get user's favorite songs
 */
export const getFavoriteSongs = catchAsync(async (req, res) => {
    const { FavoriteSong } = await import('../../models/favorites/FavoriteSongsModel.js');
    const limit = Number(req.query.limit) || 50;
    const page = Number(req.query.page) || 1;
    const skip = (page - 1) * limit;
    
    const [favorites, total] = await Promise.all([
        FavoriteSong.find({ user: req.user._id })
            .sort({ createdAt: -1 })
            .limit(limit)
            .skip(skip)
            .lean(),
        FavoriteSong.countDocuments({ user: req.user._id })
    ]);
    
    sendSuccessResponse(res, CONSTANTS.STATUS_CODES.OK, 'Favorite songs retrieved', {
        count: favorites.length,
        total,
        page,
        pages: Math.ceil(total / limit),
        data: favorites
    });
});
//endregion

//region getLibraryData
/**
 * Get all library data (searches, history, favorites)
 */
export const getLibraryData = catchAsync(async (req, res) => {
    const { SearchHistory } = await import('../../models/search/SearchHistoryModel.js');
    const { FavoriteSong } = await import('../../models/favorites/FavoriteSongsModel.js');
    
    const tab = req.query.tab || 'searched'; // searched, history, favorites
    const limit = Number(req.query.limit) || 20;
    const page = Number(req.query.page) || 1;
    const skip = (page - 1) * limit;
    
    let data, total;
    
    if (tab === 'searched') {
        // Get recent searches (unique queries)
        const searches = await SearchHistory.find({ user: req.user._id })
            .sort({ createdAt: -1 })
            .limit(limit)
            .lean();
        
        total = await SearchHistory.countDocuments({ user: req.user._id });
        data = searches;
    } else if (tab === 'history') {
        // Get all search history (all searches including duplicates)
        const history = await SearchHistory.find({ user: req.user._id })
            .sort({ createdAt: -1 })
            .limit(limit)
            .skip(skip)
            .lean();
        
        total = await SearchHistory.countDocuments({ user: req.user._id });
        data = history;
    } else if (tab === 'favorites') {
        // Get favorite songs
        const favorites = await FavoriteSong.find({ user: req.user._id })
            .sort({ createdAt: -1 })
            .limit(limit)
            .skip(skip)
            .lean();
        
        total = await FavoriteSong.countDocuments({ user: req.user._id });
        data = favorites;
    }
    
    sendSuccessResponse(res, CONSTANTS.STATUS_CODES.OK, `${tab} data retrieved`, {
        count: data.length,
        total,
        page,
        pages: Math.ceil(total / limit),
        data
    });
});
//endregion

//region deleteSearchHistory
/**
 * Delete a search from history
 */
export const deleteSearchHistory = catchAsync(async (req, res) => {
    const { SearchHistory } = await import('../../models/search/SearchHistoryModel.js');
    const { id } = req.params;
    
    const search = await SearchHistory.findById(id);
    
    if (!search) {
        return sendSuccessResponse(res, CONSTANTS.STATUS_CODES.NOT_FOUND, 'Search not found', null);
    }
    
    // Verify ownership
    if (search.user.toString() !== req.user._id.toString()) {
        return sendSuccessResponse(res, CONSTANTS.STATUS_CODES.FORBIDDEN, 'Not authorized to delete this search', null);
    }
    
    await SearchHistory.findByIdAndDelete(id);
    
    sendSuccessResponse(res, CONSTANTS.STATUS_CODES.OK, 'Search deleted successfully', { id });
});
//endregion
