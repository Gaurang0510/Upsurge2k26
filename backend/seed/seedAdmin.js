require('dotenv').config();
const mongoose = require('mongoose');
const Admin = require('../src/models/Admin');

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const username = process.env.ADMIN_USERNAME || 'admin';
    const password = process.env.ADMIN_PASSWORD || 'ChangeMe123!';
    const email = process.env.ADMIN_EMAIL || '';

    const existing = await Admin.findOne({ username });
    if (existing) {
      existing.email = email;
      existing.passwordHash = await Admin.hashPassword(password);
      existing.role = 'ADMIN';
      await existing.save();
      console.log(`✅ Admin '${username}' already existed. Password reset from current .env value.`);
      console.log(`   Username: ${username}`);
      console.log(`   Password: ${password}`);
      process.exit(0);
    }

    const passwordHash = await Admin.hashPassword(password);
    await Admin.create({ username, email, passwordHash, role: 'ADMIN' });

    console.log(`✅ Admin account created.`);
    console.log(`   Username: ${username}`);
    console.log(`   Password: ${password}`);
    console.log(`   ⚠️  Change this password after first login.`);
    process.exit(0);
  } catch (err) {
    console.error('❌ Failed to create admin:', err);
    process.exit(1);
  }
})();
