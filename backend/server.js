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
const webhookRoutes = require('./src/routes/webhookRoutes');
const adminRoutes = require('./src/routes/adminRoutes');

const app = express();

// ---- DB ----
connectDB();

// ---- Security & logging middleware ----
app.use(helmet({ contentSecurityPolicy: false }));
app.use(
  cors({
    origin: process.env.FRONTEND_URL || '*',
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

// ---- Webhook route needs RAW body for HMAC verification — must be BEFORE express.json() ----
app.use('/api/v1/payments', express.raw({ type: 'application/json' }), webhookRoutes);

// ---- Standard JSON body parsing for everything else ----
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));

// ---- API routes ----
app.use('/api/v1/events', publicLimiter, eventRoutes);
app.use('/api/v1/registrations', publicLimiter, registrationRoutes);
app.use('/api/v1/admin', adminRoutes);

// ---- Static Admin Panel (served at /admin) ----
app.use('/admin', express.static(path.join(__dirname, 'admin-panel')));

// ---- Health check ----
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'UPSURGE 2K26 Registration & Payment API is running',
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
      'POST /api/v1/registrations/create-order',
      'POST /api/v1/registrations/verify-payment',
      'GET  /api/v1/registrations/track/:caseCode',
      'POST /api/v1/payments/webhook',
      'POST /api/v1/admin/login',
      'GET  /api/v1/admin/stats',
      'GET  /api/v1/admin/teams',
      'GET  /api/v1/admin/teams/:id',
      'PATCH /api/v1/admin/teams/:id/status',
      'GET  /api/v1/admin/export',
      'POST /api/v1/admin/checkin',
      'GET  /api/v1/admin/events',
      'POST /api/v1/admin/events',
      'PATCH /api/v1/admin/events/:id',
    ],
  });
});

// ---- 404 + error handlers ----
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 UPSURGE 2K26 backend running on port ${PORT}`);
  console.log(`🛡️  Admin panel available at http://localhost:${PORT}/admin`);
});
