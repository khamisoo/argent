const { success } = require('../utils/response');
const logger = require('../utils/logger');

exports.getRoot = (req, res, next) => {
  try {
    logger.info('Root route accessed');
    success(res, null, 'Welcome to HFF Website API 🚀');
  } catch (error) {
    logger.error('Error in getRoot: %s', error.message);
    next(error);
  }
};