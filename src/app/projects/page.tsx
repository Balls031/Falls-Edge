import ProjectGallery from '@/components/ProjectGallery';
import ContactCard from '@/components/ContactCard';
import Link from 'next/link';
import { getProjects } from "@/lib/storage";

export const dynamic = 'force-dynamic';

export default async function ProjectsPage() {
    const projects = await getProjects();

    return (
        <main className="min-h-screen pt-24 md:pt-40">
            <div className="w-full max-w-[1340px] min-[2000px]:max-w-[1700px] mx-auto px-4 md:px-[80px]">
                {/* Header */}
                <div className="mb-20 text-center">
                    <h1 className="text-5xl md:text-6xl font-architect text-white mb-6">Our Homes</h1>
                    <p className="text-lg text-gray-400 font-tech max-w-2xl mx-auto leading-relaxed">
                        Take a look at the plans. From the first line on the grid to the final nail, we build functional homes designed for real life in South Dakota.
                    </p>
                </div>
            </div>

            <ProjectGallery initialProjects={projects} showTitle={false} />

            <div className="py-20">
                <ContactCard />
            </div>

            {/* Footer / Copyright */}
            <footer className="text-center py-10 text-xs text-white/30 font-mono border-t border-white/10 relative z-10 bg-blueprint">
                <div className="mb-4">
                    &copy; {new Date().getFullYear()} FALLS EDGE CONSTRUCTION.
                </div>
                <Link href="/admin" className="hover:text-white/60 transition-colors uppercase tracking-widest border-b border-white/10 pb-0.5">
                    Admin Access
                </Link>
            </footer>
        </main>
    );
}
