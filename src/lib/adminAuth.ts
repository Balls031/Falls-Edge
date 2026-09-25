/**
 * Server-side admin authentication.
 *
 * The admin password is stored as a scrypt hash in the site_settings table (key
 * "adminPasswordHash") and can be changed from the admin UI. Until one has been set,
 * the ADMIN_PASSWORD env var is accepted instead (bootstrap / recovery: delete the
 * adminPasswordHash row to fall back to it). The password itself is never stored.
 *
 * A successful login sets an HttpOnly cookie holding a signed, expiring token. API routes
 * that write data require it. The signing key is derived from the current hash, so
 * changing the password invalidates every existing session.
 */
import { createHmac, randomBytes, scryptSync, timingSafeEqual } from 'crypto';
import { NextResponse } from 'next/server';
import { getSettingValue, updateSiteSetting } from './settings';

export const SESSION_COOKIE = 'fe_admin_session';
export const PASSWORD_SETTING_KEY = 'adminPasswordHash';
const SESSION_TTL_SECONDS = 30 * 24 * 60 * 60; // 30 days
export const MIN_PASSWORD_LENGTH = 8;

export const sessionCookieOptions = {
    httpOnly: true,
    sameSite: 'lax' as const,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: SESSION_TTL_SECONDS,
};

// --- password hashing ---

function hashPassword(password: string): string {
    const salt = randomBytes(16).toString('hex');
    const hash = scryptSync(password, salt, 64).toString('hex');
    return `scrypt$${salt}$${hash}`;
}

function verifyPassword(password: string, stored: string): boolean {
    const [algo, salt, hash] = stored.split('$');
    if (algo !== 'scrypt' || !salt || !hash) return false;
    const candidate = scryptSync(password, salt, 64);
    const expected = Buffer.from(hash, 'hex');
    return candidate.length === expected.length && timingSafeEqual(candidate, expected);
}

function safeEqual(a: string, b: string): boolean {
    const ab = Buffer.from(a);
    const bb = Buffer.from(b);
    return ab.length === bb.length && timingSafeEqual(ab, bb);
}

// --- current credential source: stored hash first, env var as fallback ---

async function getStoredHash(): Promise<string | null> {
    return getSettingValue(PASSWORD_SETTING_KEY);
}

export async function isAdminConfigured(): Promise<boolean> {
    return !!(await getStoredHash()) || !!process.env.ADMIN_PASSWORD;
}

export async function checkPassword(input: unknown): Promise<boolean> {
    if (typeof input !== 'string' || !input) return false;
    const stored = await getStoredHash();
    if (stored) return verifyPassword(input, stored);
    const envPw = process.env.ADMIN_PASSWORD;
    return !!envPw && safeEqual(input, envPw);
}

export function validateNewPassword(pw: unknown): string | null {
    if (typeof pw !== 'string') return 'Password is required.';
    if (pw.length < MIN_PASSWORD_LENGTH) return `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`;
    if (pw.length > 200) return 'Password is too long.';
    return null;
}

/** Store a new password (as a hash). Existing sessions become invalid. */
export async function setAdminPassword(newPassword: string): Promise<void> {
    await updateSiteSetting(PASSWORD_SETTING_KEY, hashPassword(newPassword));
}

// --- session tokens ---

// Derived from the current credential so there's only one secret to manage and a
// password change rotates it.
async function signingKey(): Promise<string | null> {
    const source = (await getStoredHash()) || process.env.ADMIN_PASSWORD;
    return source ? createHmac('sha256', 'falls-edge-admin-session').update(source).digest('hex') : null;
}

function sign(payload: string, key: string): string {
    return createHmac('sha256', key).update(payload).digest('hex');
}

/** Token format: "<expiry unix seconds>.<hmac>" */
export async function createSessionToken(): Promise<string | null> {
    const key = await signingKey();
    if (!key) return null;
    const exp = String(Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS);
    return `${exp}.${sign(exp, key)}`;
}

export async function verifySessionToken(token: string | null | undefined): Promise<boolean> {
    if (!token) return false;
    const key = await signingKey();
    if (!key) return false;
    const [exp, sig] = token.split('.');
    if (!exp || !sig) return false;
    if (!safeEqual(sig, sign(exp, key))) return false;
    return Number(exp) > Math.floor(Date.now() / 1000);
}

/** True when the request carries a valid admin session cookie. */
export async function isAdminRequest(request: Request): Promise<boolean> {
    const cookie = request.headers.get('cookie') || '';
    const match = cookie.match(new RegExp(`(?:^|;\\s*)${SESSION_COOKIE}=([^;]+)`));
    return verifySessionToken(match?.[1]);
}

export function unauthorized() {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}
