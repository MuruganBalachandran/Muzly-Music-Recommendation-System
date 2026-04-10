/**
 * @file userRouter.js
 * @description Routes for user-specific data management like profiles, favorites, and activity logs.
 */

import express from 'express';
import {
    updateProfile,
    getProfile,
    toggleFavorite,
    logActivity,
    getProfileStats,
    getSearchHistory,
    getFavoriteSongs,
    getLibraryData,
    deleteSearchHistory
} from '../../controllers/user/userController.js';
import { protect } from '../../middlewares/index.js';

const router = express.Router();

// Middleware to protect all routes defined in this file
router.use(protect);

// #region User Profile Routes

router.get('/profile', getProfile);
router.patch('/profile', updateProfile);
router.get('/stats', getProfileStats);

// #endregion

// #region Interactions & Tracking

router.post('/favorite', toggleFavorite);
router.post('/favorites', toggleFavorite); // Alias for POST /favorites
router.delete('/favorites/:songId', toggleFavorite); // Handle DELETE for removing favorites
router.post('/activity', logActivity);

// #endregion

// #region Library Routes

router.get('/library', getLibraryData);
router.get('/search-history', getSearchHistory);
router.delete('/search-history/:id', deleteSearchHistory);
router.get('/favorites', getFavoriteSongs);

// #endregion

export default router;
