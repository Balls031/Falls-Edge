<<<<<<< HEAD
import { NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import sharp from 'sharp';

export async function POST(request: Request) {
    const data = await request.formData();
    const file: File | null = data.get('file') as unknown as File;

    if (!file) {
        return NextResponse.json({ success: false }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Optimize with Sharp
    // Resize to max 1920px width, convert to JPEG with 85% quality
    let processedBuffer;
    try {
        processedBuffer = await sharp(buffer)
            .resize(1920, null, { withoutEnlargement: true }) // Maintains aspect ratio
            .jpeg({ quality: 85, mozjpeg: true })
            .toBuffer();
    } catch (e) {
        console.error("Optimization failed:", e);
        // Fallback to original buffer if sharp fails (e.g. non-image)
        processedBuffer = buffer;
    }

    // Ensure .jpg extension since we converted to jpeg
    const safeName = file.name.replace(/\.[^/.]+$/, "");
    const name = `${Date.now()}-${safeName}.jpg`;

    const path = join(process.cwd(), 'public', 'uploads', name);

    try {
        await writeFile(path, processedBuffer);
        return NextResponse.json({ success: true, url: `/uploads/${name}` });
    } catch (e) {
        console.error("Upload error:", e);
        return NextResponse.json({ success: false, error: 'Upload failed' }, { status: 500 });
    }
}
=======
import { NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import sharp from 'sharp';

export async function POST(request: Request) {
    const data = await request.formData();
    const file: File | null = data.get('file') as unknown as File;

    if (!file) {
        return NextResponse.json({ success: false }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Optimize with Sharp
    // Resize to max 1920px width, convert to JPEG with 85% quality
    let processedBuffer;
    try {
        processedBuffer = await sharp(buffer)
            .resize(1920, null, { withoutEnlargement: true }) // Maintains aspect ratio
            .jpeg({ quality: 85, mozjpeg: true })
            .toBuffer();
    } catch (e) {
        console.error("Optimization failed:", e);
        // Fallback to original buffer if sharp fails (e.g. non-image)
        processedBuffer = buffer;
    }

    // Ensure .jpg extension since we converted to jpeg
    const safeName = file.name.replace(/\.[^/.]+$/, "");
    const name = `${Date.now()}-${safeName}.jpg`;

    const path = join(process.cwd(), 'public', 'uploads', name);

    try {
        await writeFile(path, processedBuffer);
        return NextResponse.json({ success: true, url: `/uploads/${name}` });
    } catch (e) {
        console.error("Upload error:", e);
        return NextResponse.json({ success: false, error: 'Upload failed' }, { status: 500 });
    }
}
>>>>>>> f23c7ec5816116c984b5737788af5cbb8de299c1
