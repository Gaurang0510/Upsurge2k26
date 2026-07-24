import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import useDocumentTitle from '../../hooks/useDocumentTitle.js';
import SectionHeading from '../../components/common/SectionHeading.jsx';
import Aurora from '../../components/team/Aurora.jsx';
import operationBreach from '../../data/events/operation-breach.js';
import '../Hackathon/hackathon.css';

// In production Express serves this SPA, so relative API URLs always target
// the Railway service. Local development uses Vite's /api proxy.
const API_BASE_URL = '';
const MAX_PAYMENT_SCREENSHOT_BYTES = 2 * 1024 * 1024;
const PAYMENT_SCREENSHOT_TYPES = new Set(['image/png', 'image/jpeg', 'image/webp']);
const REQUIRED_PERSON_FIELDS = ['fullName', 'email', 'phone', 'department', 'year'];
const GITHUB_REPOSITORY_REGEX = /^https:\/\/github\.com\/[A-Za-z0-9-]+\/[A-Za-z0-9._-]+\/?$/;

const emptyMember = () => ({
  fullName: '',
  email: '',
  phone: '',
  department: '',
  year: '',
});

const toDataUri = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error('Failed to read payment screenshot'));
    reader.readAsDataURL(file);
  });

export default function Register() {
  useDocumentTitle('Smackathon Registration');

  const [eventInfo, setEventInfo] = useState(null);
  const [eventError, setEventError] = useState('');

  const [email, setEmail] = useState('');
  const [teamCode, setTeamCode] = useState('');
  const [accessToken, setAccessToken] = useState('');

  const [statusLookup, setStatusLookup] = useState({ email: '', teamCode: '' });
  const [statusResult, setStatusResult] = useState(null);
  const [statusError, setStatusError] = useState('');

  const [formData, setFormData] = useState({
    teamName: '',
    collegeName: '',
    problemStatement: '',
    modePreference: 'OFFLINE',
    githubRepositoryUrl: '',
    leader: {
      fullName: '',
      email: '',
      phone: '',
      department: '',
      year: '',
    },
    members: [emptyMember(), emptyMember(), emptyMember(), emptyMember()],
    utr: '',
    paymentScreenshot: null,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [verificationMessage, setVerificationMessage] = useState(null);
  const [registrationError, setRegistrationError] = useState('');
  const [success, setSuccess] = useState(null);

  const problemStatements = useMemo(
    () =>
      operationBreach.tracks.map((track) => ({
        value: track.name,
        label: `${track.name} — ${track.brief}`,
      })),
    []
  );

  const resetRegistrationDetails = () => {
    setFormData({
      teamName: '',
      collegeName: '',
      problemStatement: '',
      modePreference: 'OFFLINE',
      githubRepositoryUrl: '',
      leader: {
        fullName: '',
        email: '',
        phone: '',
        department: '',
        year: '',
      },
      members: [emptyMember(), emptyMember(), emptyMember(), emptyMember()],
      utr: '',
      paymentScreenshot: null,
    });
  };

  useEffect(() => {
    let active = true;

    const loadEvent = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/v1/events/smackathon-2k26`);
        const data = await response.json();
        if (!response.ok || !data.success) {
          throw new Error(data.message || 'Failed to load registration details');
        }
        if (active) setEventInfo(data.event);
      } catch (err) {
        if (active) setEventError(err.message || 'Failed to load registration details');
      }
    };

    loadEvent();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (accessToken) {
      setFormData((prev) => ({
        ...prev,
        leader: {
          ...prev.leader,
          email,
        },
      }));
    }
  }, [accessToken, email]);

  const handleLeaderChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      leader: {
        ...prev.leader,
        [field]: value,
      },
    }));
  };

  const handleMemberChange = (index, field, value) => {
    setFormData((prev) => {
      const nextMembers = [...prev.members];
      nextMembers[index] = {
        ...nextMembers[index],
        [field]: value,
      };
      return { ...prev, members: nextMembers };
    });
  };

  const verifyInvitation = async () => {
    setIsSubmitting(true);
    setVerificationMessage(null);
    setRegistrationError('');
    setAccessToken('');
    resetRegistrationDetails();

    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/registrations/verify-invitation`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, teamCode }),
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.message || 'We could not verify this shortlisted team. Check the leader email and six-digit team code.');
      }
      setAccessToken(data.accessToken);
      setTeamCode(data.teamCode);
      setVerificationMessage({
        type: 'success',
        text: 'Team verified successfully. You may now complete Step 2 and submit your registration.',
      });
    } catch (err) {
      setVerificationMessage({
        type: 'error',
        text: err.message || 'This team could not be verified. Check the leader email and six-digit team code.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!accessToken) {
      setRegistrationError('Please verify your shortlisted team in Step 1 before entering registration details.');
      return;
    }
    setIsSubmitting(true);
    setRegistrationError('');

    try {
      const missingLeaderField = REQUIRED_PERSON_FIELDS.find(
        (field) => !String(formData.leader[field] || '').trim()
      );
      if (missingLeaderField) {
        throw new Error('All team leader details are required');
      }

      const memberRows = formData.members.map((member, index) => ({
        member,
        index,
        hasAnyDetails: Object.values(member).some((value) => String(value).trim() !== ''),
      }));
      const missingRequiredMember = memberRows.slice(0, 2).find(({ member }) =>
        REQUIRED_PERSON_FIELDS.some((field) => !String(member[field] || '').trim())
      );

      if (missingRequiredMember) {
        throw new Error(`All details for member ${missingRequiredMember.index + 2} are required`);
      }

      const incompleteOptionalMember = memberRows.slice(2).find(({ member, hasAnyDetails }) =>
        hasAnyDetails && REQUIRED_PERSON_FIELDS.some((field) => !String(member[field] || '').trim())
      );
      if (incompleteOptionalMember) {
        throw new Error(`Complete all details for member ${incompleteOptionalMember.index + 2} or leave the row empty`);
      }

      const githubRepositoryUrl = formData.githubRepositoryUrl.trim().replace(/\/$/, '');
      if (!GITHUB_REPOSITORY_REGEX.test(`${githubRepositoryUrl}/`)) {
        throw new Error('Enter a valid GitHub repository link, for example https://github.com/username/project-repository');
      }

      const validMembers = memberRows
        .filter(({ hasAnyDetails }) => hasAnyDetails)
        .map(({ member }) => member);

      if (!formData.paymentScreenshot) {
        throw new Error('Payment screenshot is required');
      }
      if (!String(formData.utr || '').trim()) {
        throw new Error('UTR number is required');
      }
      if (!PAYMENT_SCREENSHOT_TYPES.has(formData.paymentScreenshot.type)) {
        throw new Error('Payment screenshot must be a PNG, JPG, or WEBP image');
      }
      if (formData.paymentScreenshot.size > MAX_PAYMENT_SCREENSHOT_BYTES) {
        throw new Error('Payment screenshot must be 2 MB or smaller');
      }

      const paymentScreenshotDataUri = await toDataUri(formData.paymentScreenshot);

      const response = await fetch(`${API_BASE_URL}/api/v1/registrations/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          accessToken,
          teamName: formData.teamName,
          collegeName: formData.collegeName,
          problemStatement: formData.problemStatement,
          modePreference: formData.modePreference,
          githubRepositoryUrl: formData.githubRepositoryUrl,
          leader: formData.leader,
          members: validMembers,
          utr: formData.utr,
          paymentScreenshotDataUri,
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Registration submission failed');
      }

      setSuccess({
        registrationCode: data.registrationCode,
        teamCode: data.teamCode,
        paymentStatus: data.paymentStatus,
      });
    } catch (err) {
      setRegistrationError(err.message || 'Registration submission failed. Please review your details and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const checkStatus = async (event) => {
    event.preventDefault();
    setStatusError('');
    setStatusResult(null);

    try {
      const params = new URLSearchParams();
      if (statusLookup.email) params.set('email', statusLookup.email);
      if (statusLookup.teamCode) params.set('teamCode', statusLookup.teamCode);

      const response = await fetch(`${API_BASE_URL}/api/v1/registrations/status?${params.toString()}`);
      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Status lookup failed');
      }

      setStatusResult(data);
    } catch (err) {
      setStatusError(err.message || 'Status lookup failed');
    }
  };

  const paymentConfig = eventInfo?.payment;

  return (
    <div className="registration-page relative w-full min-h-screen overflow-hidden pb-20">
      <div className="absolute inset-x-0 top-0 h-[800px] z-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 opacity-60">
          <Aurora colorStops={['#C1121F', '#780000', '#000000']} amplitude={1.6} speed={1.0} />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-case-black" />
      </div>

      <div className="relative z-10 mx-auto max-w-5xl px-4 pt-28 sm:pt-32 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <SectionHeading
            eyebrow="Shortlisted Teams Only"
            title="Smackathon Confirmation Registration"
            description="Enter the leader email and team code sent after Unstop selection, then upload payment proof."
            align="center"
          />
        </div>

        <div className="grid gap-8 xl:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-8">
            {success ? (
              <div className="hackathon-panel p-8 border border-evidence/30 bg-black/40 backdrop-blur-md rounded-lg">
                <span className="case-tag">Submission Logged</span>
                <h2 className="heading-display mt-4 text-3xl text-white">Registration Submitted Successfully</h2>
                <div className="mt-6 space-y-2 font-mono text-sm text-steel">
                  <p><strong className="text-white">Team Code:</strong> {success.teamCode}</p>
                  <p><strong className="text-white">Registration Code:</strong> {success.registrationCode}</p>
                  <p><strong className="text-white">Payment Status:</strong> {success.paymentStatus}</p>
                  <p className="text-steel/80">
                    Your registration has been submitted successfully and your payment is now pending manual verification. Use the status checker on this page to follow the review.
                  </p>
                </div>
                <div className="mt-8 flex flex-wrap gap-4">
                  <Link to="/hackathon" className="btn-secondary">Back to Smackathon</Link>
                  <button
                    type="button"
                    onClick={() => setSuccess(null)}
                    className="btn-primary"
                  >
                    Register Another Team
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="hackathon-panel p-6 sm:p-8 border border-white/10 bg-black/35 backdrop-blur-md rounded-lg space-y-6">
                  <div>
                    <h2 className="font-display text-3xl text-white">Step 1: Verify Team Invitation</h2>
                    <p className="mt-2 text-sm text-steel">
                      Only shortlisted teams can continue. Enter the leader email and manually assigned six-digit team code.
                    </p>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setAccessToken('');
                        setVerificationMessage(null);
                        resetRegistrationDetails();
                      }}
                      placeholder="Leader email used on Unstop"
                      className="w-full bg-ink/60 border border-white/10 text-white p-3 font-mono text-sm focus:outline-none focus:border-evidence focus:ring-1 focus:ring-evidence rounded"
                    />
                    <input
                      type="text"
                      value={teamCode}
                      onChange={(e) => {
                        setTeamCode(e.target.value.toUpperCase());
                        setAccessToken('');
                        setVerificationMessage(null);
                        resetRegistrationDetails();
                      }}
                      placeholder="Team code from selection email"
                      className="w-full bg-ink/60 border border-white/10 text-white p-3 font-mono text-sm focus:outline-none focus:border-evidence focus:ring-1 focus:ring-evidence rounded"
                    />
                  </div>
                  <button
                    type="button"
                    disabled={isSubmitting || !email || !teamCode}
                    onClick={verifyInvitation}
                    className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Verify Invitation
                  </button>

                  {verificationMessage && (
                    <div
                      className={`p-3 border rounded font-mono text-xs ${
                        verificationMessage.type === 'success'
                          ? 'bg-emerald-950/30 border-emerald-500/30 text-emerald-300'
                          : 'bg-red-950/40 border-red-500/30 text-red-300'
                      }`}
                    >
                      {verificationMessage.text}
                    </div>
                  )}
                </div>

                <form
                  onSubmit={handleSubmit}
                  className={`hackathon-panel p-6 sm:p-8 border border-white/10 bg-black/35 backdrop-blur-md rounded-lg space-y-6 ${!accessToken ? 'opacity-60' : ''}`}
                >
                  <div>
                    <h2 className="font-display text-3xl text-white">Step 2: Submit Team And Payment Proof</h2>
                    <p className="mt-2 text-sm text-steel">
                      {accessToken
                        ? 'Team size must remain 3–5 members. Member 2 and Member 3 are required.'
                        : 'Step 2 is locked. Verify your shortlisted team in Step 1 to unlock the registration form.'}
                    </p>
                  </div>

                  <fieldset disabled={!accessToken || isSubmitting} className="space-y-6">
                  <div className="grid gap-6 sm:grid-cols-2">
                    <input
                      type="text"
                      value={formData.teamName}
                      onChange={(e) => setFormData((prev) => ({ ...prev, teamName: e.target.value }))}
                      placeholder="Team name"
                      className="w-full bg-ink/60 border border-white/10 text-white p-3 font-mono text-sm focus:outline-none focus:border-evidence focus:ring-1 focus:ring-evidence rounded"
                      required
                    />
                    <input
                      type="text"
                      value={formData.collegeName}
                      onChange={(e) => setFormData((prev) => ({ ...prev, collegeName: e.target.value }))}
                      placeholder="College / Institution name"
                      className="w-full bg-ink/60 border border-white/10 text-white p-3 font-mono text-sm focus:outline-none focus:border-evidence focus:ring-1 focus:ring-evidence rounded"
                      required
                    />
                    <select
                      value={formData.problemStatement}
                      onChange={(e) => setFormData((prev) => ({ ...prev, problemStatement: e.target.value }))}
                      className="w-full bg-ink/60 border border-white/10 text-white p-3 font-mono text-sm focus:outline-none focus:border-evidence focus:ring-1 focus:ring-evidence rounded"
                      required
                    >
                      <option value="">Select problem statement</option>
                      {problemStatements.map((track) => (
                        <option key={track.value} value={track.value}>
                          {track.label}
                        </option>
                      ))}
                    </select>
                    <select
                      value={formData.modePreference}
                      onChange={(e) => setFormData((prev) => ({ ...prev, modePreference: e.target.value }))}
                      className="w-full bg-ink/60 border border-white/10 text-white p-3 font-mono text-sm focus:outline-none focus:border-evidence focus:ring-1 focus:ring-evidence rounded"
                    >
                      <option value="OFFLINE">Offline</option>
                      <option value="ONLINE_REQUEST">Online Request</option>
                    </select>
                    <div className="sm:col-span-2 space-y-2">
                      <label htmlFor="githubRepositoryUrl" className="block text-xs font-mono uppercase tracking-wider text-steel">
                        GitHub Repository Link
                      </label>
                      <p className="text-xs text-steel">
                        Create a GitHub repository for your project and paste its link here. Push your project code to this repository.
                      </p>
                      <input
                        id="githubRepositoryUrl"
                        type="url"
                        value={formData.githubRepositoryUrl}
                        onChange={(e) => setFormData((prev) => ({ ...prev, githubRepositoryUrl: e.target.value }))}
                        placeholder="https://github.com/username/project-repository"
                        pattern="https://github\.com/[A-Za-z0-9-]+/[A-Za-z0-9._-]+/?"
                        className="w-full bg-ink/60 border border-white/10 text-white p-3 font-mono text-sm focus:outline-none focus:border-evidence focus:ring-1 focus:ring-evidence rounded"
                        required
                      />
                    </div>
                  </div>

                  <div className="border-t border-white/10 pt-6 space-y-4">
                    <h3 className="font-display text-2xl text-white">Leader Details</h3>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <input type="text" value={formData.leader.fullName} onChange={(e) => handleLeaderChange('fullName', e.target.value)} placeholder="Leader full name" className="w-full bg-ink/60 border border-white/10 text-white p-3 font-mono text-sm rounded" required />
                      <input type="email" value={formData.leader.email} readOnly className="w-full bg-ink/40 border border-white/10 text-steel p-3 font-mono text-sm rounded cursor-not-allowed" required />
                      <input type="tel" value={formData.leader.phone} onChange={(e) => handleLeaderChange('phone', e.target.value)} placeholder="Leader phone number" className="w-full bg-ink/60 border border-white/10 text-white p-3 font-mono text-sm rounded" required />
                      <input type="text" value={formData.leader.department} onChange={(e) => handleLeaderChange('department', e.target.value)} placeholder="Leader department" className="w-full bg-ink/60 border border-white/10 text-white p-3 font-mono text-sm rounded" required />
                      <input type="text" value={formData.leader.year} onChange={(e) => handleLeaderChange('year', e.target.value)} placeholder="Leader year" className="w-full bg-ink/60 border border-white/10 text-white p-3 font-mono text-sm rounded sm:col-span-2" required />
                    </div>
                  </div>

                  <div className="border-t border-white/10 pt-6 space-y-4">
                    <h3 className="font-display text-2xl text-white">Team Members</h3>
                    <div className="grid gap-4">
                      {formData.members.map((member, index) => (
                        <div key={index} className="member-row grid gap-4 sm:grid-cols-2">
                          <input type="text" value={member.fullName} onChange={(e) => handleMemberChange(index, 'fullName', e.target.value)} placeholder={`Member ${index + 2} full name`} className="w-full bg-ink/60 border border-white/10 text-white p-3 font-mono text-xs rounded" required={index < 2} />
                          <input type="email" value={member.email} onChange={(e) => handleMemberChange(index, 'email', e.target.value)} placeholder="Email" className="w-full bg-ink/60 border border-white/10 text-white p-3 font-mono text-xs rounded" required={index < 2} />
                          <input type="tel" value={member.phone} onChange={(e) => handleMemberChange(index, 'phone', e.target.value)} placeholder="Phone" className="w-full bg-ink/60 border border-white/10 text-white p-3 font-mono text-xs rounded" required={index < 2} />
                          <input type="text" value={member.department} onChange={(e) => handleMemberChange(index, 'department', e.target.value)} placeholder="Department" className="w-full bg-ink/60 border border-white/10 text-white p-3 font-mono text-xs rounded" required={index < 2} />
                          <input type="text" value={member.year} onChange={(e) => handleMemberChange(index, 'year', e.target.value)} placeholder="Year" className="w-full bg-ink/60 border border-white/10 text-white p-3 font-mono text-xs rounded" required={index < 2} />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="border-t border-white/10 pt-6 space-y-4">
                    <h3 className="font-display text-2xl text-white">Payment Proof</h3>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <input
                        type="text"
                        value={formData.utr}
                        onChange={(e) => setFormData((prev) => ({ ...prev, utr: e.target.value.toUpperCase() }))}
                        placeholder="Enter UTR number"
                        className="w-full bg-ink/60 border border-white/10 text-white p-3 font-mono text-sm rounded"
                        minLength={8}
                        maxLength={32}
                        pattern="[A-Za-z0-9-]{8,32}"
                        required
                      />
                      <input
                        type="file"
                        accept="image/png,image/jpeg,image/webp"
                        onChange={(e) => setFormData((prev) => ({ ...prev, paymentScreenshot: e.target.files?.[0] || null }))}
                        className="w-full bg-ink/60 border border-white/10 text-white p-3 font-mono text-sm rounded"
                        required
                      />
                    </div>
                  </div>

                  {registrationError && (
                    <div className="p-3 bg-red-950/40 border border-red-500/30 text-red-300 text-xs font-mono rounded">
                      {registrationError}
                    </div>
                  )}

                  <button
                    type="submit"
                    className="btn-primary w-full py-4 text-base font-bold uppercase tracking-widest disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Registration'}
                  </button>
                  </fieldset>
                </form>
              </>
            )}
          </div>

          <div className="space-y-8">
            <div className="hackathon-panel p-6 border border-white/10 bg-black/35 backdrop-blur-md rounded-lg space-y-4">
              <h2 className="font-display text-3xl text-white">Payment Details</h2>
              {eventError ? (
                <p className="text-sm text-red-300 font-mono">{eventError}</p>
              ) : (
                <>
                  <div className="space-y-2 font-mono text-sm text-steel">
                    <p><strong className="text-white">Fee:</strong> ₹{eventInfo?.feeInINR ?? 599} per team</p>
                    <p><strong className="text-white">Team Size:</strong> {eventInfo?.teamSize?.min ?? 3} to {eventInfo?.teamSize?.max ?? 5} members</p>
                    <p><strong className="text-white">UPI ID:</strong> {paymentConfig?.upiId || 'Will be updated'}</p>
                    <p><strong className="text-white">Payee Name:</strong> {paymentConfig?.payeeName || 'Will be updated'}</p>
                  </div>
                  {paymentConfig?.qrImageUrl ? (
                    <img
                      src={paymentConfig.qrImageUrl}
                      alt="Smackathon payment QR"
                      className="w-full rounded border border-white/10 bg-white p-3"
                    />
                  ) : (
                    <div className="border border-dashed border-white/20 rounded p-6 font-mono text-xs text-steel">
                      QR code URL is not configured in the backend yet.
                    </div>
                  )}
                  <ul className="space-y-2 text-xs text-steel">
                    {(paymentConfig?.instructions || []).map((item) => (
                      <li key={item} className="flex gap-2">
                        <span className="text-evidence">›</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>

            <form
              onSubmit={checkStatus}
              className="hackathon-panel p-6 border border-white/10 bg-black/35 backdrop-blur-md rounded-lg space-y-4"
            >
              <h2 className="font-display text-3xl text-white">Check Registration Status</h2>
              <input
                type="email"
                value={statusLookup.email}
                onChange={(e) => setStatusLookup((prev) => ({ ...prev, email: e.target.value }))}
                placeholder="Leader email"
                className="w-full bg-ink/60 border border-white/10 text-white p-3 font-mono text-sm rounded"
              />
              <input
                type="text"
                value={statusLookup.teamCode}
                onChange={(e) => setStatusLookup((prev) => ({ ...prev, teamCode: e.target.value.toUpperCase() }))}
                placeholder="Six-digit team code"
                className="w-full bg-ink/60 border border-white/10 text-white p-3 font-mono text-sm rounded"
              />
              {statusError && <div className="text-xs font-mono text-red-300">{statusError}</div>}
              {statusResult && (
                <div className="space-y-2 font-mono text-sm text-steel">
                  <p><strong className="text-white">Team:</strong> {statusResult.team.teamName}</p>
                  <p><strong className="text-white">Team Code:</strong> {statusResult.team.teamCode}</p>
                  <p><strong className="text-white">Status:</strong> {statusResult.team.status}</p>
                  <p><strong className="text-white">Payment:</strong> {statusResult.registration?.paymentStatus || '—'}</p>
                  {statusResult.team.paymentReviewReason && (
                    <p><strong className="text-white">Review Note:</strong> {statusResult.team.paymentReviewReason}</p>
                  )}
                </div>
              )}
              <button type="submit" className="btn-secondary w-full">Check Status</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
