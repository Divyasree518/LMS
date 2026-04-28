const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');

async function resetPasswords() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/vemu_library');
    console.log('Connected to MongoDB');

    const db = mongoose.connection.db;
    const usersCollection = db.collection('users');

    const passwordMap = {
      'admin': 'Admin@123',
      'faculty1': 'Faculty@123',
      'student1': 'Student@123',
      'student2': 'Student@123'
    };

    for (const [username, plainPassword] of Object.entries(passwordMap)) {
      const salt = await bcryptjs.genSalt(10);
      const hash = await bcryptjs.hash(plainPassword, salt);
      
      const result = await usersCollection.updateOne(
        { username },
        { $set: { password: hash } }
      );
      
      if (result.matchedCount > 0) {
        console.log(`Reset password for ${username}: ${plainPassword}`);
      } else {
        console.log(`User ${username} not found`);
      }
    }

    // Verify
    const student1 = await usersCollection.findOne({ username: 'student1' });
    if (student1) {
      const match = await bcryptjs.compare('Student@123', student1.password);
      console.log('Verification - student1 password match:', match);
    }

    console.log('Done!');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

resetPasswords();
