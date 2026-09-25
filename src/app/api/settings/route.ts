import { NextResponse } from 'next/server';
import { isAdminRequest, unauthorized } from '@/lib/adminAuth';
import { getSiteSettings, updateSiteSetting } from '@/lib/settings';

// Settings this generic endpoint may write. The admin password is changed via /api/auth/password.
const EDITABLE_SETTINGS = new Set(['hideOurHomesPage']);

export async function GET() {
    const settings = await getSiteSettings();
    return NextResponse.json(settings);
}

export async function PUT(request: Request) {
    if (!(await isAdminRequest(request))) return unauthorized();
    try {
        const body = await request.json();
        const { key, value } = body;

        if (!key) {
            return NextResponse.json({ error: 'Missing key' }, { status: 400 });
        }
        if (!EDITABLE_SETTINGS.has(key)) {
            return NextResponse.json({ error: 'Unknown setting' }, { status: 400 });
        }

        await updateSiteSetting(key, String(value));
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Settings API Error:', error);
        return NextResponse.json(
            { error: 'Failed to update setting', details: JSON.stringify(error) },
            { status: 500 }
        );
    }
}
