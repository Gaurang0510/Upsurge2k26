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

const REQUIRED_SECRETS = ['JWT_SECRET', 'REGISTRATION_JWT_SECRET', 'MONGO_URI'];
const PLACEHOLDER_VALUES = new Set([
  'replace-with-long-random-secret',
  'your-secret-here',
  'changeme',
  'secret',
  '',
]);

for (const key of REQUIRED_SECRETS) {
  const value = (process.env[key] || '').trim();
  if (!value || PLACEHOLDER_VALUES.has(value.toLowerCase())) {
    console.error(`❌ Missing or placeholder value for required env var: ${key}`);
    process.exit(1);
  }
}

if (IS_PRODUCTION) {
  const frontendUrl = (process.env.FRONTEND_URL || '').trim();
  if (!frontendUrl) {
    console.error('❌ FRONTEND_URL must be set in production to restrict CORS origins');
    process.exit(1);
  }
}

const app = express();
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
            scriptSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            imgSrc: ["'self'", 'data:', 'https://res.cloudinary.com'],
            connectSrc: ["'self'", ...configuredOrigins],
            fontSrc: ["'self'"],
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
    credentials: true,
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

// ---- Standard JSON body parsing ----
// A 2 MB image becomes roughly 2.7 MB after base64 encoding.
app.use(express.json({ limit: '3mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// ---- API routes ----
app.use('/api/v1/events', publicLimiter, eventRoutes);
app.use('/api/v1/registrations/verify-invitation', invitationLimiter);
app.use('/api/v1/registrations/status', statusLimiter);
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
  await connectDB();

  const server = app.listen(PORT, () => {
    console.log(`SMACKATHON 2K26 backend running on port ${PORT}`);
    console.log(`Admin panel available at http://localhost:${PORT}/admin`);
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

startServer().catch((err) => {
  console.error('❌ Server startup failed:', err.message);
  process.exit(1);
});
