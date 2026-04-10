/**
 * @file SearchHistoryModel.js
 * @description Mongoose model for user search history (like Spotify)
 */

import mongoose from 'mongoose';

const searchHistorySchema = new mongoose.Schema(
    {
        // #region Fields
        user: {
            type: mongoose.Schema.ObjectId,
            ref: 'User',
            required: [true, 'Search must belong to a user'],
        },
        query: {
            type: String,
            required: [true, 'Search query is required'],
            trim: true,
        },
        type: {
            type: String,
            enum: ['song', 'artist', 'album', 'playlist'],
            default: 'song',
        },
        results: {
            type: Number,
            default: 0,
        },
        ipAddress: {
            type: String,
        },
        userAgent: {
            type: String,
        },
        metadata: {
            type: mongoose.Schema.Types.Mixed,
        }
        // #endregion
    },
    {
        timestamps: true,
    }
);

// #region Indexes
searchHistorySchema.index({ user: 1, createdAt: -1 });
searchHistorySchema.index({ query: 1, createdAt: -1 });
searchHistorySchema.index({ user: 1, type: 1, createdAt: -1 });
// #endregion

export const SearchHistory = mongoose.model('SearchHistory', searchHistorySchema, 'search_history');
