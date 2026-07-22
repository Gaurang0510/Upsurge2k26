const crypto = require('crypto');

/**
 * Generate a short random alphanumeric segment
 */
const randomSegment = (length = 4) => {
  return crypto
    .randomBytes(length)
    .toString('hex')
    .toUpperCase()
    .slice(0, length);
};

const generateRegistrationCode = (eventSlug = 'SMACK') => {
  const tag = eventSlug
    .replace(/[^a-zA-Z0-9-]/g, '')
    .split('-')
    .filter(Boolean)[0]
    ?.toUpperCase()
    .slice(0, 8) || 'SMACK';
  return `REG-${tag}-${randomSegment(10)}`;
};

module.exports = { generateRegistrationCode, randomSegment };
