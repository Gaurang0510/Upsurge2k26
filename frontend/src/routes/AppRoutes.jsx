import { Routes, Route } from 'react-router-dom';

// Eagerly import all page components to eliminate page chunk loading latency and remove black blank screens
import Home from '../pages/Home/Home.jsx';
import Events from '../pages/Events/Events.jsx';
import EventDetail from '../pages/EventDetail/EventDetail.jsx';
import Hackathon from '../pages/Hackathon/Hackathon.jsx';
import Schedule from '../pages/Schedule/Schedule.jsx';
import Team from '../pages/Team/Team.jsx';
import Register from '../pages/Register/Register.jsx';
import NotFound from '../pages/NotFound/NotFound.jsx';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/events" element={<Events />} />
      <Route path="/events/:slug" element={<EventDetail />} />
      <Route path="/hackathon" element={<Hackathon />} />
      <Route path="/schedule" element={<Schedule />} />
      <Route path="/team" element={<Team />} />
      <Route path="/register" element={<Register />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
