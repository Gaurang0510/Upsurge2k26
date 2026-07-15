import coreCommittee from './core-committee.js';
import technicalTeam from './technical-team.js';
import designTeam from './design-team.js';
import contentTeam from './content-team.js';
import eventManagementTeam from './event-management-team.js';
import sponsorshipTeam from './sponsorship-team.js';

// One entry per department shown on the Team page.
// ADDING A DEPARTMENT: create the data file, then add one line here.
export const teamDepartments = [
  { name: 'Core Committee', slug: 'core-committee', members: coreCommittee },
  { name: 'Technical Team', slug: 'technical-team', members: technicalTeam },
  { name: 'Design Team', slug: 'design-team', members: designTeam },
  { name: 'Content & Publicity Team', slug: 'content-team', members: contentTeam },
  { name: 'Event Management Team', slug: 'event-management-team', members: eventManagementTeam },
  { name: 'Sponsorship Team', slug: 'sponsorship-team', members: sponsorshipTeam },
];
