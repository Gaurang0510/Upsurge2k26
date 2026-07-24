# SMACKATHON 2K26 Backend

Express + MongoDB Atlas backend for the paid selected-team registration flow.

## What It Does

- Stores manually assigned shortlisted leader email and six-digit team-code pairs
- Verifies the shortlisted leader email and team code before unlocking registration
- Accepts direct team registration without participant login
- Uploads payment screenshots to Cloudinary
- Stores UTR + full team/member details
- Lets admins manually verify or reject payments
- Sends confirmation email only after admin approval
- Exports registrations in an Excel-friendly `.xls` format
- Includes a static admin dashboard at `/admin`

## Main Public APIs

- `GET /api/v1/events`
- `GET /api/v1/events/smackathon-2k26`
- `POST /api/v1/registrations/verify-invitation`
- `POST /api/v1/registrations/submit`
- `GET /api/v1/registrations/status?email=...&teamCode=...`

## Main Admin APIs

- `POST /api/v1/admin/login`
- `GET /api/v1/admin/stats`
- `GET /api/v1/admin/teams`
- `GET /api/v1/admin/teams/:id`
- `PATCH /api/v1/admin/teams/:id`
- `PATCH /api/v1/admin/teams/:id/review-payment`
- `GET /api/v1/admin/export`
- `GET /api/v1/admin/shortlist`
- `POST /api/v1/admin/shortlist/import` with `{ "entriesText": "leader@example.com | 123456" }` (one pair per line)

## Required Environment Variables

- `MONGO_URI`
- `MONGO_DB_NAME` optional; defaults to `smackathon_2k26`
- `JWT_SECRET`
- `JWT_EXPIRES_IN` optional
- `REGISTRATION_ACCESS_TTL` optional
- `ADMIN_USERNAME`
- `ADMIN_PASSWORD`
- `ADMIN_EMAIL` optional
- `CLOUDINARY_API_SECRET`
- `CLOUDINARY_PAYMENT_FOLDER` optional
- `PAYMENT_SCREENSHOT_MAX_BYTES` optional; defaults to 2 MB
- `SMACKATHON_UPI_ID`
- `SMACKATHON_PAYEE_NAME`
- `SMACKATHON_QR_IMAGE_URL`
- `FRONTEND_URL` comma-separated allow-list for browser origins. In production include both the Railway frontend URL and the final Hostinger custom domain.

In production, `JWT_SECRET`, `REGISTRATION_JWT_SECRET`, MongoDB, Cloudinary,
and UPI settings must be configured. Both JWT secrets must be different and at
least 32 characters long. For backward-compatible local development only, the
registration secret may be omitted and a scoped key is derived from
`JWT_SECRET`. Store all production values in Railway service variables; never
commit a real `.env` file.

No email, SMS, Gmail, SMTP, or other notification service is used. Shortlist access, registration submission, payment review, and status tracking are handled manually through the database and admin/status pages.

## Local Run

```bash
npm install
npm run create-admin
npm run dev
```

Admin panel:

```text
http://localhost:5000/admin
```

## Railway deployment

Deploy this directory as its own Railway service with Root Directory `backend`.
Railway runs `npm ci` and `npm start`; configure `/health` as its healthcheck.
Set `FRONTEND_URL` to the deployed frontend origins, provide Atlas `MONGO_URI`,
and set the variables from `.env.example`. To create the first admin, run
`npm run create-admin` from this directory with the same environment variables.
