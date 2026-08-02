import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { Home, Shield, Calendar, Clock, Users } from "lucide-react";
import { cn } from "../../lib/utils.js";
import { siteConfig } from "../../data/site.js";

const iconMap = {
  'Home': Home,
  'Smackathon': Shield,
  'Events': Calendar,
  'Schedule': Clock,
  'Team': Users
};

export default function Navbar({ className }) {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('');
  const [hoveredTab, setHoveredTab] = useState(null);

  useEffect(() => {
    // Find the active tab based on the current path
    const currentLink = siteConfig.navLinks.find(link =>
      link.path === '/'
        ? location.pathname === '/'
        : location.pathname.startsWith(link.path)
    );
    if (currentLink) {
      setActiveTab(currentLink.label);
    } else {
      setActiveTab(siteConfig.navLinks[0].label);
    }
  }, [location.pathname]);

  // removed handleResize as isMobile state is no longer used

  const items = siteConfig.navLinks.map(link => ({
    name: link.label,
    url: link.path,
    icon: iconMap[link.label] || Home
  }));

  return (
    <div
      className={cn(
        "site-navbar fixed bottom-0 sm:bottom-auto sm:top-0 left-0 right-0 w-full flex justify-center z-50 mb-6 sm:pt-6 pointer-events-none",
        className,
      )}
    >
      <div 
        className="flex items-center gap-1 sm:gap-3 bg-transparent py-1 px-1 rounded-full pointer-events-auto"
        onMouseLeave={() => setHoveredTab(null)}
      >
        <AnimatePresence>
          {items.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.name;

            return (
              <Link
                key={item.name}
                to={item.url}
                onClick={() => setActiveTab(item.name)}
                onMouseEnter={() => setHoveredTab(item.name)}
                className={cn(
                  "relative cursor-pointer text-sm font-semibold px-3.5 sm:px-6 py-2 rounded-full transition-colors duration-300",
                  "text-paper/80 hover:text-evidence",
                  isActive && "text-evidence"
                )}
              >
                <span className="relative z-10 hidden md:inline font-mono tracking-widest uppercase transition-transform duration-200 hover:scale-105 inline-block">{item.name}</span>
                <span className="relative z-10 md:hidden transition-transform duration-200 hover:scale-110 inline-block">
                  <Icon size={18} strokeWidth={2.5} />
                </span>
                
                {/* Hover Pill Background */}
                {hoveredTab === item.name && (
                  <motion.div
                    layoutId="hoverPill"
                    className="absolute inset-0 bg-white/[0.04] border border-white/[0.03] rounded-full -z-10"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 25,
                    }}
                  />
                )}

                {/* Active Lamp Background */}
                {isActive && (
                  <motion.div
                    layoutId="lamp"
                    className="absolute inset-0 w-full bg-evidence/5 rounded-full -z-10"
                    initial={false}
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 30,
                    }}
                  >
                    <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-1 bg-evidence rounded-t-full">
                      <div className="absolute w-12 h-6 bg-evidence/20 rounded-full blur-md -top-2 -left-2" />
                      <div className="absolute w-8 h-6 bg-evidence/20 rounded-full blur-md -top-1" />
                      <div className="absolute w-4 h-4 bg-evidence/20 rounded-full blur-sm top-0 left-2" />
                    </div>
                  </motion.div>
                )}
              </Link>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
