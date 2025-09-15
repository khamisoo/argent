const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
  level: { type: String, required: true },
  message: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  additionalData: { type: mongoose.Schema.Types.Mixed },
  smsRef: {
    type: mongoose.Types.ObjectId,
    ref: 'SmsMessage',
  },
}, {
  collection: 'logRecords',
  timestamps: true,
});

// Add indexes for performance
logSchema.index({ timestamp: -1 });
logSchema.index({ level: 1 });

const LogRecord = mongoose.model('LogRecord', logSchema);
module.exports = LogRecord;