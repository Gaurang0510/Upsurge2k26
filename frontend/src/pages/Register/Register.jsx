import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import useDocumentTitle from '../../hooks/useDocumentTitle.js';
import SectionHeading from '../../components/common/SectionHeading.jsx';
import Aurora from '../../components/team/Aurora.jsx';
import operationBreach from '../../data/events/operation-breach.js';
import { Lock, ShieldAlert, Terminal, Users, User, CreditCard } from 'lucide-react';
import '../Hackathon/hackathon.css';

// VITE_API_URL is baked into the production bundle by Vite.
const API_BASE_URL = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');
const MAX_PAYMENT_SCREENSHOT_BYTES = 2 * 1024 * 1024;
const PAYMENT_SCREENSHOT_TYPES = new Set(['image/png', 'image/jpeg', 'image/webp']);
const REQUIRED_PERSON_FIELDS = ['fullName', 'email', 'phone', 'department', 'year'];
const GITHUB_REPOSITORY_REGEX = /^https:\/\/github\.com\/[A-Za-z0-9-]+\/[A-Za-z0-9._-]+\/?$/;

const toDisplayableImageUrl = (url) => {
  const value = String(url || '').trim();
  const driveFileMatch = value.match(/drive\.google\.com\/file\/d\/([^/?]+)/);
  if (driveFileMatch) return `https://drive.google.com/uc?export=view&id=${driveFileMatch[1]}`;

  const driveOpenMatch = value.match(/drive\.google\.com\/open\?[^#]*\bid=([^&#]+)/);
  if (driveOpenMatch) return `https://drive.google.com/uc?export=view&id=${driveOpenMatch[1]}`;

  return value;
};

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

  const [searchParams, setSearchParams] = useSearchParams();

  // Clear query parameters to make the URL clean (e.g. removing ?event=operation-breach)
  useEffect(() => {
    if (searchParams.has('event')) {
      const newParams = new URLSearchParams(searchParams);
      newParams.delete('event');
      setSearchParams(newParams, { replace: true });
    }
  }, [searchParams, setSearchParams]);

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

  const [slots, setSlots] = useState(null);

  const fetchSlots = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/registrations/slots`);
      const data = await response.json();
      if (response.ok && data.success) {
        setSlots(data.slots);
      }
    } catch (e) {
      // ignore network errors during poll
    }
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
        if (active) {
          setEventInfo(data.event);
          if (data.event.slots) setSlots(data.event.slots);
        }
      } catch (err) {
        if (active) setEventError(err.message || 'Failed to load registration details');
      }
    };

    loadEvent();
    const interval = setInterval(fetchSlots, 15000);
    return () => {
      active = false;
      clearInterval(interval);
    };
  }, []);

  const isOfflineFull = (slots?.offline?.remaining ?? 50) === 0;
  const isOnlineFull = (slots?.online?.remaining ?? 30) === 0;

  useEffect(() => {
    if (isOfflineFull && !isOnlineFull && formData.modePreference === 'OFFLINE') {
      setFormData((prev) => ({ ...prev, modePreference: 'ONLINE_REQUEST' }));
    }
  }, [isOfflineFull, isOnlineFull, formData.modePreference]);

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
      fetchSlots();
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

  const paymentOptions = useMemo(() => {
    const configuredOptions = paymentConfig?.paymentOptions || [];
    const options = configuredOptions.length
      ? configuredOptions
      : [paymentConfig].filter(Boolean);

    return options
      .map((option) => ({
        ...option,
        qrImageUrl: toDisplayableImageUrl(option.qrImageUrl),
      }))
      .filter((option) => option.upiId || option.qrImageUrl);
  }, [paymentConfig]);

  return (
    <div className="registration-page relative w-full min-h-screen overflow-hidden pb-20">
      <div className="absolute inset-x-0 top-0 h-[800px] z-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 opacity-60">
          <Aurora colorStops={['#C1121F', '#780000', '#000000']} amplitude={1.6} speed={1.0} />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-case-black" />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-4 pt-28 sm:pt-32 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <SectionHeading
            eyebrow="SHORTLISTED TEAMS ONLY"
            title="Smackathon Confirmation"
            description="Complete team verification credentials to unlock final registration submittal."
            align="center"
          />
        </div>

        {/* Dynamic Hackathon Registration Slots HUD */}
        <div className="mb-10 hackathon-panel p-6 border border-evidence/30 bg-black/55 backdrop-blur-md rounded-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-[radial-gradient(circle,rgba(239,68,68,0.14),transparent_70%)] pointer-events-none" />
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
            <div className="flex items-center gap-3">
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-evidence opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-evidence" />
              </span>
              <div>
                <h3 className="font-mono text-xs text-white tracking-widest uppercase font-bold">Live Registration Capacity Tracker</h3>
                <p className="text-[11px] text-zinc-400 font-mono">Real-time hackathon slot availability across Offline and Online modes</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-[10px] font-mono text-zinc-400 bg-zinc-950/80 border border-zinc-800 px-3 py-1.5 rounded">
              <span>STATUS:</span>
              <span className={isOfflineFull && isOnlineFull ? 'text-red-400 font-bold' : 'text-emerald-400 font-bold'}>
                {isOfflineFull && isOnlineFull ? 'ALL SLOTS FILLED' : 'OPEN FOR REGISTRATION'}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-5">
            {/* Offline Capacity Meter */}
            <div className="bg-zinc-950/60 border border-zinc-800/80 rounded p-4 relative overflow-hidden">
              <div className="flex justify-between items-center mb-2">
                <span className="font-mono text-xs uppercase tracking-wider text-zinc-300 font-bold flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5 text-evidence" />
                  Offline Mode Capacity
                </span>
                <span className={`font-mono text-xs px-2 py-0.5 rounded font-bold ${
                  isOfflineFull ? 'bg-red-950/80 text-red-400 border border-red-500/30' : 'bg-emerald-950/80 text-emerald-400 border border-emerald-500/30'
                }`}>
                  {isOfflineFull ? '0 REMAINING (FULL)' : `${slots?.offline?.remaining ?? 50} / ${slots?.offline?.total ?? 50} SLOTS LEFT`}
                </span>
              </div>
              <div className="w-full bg-zinc-900 h-2 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-700 ${isOfflineFull ? 'bg-red-500' : 'bg-gradient-to-r from-red-600 to-amber-500'}`}
                  style={{ width: `${Math.min(100, Math.max(0, ((slots?.offline?.used ?? 0) / (slots?.offline?.total || 50)) * 100))}%` }}
                />
              </div>
              <p className="text-[10px] text-zinc-500 font-mono mt-2 flex justify-between">
                <span>Total Capacity: {slots?.offline?.total ?? 50} teams</span>
                <span>Filled: {slots?.offline?.used ?? 0}</span>
              </p>
            </div>

            {/* Online Request Capacity Meter */}
            <div className="bg-zinc-950/60 border border-zinc-800/80 rounded p-4 relative overflow-hidden">
              <div className="flex justify-between items-center mb-2">
                <span className="font-mono text-xs uppercase tracking-wider text-zinc-300 font-bold flex items-center gap-1.5">
                  <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
                  Online Request Capacity
                </span>
                <span className={`font-mono text-xs px-2 py-0.5 rounded font-bold ${
                  isOnlineFull ? 'bg-red-950/80 text-red-400 border border-red-500/30' : 'bg-emerald-950/80 text-emerald-400 border border-emerald-500/30'
                }`}>
                  {isOnlineFull ? '0 REMAINING (FULL)' : `${slots?.online?.remaining ?? 30} / ${slots?.online?.total ?? 30} SLOTS LEFT`}
                </span>
              </div>
              <div className="w-full bg-zinc-900 h-2 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-700 ${isOnlineFull ? 'bg-red-500' : 'bg-gradient-to-r from-amber-500 to-emerald-500'}`}
                  style={{ width: `${Math.min(100, Math.max(0, ((slots?.online?.used ?? 0) / (slots?.online?.total || 30)) * 100))}%` }}
                />
              </div>
              <p className="text-[10px] text-zinc-500 font-mono mt-2 flex justify-between">
                <span>Total Capacity: {slots?.online?.total ?? 30} teams</span>
                <span>Filled: {slots?.online?.used ?? 0}</span>
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.3fr_0.7fr]">
          <div className="space-y-8">
            {success ? (
              <div className="hackathon-panel p-8 border border-evidence/30 bg-black/45 backdrop-blur-md rounded-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-[radial-gradient(circle,rgba(16,185,129,0.15),transparent_60%)] pointer-events-none" />
                <span className="case-tag bg-emerald-950/40 text-emerald-400 border border-emerald-500/30 px-3 py-1">Submission Logged</span>
                <h2 className="heading-display mt-4 text-3xl text-white">Registration Processed</h2>
                
                <div className="mt-6 p-6 bg-zinc-950/60 border border-zinc-800 rounded font-mono text-sm space-y-3">
                  <div className="flex justify-between border-b border-white/5 pb-2">
                    <span className="text-zinc-500">TEAM CODE:</span>
                    <span className="text-white font-bold">{success.teamCode}</span>
                  </div>
                  <div className="flex justify-between border-b border-white/5 pb-2">
                    <span className="text-zinc-500">REGISTRATION ID:</span>
                    <span className="text-white font-bold">{success.registrationCode}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">PAYMENT STATUS:</span>
                    <span className="text-amber-400 font-bold animate-pulse">{success.paymentStatus}</span>
                  </div>
                </div>
                
                <p className="mt-4 text-sm text-steel leading-relaxed">
                  Your credentials have been loaded. The administrative panel is executing transaction receipt verification. You can track this process in real-time using the panel on the right.
                </p>

                <div className="mt-8 flex flex-wrap gap-4">
                  <Link to="/hackathon" className="btn-secondary">Return to Overview</Link>
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
                {/* Step 1: Verification Form */}
                <div className="hackathon-panel p-6 sm:p-8 border border-white/10 bg-black/35 backdrop-blur-md rounded-lg space-y-6">
                  <div className="flex items-center gap-2.5 border-b border-white/5 pb-4">
                    <div className="w-8 h-8 rounded bg-evidence/10 border border-evidence/30 flex items-center justify-center text-evidence font-mono text-sm font-bold">
                      01
                    </div>
                    <div>
                      <h2 className="font-display text-2xl text-white">Verify Team Invitation</h2>
                      <p className="text-xs text-steel">
                        Shortlisted teams verify credentials via the leader email and assigned six-digit team code.
                      </p>
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2 font-mono text-xs">
                    <div className="space-y-1">
                      <label className="block text-zinc-400 uppercase tracking-wider font-semibold">Leader Email (Unstop)</label>
                      <div className="relative">
                        <span className="absolute left-3.5 top-3.5 text-zinc-600 font-bold">&gt;</span>
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => {
                            setEmail(e.target.value);
                            setAccessToken('');
                            setVerificationMessage(null);
                            resetRegistrationDetails();
                          }}
                          placeholder="e.g. teamleader@gmail.com"
                          className="w-full bg-zinc-950/60 border border-zinc-800 text-white pl-8 pr-4 py-3 font-mono text-sm focus:outline-none focus:border-evidence focus:ring-1 focus:ring-evidence rounded transition-all placeholder-zinc-700 font-mono"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-1">
                      <label className="block text-zinc-400 uppercase tracking-wider font-semibold">Verification Team Code</label>
                      <div className="relative">
                        <span className="absolute left-3.5 top-3.5 text-zinc-600 font-bold">&gt;</span>
                        <input
                          type="text"
                          value={teamCode}
                          onChange={(e) => {
                            setTeamCode(e.target.value.toUpperCase());
                            setAccessToken('');
                            setVerificationMessage(null);
                            resetRegistrationDetails();
                          }}
                          placeholder="e.g. SM-A4E2"
                          className="w-full bg-zinc-950/60 border border-zinc-800 text-white pl-8 pr-4 py-3 font-mono text-sm focus:outline-none focus:border-evidence focus:ring-1 focus:ring-evidence rounded transition-all placeholder-zinc-700 font-mono"
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    disabled={isSubmitting || !email || !teamCode}
                    onClick={verifyInvitation}
                    className="btn-primary w-full sm:w-auto py-3 px-6 text-xs tracking-widest disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Verifying...' : 'Verify Team Credentials'}
                  </button>

                  {verificationMessage && (
                    <div
                      className={`p-4 border rounded font-mono text-xs flex gap-2 items-start ${
                        verificationMessage.type === 'success'
                          ? 'bg-emerald-950/30 border-emerald-500/30 text-emerald-300'
                          : 'bg-red-950/40 border-red-500/30 text-red-300'
                      }`}
                    >
                      <ShieldAlert className="w-4 h-4 flex-shrink-0 mt-0.5" />
                      <span>{verificationMessage.text}</span>
                    </div>
                  )}
                </div>

                {/* Step 2: Form Submission */}
                <div className="relative">
                  {!accessToken && (
                    <div className="absolute inset-0 bg-zinc-950/80 backdrop-blur-[2px] z-30 flex flex-col items-center justify-center rounded-lg p-6 border border-white/5 text-center">
                      <div className="w-16 h-16 rounded-full bg-evidence/10 border border-evidence/30 flex items-center justify-center text-evidence mb-4 animate-pulse">
                        <Lock className="w-6 h-6" />
                      </div>
                      <h3 className="font-display text-xl text-white uppercase tracking-wider">Step 2 Locked</h3>
                      <p className="mt-2 text-xs text-zinc-400 max-w-sm font-mono leading-relaxed">
                        Security verification pending. Please verify your shortlisted team credentials in Step 1 to unlock the registration pipeline.
                      </p>
                    </div>
                  )}

                  <form
                    onSubmit={handleSubmit}
                    className={`hackathon-panel p-6 sm:p-8 border border-white/10 bg-black/35 backdrop-blur-md rounded-lg space-y-6 ${!accessToken ? 'opacity-40' : ''}`}
                  >
                    <div className="flex items-center gap-2.5 border-b border-white/5 pb-4">
                      <div className="w-8 h-8 rounded bg-evidence/10 border border-evidence/30 flex items-center justify-center text-evidence font-mono text-sm font-bold">
                        02
                      </div>
                      <div>
                        <h2 className="font-display text-2xl text-white">Operative Profile Submission</h2>
                        <p className="text-xs text-steel">
                          Submit project metadata, leader contact channels, and core team member registers.
                        </p>
                      </div>
                    </div>

                    <fieldset disabled={!accessToken || isSubmitting} className="space-y-8">
                      {/* Section A: Team Info */}
                      <div className="space-y-4">
                        <h3 className="font-mono text-xs font-bold text-evidence uppercase tracking-widest">{"// TEAM PREFERENCES"}</h3>
                        <div className="grid gap-4 sm:grid-cols-2">
                          <div className="space-y-1">
                            <label className="block text-[10px] font-mono text-zinc-400 uppercase tracking-wider">Team Name</label>
                            <input
                              type="text"
                              value={formData.teamName}
                              onChange={(e) => setFormData((prev) => ({ ...prev, teamName: e.target.value }))}
                              placeholder="e.g. CyberShield"
                              className="w-full bg-zinc-950/60 border border-zinc-800 text-white p-3 font-mono text-xs focus:outline-none focus:border-evidence rounded transition-all placeholder-zinc-700"
                              required
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="block text-[10px] font-mono text-zinc-400 uppercase tracking-wider">College / Institution</label>
                            <input
                              type="text"
                              value={formData.collegeName}
                              onChange={(e) => setFormData((prev) => ({ ...prev, collegeName: e.target.value }))}
                              placeholder="e.g. YCCE, Nagpur"
                              className="w-full bg-zinc-950/60 border border-zinc-800 text-white p-3 font-mono text-xs focus:outline-none focus:border-evidence rounded transition-all placeholder-zinc-700"
                              required
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="block text-[10px] font-mono text-zinc-400 uppercase tracking-wider">Selected Track</label>
                            <select
                              value={formData.problemStatement}
                              onChange={(e) => setFormData((prev) => ({ ...prev, problemStatement: e.target.value }))}
                              className="w-full bg-zinc-950/60 border border-zinc-800 text-white p-3 font-mono text-xs focus:outline-none focus:border-evidence rounded transition-all"
                              required
                            >
                              <option value="">Select problem statement</option>
                              {problemStatements.map((track) => (
                                <option key={track.value} value={track.value}>
                                  {track.label}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div className="space-y-1">
                            <div className="flex justify-between items-center">
                              <label className="block text-[10px] font-mono text-zinc-400 uppercase tracking-wider">Preferred Mode</label>
                              <span className="text-[10px] font-mono text-evidence">
                                {formData.modePreference === 'OFFLINE'
                                  ? `${slots?.offline?.remaining ?? 50} OFFLINE SLOTS LEFT`
                                  : `${slots?.online?.remaining ?? 30} ONLINE SLOTS LEFT`}
                              </span>
                            </div>
                            <select
                              value={formData.modePreference}
                              onChange={(e) => setFormData((prev) => ({ ...prev, modePreference: e.target.value }))}
                              className="w-full bg-zinc-950/60 border border-zinc-800 text-white p-3 font-mono text-xs focus:outline-none focus:border-evidence rounded transition-all"
                            >
                              <option value="OFFLINE" disabled={isOfflineFull}>
                                {isOfflineFull ? 'Offline (FULL - 0/50 Remaining)' : `Offline (${slots?.offline?.remaining ?? 50} Slots Available)`}
                              </option>
                              <option value="ONLINE_REQUEST" disabled={isOnlineFull}>
                                {isOnlineFull ? 'Online Request (FULL - 0/30 Remaining)' : `Online Request (${slots?.online?.remaining ?? 30} Slots Available)`}
                              </option>
                            </select>
                            {isOfflineFull && (
                              <p className="text-[11px] font-mono text-amber-400 mt-1">
                                ⚠️ 50/50 Offline registration slots have been filled. You can register for Online Request mode.
                              </p>
                            )}
                          </div>

                          <div className="sm:col-span-2 space-y-1">
                            <label className="block text-[10px] font-mono text-zinc-400 uppercase tracking-wider">GitHub Project Repository</label>
                            <p className="text-[11px] text-steel font-mono leading-relaxed pb-1">
                              Initialize a repository containing your project code and link it below. Keep this accessible for review.
                            </p>
                            <input
                              type="url"
                              value={formData.githubRepositoryUrl}
                              onChange={(e) => setFormData((prev) => ({ ...prev, githubRepositoryUrl: e.target.value }))}
                              placeholder="e.g. https://github.com/username/project-repository"
                              pattern="https://github\.com/[A-Za-z0-9-]+/[A-Za-z0-9._-]+/?"
                              className="w-full bg-zinc-950/60 border border-zinc-800 text-white p-3 font-mono text-xs focus:outline-none focus:border-evidence rounded transition-all placeholder-zinc-700"
                              required
                            />
                          </div>
                        </div>
                      </div>

                      {/* Section B: Leader Details */}
                      <div className="border-t border-white/5 pt-6 space-y-4">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-evidence" />
                          <h3 className="font-mono text-xs font-bold text-white uppercase tracking-widest">TEAM LEADER</h3>
                        </div>
                        
                        <div className="grid gap-4 sm:grid-cols-2">
                          <div className="space-y-1">
                            <label className="block text-[10px] font-mono text-zinc-400 uppercase tracking-wider">Leader Full Name</label>
                            <input 
                              type="text" 
                              value={formData.leader.fullName} 
                              onChange={(e) => handleLeaderChange('fullName', e.target.value)} 
                              placeholder="e.g. Alex Mercer" 
                              className="w-full bg-zinc-950/60 border border-zinc-800 text-white p-3 font-mono text-xs rounded focus:outline-none focus:border-evidence transition-all placeholder-zinc-700" 
                              required 
                            />
                          </div>
                          
                          <div className="space-y-1">
                            <label className="block text-[10px] font-mono text-zinc-500 uppercase tracking-wider">Verified Email (Read-Only)</label>
                            <input 
                              type="email" 
                              value={formData.leader.email} 
                              readOnly 
                              className="w-full bg-zinc-950/20 border border-zinc-900 text-zinc-500 p-3 font-mono text-xs rounded cursor-not-allowed" 
                              required 
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="block text-[10px] font-mono text-zinc-400 uppercase tracking-wider">Leader Phone Number</label>
                            <input 
                              type="tel" 
                              value={formData.leader.phone} 
                              onChange={(e) => handleLeaderChange('phone', e.target.value)} 
                              placeholder="e.g. 9876543210" 
                              className="w-full bg-zinc-950/60 border border-zinc-800 text-white p-3 font-mono text-xs rounded focus:outline-none focus:border-evidence transition-all placeholder-zinc-700" 
                              required 
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="block text-[10px] font-mono text-zinc-400 uppercase tracking-wider">Leader Department</label>
                            <input 
                              type="text" 
                              value={formData.leader.department} 
                              onChange={(e) => handleLeaderChange('department', e.target.value)} 
                              placeholder="e.g. Computer Science" 
                              className="w-full bg-zinc-950/60 border border-zinc-800 text-white p-3 font-mono text-xs rounded focus:outline-none focus:border-evidence transition-all placeholder-zinc-700" 
                              required 
                            />
                          </div>

                          <div className="space-y-1 sm:col-span-2">
                            <label className="block text-[10px] font-mono text-zinc-400 uppercase tracking-wider">Leader Academic Year</label>
                            <input 
                              type="text" 
                              value={formData.leader.year} 
                              onChange={(e) => handleLeaderChange('year', e.target.value)} 
                              placeholder="e.g. 3rd Year (VI Sem)" 
                              className="w-full bg-zinc-950/60 border border-zinc-800 text-white p-3 font-mono text-xs rounded focus:outline-none focus:border-evidence transition-all placeholder-zinc-700" 
                              required 
                            />
                          </div>
                        </div>
                      </div>

                      {/* Section C: Team Members */}
                      <div className="border-t border-white/5 pt-6 space-y-4">
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-evidence" />
                          <h3 className="font-mono text-xs font-bold text-white uppercase tracking-widest">TEAM OPERATIVES</h3>
                        </div>
                        <p className="text-[11px] text-steel font-mono leading-relaxed">
                          SMACKATHON limits team rosters to 3–5 members. Operatives 02 & 03 are required registers.
                        </p>

                        <div className="grid gap-6 md:grid-cols-2">
                          {formData.members.map((member, index) => {
                            const isRequired = index < 2;
                            return (
                              <div 
                                key={index} 
                                className={`p-4 border rounded-md transition-all duration-300 ${
                                  isRequired 
                                    ? 'bg-zinc-950/30 border-evidence/25 hover:border-evidence/50' 
                                    : 'bg-zinc-950/15 border-white/5 hover:border-white/10'
                                }`}
                              >
                                <div className="flex justify-between items-center mb-3 border-b border-white/5 pb-2">
                                  <span className="font-mono text-[10px] font-bold text-white uppercase">
                                    Operative 0{index + 2}
                                  </span>
                                  <span className={`font-mono text-[9px] px-2 py-0.5 rounded uppercase border ${
                                    isRequired 
                                      ? 'bg-evidence/15 text-evidence border-evidence/25' 
                                      : 'bg-zinc-900 text-zinc-500 border-zinc-800'
                                  }`}>
                                    {isRequired ? 'Required' : 'Optional'}
                                  </span>
                                </div>

                                <div className="space-y-3 text-[10px] font-mono">
                                  <div className="space-y-1">
                                    <label className="block text-zinc-400 uppercase">Full Name</label>
                                    <input 
                                      type="text" 
                                      value={member.fullName} 
                                      onChange={(e) => handleMemberChange(index, 'fullName', e.target.value)} 
                                      placeholder="e.g. John Doe" 
                                      className="w-full bg-zinc-900/60 border border-zinc-800 text-white px-3 py-2 text-xs focus:outline-none focus:border-evidence rounded transition-all placeholder-zinc-800"
                                      required={isRequired} 
                                    />
                                  </div>

                                  <div className="space-y-1">
                                    <label className="block text-zinc-400 uppercase">Email Address</label>
                                    <input 
                                      type="email" 
                                      value={member.email} 
                                      onChange={(e) => handleMemberChange(index, 'email', e.target.value)} 
                                      placeholder="e.g. op@college.edu" 
                                      className="w-full bg-zinc-900/60 border border-zinc-800 text-white px-3 py-2 text-xs focus:outline-none focus:border-evidence rounded transition-all placeholder-zinc-800"
                                      required={isRequired} 
                                    />
                                  </div>

                                  <div className="space-y-1">
                                    <label className="block text-zinc-400 uppercase">Phone Number</label>
                                    <input 
                                      type="tel" 
                                      value={member.phone} 
                                      onChange={(e) => handleMemberChange(index, 'phone', e.target.value)} 
                                      placeholder="e.g. 9876543210" 
                                      className="w-full bg-zinc-900/60 border border-zinc-800 text-white px-3 py-2 text-xs focus:outline-none focus:border-evidence rounded transition-all placeholder-zinc-800"
                                      required={isRequired} 
                                    />
                                  </div>

                                  <div className="grid grid-cols-2 gap-2">
                                    <div className="space-y-1">
                                      <label className="block text-zinc-400 uppercase">Dept</label>
                                      <input 
                                        type="text" 
                                        value={member.department} 
                                        onChange={(e) => handleMemberChange(index, 'department', e.target.value)} 
                                        placeholder="e.g. CSE" 
                                        className="w-full bg-zinc-900/60 border border-zinc-800 text-white px-2 py-2 text-xs focus:outline-none focus:border-evidence rounded transition-all placeholder-zinc-800"
                                        required={isRequired} 
                                      />
                                    </div>
                                    <div className="space-y-1">
                                      <label className="block text-zinc-400 uppercase">Year</label>
                                      <input 
                                        type="text" 
                                        value={member.year} 
                                        onChange={(e) => handleMemberChange(index, 'year', e.target.value)} 
                                        placeholder="e.g. 3rd" 
                                        className="w-full bg-zinc-900/60 border border-zinc-800 text-white px-2 py-2 text-xs focus:outline-none focus:border-evidence rounded transition-all placeholder-zinc-800"
                                        required={isRequired} 
                                      />
                                    </div>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Section D: Payment Receipt */}
                      <div className="border-t border-white/5 pt-6 space-y-4">
                        <div className="flex items-center gap-2">
                          <CreditCard className="w-4 h-4 text-evidence" />
                          <h3 className="font-mono text-xs font-bold text-white uppercase tracking-widest">TRANSACTION SIGNATURE</h3>
                        </div>

                        <div className="bg-red-950/20 border border-red-500/30 rounded p-4 flex gap-3 text-xs text-red-300 font-mono">
                          <ShieldAlert className="w-5 h-5 flex-shrink-0 text-evidence animate-pulse" />
                          <div>
                            <strong className="text-white">WARNING // VERIFICATION MONITORING:</strong> False or duplicate UTR entries will be flagged. Attempting transaction fraud will result in automatic team elimination and registration blacklist.
                          </div>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                          <div className="space-y-1">
                            <label className="block text-[10px] font-mono text-zinc-400 uppercase tracking-wider">UTR / Transaction ID</label>
                            <input
                              type="text"
                              value={formData.utr}
                              onChange={(e) => setFormData((prev) => ({ ...prev, utr: e.target.value.toUpperCase() }))}
                              placeholder="e.g. 12-digit transaction UTR code"
                              className="w-full bg-zinc-950/60 border border-zinc-800 text-white p-3 font-mono text-xs rounded focus:outline-none focus:border-evidence transition-all placeholder-zinc-700"
                              minLength={8}
                              maxLength={32}
                              pattern="[A-Za-z0-9-]{8,32}"
                              required
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="block text-[10px] font-mono text-zinc-400 uppercase tracking-wider">Screenshot Receipt Upload</label>
                            <input
                              type="file"
                              accept="image/png,image/jpeg,image/webp"
                              onChange={(e) => setFormData((prev) => ({ ...prev, paymentScreenshot: e.target.files?.[0] || null }))}
                              className="w-full bg-zinc-950/60 border border-zinc-800 text-white p-2 font-mono text-xs rounded focus:outline-none focus:border-evidence transition-all file:mr-3 file:py-1 file:px-3 file:rounded file:border-0 file:text-[10px] file:bg-evidence file:text-white hover:file:bg-evidence/80 file:cursor-pointer"
                              required
                            />
                          </div>
                        </div>
                      </div>

                      {registrationError && (
                        <div className="p-3 bg-red-950/40 border border-red-500/30 text-red-300 text-xs font-mono rounded flex gap-2">
                          <ShieldAlert className="w-4 h-4 flex-shrink-0" />
                          <span>{registrationError}</span>
                        </div>
                      )}

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="btn-primary w-full py-4 text-sm font-bold uppercase tracking-widest disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSubmitting ? 'LOGGING SUBMISSION...' : 'SUBMIT REGISTRATION DOSSIER'}
                      </button>
                    </fieldset>
                  </form>
                </div>
              </>
            )}
          </div>

          {/* Right Column panels */}
          <div className="space-y-8">
            <div className="hackathon-panel p-6 border border-white/10 bg-black/35 backdrop-blur-md rounded-lg space-y-4">
              <div className="flex items-center gap-2 border-b border-white/5 pb-3">
                <CreditCard className="w-5 h-5 text-evidence" />
                <h2 className="font-display text-2xl text-white">Payment Details</h2>
              </div>
              
              {eventError ? (
                <p className="text-xs text-red-300 font-mono">{eventError}</p>
              ) : (
                <>
                  <div className="space-y-2.5 font-mono text-xs text-steel">
                    <div className="flex justify-between border-b border-white/5 pb-1">
                      <span>FEE AMOUNT:</span>
                      <span className="text-white font-bold">₹{eventInfo?.feeInINR ?? 599} INR</span>
                    </div>
                    <div className="flex justify-between border-b border-white/5 pb-1">
                      <span>TEAM QUOTA:</span>
                      <span>{eventInfo?.teamSize?.min ?? 3} - {eventInfo?.teamSize?.max ?? 5} OPERATIVES</span>
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    {paymentOptions.map((option, index) => (
                      <div key={`${option.upiId}-${index}`} className="space-y-3 rounded-md border border-white/10 bg-zinc-950/50 p-3">
                        <div className="space-y-1.5 font-mono text-[11px] text-steel">
                          <p className="text-[10px] font-bold uppercase tracking-widest text-evidence">Payment Option {index + 1}</p>
                          <p className="break-all"><span className="text-zinc-500">UPI ID: </span><span className="select-all text-white">{option.upiId || 'Not configured'}</span></p>
                          {option.payeeName && <p><span className="text-zinc-500">PAYEE: </span><span className="text-white">{option.payeeName}</span></p>}
                        </div>
                        {option.qrImageUrl ? (
                          <div className="bg-white p-2 rounded">
                            <img
                              src={option.qrImageUrl}
                              alt={`Smackathon payment QR option ${index + 1}`}
                              className="w-full h-auto mx-auto"
                            />
                          </div>
                        ) : (
                          <p className="font-mono text-[10px] text-zinc-500">QR image not configured.</p>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-white/5 pt-3 space-y-2">
                     <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest block font-bold">{"// UPLOAD PROCEDURES"}</span>
                    <ul className="space-y-1.5 text-[10px] text-steel font-mono">
                      {(paymentConfig?.instructions || []).map((item) => (
                        <li key={item} className="flex gap-2">
                          <span className="text-evidence">›</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </>
              )}
            </div>

            {/* Check Status Form */}
            <form
              onSubmit={checkStatus}
              className="hackathon-panel p-6 border border-white/10 bg-black/35 backdrop-blur-md rounded-lg space-y-4"
            >
              <div className="flex items-center gap-2 border-b border-white/5 pb-3">
                <Terminal className="w-5 h-5 text-evidence" />
                <h2 className="font-display text-2xl text-white">Console Query</h2>
              </div>
              
              <p className="text-[10px] text-steel font-mono">
                Query team registration and transaction logs.
              </p>

              <div className="space-y-3 font-mono text-xs">
                <div className="space-y-1">
                  <label className="block text-zinc-400 uppercase font-semibold">Leader Email</label>
                  <input
                    type="email"
                    value={statusLookup.email}
                    onChange={(e) => setStatusLookup((prev) => ({ ...prev, email: e.target.value }))}
                    placeholder="e.g. leader@college.edu"
                    className="w-full bg-zinc-950/60 border border-zinc-800 text-white p-3 font-mono text-sm rounded focus:outline-none focus:border-evidence transition-all placeholder-zinc-700"
                  />
                </div>
                
                <div className="space-y-1">
                  <label className="block text-zinc-400 uppercase font-semibold">Team Code</label>
                  <input
                    type="text"
                    value={statusLookup.teamCode}
                    onChange={(e) => setStatusLookup((prev) => ({ ...prev, teamCode: e.target.value.toUpperCase() }))}
                    placeholder="e.g. SM-A4E2"
                    className="w-full bg-zinc-950/60 border border-zinc-800 text-white p-3 font-mono text-sm rounded focus:outline-none focus:border-evidence transition-all placeholder-zinc-700"
                  />
                </div>
              </div>

              {statusError && (
                <div className="p-2.5 bg-red-950/40 border border-red-500/30 text-red-300 text-xs font-mono rounded">
                  {statusError}
                </div>
              )}

              {statusResult && (
                <div className="p-4 bg-zinc-950/60 border border-zinc-800 rounded font-mono text-xs space-y-2">
                  <div className="flex justify-between border-b border-white/5 pb-1">
                    <span className="text-zinc-500">TEAM:</span>
                    <span className="text-white font-bold">{statusResult.team.teamName}</span>
                  </div>
                  <div className="flex justify-between border-b border-white/5 pb-1">
                    <span className="text-zinc-500">CODE:</span>
                    <span className="text-white font-bold">{statusResult.team.teamCode}</span>
                  </div>
                  <div className="flex justify-between border-b border-white/5 pb-1">
                    <span className="text-zinc-500">LOG STATUS:</span>
                    <span className="text-white font-bold">{statusResult.team.status}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">TRANSACTION:</span>
                    <span className="text-amber-400 font-bold">{statusResult.registration?.paymentStatus || 'PENDING'}</span>
                  </div>
                  {statusResult.team.paymentReviewReason && (
                    <div className="mt-2 p-2 bg-red-950/20 border border-red-500/20 text-red-300 rounded">
                      <strong>NOTE:</strong> {statusResult.team.paymentReviewReason}
                    </div>
                  )}
                </div>
              )}

              <button type="submit" className="btn-secondary w-full py-3 text-xs uppercase tracking-wider font-bold">Query Log Registry</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
