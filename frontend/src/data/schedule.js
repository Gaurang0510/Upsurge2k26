// Schedule timeline shown on the Schedule page.
// `eventSlug` should match a `slug` in /src/data/events/ so the timeline
// can link straight to that event's detail page. Leave it null for
// non-competition blocks (inauguration, breaks, closing ceremony, etc).
export const schedule = [
  {
    day: 'Day 1',
    date: '6 Aug 2026',
    blocks: [
      { time: '09:00 AM', title: 'Onsite Entry & Registration', eventSlug: null },
      { time: '10:00 AM – 02:00 PM', title: 'Smackathon — Round 1 (Prototype Development)', eventSlug: 'operation-breach' },
      { time: '11:00 AM onwards', title: 'Coding Relay', eventSlug: 'the-chase' },
      { time: '11:00 AM – 05:00 PM', title: 'Escape Room', eventSlug: 'lockdown' },
      { time: '11:00 AM – 05:00 PM', title: 'FIFA 26', eventSlug: 'turf-wars' },
      { time: '11:00 AM onwards', title: 'F1 x Forza Simulator', eventSlug: 'the-getaway' },
      { time: '02:00 PM – 05:00 PM', title: 'Smackathon — Round 1 Elimination (Judging)', eventSlug: 'operation-breach' },
      { time: '05:00 PM onwards', title: 'Smackathon — Top Teams Announcement', eventSlug: 'operation-breach' },
      { time: 'Evening', title: 'Smackathon — Product Refinement', eventSlug: 'operation-breach' },
    ],
  },
  {
    day: 'Day 2',
    date: '7 Aug 2026',
    blocks: [
      { time: '10:00 AM – 01:00 PM', title: 'Smackathon — Grand Finale', eventSlug: 'operation-breach' },
      { time: '11:00 AM onwards', title: 'Free Fire', eventSlug: 'manhunt' },
      { time: '11:00 AM onwards', title: 'F1 x Forza Simulator', eventSlug: 'the-getaway' },
      { time: '11:00 AM onwards', title: 'Cipher Chase', eventSlug: 'cipher-heist' },
      { time: 'TBD', title: 'Capture the Flag', eventSlug: 'capture-the-flag' },
      { time: 'TBD', title: 'Smackathon — Winner Announcement', eventSlug: 'operation-breach' },
    ],
  },
  {
    day: 'Day 3',
    date: '8 Aug 2026',
    blocks: [
      { time: '11:00 AM – 05:00 PM', title: 'Carrom', eventSlug: 'underground-circuit' },
      { time: '11:00 AM onwards', title: 'F1 x Forza Simulator', eventSlug: 'the-getaway' },
      { time: '11:00 AM onwards', title: 'Prompt Sprint', eventSlug: 'prompt-sprint' },
      { time: '02:00 PM – 05:00 PM', title: 'IdeathonX', eventSlug: 'syndicate-pitch' },
      { time: 'TBD', title: 'Algo Arena', eventSlug: 'algo-arena' },
      { time: '05:00 PM onwards', title: 'Closing Ceremony & Prize Distribution', eventSlug: null },
    ],
  },
];
