import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';

const Home = lazy(() => import('../pages/Home/Home.jsx'));
const Events = lazy(() => import('../pages/Events/Events.jsx'));
const EventDetail = lazy(() => import('../pages/EventDetail/EventDetail.jsx'));
const Hackathon = lazy(() => import('../pages/Hackathon/Hackathon.jsx'));
const Schedule = lazy(() => import('../pages/Schedule/Schedule.jsx'));
const Team = lazy(() => import('../pages/Team/Team.jsx'));
const Register = lazy(() => import('../pages/Register/Register.jsx'));
const NotFound = lazy(() => import('../pages/NotFound/NotFound.jsx'));

export default function AppRoutes() {
  return (
    <Suspense fallback={<main className="min-h-screen bg-case-black" aria-busy="true" aria-label="Loading page" />}>
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
    </Suspense>
  );
}
