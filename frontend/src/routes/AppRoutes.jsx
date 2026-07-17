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

// A beautiful, premium, cyberpunk-themed loading fallback component
function LoadingFallback() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center font-mono">
      <span className="case-tag animate-pulse">SYSTEM INITIALIZING</span>
      <p className="mt-3 text-xs uppercase tracking-[0.3em] text-steel">
        Accessing Database...
      </p>
    </div>
  );
}

// ADDING A PAGE: create the folder under /src/pages, then add one <Route /> here.
// This file only ever changes by adding/removing a single line per page —
// keep unrelated edits out of it to avoid stepping on teammates' PRs.
export default function AppRoutes() {
  return (
    <Suspense fallback={<LoadingFallback />}>
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
