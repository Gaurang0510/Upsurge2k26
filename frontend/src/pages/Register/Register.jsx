import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import useDocumentTitle from '../../hooks/useDocumentTitle.js';
import SectionHeading from '../../components/common/SectionHeading.jsx';
import Aurora from '../../components/team/Aurora.jsx';
import operationBreach from '../../data/events/operation-breach.js';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';
const MAX_PAYMENT_SCREENSHOT_BYTES = 2 * 1024 * 1024;
const PAYMENT_SCREENSHOT_TYPES = new Set(['image/png', 'image/jpeg', 'image/webp']);

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
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(null);

  const problemStatements = useMemo(
    () =>
      operationBreach.tracks.map((track) => ({
        value: track.name,
        label: `${track.name} — ${track.brief}`,
      })),
    []
  );

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
    setError('');

    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/registrations/verify-invitation`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, teamCode }),
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Invitation verification failed');
      }
      setAccessToken(data.accessToken);
      setTeamCode(data.teamCode);
    } catch (err) {
      setError(err.message || 'Invitation verification failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const validMembers = formData.members.filter((member) =>
        Object.values(member).some((value) => String(value).trim() !== '')
      );

      if (validMembers.length < 2) {
        throw new Error('At least two additional team members are required');
      }

      if (!formData.paymentScreenshot) {
        throw new Error('Payment screenshot is required');
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
      setError(err.message || 'Registration submission failed');
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
    <div className="relative w-full min-h-screen overflow-hidden pb-20">
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
                <h2 className="heading-display mt-4 text-3xl text-white">Registration Sent For Review</h2>
                <div className="mt-6 space-y-2 font-mono text-sm text-steel">
                  <p><strong className="text-white">Team Code:</strong> {success.teamCode}</p>
                  <p><strong className="text-white">Registration Code:</strong> {success.registrationCode}</p>
                  <p><strong className="text-white">Payment Status:</strong> {success.paymentStatus}</p>
                  <p className="text-steel/80">
                    Admin will verify your payment manually. You’ll receive a confirmation email after approval.
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
                      Only selected teams can continue. Enter the leader email and team code from your selection email.
                    </p>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setAccessToken('');
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

                  {accessToken && (
                    <div className="p-3 bg-emerald-950/30 border border-emerald-500/30 rounded font-mono text-xs text-emerald-300">
                      Invitation verified. Continue with team registration.
                    </div>
                  )}
                </div>

                <form
                  onSubmit={handleSubmit}
                  className="hackathon-panel p-6 sm:p-8 border border-white/10 bg-black/35 backdrop-blur-md rounded-lg space-y-6"
                >
                  <div>
                    <h2 className="font-display text-3xl text-white">Step 2: Submit Team And Payment Proof</h2>
                    <p className="mt-2 text-sm text-steel">
                      Team size must remain 3–5 members. Member 2 and Member 3 are required.
                    </p>
                  </div>

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
                        <div key={index} className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
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

                  {error && (
                    <div className="p-3 bg-red-950/40 border border-red-500/30 text-red-300 text-xs font-mono rounded">
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting || !accessToken}
                    className="btn-primary w-full py-4 text-base font-bold uppercase tracking-widest disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Registration'}
                  </button>
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
                placeholder="Or team code"
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
