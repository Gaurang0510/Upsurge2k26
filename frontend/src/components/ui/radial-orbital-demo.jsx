"use client";

import React from "react";
import { GraduationCap, HeartPulse, TrendingUp, Cpu, Sprout, Leaf, Lightbulb } from "lucide-react";
import RadialOrbitalTimeline from "@/components/ui/radial-orbital-timeline";

const smackathonDomains = [
  {
    id: 1,
    title: "EDUCATION",
    date: "TRACK-01",
    content: "Tools & innovations that eliminate barriers to learning, making education accessible, engaging, and impactful.",
    category: "Education",
    icon: GraduationCap,
    image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=400&q=80",
    relatedIds: [2, 7],
    status: "completed",
    energy: 95,
  },
  {
    id: 2,
    title: "HEALTH CARE",
    date: "TRACK-02",
    content: "Digital health monitoring, patient care systems, early diagnostic tools, and public health telemetry.",
    category: "Healthcare",
    icon: HeartPulse,
    image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400&q=80",
    relatedIds: [1, 3],
    status: "completed",
    energy: 90,
  },
  {
    id: 3,
    title: "FINANCE",
    date: "TRACK-03",
    content: "FinTech security, algorithmic trading, decentralized payment rails, micro-investments, and fraud prevention.",
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
    content: "Cyber defense, smart contract security, zero-knowledge proofs, and decentralized autonomous protocols.",
    category: "Cyber Security",
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
    content: "Precision farming, IoT crop monitoring, supply-chain transparency, and smart irrigation systems.",
    category: "AgriTech",
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
    content: "Sustainability telemetry, carbon footprint tracking, renewable grid optimization, and waste management.",
    category: "Sustainability",
    icon: Leaf,
    image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=400&q=80",
    relatedIds: [5, 7],
    status: "completed",
    energy: 92,
  },
  {
    id: 7,
    title: "OPEN INNOVATIVE",
    date: "TRACK-07",
    content: "Have a unique idea that doesn't fit standard domains? Build any impactful software or hardware solution under open innovation.",
    category: "Open Track",
    icon: Lightbulb,
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&q=80",
    relatedIds: [6, 1],
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
