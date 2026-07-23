const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

/**
 * Protects admin routes. Expects: Authorization: Bearer <token>
 * Returns 401 for missing/invalid/expired tokens.
 * Returns 401 if the admin account was deleted or the password was changed
 * after the token was issued (AUD-009 session invalidation fix).
 */
const protectAdmin = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

    if (!token) {
      return res.status(401).json({ success: false, message: 'Not authorized. No token provided.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== 'ADMIN' && decoded.role !== 'STAFF') {
      return res.status(401).json({ success: false, message: 'Invalid or expired token.' });
    }

    const admin = await Admin.findById(decoded.id).select('-passwordHash');
    if (!admin) {
      return res.status(401).json({ success: false, message: 'Admin account no longer exists.' });
    }

    // Invalidate tokens issued before the last password change (AUD-009)
    if (admin.passwordChangedAt) {
      const tokenIssuedAt = decoded.iat * 1000; // JWT iat is in seconds
      if (tokenIssuedAt < admin.passwordChangedAt.getTime()) {
        return res.status(401).json({ success: false, message: 'Token invalidated by password change. Please log in again.' });
      }
    }

    req.admin = admin;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Invalid or expired token.' });
  }
};

/**
 * Restrict route to certain roles. Returns 403 for insufficient permissions.
 * Must be used AFTER protectAdmin middleware.
 */
const requireRole = (...roles) => (req, res, next) => {
  if (!req.admin || !roles.includes(req.admin.role)) {
    return res.status(403).json({ success: false, message: 'Insufficient permissions.' });
  }
  next();
};

module.exports = { protectAdmin, requireRole };
