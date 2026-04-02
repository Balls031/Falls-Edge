'use client';

import { useState, useRef, useEffect } from 'react';
import { Calendar } from 'lucide-react';

interface CalendarEvent {
    title: string;
    location: string;
    date: string;       // "2026-04-05"
    startTime: string;  // "10:00"
    endTime: string;    // "14:00"
    address?: string;   // Full street address for navigation
    coordinates?: { lat: number; lng: number }; // GPS for new construction
}

/**
 * Resolve the best location string for calendar events.
 * Priority: address > formatted coordinates > fallback location name.
 */
function resolveLocation(event: CalendarEvent): string {
    if (event.address) return event.address;
    if (event.coordinates) return `${event.coordinates.lat}, ${event.coordinates.lng}`;
    return event.location;
}

function toGoogleDate(date: string, time: string): string {
    // Google wants: 20260405T100000  (local time, no Z suffix for floating time)
    const [y, m, d] = date.split('-');
    const [h, min] = time.split(':');
    return `${y}${m.padStart(2, '0')}${d.padStart(2, '0')}T${h.padStart(2, '0')}${min.padStart(2, '0')}00`;
}

function buildGoogleCalendarUrl(event: CalendarEvent): string {
    const loc = resolveLocation(event);
    const params = new URLSearchParams({
        action: 'TEMPLATE',
        text: `Open House – ${event.title}`,
        dates: `${toGoogleDate(event.date, event.startTime)}/${toGoogleDate(event.date, event.endTime)}`,
        details: `Open House at ${event.title}\n${loc}\nHosted by Falls Edge Construction`,
        location: loc,
    });
    return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

function buildOutlookUrl(event: CalendarEvent): string {
    const loc = resolveLocation(event);
    const startDt = `${event.date}T${event.startTime}:00`;
    const endDt = `${event.date}T${event.endTime}:00`;
    const params = new URLSearchParams({
        path: '/calendar/action/compose',
        rru: 'addevent',
        subject: `Open House – ${event.title}`,
        startdt: startDt,
        enddt: endDt,
        body: `Open House at ${event.title}\n${loc}\nHosted by Falls Edge Construction`,
        location: loc,
    });
    return `https://outlook.live.com/calendar/0/action/compose?${params.toString()}`;
}

function buildYahooUrl(event: CalendarEvent): string {
    const loc = resolveLocation(event);
    const st = toGoogleDate(event.date, event.startTime);
    const et = toGoogleDate(event.date, event.endTime);
    const params = new URLSearchParams({
        v: '60',
        title: `Open House – ${event.title}`,
        st,
        et,
        desc: `Open House at ${event.title}\n${loc}\nHosted by Falls Edge Construction`,
        in_loc: loc,
    });
    return `https://calendar.yahoo.com/?${params.toString()}`;
}

function buildAppleIcsContent(event: CalendarEvent): string {
    const loc = resolveLocation(event);
    const pad2 = (n: number) => n.toString().padStart(2, '0');
    const [y, m, d] = event.date.split('-');
    const [sh, sm] = event.startTime.split(':');
    const [eh, em] = event.endTime.split(':');
    const dtStart = `${y}${pad2(Number(m))}${pad2(Number(d))}T${pad2(Number(sh))}${pad2(Number(sm))}00`;
    const dtEnd = `${y}${pad2(Number(m))}${pad2(Number(d))}T${pad2(Number(eh))}${pad2(Number(em))}00`;
    const now = new Date();
    const stamp = `${now.getUTCFullYear()}${pad2(now.getUTCMonth() + 1)}${pad2(now.getUTCDate())}T${pad2(now.getUTCHours())}${pad2(now.getUTCMinutes())}${pad2(now.getUTCSeconds())}Z`;

    const lines = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//Falls Edge Construction//Open House//EN',
        'CALSCALE:GREGORIAN',
        'METHOD:PUBLISH',
        'BEGIN:VEVENT',
        `DTSTART:${dtStart}`,
        `DTEND:${dtEnd}`,
        `DTSTAMP:${stamp}`,
        `UID:openhouse-${event.date}@fallsedge.com`,
        `SUMMARY:Open House – ${event.title}`,
        `DESCRIPTION:Open House at ${event.title}\\n${loc}\\nHosted by Falls Edge Construction`,
        `LOCATION:${loc}`,
        'STATUS:CONFIRMED',
    ];

    // Add GEO property if coordinates are available (Apple Calendar / iOS Maps use this)
    if (event.coordinates) {
        lines.push(`GEO:${event.coordinates.lat};${event.coordinates.lng}`);
    }

    lines.push(
        'BEGIN:VALARM',
        'TRIGGER:-PT1H',
        'ACTION:DISPLAY',
        'DESCRIPTION:Open House in 1 hour',
        'END:VALARM',
        'END:VEVENT',
        'END:VCALENDAR',
    );

    return lines.join('\r\n');
}

