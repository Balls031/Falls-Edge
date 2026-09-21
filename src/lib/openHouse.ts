/**
 * Open house date/time helpers.
 *
 * Open houses are stored as a wall-clock date + time ("2026-09-21", "14:00") with no
 * timezone. Every listing is in South Dakota, so we always interpret those values in
 * Central time — regardless of where the server (Vercel runs in UTC) or the visitor is.
 */

const SITE_TIMEZONE = 'America/Chicago';

/** How long after an open house ends it still counts as "current". */
const END_GRACE_MS = 30 * 60 * 1000;

export type OpenHouse = { date: string; startTime: string; endTime: string };

/** Convert a Central-time wall clock (date + "HH:mm") to a real instant. */
function zonedDate(date: string, time: string): Date {
    const [y, m, d] = date.split('-').map(Number);
    const [hh, mm] = time.split(':').map(Number);
    const guess = Date.UTC(y, m - 1, d, hh, mm);

    // Find what Central time reads at the guessed instant, then shift by the difference.
    const parts = Object.fromEntries(
        new Intl.DateTimeFormat('en-US', {
            timeZone: SITE_TIMEZONE, hour12: false,
            year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit',
        }).formatToParts(new Date(guess)).map(p => [p.type, p.value])
    );
    const asIf = Date.UTC(+parts.year, +parts.month - 1, +parts.day, +parts.hour % 24, +parts.minute);
    return new Date(guess - (asIf - guess));
}

export function getOpenHouseWindow(oh: OpenHouse): { start: Date; end: Date } {
    const start = zonedDate(oh.date, oh.startTime);
    let end = zonedDate(oh.date, oh.endTime);
    if (end.getTime() <= start.getTime()) end = new Date(start.getTime() + 3 * 60 * 60 * 1000); // bad data guard
    return { start, end };
}

/** True while the open house is upcoming or in progress (plus a short grace period after it ends). */
export function isOpenHouseCurrent(oh: OpenHouse, now: number = Date.now()): boolean {
    return getOpenHouseWindow(oh).end.getTime() + END_GRACE_MS > now;
}

/** The soonest open house that hasn't finished yet, or undefined. */
export function getNextOpenHouse<T extends OpenHouse>(openHouses: T[] | undefined, now: number = Date.now()): T | undefined {
    return openHouses
        ?.filter(oh => isOpenHouseCurrent(oh, now))
        .sort((a, b) => getOpenHouseWindow(a).start.getTime() - getOpenHouseWindow(b).start.getTime())[0];
}

/** Today's calendar date in Central time, as "YYYY-MM-DD". */
function todayInSiteTz(now: number = Date.now()): string {
    const parts = Object.fromEntries(
        new Intl.DateTimeFormat('en-CA', { timeZone: SITE_TIMEZONE, year: 'numeric', month: '2-digit', day: '2-digit' })
            .formatToParts(new Date(now)).map(p => [p.type, p.value])
    );
    return `${parts.year}-${parts.month}-${parts.day}`;
}

/** Whole days from today (Central) to the open house date. 0 = today, 1 = tomorrow. */
export function daysUntilOpenHouse(date: string, now: number = Date.now()): number {
    const toUtcMidnight = (d: string) => { const [y, m, dd] = d.split('-').map(Number); return Date.UTC(y, m - 1, dd); };
    return Math.round((toUtcMidnight(date) - toUtcMidnight(todayInSiteTz(now))) / 86_400_000);
}

/** "14:30" → "2:30 PM". Pure string formatting, no timezone involved. */
export function formatOpenHouseTime(time: string): string {
    const [h, m] = time.split(':').map(Number);
    const suffix = h >= 12 ? 'PM' : 'AM';
    const hour12 = h % 12 === 0 ? 12 : h % 12;
    return `${hour12}:${String(m).padStart(2, '0')} ${suffix}`;
}

/** Format the open house calendar date (e.g. "Saturday, September 21") without timezone drift. */
export function formatOpenHouseDate(date: string, options: Intl.DateTimeFormatOptions): string {
    const [y, m, d] = date.split('-').map(Number);
    return new Date(Date.UTC(y, m - 1, d, 12)).toLocaleDateString('en-US', { ...options, timeZone: 'UTC' });
}
