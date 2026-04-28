const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    global.dbConnected = false;
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/vemu_library', {
      serverSelectionTimeoutMS: 5000 // Fail fast if MongoDB is not available
    });
    global.dbConnected = true;
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    console.log('⚠️  Running in MOCK MODE - all data will be stored in memory');
    global.dbConnected = false;
    return null;
  }
};

module.exports = connectDB;
