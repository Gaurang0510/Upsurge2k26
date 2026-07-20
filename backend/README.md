# SMACKATHON 2K26 Backend

Express + MongoDB Atlas backend for the paid shortlisted-team registration flow.

## What It Does

- Verifies shortlisted Unstop emails with OTP
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
- `POST /api/v1/registrations/request-otp`
- `POST /api/v1/registrations/verify-otp`
- `POST /api/v1/registrations/submit`
- `GET /api/v1/registrations/status?email=...`
- `GET /api/v1/registrations/status?teamCode=...`

## Main Admin APIs

- `POST /api/v1/admin/login`
- `GET /api/v1/admin/stats`
- `GET /api/v1/admin/teams`
- `GET /api/v1/admin/teams/:id`
- `PATCH /api/v1/admin/teams/:id`
- `PATCH /api/v1/admin/teams/:id/review-payment`
- `POST /api/v1/admin/teams/:id/resend-confirmation`
- `GET /api/v1/admin/export`
- `GET /api/v1/admin/shortlist`
- `POST /api/v1/admin/shortlist/import`

## Required Environment Variables

- `MONGO_URI`
- `JWT_SECRET`
- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_USER`
- `SMTP_PASS`
- `EMAIL_FROM`
- `ADMIN_USERNAME`
- `ADMIN_PASSWORD`
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`
- `CLOUDINARY_PAYMENT_FOLDER` optional
- `SMACKATHON_UPI_ID`
- `SMACKATHON_PAYEE_NAME`
- `SMACKATHON_QR_IMAGE_URL`
- `FRONTEND_URL` optional

If SMTP is missing, OTP and confirmation emails are logged to the console for development.

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
