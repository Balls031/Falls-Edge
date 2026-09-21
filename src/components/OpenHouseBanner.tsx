'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import AddToCalendarButton from './AddToCalendarButton';
import { daysUntilOpenHouse, formatOpenHouseDate, formatOpenHouseTime } from '@/lib/openHouse';

interface OpenHouseProject {
    id: string;
    title: string;
    location: string;
    address?: string;
    coordinates?: { lat: number; lng: number };
    openHouse: {
        date: string;
        startTime: string;
        endTime: string;
    };
}


function OpenHouseBannerItem({ project, index }: { project: OpenHouseProject; index: number }) {
    const [calOpen, setCalOpen] = useState(false);
    const daysUntil = daysUntilOpenHouse(project.openHouse.date);
    const isToday = daysUntil <= 0;
    const isTomorrow = daysUntil === 1;
    const urgencyLabel = isToday ? 'TODAY' : isTomorrow ? 'TOMORROW' : `IN ${daysUntil} DAYS`;

    return (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1.8 + index * 0.15, duration: 0.6 }}
                        >
                            {/* Whole card opens the Add-to-Calendar chooser; the arrow on the right goes to the listing. */}
                            <div
                                role="button"
                                tabIndex={0}
                                onClick={() => setCalOpen(true)}
                                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setCalOpen(true); } }}
                                title="Add this open house to your calendar"
                                className="block group cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-blueprint-accent"
                            >
                                <div className="relative border border-blueprint-accent/60 bg-gradient-to-r from-blueprint-accent/10 via-blueprint/60 to-blueprint-accent/10 backdrop-blur-lg p-5 md:p-6 overflow-hidden hover:border-blueprint-accent transition-all duration-300">
                                    {/* Animated shimmer effect */}
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blueprint-accent/5 to-transparent animate-[shimmer_3s_ease-in-out_infinite] pointer-events-none" />
                                    
                                    {/* Corner accents */}
                                    <div className="absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2 border-blueprint-accent" />
                                    <div className="absolute top-0 right-0 w-5 h-5 border-t-2 border-r-2 border-blueprint-accent" />
                                    <div className="absolute bottom-0 left-0 w-5 h-5 border-b-2 border-l-2 border-blueprint-accent" />
                                    <div className="absolute bottom-0 right-0 w-5 h-5 border-b-2 border-r-2 border-blueprint-accent" />

                                    <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                                        {/* Left: Icon + Details */}
                                        <div className="flex items-center gap-4 md:gap-5">
                                            {/* Calendar dropdown — add to preferred calendar */}
                                            <AddToCalendarButton
                                                event={{
                                                    title: project.title,
                                                    location: project.location,
                                                    date: project.openHouse.date,
                                                    startTime: project.openHouse.startTime,
                                                    endTime: project.openHouse.endTime,
                                                    address: project.address,
                                                    coordinates: project.coordinates,
                                                }}
                                                size="sm"
                                                open={calOpen}
                                                onOpenChange={setCalOpen}
                                            />

                                            <div>
                                                <div className="flex items-center gap-3 mb-1">
                                                    <span className="text-blueprint-accent font-bold uppercase tracking-[0.2em] text-xs md:text-sm">Open House</span>
                                                    <span className={`text-[10px] md:text-xs font-bold uppercase tracking-widest px-2 py-0.5 border ${isToday ? 'bg-red-500/20 text-red-400 border-red-500/50 animate-pulse' : isTomorrow ? 'bg-amber-500/20 text-amber-400 border-amber-500/50' : 'bg-blueprint-accent/10 text-blueprint-accent border-blueprint-accent/30'}`}>
                                                        {urgencyLabel}
                                                    </span>
                                                </div>
                                                <p className="text-white font-architect text-lg md:text-2xl tracking-wide">
                                                    {project.title}
                                                    <span className="text-gray-400 font-tech text-sm ml-3 hidden md:inline">{project.location}</span>
                                                </p>
                                                <p className="text-gray-400 font-tech text-sm md:hidden mt-0.5">{project.location}</p>
                                            </div>
                                        </div>

                                        {/* Right: Date + Time + Arrow */}
                                        <div className="flex items-center gap-4 md:gap-6 w-full md:w-auto justify-between md:justify-end pl-16 md:pl-0">
                                            <div className="text-right">
                                                <p className="text-white font-mono text-sm md:text-base tracking-wide">
                                                    {formatOpenHouseDate(project.openHouse.date, { weekday: 'short', month: 'short', day: 'numeric' })}
                                                </p>
                                                <p className="text-blueprint-accent font-mono text-xs md:text-sm">
                                                    {formatOpenHouseTime(project.openHouse.startTime)} – {formatOpenHouseTime(project.openHouse.endTime)}
                                                </p>
                                                <p className="text-white/40 font-mono text-[9px] md:text-[10px] uppercase tracking-widest mt-1">Click to add to calendar</p>
                                            </div>
                                            <Link
                                                href={`/projects/${project.id}`}
                                                onClick={(e) => e.stopPropagation()}
                                                title="View this home"
                                                className="flex items-center gap-1 text-blueprint-accent hover:text-white transition-colors duration-300 shrink-0"
                                            >
                                                <span className="hidden md:inline font-mono text-[10px] uppercase tracking-widest">View Home</span>
                                                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform duration-300" />
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
    );
}

export default function OpenHouseBanner({ projects }: { projects: OpenHouseProject[] }) {
    // Force re-render every 60s so the urgency label stays current (e.g. at midnight)
    const [, setTick] = useState(0);
    useEffect(() => {
        const interval = setInterval(() => setTick((t: number) => t + 1), 60_000);
        return () => clearInterval(interval);
    }, []);

    if (projects.length === 0) return null;

    return (
        <section className="w-full max-w-[1340px] min-[2000px]:max-w-[1700px] mx-auto px-4 md:px-12 pt-4 pb-8 md:pb-12 relative z-10">
            <div className="space-y-4">
                {projects.map((project, i) => (
                    <OpenHouseBannerItem key={`${project.id}-${i}`} project={project} index={i} />
                ))}
            </div>
        </section>
    );
}
