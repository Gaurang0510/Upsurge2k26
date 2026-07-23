const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const BCRYPT_SALT_ROUNDS = 12;

const adminSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true, trim: true, maxlength: 80 },
    email: { type: String, trim: true, lowercase: true, maxlength: 254 },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ['ADMIN', 'STAFF'], default: 'ADMIN' },
    passwordChangedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

adminSchema.methods.comparePassword = function (plainPassword) {
  return bcrypt.compare(plainPassword, this.passwordHash);
};

adminSchema.statics.hashPassword = function (plainPassword) {
  return bcrypt.hash(plainPassword, BCRYPT_SALT_ROUNDS);
};

module.exports = mongoose.model('Admin', adminSchema);
