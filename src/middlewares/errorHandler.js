const logger = require('../utils/logger');
const ApiError = require('../utils/ApiError');
const LogRecord = require('../models/LogRecord.model');

async function errorHandler(err, req, res, next) {
  const errorInfo = {
    method: req.method,
    url: req.originalUrl,
    ip: req.ip,
    requestId: req.id || 'unknown', // Fallback if requestId fails
    user: req.user ? req.user.id || req.user.email || 'unknown' : 'guest',
    message: err.message,
    stack: err.stack,
  };

  // Log to file/console
  logger.error('Request Error: %o', errorInfo);

  // Save critical errors to MongoDB for auditing
  try {
    await LogRecord.create({
      level: 'error',
      message: err.message,
      additionalData: errorInfo,
    });
  } catch (logErr) {
    logger.error('Failed to log error to MongoDB: %s', logErr.message);
  }

  // Handle specific error types
  if (err.name === 'MongoError') {
    return res.status(500).json({
      success: false,
      message: 'Database error occurred',
    });
  }

  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  }

  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
}

module.exports = errorHandler;