const test = require('node:test');
const assert = require('node:assert/strict');
const { getSlotStats } = require('../src/utils/slotHelper');

test('getSlotStats is exported as an async function', () => {
  assert.equal(typeof getSlotStats, 'function');
});
