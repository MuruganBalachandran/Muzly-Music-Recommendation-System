/**
 * @file index.js
 * @description Application entry point. Handles server startup, database connection, and global process error listeners.
 */

import app from './app.js';
import { envVariables, connectDB } from './config/index.js';
import { serverLogger } from './middlewares/index.js';

// #region Model Registration
// Import all models to ensure they're registered with Mongoose
import './models/user/UserModel.js';
import './models/song/SongModel.js';
import './models/activity/AuthActivityModel.js';
import './models/activity/SongActivityModel.js';
import './models/search/SearchHistoryModel.js';
import './models/favorites/FavoriteSongsModel.js';
import './models/artist/ArtistModel.js';
import './models/language/LanguageModel.js';
import './models/admin/AdminModel.js';
// #endregion

// #region Global Exception Handlers

process.on('uncaughtException', (err) => {
    serverLogger.error(`UNCAUGHT EXCEPTION! 💥 ${err.name}: ${err.message}`);
    process.exit(1);
});

// #endregion

let server;

// #region Server Lifecycle

/**
 * Initializes database connection and starts the Express server.
 */
const startServer = async () => {
    try {
        await connectDB();
        server = app.listen(envVariables.PORT, () => {
            serverLogger.info(`Server running in ${envVariables.NODE_ENV} mode on port ${envVariables.PORT}`);
        });
    } catch (error) {
        serverLogger.error(`Failed to start the server: ${error.message}`);
        process.exit(1);
    }
};

startServer();

process.on('unhandledRejection', (err) => {
    serverLogger.error(`UNHANDLED REJECTION! 💥 ${err.name}: ${err.message}`);
    if (server) server.close(() => process.exit(1));
    else process.exit(1);
});

// #endregion
