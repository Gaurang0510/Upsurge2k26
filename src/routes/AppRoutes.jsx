import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home/Home.jsx';
import Events from '../pages/Events/Events.jsx';
import EventDetail from '../pages/EventDetail/EventDetail.jsx';
import Hackathon from '../pages/Hackathon/Hackathon.jsx';
import Schedule from '../pages/Schedule/Schedule.jsx';
import Team from '../pages/Team/Team.jsx';
import NotFound from '../pages/NotFound/NotFound.jsx';

// ADDING A PAGE: create the folder under /src/pages, then add one <Route /> here.
// This file only ever changes by adding/removing a single line per page —
// keep unrelated edits out of it to avoid stepping on teammates' PRs.
export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/events" element={<Events />} />
      <Route path="/events/:slug" element={<EventDetail />} />
      <Route path="/hackathon" element={<Hackathon />} />
      <Route path="/schedule" element={<Schedule />} />
      <Route path="/team" element={<Team />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
