# UPSURGE 2K26 — Registration & Payment Backend

Node.js / Express backend for the UPSURGE 2K26 Decryption & Registration Portal
(built for the hackathon / "Operation Breach" event, but works for any event
listed in the DB). Includes full Razorpay payment integration and a static
Admin Control Deck to monitor every team in real time.

## Features

- **Team registration API** — create pending order → Razorpay checkout → HMAC-SHA256 signature verification → confirm.
- **Razorpay integration** — order creation, client checkout payload, signature verification, and an async webhook handler (`payment.captured` / `payment.failed`) as a safety net.
- **MongoDB models** — `Event`, `Team`, `Registration`, `Admin` (matches the schemas in the spec doc, plus an events collection to drive fees/team-size rules dynamically).
- **Confirmation emails** — Nodemailer, with an HTML template + embedded QR code (encodes the Case Reference Code) for venue check-in. Falls back to console logging if SMTP isn't configured, so you can test without email creds.
- **Admin Control Deck** (`/admin`) — JWT-protected static dashboard:
  - Live stats (total/confirmed/pending/cancelled teams, revenue captured, check-ins)
  - Per-event breakdown
  - Searchable, filterable, paginated team/registration table
  - CSV export
  - Venue QR / Case-Code check-in tool
- **Security** — Helmet, CORS, rate limiting on public endpoints, bcrypt-hashed admin passwords, raw-body HMAC verification on the webhook route.

## Project Structure

```
upsurge-backend/
├── server.js                  # App entry point
├── admin-panel/                # Static admin dashboard (served at /admin)
│   ├── login.html
│   ├── index.html
│   ├── css/style.css
│   └── js/app.js
├── src/
│   ├── config/                # db.js, razorpay.js
│   ├── models/                # Event, Team, Registration, Admin
│   ├── controllers/           # registration, event, admin, webhook
│   ├── routes/
│   ├── middleware/             # auth.js (JWT), errorHandler.js
│   └── utils/                 # generateCode.js, sendEmail.js, emailTemplates.js
├── seed/
│   ├── seedEvents.js           # Seeds sample events (incl. the hackathon)
│   └── seedAdmin.js            # Creates the first admin login
└── .env.example
```

## Setup

```bash
cd upsurge-backend
npm install
cp .env.example .env
```

Fill in `.env`:
- `MONGO_URI` — your MongoDB connection string (Atlas or local).
- `RAZORPAY_KEY_ID` / `RAZORPAY_KEY_SECRET` — from the [Razorpay Dashboard](https://dashboard.razorpay.com/app/keys). Use `rzp_test_...` while developing.
- `RAZORPAY_WEBHOOK_SECRET` — set this in Razorpay Dashboard → Settings → Webhooks when you add the webhook URL (`https://yourdomain.com/api/v1/payments/webhook`), then paste the same secret here.
- `JWT_SECRET` — any long random string, used to sign admin session tokens.
- `SMTP_*` — optional. If left blank, confirmation emails are logged to the console instead of sent (handy for local dev).
- `ADMIN_USERNAME` / `ADMIN_PASSWORD` — used once by `npm run create-admin`.

Seed sample events (includes `operation-breach`, the flagship hackathon) and create your first admin account:

```bash
npm run seed
npm run create-admin
```

Run the server:

```bash
npm run dev     # nodemon, auto-restart
# or
npm start
```

The API runs on `http://localhost:5000` by default. The admin dashboard is at:

```
http://localhost:5000/admin
```

(You'll be redirected to `/admin/login.html` until you sign in with the admin credentials you seeded.)

## API Reference

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/v1/events` | No | List active events & fees |
| GET | `/api/v1/events/:slug` | No | Get one event |
| POST | `/api/v1/registrations/create-order` | No | Validate team, create Razorpay order, stage PENDING records |
| POST | `/api/v1/registrations/verify-payment` | No | Verify HMAC-SHA256 signature, confirm registration |
| GET | `/api/v1/registrations/track/:caseCode` | No | Look up a registration's status |
| POST | `/api/v1/payments/webhook` | Webhook secret (header) | Async Razorpay event handler |
| POST | `/api/v1/admin/login` | No | Admin login → JWT |
| GET | `/api/v1/admin/stats` | Admin JWT | Dashboard stats |
| GET | `/api/v1/admin/teams` | Admin JWT | List/search/filter/paginate teams |
| GET | `/api/v1/admin/teams/:id` | Admin JWT | Single team + registration detail |
| PATCH | `/api/v1/admin/teams/:id/status` | Admin JWT | Manually override team status |
| GET | `/api/v1/admin/export` | Admin JWT | CSV export (optionally filtered by `?eventSlug=`) |
| POST | `/api/v1/admin/checkin` | Admin JWT | Check a team in at the venue by Case Code |
| GET/POST/PATCH | `/api/v1/admin/events` | Admin JWT | Manage events, fees, team-size limits |

## Registration → Payment Flow

1. **Frontend** (`Register.jsx` in the spec) posts the form to `POST /api/v1/registrations/create-order`.
2. **Backend** validates the event + team size, generates a `teamCode` and `caseCode`, creates a Razorpay order, and stores `Team` (status `PENDING`) + `Registration` (status `PENDING`) documents.
3. **Frontend** opens the Razorpay Checkout modal using the returned `orderId` / `keyId` / `amount`.
4. On success, Razorpay's `handler` callback fires with `razorpay_payment_id`, `razorpay_order_id`, `razorpay_signature`. The frontend posts these plus `caseCode` to `POST /api/v1/registrations/verify-payment`.
5. **Backend** recomputes the HMAC-SHA256 signature using `RAZORPAY_KEY_SECRET` and compares it to the one returned by Razorpay. On match: `Registration.paymentStatus = CAPTURED`, `Team.status = CONFIRMED`, and a confirmation email (with QR code) is sent.
6. The `/api/v1/payments/webhook` endpoint independently listens for `payment.captured` / `payment.failed` events directly from Razorpay's servers, so a registration still gets confirmed even if the user closes their browser right after paying.

Free events (fee = ₹0) skip the Razorpay order entirely and confirm immediately.

## Admin Panel Notes

- Sessions are stored as a JWT in `localStorage` (`upsurge_admin_token`) and sent as `Authorization: Bearer <token>` on every admin API call.
- The check-in tool looks a team up by its `caseCode` (the same code embedded in the confirmation-email QR code) and flips `qrCheckInStatus` to `CHECKED_IN`, recording a timestamp. It safely rejects a second check-in with a warning instead of erroring.
- CSV export respects the currently selected event filter.

## Notes on Production Hardening

- Set `NODE_ENV=production` and use `rzp_live_...` keys once ready to go live.
- Put the app behind HTTPS (Razorpay requires it for live mode) — e.g. Nginx/Caddy reverse proxy or a platform like Render/Railway/EC2 + a certificate.
- Consider adding request logging/monitoring (e.g. Sentry) and a process manager (PM2) for restarts.
- Rotate `JWT_SECRET` and the admin password before going live; the seeded admin password is meant to be changed immediately.
