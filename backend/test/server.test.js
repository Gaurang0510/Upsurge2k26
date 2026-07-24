const test = require('node:test');
const assert = require('node:assert/strict');

const { validateEnvironment } = require('../server');

const requiredEnvironment = {
  JWT_SECRET: 'a'.repeat(32),
  REGISTRATION_JWT_SECRET: 'b'.repeat(32),
  MONGO_URI: 'mongodb://localhost:27017/smackathon_test',
};

const withEnvironment = async (values, callback) => {
  const original = Object.fromEntries(Object.keys(values).map((key) => [key, process.env[key]]));
  Object.assign(process.env, values);
  try {
    await callback();
  } finally {
    for (const [key, value] of Object.entries(original)) {
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
    }
  }
};

test('environment validation rejects shared JWT secrets when a registration secret is provided', async () => {
  await withEnvironment(
    { ...requiredEnvironment, REGISTRATION_JWT_SECRET: 'a'.repeat(32) },
    async () => assert.throws(validateEnvironment, /must be different/)
  );
});

test('environment validation rejects short JWT secrets', async () => {
  await withEnvironment(
    { ...requiredEnvironment, JWT_SECRET: 'short' },
    async () => assert.throws(validateEnvironment, /at least 32 characters/)
  );
});

test('environment validation accepts isolated strong secrets', async () => {
  await withEnvironment(requiredEnvironment, async () => {
    assert.doesNotThrow(validateEnvironment);
  });
});

test('environment validation accepts an omitted registration secret in development', async () => {
  const { REGISTRATION_JWT_SECRET, ...developmentEnvironment } = requiredEnvironment;
  await withEnvironment({ ...developmentEnvironment, REGISTRATION_JWT_SECRET: '' }, async () => {
    assert.doesNotThrow(validateEnvironment);
  });
});
