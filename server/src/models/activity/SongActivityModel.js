/**
 * @file SongActivityModel.js
 * @description Mongoose model for song-related activities (Played, Favorited, Recommended)
 */

import mongoose from 'mongoose';

const songActivitySchema = new mongoose.Schema(
    {
        // #region Fields
        user: {
            type: mongoose.Schema.ObjectId,
            ref: 'User',
            required: [true, 'Activity must belong to a user'],
        },
        userEmail: {
            type: String,
            required: [true, 'Activity must have user email'],
        },
        action: {
            type: String,
            enum: ['Played', 'Favorited', 'Unfavorited', 'Recommended'],
            required: [true, 'Song activity must have an action'],
        },
        songId: {
            type: String,
            required: [true, 'Song activity must have a song ID'],
        },
        songName: {
            type: String,
            required: [true, 'Song activity must have a song name'],
        },
        artist: {
            type: String,
            required: [true, 'Song activity must have an artist'],
        },
        duration: {
            type: Number,
            default: 0,
        },
        reason: {
            type: String,
        },
        ipAddress: {
            type: String,
        },
        userAgent: {
            type: String,
        },
        status: {
            type: String,
            enum: ['success', 'failed', 'pending', 'error'],
            default: 'success',
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
songActivitySchema.index({ user: 1, createdAt: -1 });
songActivitySchema.index({ userEmail: 1, createdAt: -1 });
songActivitySchema.index({ action: 1, createdAt: -1 });
songActivitySchema.index({ songId: 1, createdAt: -1 });
songActivitySchema.index({ user: 1, action: 1, createdAt: -1 });
// #endregion

export const SongActivity = mongoose.model('SongActivity', songActivitySchema, 'song_activities');
