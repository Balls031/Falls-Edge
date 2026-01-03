import { NextResponse } from 'next/server';
import { getProjects, addProject, deleteProject, updateProject } from '@/lib/storage';
import { Project } from '@/lib/data';

export async function GET() {
    const projects = await getProjects();
    return NextResponse.json(projects);
}

export async function POST(request: Request) {
    const body = await request.json();
    // Basic validation
    if (!body.title || !body.id) {
        return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    await addProject(body as Project);
    return NextResponse.json({ success: true });
}

export async function PUT(request: Request) {
    const body = await request.json();
    if (!body.title || !body.id) {
        return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    await updateProject(body as Project);
    return NextResponse.json({ success: true });
}

export async function DELETE(request: Request) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
        return NextResponse.json({ error: 'Missing ID' }, { status: 400 });
    }

    await deleteProject(id);
    return NextResponse.json({ success: true });
}
