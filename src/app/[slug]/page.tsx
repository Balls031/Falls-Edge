import { getProjects, incrementProjectScan } from '@/lib/storage';
import { notifyScan } from '@/lib/notify';
import { notFound, redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { after } from 'next/server';

export default async function RedirectPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;

    // Ignore internal paths if they somehow reach here (though app directory structure usually prevents this)
    if (slug.startsWith('_') || slug === 'admin' || slug === 'api') return notFound();

    const projects = await getProjects();
    const project = projects.find(p => p.qrCode === slug);

    if (project) {
        // Detect Device
        const headersList = await headers();
        const userAgent = headersList.get('user-agent') || '';
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
        const device = isMobile ? 'mobile' : 'desktop';

        // Increment Count (Fire and forget? No, best to await to ensure write)
        await incrementProjectScan(project.id, device);

        // Discord notification — runs after the redirect is sent so it never slows the visitor down.
        const counts = project.scanCount || { mobile: 0, desktop: 0 };
        const updatedProject = { ...project, scanCount: { ...counts, [device]: (counts[device] || 0) + 1 } };
        const proto = headersList.get('x-forwarded-proto') || 'https';
        const host = headersList.get('x-forwarded-host') || headersList.get('host') || 'fallsedge.build';
        const siteUrl = `${proto}://${host}`;
        const location = [headersList.get('x-vercel-ip-city'), headersList.get('x-vercel-ip-country-region'), headersList.get('x-vercel-ip-country')]
            .filter(Boolean).map(v => decodeURIComponent(v as string)).join(', ') || undefined;
        after(() => notifyScan({ project: updatedProject, sign: slug, device, siteUrl, location }));

        redirect(`/projects/${project.id}`);
    }

    return notFound();
}
