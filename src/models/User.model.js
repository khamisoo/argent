const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new mongoose.Schema({
  firstname: { type: String, required: true },
  phone: { type: String, required: true, unique: true },
  email: { type: String }, // for notification opt-in
  messages: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Message' }],
  notify: { type: Boolean, default: false },
});

userSchema.plugin(passportLocalMongoose, {
  usernameField: 'phone', // use phone as username
  usernameUnique: true,
  findByUsername: function(model, queryParameters) {
    // Add additional query parameters for findByUsername
    return model.findOne(queryParameters);
  }
});

const User = mongoose.model('User', userSchema);
module.exports = User;
