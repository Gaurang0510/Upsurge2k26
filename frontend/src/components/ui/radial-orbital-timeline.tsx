"use client";
import React, { useState, useEffect, useRef } from "react";
import { ArrowRight, Link, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export interface TimelineItem {
  id: number;
  title: string;
  date: string;
  content: string;
  category: string;
  icon: React.ElementType;
  image?: string;
  relatedIds: number[];
  status: "completed" | "in-progress" | "pending";
  energy: number;
}

export interface RadialOrbitalTimelineProps {
  timelineData: TimelineItem[];
}

export default function RadialOrbitalTimeline({
  timelineData,
}: RadialOrbitalTimelineProps) {
  const [expandedItems, setExpandedItems] = useState<Record<number, boolean>>(
    {}
  );
  const [viewMode, setViewMode] = useState<"orbital">("orbital");
  const [rotationAngle, setRotationAngle] = useState<number>(0);
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const [pulseEffect, setPulseEffect] = useState<Record<number, boolean>>({});
  const [centerOffset, setCenterOffset] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
  const [activeNodeId, setActiveNodeId] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const orbitRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef<Record<number, HTMLDivElement | null>>({});

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleContainerClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === containerRef.current || e.target === orbitRef.current) {
      setExpandedItems({});
      setActiveNodeId(null);
      setPulseEffect({});
      setAutoRotate(true);
    }
  };

  const toggleItem = (id: number) => {
    setExpandedItems((prev) => {
      const newState = { ...prev };
      Object.keys(newState).forEach((key) => {
        if (parseInt(key) !== id) {
          newState[parseInt(key)] = false;
        }
      });

      newState[id] = !prev[id];

      if (!prev[id]) {
        setActiveNodeId(id);
        setAutoRotate(false);

        const relatedItems = getRelatedItems(id);
        const newPulseEffect: Record<number, boolean> = {};
        relatedItems.forEach((relId) => {
          newPulseEffect[relId] = true;
        });
        setPulseEffect(newPulseEffect);

        centerViewOnNode(id);
      } else {
        setActiveNodeId(null);
        setAutoRotate(true);
        setPulseEffect({});
      }

      return newState;
    });
  };

  useEffect(() => {
    let rotationTimer: any;

    if (autoRotate && viewMode === "orbital") {
      rotationTimer = setInterval(() => {
        setRotationAngle((prev) => {
          const newAngle = (prev + 0.3) % 360;
          return Number(newAngle.toFixed(3));
        });
      }, 50);
    }

    return () => {
      if (rotationTimer) {
        clearInterval(rotationTimer);
      }
    };
  }, [autoRotate, viewMode]);

  const centerViewOnNode = (nodeId: number) => {
    if (viewMode !== "orbital" || !nodeRefs.current[nodeId]) return;

    const nodeIndex = timelineData.findIndex((item) => item.id === nodeId);
    const totalNodes = timelineData.length;
    const targetAngle = (nodeIndex / totalNodes) * 360;

    setRotationAngle(270 - targetAngle);
  };

  const calculateNodePosition = (index: number, total: number) => {
    const angle = ((index / total) * 360 + rotationAngle) % 360;
    const radius = isMobile ? 210 : 330;
    const radian = (angle * Math.PI) / 180;

    const x = radius * Math.cos(radian) + centerOffset.x;
    const y = radius * Math.sin(radian) + centerOffset.y;

    const zIndex = Math.round(100 + 50 * Math.cos(radian));
    const opacity = Math.max(
      0.55,
      Math.min(1, 0.55 + 0.45 * ((1 + Math.sin(radian)) / 2))
    );

    return { x, y, angle, zIndex, opacity };
  };

  const getRelatedItems = (itemId: number): number[] => {
    const currentItem = timelineData.find((item) => item.id === itemId);
    return currentItem ? currentItem.relatedIds : [];
  };

  const isRelatedToActive = (itemId: number): boolean => {
    if (!activeNodeId) return false;
    const relatedItems = getRelatedItems(activeNodeId);
    return relatedItems.includes(itemId);
  };

  const getStatusStyles = (status: TimelineItem["status"]): string => {
    switch (status) {
      case "completed":
        return "text-white bg-black border-white";
      case "in-progress":
        return "text-black bg-white border-black";
      case "pending":
        return "text-white bg-black/40 border-white/50";
      default:
        return "text-white bg-black/40 border-white/50";
    }
  };

  return (
    <div
      className="w-full min-h-[750px] md:min-h-[920px] h-[800px] md:h-[980px] flex flex-col items-center justify-center bg-black/90 rounded-3xl border border-red-500/20 shadow-2xl relative overflow-hidden my-12"
      ref={containerRef}
      onClick={handleContainerClick}
    >
      <div className="relative w-full max-w-5xl md:max-w-6xl h-full flex items-center justify-center">
        <div
          className="absolute w-full h-full flex items-center justify-center"
          ref={orbitRef}
          style={{
            perspective: "1200px",
            transform: `translate(${centerOffset.x}px, ${centerOffset.y}px)`,
          }}
        >
          {/* Orbital Center Hub */}
          <div className="absolute w-24 h-24 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-red-600 via-amber-500 to-red-800 animate-pulse flex items-center justify-center z-10 shadow-[0_0_40px_rgba(239,68,68,0.6)] border-2 border-red-400/50">
            <div className="absolute w-32 h-32 md:w-40 md:h-40 rounded-full border border-red-500/30 animate-ping opacity-70"></div>
            <div
              className="absolute w-40 h-40 md:w-52 md:h-52 rounded-full border border-red-500/20 animate-ping opacity-50"
              style={{ animationDelay: "0.5s" }}
            ></div>
            <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-black/80 backdrop-blur-md flex items-center justify-center border border-white/10 overflow-hidden">
              <img src="/images/logo/logo.webp" alt="Logo" className="w-4/5 h-4/5 object-contain" />
            </div>
          </div>

          {/* Large Orbital Ring Track */}
          <div className="absolute w-[420px] h-[420px] md:w-[660px] md:h-[660px] rounded-full border-2 border-red-500/20 pointer-events-none shadow-[0_0_30px_rgba(239,68,68,0.1)]"></div>

          {timelineData.map((item, index) => {
            const position = calculateNodePosition(index, timelineData.length);
            const isExpanded = expandedItems[item.id];
            const isRelated = isRelatedToActive(item.id);
            const isPulsing = pulseEffect[item.id];
            const Icon = item.icon;

            const nodeStyle = {
              transform: `translate(${position.x}px, ${position.y}px)`,
              zIndex: isExpanded ? 200 : position.zIndex,
              opacity: isExpanded ? 1 : position.opacity,
            };

            return (
              <div
                key={item.id}
                ref={(el) => (nodeRefs.current[item.id] = el)}
                className="absolute transition-all duration-700 cursor-pointer"
                style={nodeStyle}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleItem(item.id);
                }}
              >
                <div
                  className={`absolute rounded-full -inset-2 ${
                    isPulsing ? "animate-pulse duration-1000" : ""
                  }`}
                  style={{
                    background: `radial-gradient(circle, rgba(239,68,68,0.35) 0%, rgba(255,255,255,0) 70%)`,
                    width: `${item.energy * 0.6 + 60}px`,
                    height: `${item.energy * 0.6 + 60}px`,
                    left: `-${(item.energy * 0.6 + 60 - 60) / 2}px`,
                    top: `-${(item.energy * 0.6 + 60 - 60) / 2}px`,
                  }}
                ></div>

                <div
                  className={`
                  w-16 h-16 md:w-24 md:h-24 rounded-full flex items-center justify-center overflow-hidden
                  ${
                    isExpanded
                      ? "bg-red-600 text-white shadow-2xl shadow-red-500/60"
                      : isRelated
                      ? "bg-white/80 text-black border-red-500 animate-pulse"
                      : "bg-black/90 text-white"
                  }
                  border-2 md:border-3
                  ${
                    isExpanded
                      ? "border-white shadow-2xl shadow-red-500/50"
                      : isRelated
                      ? "border-red-400 animate-pulse"
                      : "border-white/60 hover:border-red-400 hover:shadow-[0_0_20px_rgba(239,68,68,0.4)]"
                  }
                  transition-all duration-300 transform
                  ${isExpanded ? "scale-150" : "hover:scale-115"}
                `}
                >
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover rounded-full"
                    />
                  ) : (
                    <Icon className="w-6 h-6 md:w-10 md:h-10" />
                  )}
                </div>

                <div
                  className={`
                  absolute top-20 md:top-28 left-1/2 -translate-x-1/2 whitespace-nowrap
                  text-xs md:text-sm font-bold tracking-widest uppercase
                  transition-all duration-300
                  ${isExpanded ? "text-red-400 scale-125 font-mono" : "text-white/90 font-mono drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"}
                `}
                >
                  {item.title}
                </div>

                {isExpanded && (
                  <Card className="absolute top-28 md:top-36 left-1/2 -translate-x-1/2 w-80 md:w-96 bg-black/95 backdrop-blur-2xl border-red-500/50 shadow-2xl shadow-red-950/60 overflow-visible z-[250] p-1">
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-px h-3 bg-red-500/80"></div>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-center">
                        <Badge
                          className={`px-2.5 py-0.5 text-xs font-mono tracking-wider ${getStatusStyles(
                            item.status
                          )}`}
                        >
                          {item.category.toUpperCase()}
                        </Badge>
                        <span className="text-xs font-mono text-steel">
                          {item.date}
                        </span>
                      </div>
                      <CardTitle className="text-lg font-display uppercase tracking-wide mt-2 text-paper">
                        {item.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-xs md:text-sm text-steel/90 space-y-4">
                      {item.image && (
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-36 object-cover rounded-lg border border-white/10"
                        />
                      )}
                      <p className="leading-relaxed">{item.content}</p>

                      <div className="mt-4 pt-3 border-t border-white/10">
                        <div className="flex justify-between items-center text-xs mb-1.5">
                          <span className="flex items-center font-mono text-xs uppercase text-steel">
                            <Zap size={12} className="mr-1 text-red-500" />
                            Activity Index
                          </span>
                          <span className="font-mono text-red-400 font-bold text-sm">{item.energy}%</span>
                        </div>
                        <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-red-600 via-amber-500 to-red-400"
                            style={{ width: `${item.energy}%` }}
                          ></div>
                        </div>
                      </div>

                      {item.relatedIds.length > 0 && (
                        <div className="mt-4 pt-3 border-t border-white/10">
                          <div className="flex items-center mb-2">
                            <Link size={12} className="text-steel mr-1.5" />
                            <h4 className="text-xs uppercase tracking-wider font-mono font-medium text-steel">
                              Connected Tracks
                            </h4>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {item.relatedIds.map((relatedId) => {
                              const relatedItem = timelineData.find(
                                (i) => i.id === relatedId
                              );
                              return (
                                <Button
                                  key={relatedId}
                                  variant="outline"
                                  size="sm"
                                  className="flex items-center h-7 px-2.5 py-0.5 text-xs font-mono rounded-none border-red-500/30 bg-red-950/20 hover:bg-red-900/40 text-paper transition-all"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toggleItem(relatedId);
                                  }}
                                >
                                  {relatedItem?.title}
                                  <ArrowRight
                                    size={10}
                                    className="ml-1.5 text-red-400"
                                  />
                                </Button>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
