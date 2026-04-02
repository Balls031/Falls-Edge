import Hero from '@/components/Hero';
import ProjectGallery from '@/components/ProjectGallery';
import OpenHouseBanner from '@/components/OpenHouseBanner';
import Link from 'next/link';
import { getProjects } from "@/lib/storage";

export const dynamic = 'force-dynamic'; // Ensure we get fresh data

export default async function Home() {
  const projects = await getProjects();
  const featuredProjects = projects.filter(p => p.featured);

  // Collect all projects with upcoming open houses
  const now = Date.now();
  const openHouseProjects = projects
    .filter(p => p.status === 'available' && p.openHouses?.length)
    .flatMap(p =>
      (p.openHouses || [])
        .map(oh => ({
          ...oh,
          dateObj: new Date(`${oh.date}T${oh.startTime}`),
        }))
        .filter(oh => oh.dateObj.getTime() > now - (12 * 60 * 60 * 1000)) // include today's events even if start time passed (12h grace)
        .map(oh => ({
          id: p.id,
          title: p.title,
          location: p.location,
          address: p.address,
          coordinates: p.coordinates,
          openHouse: oh,
        }))
    )
    .sort((a, b) => a.openHouse.dateObj.getTime() - b.openHouse.dateObj.getTime())
    .slice(0, 3); // Max 3 banners

  return (
    <main className="min-h-screen">
      <Hero />
      <OpenHouseBanner projects={openHouseProjects} />
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
