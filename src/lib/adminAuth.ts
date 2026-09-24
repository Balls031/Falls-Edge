/**
 * Server-side admin authentication.
 *
 * The admin key lives only in the ADMIN_PASSWORD env var (never in the client bundle).
 * A successful login sets an HttpOnly cookie holding a signed, expiring token; API routes
 * that write data require it. Changing ADMIN_PASSWORD invalidates every existing session.
 */
import { createHmac, timingSafeEqual } from 'crypto';
import { NextResponse } from 'next/server';

export const SESSION_COOKIE = 'fe_admin_session';
const SESSION_TTL_SECONDS = 30 * 24 * 60 * 60; // 30 days

export const sessionCookieOptions = {
    httpOnly: true,
    sameSite: 'lax' as const,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: SESSION_TTL_SECONDS,
};

export function isAdminConfigured(): boolean {
    return !!process.env.ADMIN_PASSWORD;
}

// Signing key derived from the password so there's only one secret to manage.
function signingKey(): string | null {
    const pw = process.env.ADMIN_PASSWORD;
    return pw ? createHmac('sha256', 'falls-edge-admin-session').update(pw).digest('hex') : null;
}

function sign(payload: string, key: string): string {
    return createHmac('sha256', key).update(payload).digest('hex');
}

function safeEqual(a: string, b: string): boolean {
    const ab = Buffer.from(a);
    const bb = Buffer.from(b);
    return ab.length === bb.length && timingSafeEqual(ab, bb);
}

export function checkPassword(input: string): boolean {
    const pw = process.env.ADMIN_PASSWORD;
    return !!pw && typeof input === 'string' && safeEqual(input, pw);
}

/** Token format: "<expiry unix seconds>.<hmac>" */
export function createSessionToken(): string | null {
    const key = signingKey();
    if (!key) return null;
    const exp = String(Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS);
    return `${exp}.${sign(exp, key)}`;
}

export function verifySessionToken(token: string | null | undefined): boolean {
    if (!token) return false;
    const key = signingKey();
    if (!key) return false;
    const [exp, sig] = token.split('.');
    if (!exp || !sig) return false;
    if (!safeEqual(sig, sign(exp, key))) return false;
    return Number(exp) > Math.floor(Date.now() / 1000);
}

/** True when the request carries a valid admin session cookie. */
export function isAdminRequest(request: Request): boolean {
    const cookie = request.headers.get('cookie') || '';
    const match = cookie.match(new RegExp(`(?:^|;\\s*)${SESSION_COOKIE}=([^;]+)`));
    return verifySessionToken(match?.[1]);
}

export function unauthorized() {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}
