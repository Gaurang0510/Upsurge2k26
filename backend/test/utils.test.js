const test = require('node:test');
const assert = require('node:assert/strict');

process.env.CLOUDINARY_CLOUD_NAME = 'example';
process.env.CLOUDINARY_API_SECRET = 'test-secret';

const { buildExcelHtml } = require('../src/utils/exportWorkbook');
const { getSignedPaymentScreenshotUrl, uploadPaymentScreenshot } = require('../src/utils/cloudinary');

test('export escapes HTML and spreadsheet formulas', () => {
  const output = buildExcelHtml([{ teamCode: '=HYPERLINK("https://attacker")' }]);
  assert.match(output, /<td>'=HYPERLINK/);
  assert.doesNotMatch(output, /<script>/i);
});

test('payment proof URLs use authenticated signed delivery', () => {
  const url = getSignedPaymentScreenshotUrl({ publicId: 'smackathon/payment-proofs/REG-ABC', format: 'webp' });
  assert.match(url, /^https:\/\/res\.cloudinary\.com\/example\/image\/authenticated\/s--[A-Za-z0-9_-]{8}--\//);
  assert.match(url, /REG-ABC\.webp$/);
});

test('payment screenshot parser rejects malformed base64 before upload', async () => {
  process.env.CLOUDINARY_API_KEY = 'test-key';
  await assert.rejects(
    uploadPaymentScreenshot({
      filename: 'REG-ABC',
      dataUri: 'data:image/png;base64,not valid base64',
    }),
    /Invalid payment screenshot encoding/
  );
});
