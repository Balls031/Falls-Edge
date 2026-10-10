import { NextResponse } from 'next/server';
import { isAdminRequest, unauthorized } from '@/lib/adminAuth';
import { isNotifyConfigured, notifyTest } from '@/lib/notify';

export const dynamic = 'force-dynamic';

/** Is a Discord webhook configured? (admin only) */
export async function GET(request: Request) {
    if (!(await isAdminRequest(request))) return unauthorized();
    return NextResponse.json({ configured: isNotifyConfigured() });
}

/** Send a test message to the configured webhook (admin only). */
export async function POST(request: Request) {
    if (!(await isAdminRequest(request))) return unauthorized();
    if (!isNotifyConfigured()) {
        return NextResponse.json({ error: 'DISCORD_WEBHOOK_URL is not set on the server.' }, { status: 400 });
    }
    const siteUrl = new URL(request.url).origin;
    const ok = await notifyTest(siteUrl);
    return ok
        ? NextResponse.json({ success: true })
        : NextResponse.json({ error: 'Discord rejected the message — check the webhook URL.' }, { status: 502 });
}
