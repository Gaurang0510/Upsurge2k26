import { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import useDocumentTitle from '../../hooks/useDocumentTitle.js';
import { events } from '../../data/events/index.js';
import SectionHeading from '../../components/common/SectionHeading.jsx';
import Aurora from '../../components/team/Aurora.jsx';

export default function Register() {
  useDocumentTitle('Case Entry — Register');
  const location = useLocation();

  // Parse event from query parameter e.g. /register?event=operation-breach
  const queryParams = new URLSearchParams(location.search);
  const initialEventSlug = queryParams.get('event') || 'operation-breach';

  const [selectedEventSlug, setSelectedEventSlug] = useState(initialEventSlug);
  const [formData, setFormData] = useState({
    leaderName: '',
    leaderEmail: '',
    leaderPhone: '',
    collegeName: '',
    teamName: '',
    members: ['', '', '', ''], // Member 2, 3, 4, 5
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [caseCode, setCaseCode] = useState('');

  // Find active event details
  const activeEvent = events.find((e) => e.slug === selectedEventSlug) || events[0];
  const isTeamEvent = activeEvent ? !activeEvent.teamSize.toLowerCase().includes('solo') : true;

  // Sync selected event if query param changes
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const eventParam = params.get('event');
    if (eventParam) {
      setSelectedEventSlug(eventParam);
    }
  }, [location.search]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleMemberChange = (index, value) => {
    setFormData((prev) => {
      const newMembers = [...prev.members];
      newMembers[index] = value;
      return { ...prev, members: newMembers };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate submission delay
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      // Generate a themed case tracking code
      const randNum = Math.floor(1000 + Math.random() * 9000);
      setCaseCode(`UP-${activeEvent.caseNumber.split('-')[1] || 'REG'}-${randNum}`);
    }, 1500);
  };

  return (
    <div className="relative w-full min-h-screen overflow-hidden pb-20">
      {/* Background Aurora Shader */}
      <div className="absolute inset-x-0 top-0 h-[800px] z-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 opacity-60">
          <Aurora
            colorStops={['#C1121F', '#780000', '#000000']}
            amplitude={1.6}
            speed={1.0}
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-case-black" />
      </div>

      <div className="relative z-10 mx-auto max-w-3xl px-4 pt-28 sm:pt-32 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <SectionHeading
            eyebrow="Decryption Portal"
            title="Initialize Registration"
            description="Log your credentials into the UPSURGE 2K26 system to secure your event slot."
            align="center"
          />
        </div>

        {isSuccess ? (
          <div className="hackathon-panel p-8 text-center max-w-xl mx-auto border border-evidence/30 bg-black/40 backdrop-blur-md rounded-lg">
            <span className="case-tag">Case Logged</span>
            <h2 className="heading-display mt-4 text-3xl text-white">Registration Received</h2>
            <div className="mt-6 p-4 bg-ink/75 border border-white/5 font-mono text-left rounded">
              <p className="text-sm text-green-500 font-bold mb-2">&gt; CONNECTION SECURED...</p>
              <p className="text-sm text-steel">
                <strong className="text-white">Event:</strong> {activeEvent.name}
              </p>
              <p className="text-sm text-steel">
                <strong className="text-white">Leader:</strong> {formData.leaderName}
              </p>
              {isTeamEvent && (
                <p className="text-sm text-steel">
                  <strong className="text-white">Team Name:</strong> {formData.teamName}
                </p>
              )}
              <p className="text-sm text-steel mt-2">
                <strong className="text-white">Case Reference:</strong>{' '}
                <span className="text-evidence font-bold">{caseCode}</span>
              </p>
              <p className="text-xs text-steel/70 mt-4">
                * An encryption confirmation receipt has been scheduled for dispatch to {formData.leaderEmail}. Keep your case reference safe for campus check-in.
              </p>
            </div>

            <div className="mt-8 flex justify-center gap-4">
              <Link to="/events" className="btn-secondary">
                View Other Events
              </Link>
              <Link to="/" className="btn-primary">
                Return to HQ
              </Link>
            </div>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="hackathon-panel p-6 sm:p-8 border border-white/10 bg-black/35 backdrop-blur-md rounded-lg space-y-6"
          >
            {/* Event Selection */}
            <div>
              <label className="block font-mono text-xs uppercase tracking-wider text-steel mb-2">
                Select Case / Event
              </label>
              <select
                value={selectedEventSlug}
                onChange={(e) => setSelectedEventSlug(e.target.value)}
                className="w-full bg-ink/60 border border-white/10 text-white p-3 font-mono text-sm focus:outline-none focus:border-evidence focus:ring-1 focus:ring-evidence rounded cursor-pointer"
              >
                {events.map((event) => (
                  <option key={event.slug} value={event.slug} className="bg-case-black">
                    {event.name} ({event.category})
                  </option>
                ))}
              </select>
              {activeEvent && (
                <div className="mt-2 flex items-center justify-between text-xs font-mono text-steel">
                  <span>Size: {activeEvent.teamSize}</span>
                  <span>Venue: {activeEvent.venue}</span>
                </div>
              )}
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              {/* Leader Name */}
              <div>
                <label className="block font-mono text-xs uppercase tracking-wider text-steel mb-2">
                  Full Name {isTeamEvent && '(Team Leader)'}
                </label>
                <input
                  type="text"
                  name="leaderName"
                  required
                  value={formData.leaderName}
                  onChange={handleInputChange}
                  placeholder="e.g. John Doe"
                  className="w-full bg-ink/60 border border-white/10 text-white p-3 font-mono text-sm focus:outline-none focus:border-evidence focus:ring-1 focus:ring-evidence rounded"
                />
              </div>

              {/* College Name */}
              <div>
                <label className="block font-mono text-xs uppercase tracking-wider text-steel mb-2">
                  College / Institution Name
                </label>
                <input
                  type="text"
                  name="collegeName"
                  required
                  value={formData.collegeName}
                  onChange={handleInputChange}
                  placeholder="e.g. YCCE, Nagpur"
                  className="w-full bg-ink/60 border border-white/10 text-white p-3 font-mono text-sm focus:outline-none focus:border-evidence focus:ring-1 focus:ring-evidence rounded"
                />
              </div>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              {/* Leader Email */}
              <div>
                <label className="block font-mono text-xs uppercase tracking-wider text-steel mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  name="leaderEmail"
                  required
                  value={formData.leaderEmail}
                  onChange={handleInputChange}
                  placeholder="e.g. john@example.com"
                  className="w-full bg-ink/60 border border-white/10 text-white p-3 font-mono text-sm focus:outline-none focus:border-evidence focus:ring-1 focus:ring-evidence rounded"
                />
              </div>

              {/* Leader Phone */}
              <div>
                <label className="block font-mono text-xs uppercase tracking-wider text-steel mb-2">
                  Contact / Phone Number
                </label>
                <input
                  type="tel"
                  name="leaderPhone"
                  required
                  value={formData.leaderPhone}
                  onChange={handleInputChange}
                  placeholder="e.g. +91 9876543210"
                  className="w-full bg-ink/60 border border-white/10 text-white p-3 font-mono text-sm focus:outline-none focus:border-evidence focus:ring-1 focus:ring-evidence rounded"
                />
              </div>
            </div>

            {/* Team details if applicable */}
            {isTeamEvent && (
              <div className="border-t border-white/10 pt-6 space-y-6">
                <div>
                  <label className="block font-mono text-xs uppercase tracking-wider text-steel mb-2">
                    Team Name
                  </label>
                  <input
                    type="text"
                    name="teamName"
                    required={isTeamEvent}
                    value={formData.teamName}
                    onChange={handleInputChange}
                    placeholder="e.g. Cyber Ninjas"
                    className="w-full bg-ink/60 border border-white/10 text-white p-3 font-mono text-sm focus:outline-none focus:border-evidence focus:ring-1 focus:ring-evidence rounded"
                  />
                </div>

                <div>
                  <span className="block font-mono text-xs uppercase tracking-wider text-steel mb-3">
                    Team Members Details (Optional for Registration Initializing)
                  </span>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {formData.members.map((member, index) => (
                      <div key={index}>
                        <label className="block font-mono text-[10px] uppercase tracking-wider text-steel/70 mb-1">
                          Member {index + 2} Full Name
                        </label>
                        <input
                          type="text"
                          value={member}
                          onChange={(e) => handleMemberChange(index, e.target.value)}
                          placeholder={`Member ${index + 2} Name`}
                          className="w-full bg-ink/60 border border-white/10 text-white p-3 font-mono text-xs focus:outline-none focus:border-evidence focus:ring-1 focus:ring-evidence rounded"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary w-full py-4 text-base font-bold uppercase tracking-widest disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Securing Connection...' : 'INITIALIZE REGISTRATION'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
