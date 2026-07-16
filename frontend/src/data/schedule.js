// Schedule timeline shown on the Schedule page.
// `eventSlug` should match a `slug` in /src/data/events/ so the timeline
// can link straight to that event's detail page. Leave it null for
// non-competition blocks (inauguration, breaks, closing ceremony, etc).
export const schedule = [
  {
    day: 'Day 1',
    date: 'TBD',
    blocks: [
      { time: 'TBD', title: 'Gates Open / Check-in', eventSlug: null },
      { time: 'TBD', title: 'Opening Briefing', eventSlug: null },
      { time: 'TBD', title: 'Operation Breach — Kickoff', eventSlug: 'operation-breach' },
      { time: 'TBD', title: 'Capture the Flag', eventSlug: 'capture-the-flag' },
      { time: 'TBD', title: 'Lockdown', eventSlug: 'lockdown' },
      { time: 'TBD', title: 'Cipher Heist', eventSlug: 'cipher-heist' },
      { time: 'TBD', title: 'Turf Wars', eventSlug: 'turf-wars' },
    ],
  },
  {
    day: 'Day 2',
    date: 'TBD',
    blocks: [
      { time: 'TBD', title: 'Operation Breach — Submissions Close', eventSlug: 'operation-breach' },
      { time: 'TBD', title: 'The Investigation', eventSlug: 'the-investigation' },
      { time: 'TBD', title: 'Syndicate Pitch — Finals', eventSlug: 'syndicate-pitch' },
      { time: 'TBD', title: 'Evidence Locker — Showcase', eventSlug: 'evidence-locker' },
      { time: 'TBD', title: 'Cage Match — Finals', eventSlug: 'cage-match' },
      { time: 'TBD', title: 'Closing Ceremony & Prize Distribution', eventSlug: null },
    ],
  },
];
