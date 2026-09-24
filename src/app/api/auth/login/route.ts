import { NextResponse } from 'next/server';
import { SESSION_COOKIE, sessionCookieOptions, checkPassword, createSessionToken, isAdminConfigured } from '@/lib/adminAuth';

export async function POST(request: Request) {
    if (!isAdminConfigured()) {
        return NextResponse.json({ error: 'ADMIN_PASSWORD is not configured on the server.' }, { status: 500 });
    }

    const body = await request.json().catch(() => ({}));
    if (!checkPassword(body?.password)) {
        return NextResponse.json({ error: 'Access denied' }, { status: 401 });
    }

    const token = createSessionToken();
    if (!token) return NextResponse.json({ error: 'Could not create session' }, { status: 500 });

    const res = NextResponse.json({ success: true });
    res.cookies.set(SESSION_COOKIE, token, sessionCookieOptions);
    return res;
}
