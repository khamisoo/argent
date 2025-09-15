const success = (res, data = null, message = 'Success') =>
  res.status(200).json({ success: true, message, data });

const error = (res, message = 'Error', code = 500) =>
  res.status(code).json({ success: false, message });

module.exports = { success, error };