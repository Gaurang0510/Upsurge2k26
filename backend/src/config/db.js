const mongoose = require('mongoose');

/**
 * Connect to MongoDB. Returns a promise that resolves on success or
 * rejects on failure (no process.exit — let the caller handle it).
 */
const connectDB = async () => {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    throw new Error('MONGO_URI is not set in .env');
  }
  const conn = await mongoose.connect(uri, {
    dbName: process.env.MONGO_DB_NAME || 'smackathon_2k26',
    serverSelectionTimeoutMS: 10000,
    socketTimeoutMS: 45000,
  });
  console.log(`✅ MongoDB connected: ${conn.connection.host}/${conn.connection.name}`);
  return conn;
};

module.exports = connectDB;
