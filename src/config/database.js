const mongoose = require('mongoose');
const logger = require('../utils/logger');

const connectDB = async () => {
  let retries = 5;
  while (retries) {
    try {
      const conn = await mongoose.connect(process.env.MONGO_URI, {
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 5000,
      });
      logger.info(`✅ MongoDB connected: ${conn.connection.host}`);
      break;
    } catch (err) {
      retries -= 1;
      logger.error(`❌ MongoDB connection error: ${err.message}. Retries left: ${retries}`);
      if (retries === 0) {
        process.exit(1);
      }
      await new Promise(resolve => setTimeout(resolve, 5000)); // Wait 5s before retry
    }
  }
};

// Function to disconnect for tests
const disconnectDB = async () => {
  try {
    await mongoose.connection.close();
    logger.info('✅ MongoDB disconnected');
  } catch (err) {
    logger.error(`❌ MongoDB disconnection error: ${err.message}`);
  }
};

module.exports = { connectDB, disconnectDB };