require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const crypto = require('crypto');
const rateLimit = require('express-rate-limit');

const connectDB = require('./src/config/db');
const { errorHandler, notFound } = require('./src/middleware/errorHandler');

const eventRoutes = require('./src/routes/eventRoutes');
const registrationRoutes = require('./src/routes/registrationRoutes');
const adminRoutes = require('./src/routes/adminRoutes');

// ---- Startup validation (AUD-001, AUD-011, AUD-020) ----
const IS_PRODUCTION = process.env.NODE_ENV === 'production';

const REQUIRED_SECRETS = ['JWT_SECRET', 'MONGO_URI'];
const REQUIRED_PAYMENT_SETTINGS = [
  'CLOUDINARY_CLOUD_NAME',
  'CLOUDINARY_API_KEY',
  'CLOUDINARY_API_SECRET',
  'SMACKATHON_UPI_ID',
];
const PLACEHOLDER_VALUES = new Set([
  'replace-with-long-random-secret',
  'your-secret-here',
  'changeme',
  'secret',
  '',
]);

const validateEnvironment = () => {
  for (const key of REQUIRED_SECRETS) {
    const value = (process.env[key] || '').trim();
    if (!value || PLACEHOLDER_VALUES.has(value.toLowerCase())) {
      throw new Error(`Missing or placeholder value for required env var: ${key}`);
    }
  }

  if (process.env.JWT_SECRET.trim().length < 32) {
    throw new Error('JWT_SECRET must be at least 32 characters long');
  }

  const registrationSecret = String(process.env.REGISTRATION_JWT_SECRET || '').trim();
  if (registrationSecret) {
    if (registrationSecret.length < 32) {
      throw new Error('REGISTRATION_JWT_SECRET must be at least 32 characters long');
    }
    if (process.env.JWT_SECRET === registrationSecret) {
      throw new Error('JWT_SECRET and REGISTRATION_JWT_SECRET must be different values');
    }
  } else if (IS_PRODUCTION) {
    throw new Error('REGISTRATION_JWT_SECRET must be set in production');
  }

  if (IS_PRODUCTION) {
    if (configuredOrigins.length === 0) {
      throw new Error('FRONTEND_URL must list at least one allowed frontend origin in production');
    }

    for (const key of REQUIRED_PAYMENT_SETTINGS) {
      const value = String(process.env[key] || '').trim();
      if (!value || PLACEHOLDER_VALUES.has(value.toLowerCase()) || value.startsWith('your-')) {
        throw new Error(`Missing or placeholder value for required env var: ${key}`);
      }
    }
  }
};

const app = express();
app.disable('x-powered-by');
// Railway terminates TLS before forwarding traffic to this process. Trusting
// exactly one proxy makes secure cookies and client IP rate limits reliable.
if (IS_PRODUCTION) app.set('trust proxy', 1);
const configuredOrigins = String(process.env.FRONTEND_URL || '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

// ---- Security & logging middleware ----
app.use(
  helmet({
    contentSecurityPolicy: IS_PRODUCTION
      ? {
          directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            imgSrc: ["'self'", 'data:', 'https://res.cloudinary.com', 'https://i.ytimg.com'],
            connectSrc: ["'self'", 'https://prod.spline.design', ...configuredOrigins],
            fontSrc: ["'self'"],
            frameSrc: ['https://www.youtube-nocookie.com'],
            objectSrc: ["'none'"],
            frameAncestors: ["'none'"],
          },
        }
      : false,
  })
);

