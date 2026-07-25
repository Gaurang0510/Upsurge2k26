// Schedule timeline shown on the Schedule page.
// `eventSlug` should match a `slug` in /src/data/events/ so the timeline
// can link straight to that event's detail page. Leave it null for
// non-competition blocks (inauguration, breaks, closing ceremony, etc).
export const schedule = [
  {
    day: 'Day 1',
    date: '6 Aug 2026',
    blocks: [
      { time: '09:00 AM', title: 'Onsite Entry', eventSlug: 'operation-breach' },
      { time: '10:00 AM - 02:00 PM', title: 'Round 1 - Prototype Development', eventSlug: 'operation-breach' },
      { time: '02:00 PM - 05:00 PM', title: 'Round 1 - Elimination (Judging)', eventSlug: 'operation-breach' },
      { time: '05:00 PM onwards', title: 'Top Teams Announcement', eventSlug: 'operation-breach' },
      { time: 'Evening', title: 'Product Refinement', eventSlug: 'operation-breach' },
      { time: 'TBD', title: 'Capture the Flag', eventSlug: 'capture-the-flag' },
      { time: 'TBD', title: 'Lockdown', eventSlug: 'lockdown' },
      { time: 'TBD', title: 'Cipher Heist', eventSlug: 'cipher-heist' },
      { time: 'TBD', title: 'Turf Wars', eventSlug: 'turf-wars' },
    ],
  },
  {
    day: 'Day 2',
    date: '7 Aug 2026',
    blocks: [
      { time: '10:00 AM - 01:00 PM', title: 'Grand Finale', eventSlug: 'operation-breach' },
      { time: 'TBD', title: 'Winner Announcement', eventSlug: 'operation-breach' },
      { time: 'TBD', title: 'The Investigation', eventSlug: 'the-investigation' },
      { time: 'TBD', title: 'Syndicate Pitch — Finals', eventSlug: 'syndicate-pitch' },
      { time: 'TBD', title: 'Evidence Locker — Showcase', eventSlug: 'evidence-locker' },
      { time: 'TBD', title: 'Cage Match — Finals', eventSlug: 'cage-match' },
      { time: 'TBD', title: 'Closing Ceremony & Prize Distribution', eventSlug: null },
    ],
  },
];
