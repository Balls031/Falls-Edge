import { getProjects } from '@/lib/storage';
import ProjectDetailView from '@/components/ProjectDetailView';

// Revalidate every minute so new projects appear reasonably fast if using ISR, 
// though we usually rely on on-demand, but here simple revalidation is good.
export const revalidate = 60;

// Generate static params for all known projects at build time
export async function generateStaticParams() {
    const projects = await getProjects();
    return projects.map((project) => ({
        id: project.id,
    }));
}

export default async function ProjectPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const projects = await getProjects();
    const project = projects.find((p) => p.id === id);

    if (!project) {
        return <div className="text-white text-center pt-40">Project Not Found</div>;
    }

    return <ProjectDetailView project={project} />;
}
