const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');
const User = require('../models/User');

async function fixPasswords() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/vemu_library');
    console.log('Connected to MongoDB');

    const users = await User.find();
    console.log('Found', users.length, 'users');

    for (const user of users) {
      const pw = user.password;
      if (!pw.startsWith('$2')) { // not bcrypt hash
        const salt = await bcryptjs.genSalt(10);
        user.password = await bcryptjs.hash(pw, salt);
        await user.save();
        console.log('Fixed password for:', user.username);
      } else {
        console.log('Password already hashed for:', user.username);
      }
    }

    console.log('Done!');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

fixPasswords();
