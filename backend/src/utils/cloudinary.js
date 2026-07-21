const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;
const ALLOWED_MIME_TYPES = new Set(['image/png', 'image/jpeg', 'image/jpg', 'image/webp']);

const uploadPaymentScreenshot = async ({ dataUri, filename }) => {
  const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = process.env;

  if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
    const err = new Error('Cloudinary credentials are missing');
    err.statusCode = 500;
    throw err;
  }

  if (!dataUri || typeof dataUri !== 'string' || !dataUri.startsWith('data:image/')) {
    const err = new Error('Payment screenshot must be an image data URI');
    err.statusCode = 400;
    throw err;
  }

  const match = dataUri.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/);
  if (!match) {
    const err = new Error('Invalid payment screenshot encoding');
    err.statusCode = 400;
    throw err;
  }

  const [, mimeType, base64Payload] = match;
  if (!ALLOWED_MIME_TYPES.has(mimeType.toLowerCase())) {
    const err = new Error('Only PNG, JPG, JPEG, or WEBP payment screenshots are allowed');
    err.statusCode = 400;
    throw err;
  }

  const approxBytes = Buffer.byteLength(base64Payload, 'base64');
  if (approxBytes > MAX_UPLOAD_BYTES) {
    const err = new Error('Payment screenshot must be 5 MB or smaller');
    err.statusCode = 400;
    throw err;
  }

  const form = new FormData();
  form.append('file', dataUri);
  form.append('api_key', CLOUDINARY_API_KEY);
  form.append('timestamp', String(Math.floor(Date.now() / 1000)));
  form.append('folder', process.env.CLOUDINARY_PAYMENT_FOLDER || 'smackathon/payment-proofs');
  form.append('public_id', filename);

  const paramsToSign = [
    `folder=${process.env.CLOUDINARY_PAYMENT_FOLDER || 'smackathon/payment-proofs'}`,
    `public_id=${filename}`,
    `timestamp=${form.get('timestamp')}`,
  ].join('&');

  const crypto = require('crypto');
  const signature = crypto
    .createHash('sha1')
    .update(`${paramsToSign}${CLOUDINARY_API_SECRET}`)
    .digest('hex');

  form.append('signature', signature);

  const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, {
    method: 'POST',
    body: form,
  });

  const payload = await response.json();
  if (!response.ok) {
    const err = new Error(payload.error?.message || 'Cloudinary upload failed');
    err.statusCode = 502;
    throw err;
  }

  return {
    publicId: payload.public_id,
    secureUrl: payload.secure_url,
    assetId: payload.asset_id,
  };
};

module.exports = { uploadPaymentScreenshot };
