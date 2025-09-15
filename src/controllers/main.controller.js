// Toggle email notification preference
exports.toggleNotify = async (req, res) => {
  if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
  const { notify } = req.body;
  try {
    req.user.notify = !!notify;
    await req.user.save();
    res.json({ success: true, notify: req.user.notify });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update notification preference.' });
  }
};
const nodemailer = require('nodemailer');
const uaParser = require('ua-parser-js');
const logger = require('../utils/logger');
const Message = require('../models/Message.model');
const User = require('../models/User.model');

exports.getMain = async (req, res) => {
  if (!req.user) return res.redirect('/');
  // Populate received messages
  const messages = await Message.find({ to: req.user._id }).populate('from', 'firstname');
  res.render('main', { title: 'FindMe Argent', user: req.user, receivedMessages: messages });
};

exports.gotMeNow = async (req, res) => {
  if (!req.user) return res.redirect('/');
  const { location } = req.body;
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  const userAgent = req.headers['user-agent'];
  const ua = uaParser(userAgent);
  const uaExplain = `Device: ${ua.device.type || 'Unknown'} | OS: ${ua.os.name} ${ua.os.version} | Browser: ${ua.browser.name} ${ua.browser.version}`;
  logger.info('[GotMeNow] Triggered by user', {
    user: req.user.firstname,
    phone: req.user.phone,
    ip,
    userAgent,
    uaExplain,
    location,
    time: new Date().toISOString()
  });
  const emailBody = `
    <h2>FindMe Argent - Got Me Now Alert</h2>
    <p><strong>User:</strong> ${req.user.firstname} (${req.user.phone})</p>
    <p><strong>IP Address:</strong> ${ip}</p>
    <p><strong>User Agent:</strong> ${userAgent}</p>
    <p><strong>User Agent Explained:</strong> ${uaExplain}</p>
    <p><strong>Location:</strong> ${location || 'Not provided'}</p>
    <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
  `;
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    });
    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: 'khamis@systemsolveit.com',
      subject: `FindMe Argent - Got Me Now Alert (${req.user.firstname})`,
      html: emailBody,
    });
    logger.info('[GotMeNow] Email sent successfully', { user: req.user.firstname, phone: req.user.phone });
    const messages = await Message.find({ to: req.user._id }).populate('from', 'firstname');
    res.render('main', { title: 'FindMe Argent', user: req.user, receivedMessages: messages, message: 'Alert sent successfully!' });
  } catch (err) {
    logger.error('[GotMeNow] Failed to send email', { error: err.message, user: req.user.firstname, phone: req.user.phone });
    const messages = await Message.find({ to: req.user._id }).populate('from', 'firstname');
    res.render('main', { title: 'FindMe Argent', user: req.user, receivedMessages: messages, error: 'Failed to send alert: ' + err.message });
  }
};

exports.missingMessage = async (req, res) => {
  if (!req.user) return res.redirect('/');
  let message, mention;
  if (req.is('application/json')) {
    message = req.body.message;
    mention = req.body.mention;
  } else {
    message = req.body.message;
    mention = req.body.mention;
  }
  const isAjax = req.xhr || req.headers.accept.indexOf('application/json') > -1;
  const messages = await Message.find({ to: req.user._id }).populate('from', 'firstname');
  if (!message || !mention) {
    if (isAjax) return res.status(400).json({ success: false, error: 'Message and mention are required.' });
    return res.render('main', { title: 'FindMe Argent', user: req.user, receivedMessages: messages, error: 'Message and mention are required.' });
  }
  try {
    // Find mentioned user by firstname
    const toUser = await User.findOne({ firstname: mention });
    if (!toUser) {
      if (isAjax) return res.status(404).json({ success: false, error: 'Mentioned user not found.' });
      return res.render('main', { title: 'FindMe Argent', user: req.user, receivedMessages: messages, error: 'Mentioned user not found.' });
    }
    // Save message
    const msg = await Message.create({ from: req.user._id, to: toUser._id, text: message });
    // Add message to recipient's messages array
    toUser.messages = toUser.messages || [];
    toUser.messages.push(msg._id);
    await toUser.save();
    // Notify by email if opted in
    if (toUser.notify && toUser.email) {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.GMAIL_USER,
          pass: process.env.GMAIL_PASS,
        },
      });
      await transporter.sendMail({
        from: process.env.GMAIL_USER,
        to: toUser.email,
        subject: `FindMe Argent - New Message from ${req.user.firstname}`,
        html: `<p><strong>${req.user.firstname}</strong> sent you a message:</p><blockquote>${message}</blockquote>`
      });
    }
    // Fetch updated messages for sender
    const updatedMessages = await Message.find({ to: req.user._id }).populate('from', 'firstname');
    if (isAjax) return res.json({ success: true, message: 'Message sent!' });
    res.render('main', { title: 'FindMe Argent', user: req.user, receivedMessages: updatedMessages, message: 'Message sent!' });
  } catch (err) {
    const messages = await Message.find({ to: req.user._id }).populate('from', 'firstname');
    if (isAjax) return res.status(500).json({ success: false, error: 'Failed to send message: ' + err.message });
    res.render('main', { title: 'FindMe Argent', user: req.user, receivedMessages: messages, error: 'Failed to send message: ' + err.message });
  }
};
