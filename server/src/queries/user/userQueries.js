//region imports
import { User } from '../../models/user/UserModel.js';
import mongoose from 'mongoose';
//endregion

//region exports

//region updateProfileQuery
/**
 * Updates basic user profil metadata.
 */
export const updateProfileQuery = async (userId, updateData) => {
    // perform direct update
    try {
        return await User.findByIdAndUpdate(userId, updateData, {
            new: true,
            runValidators: true,
        }).lean();
    } catch (error) {
        throw error;
    }
};
//endregion

//region addFavoriteQuery
/**
 * Adds a song to favorites array.
 */
export const addFavoriteQuery = async (userId, favoriteData) => {
    // push to nested array
    try {
        return await User.findByIdAndUpdate(
            userId,
            { $push: { favorites: favoriteData } },
            { new: true }
        ).lean();
    } catch (error) {
        throw error;
    }
};
//endregion

//region removeFavoriteQuery
/**
 * Removes a song from favorites by track ID.
 */
export const removeFavoriteQuery = async (userId, songId) => {
    // pull from nested array
    try {
        return await User.findByIdAndUpdate(
            userId,
            { $pull: { favorites: { songId } } },
            { new: true }
        ).lean();
    } catch (error) {
        throw error;
    }
};
//endregion

//region User Statistics updates

//region updateListeningTimeQuery
/**
 * Increments cumulative listening time.
 */
export const updateListeningTimeQuery = async (userId, additionalHours) => {
    // increment numeric field
    try {
        return await User.findByIdAndUpdate(
            userId,
            { $inc: { listeningTimeHours: additionalHours } },
            { new: true }
        ).lean();
    } catch (error) {
        throw error;
    }
};
//endregion

//region incrementDiscoveredQuery
/**
 * Increments songs discovered count.
 */
export const incrementDiscoveredQuery = async (userId, count = 1) => {
    // increment numeric field
    try {
        return await User.findByIdAndUpdate(
            userId,
            { $inc: { songsDiscovered: count } },
            { new: true }
        ).lean();
    } catch (error) {
        throw error;
    }
};
//endregion

//endregion

//endregion
