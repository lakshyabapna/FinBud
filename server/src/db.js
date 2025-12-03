
const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        
        const mongoURI = process.env.MONGO_URI || process.env.DATABASE_URL || "mongodb://localhost:27017/finbud";

        if (!process.env.MONGO_URI && !process.env.DATABASE_URL) {
            console.warn("⚠️  No MONGO_URI or DATABASE_URL found in .env, using local database");
        }

        const conn = await mongoose.connect(mongoURI, {
            serverSelectionTimeoutMS: 30000, 
            socketTimeoutMS: 45000,
        });

        console.log(`🍃 MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`❌ MongoDB Connection Error: ${error.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;
