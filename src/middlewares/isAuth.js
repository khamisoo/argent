const logger = require('../utils/logger');

module.exports = function isAuth(req, res, next) {
  try {
    logger.debug(`Auth check for ${req.method} ${req.path} - Session ID: ${req.sessionID}`);
    logger.debug(`User authenticated: ${req.isAuthenticated ? req.isAuthenticated() : false}`);
    logger.debug(`User object: ${req.user ? JSON.stringify({id: req.user._id, phone: req.user.phone}) : 'null'}`);
    
    if (req.isAuthenticated && req.isAuthenticated() && req.user) {
      logger.info(`Authenticated user accessing ${req.path}: ${req.user.firstname} (${req.user.phone})`);
      return next();
    }
    
    logger.warn(`Unauthenticated access attempt to ${req.path} - redirecting to login`);
    res.redirect('/');
  } catch (error) {
    logger.error(`Authentication middleware error: ${error.message}`);
    res.redirect('/');
  }
};
