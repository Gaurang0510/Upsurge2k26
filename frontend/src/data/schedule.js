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
      { time: '11:00 AM - 02:00 PM', title: 'Cypher Chase', eventSlug: 'cipher-heist' },
      { time: '11:00 AM - 05:00 PM', title: 'Escape Room', eventSlug: 'lockdown' },
      { time: '11:00 AM - 05:00 PM', title: 'FIFA 26', eventSlug: 'turf-wars' },
      { time: '11:00 AM - 05:00 PM', title: 'F1 Simulator', eventSlug: 'the-getaway' },
      { time: '02:00 PM - 05:00 PM', title: 'Round 1 - Elimination (Judging)', eventSlug: 'operation-breach' },
      { time: '05:00 PM onwards', title: 'Top Teams Announcement', eventSlug: 'operation-breach' },
      { time: 'Evening', title: 'Product Refinement', eventSlug: 'operation-breach' },
      { time: 'TBD', title: 'Capture the Flag', eventSlug: 'capture-the-flag' }
    ],
  },
  {
    day: 'Day 2',
    date: '7 Aug 2026',
    blocks: [
      { time: '10:00 AM - 01:00 PM', title: 'Grand Finale', eventSlug: 'operation-breach' },
      { time: '11:00 AM - 05:00 PM', title: 'Free Fire', eventSlug: 'manhunt' },
      { time: '11:00 AM - 05:00 PM', title: 'F1 Simulator', eventSlug: 'the-getaway' },
      { time: '02:00 PM - 05:00 PM', title: 'Ideathon', eventSlug: 'syndicate-pitch' },
      { time: 'TBD', title: 'Winner Announcement', eventSlug: 'operation-breach' },
      { time: 'TBD', title: 'The Investigation', eventSlug: 'the-investigation' },
      { time: 'TBD', title: 'Evidence Locker — Showcase', eventSlug: 'evidence-locker' },
      { time: 'TBD', title: 'Cage Match — Finals', eventSlug: 'cage-match' }
    ],
  },
  {
    day: 'Day 3',
    date: '8 Aug 2026',
    blocks: [
      { time: '11:00 AM - 02:00 PM', title: 'Coding Relay', eventSlug: 'the-chase' },
      { time: '11:00 AM - 05:00 PM', title: 'Carrom', eventSlug: 'underground-circuit' },
      { time: '11:00 AM - 05:00 PM', title: 'F1 Simulator', eventSlug: 'the-getaway' },
      { time: '05:00 PM onwards', title: 'Closing Ceremony & Prize Distribution', eventSlug: null }
    ]
  }
];
