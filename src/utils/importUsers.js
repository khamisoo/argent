const fs = require('fs');
const path = require('path');
const User = require('../models/User.model');

async function importUsersFromJson() {
  const filePath = path.join(__dirname, '../../users.json');
  if (!fs.existsSync(filePath)) return;
  const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  for (const userData of data) {
    const exists = await User.findOne({ phone: userData.phone });
    if (!exists) {
      const user = new User(userData);
      await User.register(user, userData.phone); // phone as password
    }
  }
}

module.exports = importUsersFromJson;
