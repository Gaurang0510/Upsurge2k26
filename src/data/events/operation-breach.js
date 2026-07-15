/**
 * EVENT DATA FILE — one file per event, by design.
 * This keeps every event's data isolated so two team members editing
 * different events never touch the same lines == no merge conflicts.
 * See /docs/GIT_WORKFLOW.md for the reasoning.
 *
 * Schema reference (used by every file in this folder):
 * {
 *   id, slug, caseNumber, name, tagline, category, format, teamSize, duration,
 *   description, highlights[], rules[], rounds[{title, description}],
 *   prize: { first, second, third, currency },
 *   coordinators: [{ name, phone }],
 *   venue, date, registrationLink,
 *   image, thumbnail,
 *   isFlagship, pagePath  // flagship events get their own dedicated route
 * }
 */
export default {
  id: 'operation-breach',
  slug: 'operation-breach',
  caseNumber: 'CASE-01',
  name: 'Operation Breach',
  formerlyKnownAs: 'Hackathon',
  tagline: 'Crack the system before the system cracks you.',
  category: 'Flagship',
  format: '24-Hour Hackathon',
  teamSize: '2–4 Operatives',
  duration: '24 Hours',
  description:
    'The department goes dark for 24 hours. Your crew is dropped a case file, a set of tracks, and a deadline — build a working solution from zero before the clock runs out. No shortcuts, no leaks, just your team and the terminal.',
  highlights: [
    'Real mentorship check-ins throughout the night',
    'Live leaderboard and surprise twist briefings',
    'Top teams get a shot at incubation support',
  ],
  rules: [
    'Teams of 2 to 4 operatives, cross-branch teams welcome.',
    'All code must be written during the 24-hour window — no pre-built projects.',
    'Use of open-source libraries and public APIs is allowed and encouraged.',
    'Each team must check in at every mentor round to stay eligible for judging.',
  ],
  tracks: [
    {
      code: 'FILE-01',
      name: 'Education',
      brief: 'Case files on access to learning — tools that make education reach further and land better.',
    },
    {
      code: 'FILE-02',
      name: 'Healthcare',
      brief: 'Evidence for public health gaps — wellness, access, and early-warning systems.',
    },
    {
      code: 'FILE-03',
      name: 'Environment',
      brief: 'Field reports on sustainability — tech that leaves less of a trace.',
    },
    {
      code: 'FILE-04',
      name: 'FinTech',
      brief: 'Follow the money — secure transactions, financial inclusion, fraud defense.',
    },
    {
      code: 'FILE-05',
      name: 'Cyber Defense',
      brief: 'Privacy, security, and decentralization — protect the system from the inside.',
    },
    {
      code: 'FILE-06',
      name: 'AgriTech',
      brief: 'Ground-level intelligence for farming — efficiency and sustainability in the field.',
    },
    {
      code: 'FILE-07',
      name: 'Open Case',
      brief: 'No track fits? Bring your own lead. Any domain, any approach, wide open.',
    },
  ],
  assessmentCriteria: [
    { title: 'Quality of the build', detail: 'Code quality, design, and overall execution.' },
    { title: 'Timeliness', detail: 'Hitting every checkpoint within the window.' },
    { title: 'Participation', detail: 'Engagement with mentors and fellow teams.' },
    { title: 'Originality', detail: 'A genuinely fresh angle on the problem.' },
  ],
  faqs: [
    {
      q: 'What is Operation Breach?',
      a: 'A 24-hour, on-campus hackathon where teams build a working prototype against one of the seven case tracks.',
    },
    {
      q: 'Do I need a full team to register?',
      a: 'No — solo and partial-team registrations are open. We run a team-formation session before the event starts.',
    },
    {
      q: 'Is accommodation available for outstation teams?',
      a: 'Yes, limited on-campus stay is available on request during registration. TBD — confirm with the Event Management lead.',
    },
    {
      q: 'When is the problem statement released?',
      a: 'Tracks are public ahead of time; the specific twist/problem statement drops at the opening briefing.',
    },
  ],
  prize: { first: 'TBD', second: 'TBD', third: 'TBD', currency: '₹' },
  coordinators: [
    { name: 'TBD', phone: 'TBD' },
    { name: 'TBD', phone: 'TBD' },
  ],
  venue: 'CSE Department, YCCE, Wanadongri, Nagpur',
  date: 'TBD',
  registrationLink: '#',
  image: '/images/events/operation-breach/cover.jpg',
  thumbnail: '/images/events/operation-breach/thumb.jpg',
  isFlagship: true,
  pagePath: '/hackathon',
};
