import { NextResponse } from 'next/server';
import { getRealtors, addRealtor, deleteRealtor, updateRealtor, updateRealtorInProjects } from '@/lib/storage';
import { Realtor } from '@/lib/data';

export async function GET() {
    const realtors = await getRealtors();
    return NextResponse.json(realtors);
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        if (!body.name || !body.id) {
            return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
        }

        await addRealtor(body as Realtor);
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({ error: 'Failed to create realtor', details: JSON.stringify(error) }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    try {
        const body = await request.json();
        if (!body.name || !body.id) {
            return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
        }

        await updateRealtor(body as Realtor);

        // Auto-sync: push updated realtor data into all projects that reference this realtor
        try {
            await updateRealtorInProjects(body as Realtor);
        } catch (syncError) {
            console.error('Warning: Realtor saved but project sync failed:', syncError);
            // Don't fail the request — the realtor itself was saved successfully
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({ error: 'Failed to update realtor', details: JSON.stringify(error) }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
        return NextResponse.json({ error: 'Missing ID' }, { status: 400 });
    }

    await deleteRealtor(id);
    return NextResponse.json({ success: true });
}
