const passport = require('passport');
const User = require('../models/User.model');
const logger = require('../utils/logger');
const { success, error } = require('../utils/response');

exports.registerOrLogin = async (req, res, next) => {
  const { firstname, phone } = req.body;
  if (!firstname || !phone) {
    return error(res, 'First name and phone are required', 400);
  }
  try {
    // Require both firstname and phone to match
    let user = await User.findOne({ firstname, phone });
    if (!user) {
      return error(res, 'User not found or data does not match. Please check your name and number.', 401);
    }
    req.login(user, (err) => {
      if (err) {
        logger.error('Login error: %s', err.message);
        return next(err);
      }
      
      // Save session before redirecting
      req.session.save((saveErr) => {
        if (saveErr) {
          logger.error('Session save error: %s', saveErr.message);
          return next(saveErr);
        }
        
        logger.info('User logged in successfully: %s (%s) - Session ID: %s', firstname, phone, req.sessionID);
        logger.debug('Session data: %s', JSON.stringify(req.session));
        
        // Add a small delay to ensure session is committed
        setTimeout(() => {
          res.redirect('/main');
        }, 100);
      });
    });
  } catch (err) {
    logger.error('Auth error: %s', err.message);
    next(err);
  }
};

exports.logout = (req, res) => {
  req.logout(() => {
    res.redirect('/');
  });
};
