require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../src/config/db');
const Admin = require('../src/models/Admin');
const Event = require('../src/models/Event');
const Registration = require('../src/models/Registration');
const ShortlistEntry = require('../src/models/ShortlistEntry');
const Team = require('../src/models/Team');

const initializeDatabase = async () => {
  await connectDB();

  // createIndexes is additive: it creates the database/collections and schema
  // indexes without deleting an index that may have been added in Atlas later.
  await Promise.all([
    Admin.createIndexes(),
    Event.createIndexes(),
    Registration.createIndexes(),
    ShortlistEntry.createIndexes(),
    Team.createIndexes(),
  ]);

  console.log(`✅ Database initialized: ${mongoose.connection.name}`);
  await mongoose.disconnect();
};

initializeDatabase().catch(async (error) => {
  console.error('❌ Database initialization failed:', error.message);
  await mongoose.disconnect();
  process.exit(1);
});
