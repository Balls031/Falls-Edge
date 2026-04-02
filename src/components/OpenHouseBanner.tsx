'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Calendar, ArrowRight } from 'lucide-react';

interface OpenHouseProject {
    id: string;
    title: string;
    location: string;
    openHouse: {
        date: string;
        startTime: string;
        endTime: string;
        dateObj: Date | string; // Next.js serializes Date to string when passing server→client
    };
}

function formatTime(time: string) {
    const [h, m] = time.split(':');
    const date = new Date();
    date.setHours(Number(h));
    date.setMinutes(Number(m));
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
}

function toDate(d: Date | string): Date {
    return d instanceof Date ? d : new Date(d);
}

function getDaysUntil(dateObj: Date | string): number {
    // Compare calendar dates only (strip time component)
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const eventDate = toDate(dateObj);
    const target = new Date(eventDate.getFullYear(), eventDate.getMonth(), eventDate.getDate());
    const diffMs = target.getTime() - today.getTime();
    return Math.round(diffMs / (1000 * 60 * 60 * 24));
}

function pad2(n: number) {
    return n.toString().padStart(2, '0');
}

function toICSDateLocal(dateStr: string, timeStr: string): string {
    // dateStr = "2026-04-05", timeStr = "10:00"
    // Returns: 20260405T100000
    const [y, m, d] = dateStr.split('-');
    const [h, min] = timeStr.split(':');
    return `${y}${pad2(Number(m))}${pad2(Number(d))}T${pad2(Number(h))}${pad2(Number(min))}00`;
}

function downloadICS(project: OpenHouseProject) {
    const { title, location, openHouse } = project;
    const dtStart = toICSDateLocal(openHouse.date, openHouse.startTime);
    const dtEnd = toICSDateLocal(openHouse.date, openHouse.endTime);
    const now = new Date();
    const stamp = `${now.getUTCFullYear()}${pad2(now.getUTCMonth() + 1)}${pad2(now.getUTCDate())}T${pad2(now.getUTCHours())}${pad2(now.getUTCMinutes())}${pad2(now.getUTCSeconds())}Z`;

    const ics = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//Falls Edge Construction//Open House//EN',
        'CALSCALE:GREGORIAN',
        'METHOD:PUBLISH',
        'BEGIN:VEVENT',
        `DTSTART:${dtStart}`,
        `DTEND:${dtEnd}`,
        `DTSTAMP:${stamp}`,
        `UID:openhouse-${project.id}-${openHouse.date}@fallsedge.com`,
        `SUMMARY:Open House - ${title}`,
        `DESCRIPTION:Open House at ${title}\\n${location}\\nHosted by Falls Edge Construction`,
        `LOCATION:${location}`,
        'STATUS:CONFIRMED',
        'BEGIN:VALARM',
        'TRIGGER:-PT1H',
        'ACTION:DISPLAY',
        'DESCRIPTION:Open House in 1 hour',
        'END:VALARM',
        'END:VEVENT',
        'END:VCALENDAR',
    ].join('\r\n');

    const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Open_House_${title.replace(/\s+/g, '_')}.ics`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

export default function OpenHouseBanner({ projects }: { projects: OpenHouseProject[] }) {
    if (projects.length === 0) return null;

    return (
        <section className="w-full max-w-[1340px] min-[2000px]:max-w-[1700px] mx-auto px-4 md:px-12 pt-4 pb-8 md:pb-12 relative z-10">
            <div className="space-y-4">
                {projects.map((project, i) => {
                    const daysUntil = getDaysUntil(project.openHouse.dateObj);
                    const isToday = daysUntil <= 0;
                    const isTomorrow = daysUntil === 1;
                    const urgencyLabel = isToday ? 'TODAY' : isTomorrow ? 'TOMORROW' : `IN ${daysUntil} DAYS`;

                    return (
                        <motion.div
                            key={`${project.id}-${i}`}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1.8 + i * 0.15, duration: 0.6 }}
                        >
                            <Link href={`/projects/${project.id}`} className="block group">
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
                                            {/* Pulsing calendar icon — click to add to calendar */}
                                            <button
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    downloadICS(project);
                                                }}
                                                title="Add to Calendar"
                                                className="relative shrink-0 cursor-pointer group/cal"
                                            >
                                                <div className="absolute inset-0 bg-blueprint-accent/30 rounded-full animate-ping" />
                                                <div className="relative bg-blueprint-accent text-black p-3 md:p-4 rounded-full group-hover/cal:bg-white group-hover/cal:scale-110 transition-all duration-200">
                                                    <Calendar size={22} />
                                                </div>
                                            </button>

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
                                                    {toDate(project.openHouse.dateObj).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                                                </p>
                                                <p className="text-blueprint-accent font-mono text-xs md:text-sm">
                                                    {formatTime(project.openHouse.startTime)} – {formatTime(project.openHouse.endTime)}
                                                </p>
                                            </div>
                                            <div className="text-blueprint-accent group-hover:translate-x-1 transition-transform duration-300">
                                                <ArrowRight size={20} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    );
                })}
            </div>
        </section>
    );
}