/**
 * Open .ics via Blob URL — on iOS/macOS this triggers the native
 * "Add to Calendar?" prompt directly, without a visible download.
 */
function openAppleCalendar(event: CalendarEvent): void {
    const icsContent = buildAppleIcsContent(event);
    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);

    // Create a temporary link and click it
    const link = document.createElement('a');
    link.href = url;
    link.download = `open-house-${event.date}.ics`;
    document.body.appendChild(link);
    link.click();

    // Clean up
    setTimeout(() => {
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }, 100);
}

interface AddToCalendarButtonProps {
    event: CalendarEvent;
    /** Size variant — 'sm' for home banner, 'lg' for detail page */
    size?: 'sm' | 'lg';
}

export default function AddToCalendarButton({ event, size = 'sm' }: AddToCalendarButtonProps) {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    // Close on outside click
    useEffect(() => {
        if (!isOpen) return;
        function handleClick(e: MouseEvent) {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, [isOpen]);

    // Close on Escape
    useEffect(() => {
        if (!isOpen) return;
        function handleKey(e: KeyboardEvent) {
            if (e.key === 'Escape') setIsOpen(false);
        }
        document.addEventListener('keydown', handleKey);
        return () => document.removeEventListener('keydown', handleKey);
    }, [isOpen]);

    const iconSize = size === 'lg' ? 28 : 22;
    const iconSizeMobile = size === 'lg' ? 20 : 22;
    const padding = size === 'lg' ? 'p-2.5 md:p-4' : 'p-3 md:p-4';

    const calendarOptions = [
        { label: 'Google Calendar', icon: '🗓️', action: () => window.open(buildGoogleCalendarUrl(event), '_blank') },
        { label: 'Apple Calendar',  icon: '🍎', action: () => openAppleCalendar(event) },
        { label: 'Outlook',         icon: '📧', action: () => window.open(buildOutlookUrl(event), '_blank') },
        { label: 'Yahoo Calendar',  icon: '📅', action: () => window.open(buildYahooUrl(event), '_blank') },
    ];

    return (
        <div ref={containerRef} className="relative shrink-0">
            {/* Pulsing calendar icon */}
            <button
                onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setIsOpen((prev) => !prev);
                }}
                title="Add to Calendar"
                className="relative cursor-pointer group/cal"
            >
                {size === 'sm' && (
                    <div className="absolute inset-0 bg-blueprint-accent/30 rounded-full animate-ping" />
                )}
                <div className={`relative bg-blueprint-accent text-black ${padding} rounded-full group-hover/cal:bg-white group-hover/cal:scale-110 transition-all duration-200`}>
                    {size === 'lg' ? (
                        <>
                            <Calendar size={iconSizeMobile} className="md:hidden" />
                            <Calendar size={iconSize} className="hidden md:block" />
                        </>
                    ) : (
                        <Calendar size={iconSize} />
                    )}
                </div>
            </button>

            {/* Dropdown */}
            {isOpen && (
                <div
                    className="absolute left-1/2 -translate-x-1/2 top-full mt-2 z-50 min-w-[200px] border border-blueprint-accent/40 bg-[#0a1628]/95 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,240,255,0.15)] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200"
                    style={{ borderRadius: '2px' }}
                >
                    {/* Header */}
                    <div className="px-4 py-2.5 border-b border-blueprint-accent/20 bg-blueprint-accent/5">
                        <span className="text-blueprint-accent font-mono text-[10px] uppercase tracking-[0.2em]">
                            Add to Calendar
                        </span>
                    </div>

                    {/* Options */}
                    {calendarOptions.map((option) => (
                        <button
                            key={option.label}
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                option.action();
                                setIsOpen(false);
                            }}
                            className="flex items-center gap-3 px-4 py-3 w-full text-left text-white/80 hover:text-white hover:bg-blueprint-accent/10 transition-all duration-150 border-b border-white/5 last:border-b-0 group/item"
                        >
                            <span className="text-base group-hover/item:scale-110 transition-transform duration-150">
                                {option.icon}
                            </span>
                            <span className="font-tech text-sm tracking-wide">
                                {option.label}
                            </span>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
