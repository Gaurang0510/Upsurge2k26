const crypto = require('crypto');

// Payment proofs only need to be readable by an administrator. Keeping these
// limits low is important on Cloudinary's free plan, where originals count
// toward storage as well as bandwidth.
const MAX_UPLOAD_BYTES = Number(process.env.PAYMENT_SCREENSHOT_MAX_BYTES) || 2 * 1024 * 1024;
const ALLOWED_MIME_TYPES = new Set(['image/png', 'image/jpeg', 'image/jpg', 'image/webp']);
const PAYMENT_FOLDER = process.env.CLOUDINARY_PAYMENT_FOLDER || 'smackathon/payment-proofs';
const INCOMING_TRANSFORMATION = 'c_limit,w_1600,h_1600/q_auto:low/f_webp';

const createUploadError = (message, statusCode = 400) => {
  const err = new Error(message);
  err.statusCode = statusCode;
  return err;
};

const hasValidImageSignature = (buffer, mimeType) => {
  const signatures = {
    'image/png': buffer.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])),
    'image/jpeg': buffer.subarray(0, 3).equals(Buffer.from([0xff, 0xd8, 0xff])),
    'image/jpg': buffer.subarray(0, 3).equals(Buffer.from([0xff, 0xd8, 0xff])),
    'image/webp': buffer.subarray(0, 4).toString('ascii') === 'RIFF' && buffer.subarray(8, 12).toString('ascii') === 'WEBP',
  };

  return signatures[mimeType] === true;
};

const signUploadParams = (params, apiSecret) =>
  crypto
    .createHash('sha1')
    .update(
      Object.entries(params)
        .filter(([, value]) => value !== undefined && value !== null && value !== '')
        .sort(([left], [right]) => left.localeCompare(right))
        .map(([key, value]) => `${key}=${value}`)
        .join('&') + apiSecret
    )
    .digest('hex');

const uploadPaymentScreenshot = async ({ dataUri, filename }) => {
  const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = process.env;

  if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
    throw createUploadError('Cloudinary credentials are missing', 500);
  }

  if (!dataUri || typeof dataUri !== 'string' || !dataUri.startsWith('data:image/')) {
    throw createUploadError('Payment screenshot must be an image data URI');
  }

  const match = dataUri.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/);
  if (!match) {
    throw createUploadError('Invalid payment screenshot encoding');
  }

  const [, mimeType, base64Payload] = match;
  if (!ALLOWED_MIME_TYPES.has(mimeType.toLowerCase())) {
    throw createUploadError('Only PNG, JPG, JPEG, or WEBP payment screenshots are allowed');
  }

  const imageBuffer = Buffer.from(base64Payload, 'base64');
  if (!imageBuffer.length || !hasValidImageSignature(imageBuffer, mimeType.toLowerCase())) {
    throw createUploadError('Payment screenshot content does not match its image type');
  }
  if (imageBuffer.length > MAX_UPLOAD_BYTES) {
    throw createUploadError(`Payment screenshot must be ${Math.floor(MAX_UPLOAD_BYTES / 1024 / 1024)} MB or smaller`);
  }

  const timestamp = Math.floor(Date.now() / 1000);
  const publicId = String(filename || '').replace(/[^a-zA-Z0-9_-]/g, '');
  if (!publicId) throw createUploadError('Unable to create payment screenshot identifier', 500);

  // This is an incoming transformation, not an eager derivative: Cloudinary
  // persists the compact WebP asset instead of retaining a large original.
  const uploadParams = {
    folder: PAYMENT_FOLDER,
    public_id: publicId,
    timestamp,
    transformation: INCOMING_TRANSFORMATION,
    overwrite: 'false',
    unique_filename: 'false',
  };
  const form = new FormData();
  form.append('file', dataUri);
  form.append('api_key', CLOUDINARY_API_KEY);
  Object.entries(uploadParams).forEach(([key, value]) => form.append(key, String(value)));
  form.append('signature', signUploadParams(uploadParams, CLOUDINARY_API_SECRET));

  const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, {
    method: 'POST',
    body: form,
  });

  const payload = await response.json();
  if (!response.ok) {
    throw createUploadError(payload.error?.message || 'Cloudinary upload failed', 502);
  }

  return {
    publicId: payload.public_id,
    secureUrl: payload.secure_url,
    assetId: payload.asset_id,
    bytes: payload.bytes,
    format: payload.format,
  };
};

const deletePaymentScreenshot = async (publicId) => {
  const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = process.env;
  if (!publicId || !CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) return;

  const params = { public_id: publicId, timestamp: Math.floor(Date.now() / 1000), invalidate: 'true' };
  const form = new FormData();
  form.append('api_key', CLOUDINARY_API_KEY);
  Object.entries(params).forEach(([key, value]) => form.append(key, String(value)));
  form.append('signature', signUploadParams(params, CLOUDINARY_API_SECRET));

  await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/destroy`, {
    method: 'POST',
    body: form,
  });
};

module.exports = { uploadPaymentScreenshot, deletePaymentScreenshot };
