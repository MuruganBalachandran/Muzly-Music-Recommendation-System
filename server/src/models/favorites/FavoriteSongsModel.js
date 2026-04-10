/**
 * @file FavoriteSongsModel.js
 * @description Mongoose model for user favorite songs with CRUD operations
 */

import mongoose from 'mongoose';

const favoriteSongSchema = new mongoose.Schema(
    {
        // #region Fields
        user: {
            type: mongoose.Schema.ObjectId,
            ref: 'User',
            required: [true, 'Favorite must belong to a user'],
        },
        song: {
            type: mongoose.Schema.ObjectId,
            ref: 'Song',
            required: [true, 'Song ID is required'],
        },
        songName: {
            type: String,
            required: [true, 'Song name is required'],
        },
        artist: {
            type: String,
            required: [true, 'Artist name is required'],
        },
        songImage: {
            type: String,
        },
        duration: {
            type: Number,
        },
        genre: {
            type: String,
        },
        language: {
            type: String,
        },
        emotion: {
            type: String,
        },
        notes: {
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
favoriteSongSchema.index({ user: 1, createdAt: -1 });
favoriteSongSchema.index({ user: 1, song: 1 }, { unique: true });
favoriteSongSchema.index({ songName: 'text', artist: 'text' });
// #endregion

export const FavoriteSong = mongoose.model('FavoriteSong', favoriteSongSchema, 'favorite_songs');
