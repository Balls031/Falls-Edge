import { getProjects, incrementProjectScan } from '@/lib/storage';
import { notFound, redirect } from 'next/navigation';
import { headers } from 'next/headers';

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

        redirect(`/projects/${project.id}`);
    }

    return notFound();
}
