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
      if (err) return next(err);
      logger.info('User logged in: %s (%s)', firstname, phone);
      return res.redirect('/main');
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