app.use(
  cors({
    origin(origin, callback) {
      // Allow server-to-server requests (no origin header)
      if (!origin) {
        return callback(null, true);
      }

      if (
        configuredOrigins.length > 0 && configuredOrigins.includes(origin)
      ) {
        return callback(null, true);
      }

      // Allow localhost only in development
      if (
        !IS_PRODUCTION &&
        (/^http:\/\/localhost:\d+$/.test(origin) || /^http:\/\/127\.0\.0\.1:\d+$/.test(origin))
      ) {
        return callback(null, true);
      }

      // In development with no configured origins, allow all
      if (!IS_PRODUCTION && configuredOrigins.length === 0) {
        return callback(null, true);
      }

      return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: false,
  })
);

app.use(morgan(IS_PRODUCTION ? 'combined' : 'dev'));

// ---- Assign a correlation ID to every request (AUD-007) ----
app.use((req, res, next) => {
  req.correlationId = crypto.randomUUID();
  res.setHeader('X-Correlation-Id', req.correlationId);
  next();
});

// ---- Rate limiting for public registration endpoints ----
const publicLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many login attempts. Please try again later.' },
});

const invitationLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many invitation verification attempts. Please try again later.' },
});

const statusLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many status checks. Please try again later.' },
});

const submitLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many submission attempts. Please try again later.' },
});

// ---- Standard JSON body parsing ----
// A 2 MB image becomes roughly 2.7 MB after base64 encoding.
app.use(express.json({ limit: '3mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// ---- API routes ----
app.use('/api/v1/events', publicLimiter, eventRoutes);
app.use('/api/v1/registrations/verify-invitation', invitationLimiter);
app.use('/api/v1/registrations/status', statusLimiter);
app.use('/api/v1/registrations/submit', submitLimiter);
app.use('/api/v1/registrations', publicLimiter, registrationRoutes);
app.use('/api/v1/admin/login', authLimiter);
app.use('/api/v1/admin', adminRoutes);

// ---- Static Admin Panel (served at /admin) ----
app.use('/admin', express.static(path.join(__dirname, 'admin-panel')));

// ---- Health check ----
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'SMACKATHON 2K26 backend is running',
    adminPanel: '/admin',
    docs: '/api/v1',
  });
});

app.get('/health', (_req, res) => {
  const mongoose = require('mongoose');
  const ready = mongoose.connection.readyState === 1;
  res.status(ready ? 200 : 503).json({ success: ready, status: ready ? 'ok' : 'database_unavailable' });
});

app.get('/api/v1', (req, res) => {
  res.json({
    success: true,
    endpoints: [
      'GET  /api/v1/events',
      'GET  /api/v1/events/:slug',
      'POST /api/v1/registrations/verify-invitation',
      'POST /api/v1/registrations/submit',
      'GET  /api/v1/registrations/status',
      'POST /api/v1/admin/login',
      'GET  /api/v1/admin/stats',
      'GET  /api/v1/admin/teams',
      'GET  /api/v1/admin/teams/:id',
      'PATCH /api/v1/admin/teams/:id',
      'PATCH /api/v1/admin/teams/:id/review-payment',
      'GET  /api/v1/admin/export',
      'GET  /api/v1/admin/shortlist',
      'POST /api/v1/admin/shortlist/import',
    ],
  });
});

// ---- 404 + error handlers ----
app.use(notFound);
app.use(errorHandler);

// ---- Start server after DB is ready (AUD-020) ----
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  validateEnvironment();
  await connectDB();

  const server = app.listen(PORT, () => {
    console.log(`SMACKATHON 2K26 backend running on port ${PORT}`);
    console.log('Admin panel available at /admin');
  });

  // ---- Graceful shutdown (AUD-020) ----
  const gracefulShutdown = (signal) => {
    console.log(`\n${signal} received. Shutting down gracefully...`);
    server.close(() => {
      console.log('HTTP server closed.');
      const mongoose = require('mongoose');
      mongoose.connection.close(false).then(() => {
        console.log('MongoDB connection closed.');
        process.exit(0);
      });
    });

    // Force shutdown after 10 seconds
    setTimeout(() => {
      console.error('Forced shutdown after timeout.');
      process.exit(1);
    }, 10000);
  };

  process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
  process.on('SIGINT', () => gracefulShutdown('SIGINT'));
};

if (require.main === module) {
  startServer().catch((err) => {
    console.error('❌ Server startup failed:', err.message);
    process.exit(1);
  });
}

module.exports = { app, startServer, validateEnvironment };
