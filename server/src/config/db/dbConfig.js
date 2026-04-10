import mongoose from 'mongoose';
import { envVariables } from '../env/envConfig.js';

export const connectDB = async () => {
    try {
        mongoose.set('strictQuery', false);
        const conn = await mongoose.connect(envVariables.MONGO_URI);
        console.log(`\n✅ MongoDB Connected! Host: ${conn.connection.host}`);
    } catch (error) {
        console.error(`❌ Database Connection Error: ${error.message}`);
        process.exit(1);
    }
};
