// Aggregates every event file in this folder into a single ordered list.
// ADDING A NEW EVENT: create a new file in this folder following the schema
// documented at the top of ./operation-breach.js, then import + add it below.
// This is the ONLY line in the whole data layer where two people could
// collide — keep this file tiny and merge it by hand if git ever flags it.

import operationBreach from './operation-breach.js';
import syndicatePitch from './syndicate-pitch.js';
import lockdown from './lockdown.js';
import promptSprint from './prompt-sprint.js';
import algoArena from './algo-arena.js';
import captureTheFlag from './capture-the-flag.js';
import turfWars from './turf-wars.js';
import theGetaway from './the-getaway.js';
import manhunt from './manhunt.js';
import theChase from './the-chase.js';
import cipherHeist from './cipher-heist.js';
import undergroundCircuit from './underground-circuit.js';

export { CATEGORIES } from './categories.js';

export const events = [
  operationBreach,
  syndicatePitch,
  lockdown,
  promptSprint,
  algoArena,
  captureTheFlag,
  turfWars,
  theGetaway,
  manhunt,
  theChase,
  cipherHeist,
  undergroundCircuit,
];

export const flagshipEvent = events.find((event) => event.isFlagship);

export const getEventBySlug = (slug) => events.find((event) => event.slug === slug);

export const getEventsByCategory = (category) =>
  !category || category === 'All' ? events : events.filter((event) => event.category === category);
