require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const rateLimit = require('express-rate-limit');

const connectDB = require('./src/config/db');
const { errorHandler, notFound } = require('./src/middleware/errorHandler');

const eventRoutes = require('./src/routes/eventRoutes');
const registrationRoutes = require('./src/routes/registrationRoutes');
const adminRoutes = require('./src/routes/adminRoutes');

const app = express();
const configuredOrigins = String(process.env.FRONTEND_URL || '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

// ---- DB ----
connectDB();

// ---- Security & logging middleware ----
app.use(helmet({ contentSecurityPolicy: false }));
app.use(
  cors({
    origin(origin, callback) {
      if (!origin) {
        return callback(null, true);
      }

      if (
        configuredOrigins.length === 0 ||
        configuredOrigins.includes(origin) ||
        /^http:\/\/localhost:\d+$/.test(origin) ||
        /^http:\/\/127\.0\.0\.1:\d+$/.test(origin)
      ) {
        return callback(null, true);
      }

      return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true,
  })
);
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

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

// ---- Standard JSON body parsing for everything else ----
// A 2 MB image becomes roughly 2.7 MB after base64 encoding.
app.use(express.json({ limit: '3mb' }));
app.use(express.urlencoded({ extended: true }));

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
      'POST /api/v1/admin/teams/:id/resend-confirmation',
      'GET  /api/v1/admin/export',
      'GET  /api/v1/admin/shortlist',
      'POST /api/v1/admin/shortlist/import',
    ],
  });
});

// ---- 404 + error handlers ----
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`SMACKATHON 2K26 backend running on port ${PORT}`);
  console.log(`Admin panel available at http://localhost:${PORT}/admin`);
});
