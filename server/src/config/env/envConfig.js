import dotenv from 'dotenv';
dotenv.config();

export let envVariables = {};

try {
    envVariables = JSON.parse(process.env.APP);
} catch (error) {
    console.error('❌ Configuration Error: Unable to parse process.env.APP', error.message);
    process.exit(1);
}