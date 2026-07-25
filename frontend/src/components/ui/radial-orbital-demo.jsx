"use client";

import React from "react";
import { GraduationCap, HeartPulse, TrendingUp, Cpu, Sprout, Leaf, Lightbulb, ShieldAlert } from "lucide-react";
import RadialOrbitalTimeline from "@/components/ui/radial-orbital-timeline";

const smackathonDomains = [
  {
    id: 1,
    title: "EDUCATION",
    date: "TRACK-01",
    content: "Tools & innovations that eliminate barriers to learning, mapping cognitive load and visual ML intuition.",
    category: "Education",
    icon: GraduationCap,
    image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=400&q=80",
    relatedIds: [2, 8],
    status: "completed",
    energy: 95,
  },
  {
    id: 2,
    title: "HEALTHCARE",
    date: "TRACK-02",
    content: "Early sepsis prediction, national emergency triage command, and US healthcare EDI parser & X12 file validator.",
    category: "Healthcare",
    icon: HeartPulse,
    image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400&q=80",
    relatedIds: [1, 3],
    status: "completed",
    energy: 90,
  },
  {
    id: 3,
    title: "FINTECH",
    date: "TRACK-03",
    content: "KYC/AML compliance automation, zero-trust fraud defense, and privacy-preserving federated loan stacking detection.",
    category: "FinTech",
    icon: TrendingUp,
    image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&q=80",
    relatedIds: [2, 4],
    status: "in-progress",
    energy: 85,
  },
  {
    id: 4,
    title: "WEB 3.0",
    date: "TRACK-04",
    content: "Blockchain certificate verification, transparent donation tracking, and decentralized autonomous ledgers.",
    category: "Web 3.0",
    icon: Cpu,
    image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400&q=80",
    relatedIds: [3, 5],
    status: "in-progress",
    energy: 88,
  },
  {
    id: 5,
    title: "AGRICULTURE",
    date: "TRACK-05",
    content: "AI-based soil NPK/pH quality analysis and automated carbon credit measurement for small farmers.",
    category: "Agriculture",
    icon: Sprout,
    image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400&q=80",
    relatedIds: [4, 6],
    status: "completed",
    energy: 80,
  },
  {
    id: 6,
    title: "ENVIRONMENT",
    date: "TRACK-06",
    content: "OrbitWatch real-time satellite SDG indicator tracking and lunar subsurface ice polar region characterization.",
    category: "Environment",
    icon: Leaf,
    image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=400&q=80",
    relatedIds: [5, 7],
    status: "completed",
    energy: 92,
  },
  {
    id: 7,
    title: "CYBERSECURITY",
    date: "TRACK-07",
    content: "Detecting cloned phishing login portals and privacy-preserving insider data exfiltration endpoint monitoring.",
    category: "Cybersecurity",
    icon: ShieldAlert,
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=400&q=80",
    relatedIds: [6, 8],
    status: "completed",
    energy: 94,
  },
  {
    id: 8,
    title: "OPEN INNOVATION",
    date: "TRACK-08",
    content: "Have a unique idea that doesn't fit standard domains? Propose and build any impactful software or hardware solution.",
    category: "Open Innovation",
    icon: Lightbulb,
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&q=80",
    relatedIds: [7, 1],
    status: "completed",
    energy: 90,
  },
];

export function RadialOrbitalTimelineDemo() {
  return (
    <div className="w-full flex flex-col items-center">
      <RadialOrbitalTimeline timelineData={smackathonDomains} />
    </div>
  );
}

export default RadialOrbitalTimelineDemo;
