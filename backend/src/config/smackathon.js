const SMACKATHON_CONFIG = {
  slug: 'smackathon-2k26',
  name: 'SMACKATHON 2K26',
  teamSize: {
    min: 3,
    max: 5,
  },
  feeInINR: 599,
  venue: 'CSE Department, YCCE, Wanadongri, Nagpur',
  shortlistSource: 'Unstop',
  payment: {
    method: 'UPI',
    upiId: process.env.SMACKATHON_UPI_ID || 'your-upi-id@bank',
    payeeName: process.env.SMACKATHON_PAYEE_NAME || 'YCCE CSE Department',
    qrImageUrl: process.env.SMACKATHON_QR_IMAGE_URL || '',
    // These values are returned by the public event endpoint and displayed only
    // on the registration page. Use public image URLs (including public Google
    // Drive share links) for the QR codes.
    paymentOptions: [
      {
        upiId: process.env.SMACKATHON_UPI_ID_1 || process.env.SMACKATHON_UPI_ID || 'your-upi-id@bank',
        payeeName: process.env.SMACKATHON_PAYEE_NAME_1 || process.env.SMACKATHON_PAYEE_NAME || 'YCCE CSE Department',
        qrImageUrl: process.env.SMACKATHON_QR_IMAGE_URL_1 || process.env.SMACKATHON_QR_IMAGE_URL || '',
      },
      {
        upiId: process.env.SMACKATHON_UPI_ID_2 || '',
        payeeName: process.env.SMACKATHON_PAYEE_NAME_2 || '',
        qrImageUrl: process.env.SMACKATHON_QR_IMAGE_URL_2 || '',
      },
    ],
    instructions: [
      'Pay the registration fee using the official UPI QR code or UPI ID shown on the site.',
      'Upload a clear payment screenshot after payment.',
      'Enter the correct UTR number used for the transfer.',
      'Registration is confirmed only after admin manually verifies the payment proof.',
    ],
  },
  registrationStages: {
    shortlistVerification: 'Shortlisted team email verification',
    paymentProofUpload: 'Manual payment proof upload',
    adminReview: 'Admin manual verification',
  },
};

const TEAM_STATUSES = [
  'EMAIL_VERIFIED',
  'REGISTRATION_SUBMITTED',
  'PAYMENT_UNDER_REVIEW',
  'PAYMENT_VERIFIED',
  'PAYMENT_REJECTED',
  'CONFIRMED',
];

const PAYMENT_STATUSES = ['NOT_SUBMITTED', 'UNDER_REVIEW', 'VERIFIED', 'REJECTED'];

const MODE_PREFERENCES = ['OFFLINE', 'ONLINE_REQUEST'];

module.exports = {
  SMACKATHON_CONFIG,
  TEAM_STATUSES,
  PAYMENT_STATUSES,
  MODE_PREFERENCES,
};
