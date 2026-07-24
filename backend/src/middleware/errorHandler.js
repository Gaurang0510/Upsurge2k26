const IS_PRODUCTION = process.env.NODE_ENV === 'production';

/**
 * Central error handler (AUD-007).
 *
 * In production, internal server errors (5xx) return a generic message with
 * a correlation ID so the admin can look up details in server logs.
 * Known operational errors (validation, cast, duplicate key) return safe,
 * user-friendly messages without leaking schema or infrastructure details.
 */
const errorHandler = (err, req, res, _next) => {
  const correlationId = req.correlationId || 'unknown';

  if (err.type === 'entity.too.large') {
    return res.status(413).json({ success: false, message: 'Request body is too large' });
  }
  if (err instanceof SyntaxError && 'body' in err) {
    return res.status(400).json({ success: false, message: 'Malformed JSON request body' });
  }

  // Always log the full error server-side
  console.error(`🔥 [${correlationId}] Error:`, err.message);
  if (!IS_PRODUCTION) {
    console.error(err.stack);
  }

  // Mongoose ValidationError → 400 with safe message
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors || {}).map((e) => e.message);
    return res.status(400).json({
      success: false,
      message: messages.length ? messages.join('. ') : 'Validation failed',
      ...(IS_PRODUCTION ? { correlationId } : {}),
    });
  }

  // Mongoose CastError (e.g., invalid ObjectId) → 400
  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      message: `Invalid value for ${err.path || 'field'}`,
      ...(IS_PRODUCTION ? { correlationId } : {}),
    });
  }

  // MongoDB duplicate key error → 409
  if (err.code === 11000) {
    return res.status(409).json({
      success: false,
      message: err.statusCode ? err.message : 'A record with the same unique details already exists',
      ...(IS_PRODUCTION ? { correlationId } : {}),
    });
  }

  // JWT errors → 401
  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token',
      ...(IS_PRODUCTION ? { correlationId } : {}),
    });
  }

  const statusCode = err.statusCode || 500;

  // In production, mask 500 errors to avoid leaking internals
  const message = IS_PRODUCTION && statusCode >= 500
    ? 'An internal error occurred. Please try again later.'
    : err.message || 'Internal Server Error';

  res.status(statusCode).json({
    success: false,
    message,
    ...(IS_PRODUCTION ? { correlationId } : {}),
  });
};

// 404 handler — does not include req.originalUrl in production to prevent path enumeration
const notFound = (req, res) => {
  res.status(404).json({
    success: false,
    message: IS_PRODUCTION ? 'Route not found' : `Route not found: ${req.originalUrl}`,
  });
};

module.exports = { errorHandler, notFound };
