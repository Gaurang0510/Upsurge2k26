import coreCommittee from './core-committee.js';
import technicalTeam from './technical-team.js';
import eventManagementTeam from './event-management-team.js';
import literatureTeam from './literature-team.js';
import designTeam from './design-team.js';
import publicityTeam from './publicity-team.js';
import culturalTeam from './cultural-team.js';
import sponsorshipTeam from './sponsorship-team.js';
import socialMediaTeam from './social-media-team.js';
import databaseTeam from './database-team.js';
import photographyTeam from './photography-team.js';
import sportsTeam from './sports-team.js';

// One entry per department shown on the Team page.
// ADDING A DEPARTMENT: create the data file, then add one line here.
export const teamDepartments = [
  { name: 'Core Committee', slug: 'core-committee', members: coreCommittee },
  { name: 'Technical Team', slug: 'technical-team', members: technicalTeam },
  { name: 'Event Management Team', slug: 'event-management-team', members: eventManagementTeam },
  { name: 'Literature Team', slug: 'literature-team', members: literatureTeam },
  { name: 'Design Team', slug: 'design-team', members: designTeam },
  { name: 'Publicity Team', slug: 'publicity-team', members: publicityTeam },
  { name: 'Cultural Team', slug: 'cultural-team', members: culturalTeam },
  { name: 'Sponsorship Team', slug: 'sponsorship-team', members: sponsorshipTeam },
  { name: 'Social Media Team', slug: 'social-media-team', members: socialMediaTeam },
  { name: 'Database Team', slug: 'database-team', members: databaseTeam },
  { name: 'Photography Team', slug: 'photography-team', members: photographyTeam },
  { name: 'Sports Team', slug: 'sports-team', members: sportsTeam },
];
