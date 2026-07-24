require('dotenv').config();
const mongoose = require('mongoose');
const Admin = require('../src/models/Admin');

(async () => {
  try {
    const username = String(process.env.ADMIN_USERNAME || '').trim();
    const password = String(process.env.ADMIN_PASSWORD || '');
    const email = String(process.env.ADMIN_EMAIL || '').trim().toLowerCase();

    if (!username || username.length > 80 || !password || password.length < 12) {
      throw new Error('ADMIN_USERNAME and an ADMIN_PASSWORD of at least 12 characters are required');
    }
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw new Error('ADMIN_EMAIL must be a valid email address when provided');
    }

    await mongoose.connect(process.env.MONGO_URI, { dbName: process.env.MONGO_DB_NAME || 'smackathon_2k26' });

    const existing = await Admin.findOne({ username });
    if (existing) {
      existing.email = email;
      existing.passwordHash = await Admin.hashPassword(password);
      existing.role = 'ADMIN';
      existing.passwordChangedAt = new Date();
      await existing.save();
      console.log(`✅ Admin '${username}' password reset and existing tokens invalidated.`);
      process.exit(0);
    }

    const passwordHash = await Admin.hashPassword(password);
    await Admin.create({ username, email, passwordHash, role: 'ADMIN', passwordChangedAt: new Date() });

    console.log(`✅ Admin account '${username}' created.`);
    process.exit(0);
  } catch (err) {
    console.error('❌ Failed to create admin:', err);
    process.exit(1);
  }
})();
