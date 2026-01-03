import { NextResponse } from 'next/server';
import sharp from 'sharp';
import { supabase } from '@/lib/supabase';

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

    try {
        const { data: uploadData, error } = await supabase.storage
            .from('images')
            .upload(name, processedBuffer, {
                contentType: 'image/jpeg',
                upsert: true
            });

        if (error) {
            console.error('Supabase upload error:', error);
            throw error;
        }

        const { data: { publicUrl } } = supabase.storage
            .from('images')
            .getPublicUrl(name);

        return NextResponse.json({ success: true, url: publicUrl });
    } catch (e) {
        console.error("Upload error:", e);
        return NextResponse.json({ success: false, error: 'Upload failed' }, { status: 500 });
    }
}
