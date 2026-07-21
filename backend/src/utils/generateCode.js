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

const generateTeamCode = () => `TEAM-SM26-${randomSegment(8)}`;

const generateRegistrationCode = (eventSlug = 'SMACK') => {
  const tag = eventSlug
    .replace(/[^a-zA-Z0-9-]/g, '')
    .split('-')
    .filter(Boolean)[0]
    ?.toUpperCase()
    .slice(0, 8) || 'SMACK';
  return `REG-${tag}-${randomSegment(10)}`;
};

const generateOtpCode = () => String(Math.floor(100000 + Math.random() * 900000));

module.exports = { generateTeamCode, generateRegistrationCode, generateOtpCode, randomSegment };
