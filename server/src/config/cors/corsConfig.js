import { envVariables } from '../env/envConfig.js';

export const corsOptions = {
    origin: function (origin, callback) {
        if (!origin) return callback(null, true);
        const allowedOrigins = envVariables.CORS_ORIGINS || [];
        if (allowedOrigins.includes(origin) || envVariables.NODE_ENV === 'development') {
            callback(null, true);
        } else {
            callback(new Error(`CORS policy does not allow access from: ${origin}`), false);
        }
    },
    credentials: true,
    optionsSuccessStatus: 200,
};
