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

/**
 * TEAM-UP26-XXXX
 */
const generateTeamCode = () => {
  const num = Math.floor(1000 + Math.random() * 9000);
  return `TEAM-UP26-${num}`;
};

/**
 * UP-<EVENTTAG>-XXXX  e.g. UP-BREACH-8492
 */
const generateCaseCode = (eventSlug = 'EVENT') => {
  const tag = eventSlug
    .replace(/[^a-zA-Z0-9-]/g, '')
    .split('-')
    .filter(Boolean)[0]
    ?.toUpperCase()
    .slice(0, 8) || 'EVENT';
  const num = Math.floor(1000 + Math.random() * 9000);
  return `UP-${tag}-${num}`;
};

module.exports = { generateTeamCode, generateCaseCode, randomSegment };
