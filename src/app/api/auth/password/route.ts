import { NextResponse } from 'next/server';
import {
    SESSION_COOKIE, sessionCookieOptions, isAdminRequest, unauthorized,
    checkPassword, validateNewPassword, setAdminPassword, createSessionToken,
} from '@/lib/adminAuth';

/** Change the admin password. Requires a signed-in session AND the current password. */
export async function POST(request: Request) {
    if (!(await isAdminRequest(request))) return unauthorized();

    const body = await request.json().catch(() => ({}));
    if (!(await checkPassword(body?.currentPassword))) {
        return NextResponse.json({ error: 'Current password is incorrect.' }, { status: 403 });
    }
    const problem = validateNewPassword(body?.newPassword);
    if (problem) return NextResponse.json({ error: problem }, { status: 400 });

    await setAdminPassword(body.newPassword);

    // The signing key just rotated, so re-issue this session's cookie; all other sessions are now signed out.
    const token = await createSessionToken();
    const res = NextResponse.json({ success: true });
    if (token) res.cookies.set(SESSION_COOKIE, token, sessionCookieOptions);
    return res;
}
