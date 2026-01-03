<<<<<<< HEAD
import { getProjects } from '@/lib/storage';
import { notFound, redirect } from 'next/navigation';

export default async function RedirectPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;

    // Ignore internal paths if they somehow reach here (though app directory structure usually prevents this)
    if (slug.startsWith('_') || slug === 'admin' || slug === 'api') return notFound();

    const projects = await getProjects();
    const project = projects.find(p => p.qrCode === slug);

    if (project) {
        redirect(`/projects/${project.id}`);
    }

    return notFound();
}
=======
import { getProjects } from '@/lib/storage';
import { notFound, redirect } from 'next/navigation';

export default async function RedirectPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;

    // Ignore internal paths if they somehow reach here (though app directory structure usually prevents this)
    if (slug.startsWith('_') || slug === 'admin' || slug === 'api') return notFound();

    const projects = await getProjects();
    const project = projects.find(p => p.qrCode === slug);

    if (project) {
        redirect(`/projects/${project.id}`);
    }

    return notFound();
}
>>>>>>> f23c7ec5816116c984b5737788af5cbb8de299c1
