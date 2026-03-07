const mongoose = require('mongoose');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/munira_crm';

let isConnected = false;

const connectDB = async () => {
    if (isConnected) return;
    try {
        await mongoose.connect(MONGO_URI);
        isConnected = true;
        console.log('[MongoDB] Connected to:', MONGO_URI);
    } catch (err) {
        console.error('[MongoDB] Connection error:', err.message);
        process.exit(1);
    }
};

module.exports = connectDB;
