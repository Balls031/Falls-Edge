import { NextResponse } from 'next/server';
import { SESSION_COOKIE, sessionCookieOptions, checkPassword, createSessionToken, isAdminConfigured } from '@/lib/adminAuth';

export async function POST(request: Request) {
    if (!(await isAdminConfigured())) {
        return NextResponse.json({ error: 'No admin password is configured on the server (set ADMIN_PASSWORD).' }, { status: 500 });
    }

    const body = await request.json().catch(() => ({}));
    if (!(await checkPassword(body?.password))) {
        return NextResponse.json({ error: 'Access denied' }, { status: 401 });
    }

    const token = await createSessionToken();
    if (!token) return NextResponse.json({ error: 'Could not create session' }, { status: 500 });

    const res = NextResponse.json({ success: true });
    res.cookies.set(SESSION_COOKIE, token, sessionCookieOptions);
    return res;
}
