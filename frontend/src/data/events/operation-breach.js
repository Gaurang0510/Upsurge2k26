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
  name: 'SMACKATHON 2K26',
  formerlyKnownAs: 'Hackathon',
  tagline: 'A multi-stage innovation hackathon for the best student innovators.',
  category: 'Flagship',
  format: 'Multi-stage Hackathon',
  teamSize: '3–5 Members',
  duration: '16 Jul – 7 Aug',
  description:
    'SMACKATHON 2K26 is a multi-stage innovation hackathon designed to identify, nurture, and showcase the best student innovators across the country. The event follows a structured selection process beginning with an online idea evaluation and culminating in an offline Grand Finale where shortlisted teams present fully functional prototypes.',
  highlights: [
    'Round 0 is completely free for all teams',
    '₹599 offline participation fee per team (only for shortlisted teams)',
    'Accommodation is optional and comes with additional charges per member',
    'On-demand online participation available for shortlisted teams with valid reasons',
    'Only the Top teams from Round 1 proceed to the Grand Finale',
  ],
  rules: [
    'Each team must consist of 3–5 members.',
    'A participant may be part of only one team.',
    'All submitted ideas and prototypes must be original.',
    'Use of open-source libraries is permitted with proper attribution.',
    'Shortlisted teams must complete offline registration on our official platform before the deadline.',
    'Accommodation will be provided only to teams that opt for it during offline registration on our official platform.',
    'Online participation is granted only on request, with valid supporting proof, subject to limited slot availability; approval is at the organizers\' discretion.',
    'Teams must carry valid student ID cards during offline rounds.',
    'Projects must be developed around the chosen problem statement.',
    'Teams must regularly push code to the designated Git repository.',
    'Judges\' decisions will be final and binding.',
    'Any plagiarism, misconduct, or damage to venue property will result in immediate disqualification.',
    'Organizers reserve the right to modify schedules in case of unforeseen circumstances.',
    'Teams must adhere to event timings and reporting instructions.',
    'Failure to appear for evaluation at the allotted time may lead to disqualification.',
    'By participating, teams consent to photography and media coverage for promotional purposes.',
  ],
  tracks: [
    {
      code: 'FILE-01',
      psCode: 'PS-ED-01',
      domain: 'Education',
      name: 'Education',
      brief: 'Case files on access to learning — tools that make education reach further and land better.',
    },
    {
      code: 'FILE-02',
      psCode: 'PS-HC-02',
      domain: 'Healthcare',
      name: 'Healthcare',
      brief: 'Evidence for public health gaps — wellness, access, and early-warning systems.',
    },
    {
      code: 'FILE-03',
      psCode: 'PS-EV-03',
      domain: 'Environment',
      name: 'Environment',
      brief: 'Field reports on sustainability — tech that leaves less of a trace.',
    },
    {
      code: 'FILE-04',
      psCode: 'PS-FT-04',
      domain: 'FinTech',
      name: 'FinTech',
      brief: 'Follow the money — secure transactions, financial inclusion, fraud defense.',
    },
    {
      code: 'FILE-05',
      psCode: 'PS-CD-05',
      domain: 'Cyber Defense',
      name: 'Cyber Defense',
      brief: 'Privacy, security, and decentralization — protect the system from the inside.',
    },
    {
      code: 'FILE-06',
      psCode: 'PS-AG-06',
      domain: 'AgriTech',
      name: 'AgriTech',
      brief: 'Ground-level intelligence for farming — efficiency and sustainability in the field.',
    },
    {
      code: 'FILE-07',
      psCode: 'PS-OP-07',
      domain: 'Open Case',
      name: 'Open Case',
      brief: 'No track fits? Bring your own lead. Any domain, any approach, wide open.',
    },
    {
      code: 'FILE-08',
      psCode: 'PS-CF-08',
      domain: 'Cyber Forensics',
      name: 'Cyber Forensics',
      brief: 'Investigative case files on digital crimes — tracing signatures, decryption tools, and data recovery.',
    },
  ],
  assessmentCriteria: [
    { title: 'Innovation & Originality', detail: 'A genuinely fresh angle on the problem.' },
    { title: 'Technical Implementation', detail: 'Code quality, design, and overall execution.' },
    { title: 'Problem Understanding', detail: 'Depth of research and grasp of the problem.' },
    { title: 'Scalability & Practical Impact', detail: 'How well the solution can scale in the real world.' },
    { title: 'UI/UX & User Experience', detail: 'Design intuitiveness and user journey.' },
    { title: 'Business Viability', detail: 'Potential for market success or sustainability.' },
    { title: 'Presentation & Q&A', detail: 'Clarity of the pitch and ability to defend the idea.' },
    { title: 'Prototype Completeness', detail: 'Degree of functional completeness.' },
  ],
  faqs: [
    {
      q: 'Is the event online or offline?',
      a: 'Round 0 is online. Round 1 and the Grand Finale are conducted offline at the host campus, but on-demand online participation is available for shortlisted teams with valid reasons.',
    },
    {
      q: 'How much does it cost to register?',
      a: 'Round 0 is completely free. If shortlisted, the offline participation fee is ₹599 per team. Accommodation is optional and carries additional charges.',
    },
    {
      q: 'Do I need a full team to register?',
      a: 'Each team must strictly consist of 3 to 5 members.',
    },
    {
      q: 'Can I participate in multiple teams?',
      a: 'No. A participant may be part of only one team.',
    },
  ],
  prize: { total: '40,000', first: '20,000', second: '10,000', third: '5,000', goodies: '5,000', currency: '₹' },
  coordinators: [
    { name: 'TBD', phone: 'TBD' },
    { name: 'TBD', phone: 'TBD' },
  ],
  venue: 'CSE Department, YCCE, Wanadongri, Nagpur',
  date: '16 Jul - 7 Aug 2026',
  registrationLink: '/register?event=operation-breach',
  image: '/images/events/operation-breach/cover.jpg',
  thumbnail: '/images/events/operation-breach/thumb.jpg',
  isFlagship: true,
  pagePath: '/hackathon',
};
