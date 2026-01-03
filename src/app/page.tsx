import Hero from '@/components/Hero';
import ProjectGallery from '@/components/ProjectGallery';
import ContactCard from '@/components/ContactCard';
import Link from 'next/link';
import { getProjects } from "@/lib/storage";

export const dynamic = 'force-dynamic'; // Ensure we get fresh data

export default async function Home() {
  const projects = await getProjects();
  const featuredProjects = projects.filter(p => p.featured);

  return (
    <main className="min-h-screen">
      <Hero />
      <ProjectGallery initialProjects={featuredProjects} />
      {/* Contact Card removed from home per previous request */}


      {/* Footer / Copyright */}
      <footer className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 md:px-10 bg-blueprint/80 backdrop-blur-md text-xs font-mono text-white/50">
        <div>
          &copy; {new Date().getFullYear()} FALLS EDGE CONSTRUCTION.
        </div>
        <Link href="/admin" className="hover:text-blueprint-accent transition-colors uppercase tracking-widest">
          Admin Access
        </Link>
      </footer>
    </main >
  );
}
