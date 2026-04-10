/**
 * @file seedAdmin.js
 * @description Standalone script to seed the initial Admin user into the database.
 */

import mongoose from 'mongoose';
import { Admin } from '../models/admin/AdminModel.js';
import { connectDB } from '../config/db/dbConfig.js';
import { CONSTANTS } from '../utils/index.js';

const seedAdmin = async () => {
    try {
        console.log('🚀 Starting Admin Seeding process...');
        
        await connectDB();
        
        const adminEmail = 'admin@muzly.ai';
        const existingAdmin = await Admin.findOne({ email: adminEmail });
        
        if (existingAdmin) {
            console.log('⚠️ Admin user already exists. Skipping seeding.');
            process.exit(0);
        }

        // Create new admin
        const admin = new Admin({
            name: 'Master Admin',
            email: adminEmail,
            password: 'AdminPassword123!',
            role: CONSTANTS.USER_ROLES.ADMIN,
            isVerified: true
        });

        await admin.save();
        
        console.log('\n-----------------------------------------');
        console.log('✅ Admin User Created Successfully!');
        console.log(`📧 Email: ${adminEmail}`);
        console.log('🔑 Password: AdminPassword123!');
        console.log('-----------------------------------------\n');
        
        process.exit(0);
    } catch (error) {
        console.error('\n❌ Seeding failed with error:');
        console.error(error.message);
        process.exit(1);
    }
};

seedAdmin();
