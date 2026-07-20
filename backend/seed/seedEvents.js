require('dotenv').config();
const mongoose = require('mongoose');
const Event = require('../src/models/Event');

const events = [
  {
    slug: 'operation-breach',
    name: 'Operation Breach (Hackathon / Smackathon 2K26)',
    category: 'Flagship',
    feeInINR: 500,
    minTeamSize: 2,
    maxTeamSize: 4,
    description: '24-hour flagship hackathon with deep-tech problem tracks.',
  },
  {
    slug: 'code-crimson',
    name: 'Code Crimson (Competitive Programming)',
    category: 'Technical',
    feeInINR: 150,
    minTeamSize: 1,
    maxTeamSize: 2,
    description: 'Head-to-head competitive programming rounds.',
  },
  {
    slug: 'circuit-breaker',
    name: 'Circuit Breaker (Robotics)',
    category: 'Technical',
    feeInINR: 300,
    minTeamSize: 2,
    maxTeamSize: 4,
    description: 'Build and battle bots on the arena floor.',
  },
  {
    slug: 'pixel-pursuit',
    name: 'Pixel Pursuit (Gaming - Valorant)',
    category: 'Gaming',
    feeInINR: 400,
    minTeamSize: 5,
    maxTeamSize: 6,
    description: '5v5 Valorant LAN tournament.',
  },
  {
    slug: 'lens-flare',
    name: 'Lens Flare (Photography)',
    category: 'Non-Tech',
    feeInINR: 100,
    minTeamSize: 1,
    maxTeamSize: 1,
    description: 'On-the-spot campus photography contest.',
  },
];

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected. Seeding events...');

    for (const ev of events) {
      await Event.findOneAndUpdate({ slug: ev.slug }, ev, { upsert: true, new: true });
      console.log(`  ✔ ${ev.slug}`);
    }

    console.log('✅ Event seeding complete.');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding failed:', err);
    process.exit(1);
  }
})();
