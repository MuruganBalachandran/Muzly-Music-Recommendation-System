/**
 * @file app.js
 * @description Express application configuration, middleware registration, and route mounting.
 */

import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import compression from 'compression';
import mongoSanitize from 'express-mongo-sanitize';
import xss from 'xss-clean';
import hpp from 'hpp';
import path from 'path';
import { fileURLToPath } from 'url';
import { createProxyMiddleware } from 'http-proxy-middleware';
import rateLimit from 'express-rate-limit';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import { corsOptions, envVariables } from './config/index.js';
import { globalErrorHandler, httpLoggerMiddleware, globalActivityLogger, errorActivityLogger } from './middlewares/index.js';
import { AppError } from './utils/AppError.js';
import apiRouter from './routers/index.js';

const app = express();

// #region TRUST PROXY CONFIGURATION
/**
 * Trust proxy - Required for proper IP address extraction
 * Enables req.ip to work correctly behind proxies/load balancers
 */
app.set('trust proxy', 1); // 1 = trust first proxy (e.g., Render/Heroku router)
// #endregion

// #region GLOBAL MIDDLEWARES

/**
 * CORS - Cross-Origin Resource Sharing
 * Configured via src/config/cors/corsConfig.js
 */
app.use(cors(corsOptions));

/**
 * Helmet - Security headers
 */
app.use(helmet({
    crossOriginResourcePolicy: false,
}));

/**
 * HTTP Logger - Request logging
 */
app.use(httpLoggerMiddleware);

/**
 * Rate Limiter - Prevent Brute Force
 */
const limiter = rateLimit({
    max: 150,
    windowMs: 60 * 60 * 1000,
    message: 'Too many requests from this IP, please try again in an hour!',
    // The default keyGenerator uses req.ip, which is correct because 'trust proxy' is set to true above.
    skip: (req) => {
        // Skip rate limiting for health checks
        return req.path === '/api/health';
    }
});
app.use('/api', limiter);

/**
 * Body Parsers & Cookie Parser
 */
app.use(express.json({ limit: '50kb' }));
app.use(express.urlencoded({ extended: true, limit: '50kb' }));
app.use(cookieParser());

/**
 * Parameter Pollution Prevention
 */
app.use(hpp({
    whitelist: [
        'duration',
        'artist',
        'genre',
        'language',
        'emotion'
    ]
}));

/**
 * Gzip Compression
 */
app.use(compression());

// #endregion

// #region ROUTES

/**
 * Health Check Route
 */
app.get('/api/health', (req, res) => {
    res.status(200).json({ success: true, message: 'Node Server API is running optimally' });
});

/**
 * Mount V1 API Routes
 * Base: /api/v1
 */
app.use('/api/v1', apiRouter);

/**
 * ML Model Proxy
 * Proxies /api/ml requests to the Python FastAPI server
 */
const ML_URL = process.env.ML_API_URL || 'http://localhost:8001';
app.use('/api/ml', createProxyMiddleware({
    target: ML_URL,
    changeOrigin: true,
    pathRewrite: {
        '^/api/ml': '', // remove /api/ml prefix when sending to python
    },
}));

/**
 * Note: React frontend is deployed as a separate microservice.
 * This Node.js server strictly acts as an API.
 */

/**
 * Global Activity Logger Middleware
 * Logs all successful activities to respective collections
 */
app.use(globalActivityLogger);

// #endregion

// #region ERROR HANDLING

/**
 * Catch-all for undefined routes
 */
app.use((req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

/**
 * Error Activity Logger Middleware
 * Logs failed activities before error handling
 */
app.use(errorActivityLogger);

/**
 * Global Error Handling Middleware
 */
app.use(globalErrorHandler);

// #endregion

export default app;
