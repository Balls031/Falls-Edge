'use client';

import Link from 'next/link';
import { Project } from '@/lib/data';
import ContactCard from '@/components/ContactCard';
import ProjectTabs from '@/components/ProjectTabs';
import Lightbox from '@/components/Lightbox';
import { useState } from 'react';

export default function ProjectDetailView({ project }: { project: Project }) {
    const [tab, setTab] = useState<'photos' | 'plans'>('photos');
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [photoIndex, setPhotoIndex] = useState(0);

    const allPhotos = [project.image, ...(project.gallery || [])];

    const openLightbox = (index: number) => {
        setPhotoIndex(index);
        setLightboxOpen(true);
    };

    return (
        <main className="pt-20 pb-20 w-full max-w-[1340px] min-[2000px]:max-w-[1700px] mx-auto px-4 md:px-8 relative">
            {/* Back Nav */}
            <div className="fixed top-6 left-6 z-50">
                <Link href="/" className="flex items-center gap-2 text-white/50 hover:text-blueprint-accent transition-colors font-mono text-xs uppercase tracking-widest border border-white/20 bg-blueprint/80 px-4 py-2 backdrop-blur">
                    &larr; Back Home
                </Link>
            </div>

            {/* Header */}
            <header className="w-full px-[40px] md:px-[80px] mb-20 relative">
                <div className="border-l-2 border-blueprint-accent pl-6 mb-8 mt-12">
                    <span className="block text-blueprint-accent font-mono text-sm tracking-[0.3em] mb-2">PROJECT NO. {(project.projectNumber || project.id).padStart(3, '0')}</span>
                    <h1 className="text-5xl md:text-7xl font-architect text-white mb-2">{project.title}</h1>
                    <p className="text-xl text-gray-400 font-tech">{project.location}</p>
                </div>

                {/* Status Stamp */}
                {project.status !== 'available' && (
                    <div className="absolute top-0 right-20 md:right-40 border-[6px] border-red-700/80 text-red-700/80 p-4 font-bold uppercase text-4xl -rotate-12 opacity-80 mix-blend-screen hidden md:block select-none pointer-events-none">
                        <div className="border border-red-700/80 px-4 py-1">
                            {project.status}
                        </div>
                    </div>
                )}

                {/* ROW 1: Specs and Realtor 1 */}
                <div className="grid md:grid-cols-12 gap-8 border-t border-blueprint-line py-[20px]">
                    {/* Specs (Left) */}
                    <div className="md:col-span-8">
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-8 h-full">
                            <div>
                                <span className="block text-gray-500 text-xs uppercase tracking-wider mb-1">Price</span>
                                <span className="block text-2xl text-white font-mono">{project.specs.price || 'Inquire'}</span>
                            </div>
                            <div>
                                <span className="block text-gray-500 text-xs uppercase tracking-wider mb-1">Configuration</span>
                                <span className="block text-2xl text-white font-mono">{project.specs.bed} Bed / {project.specs.bath} Bath</span>
                            </div>
                            <div>
                                <span className="block text-gray-500 text-xs uppercase tracking-wider mb-1">Garage Capacity</span>
                                <span className="block text-2xl text-white font-mono">{project.specs.garage} Stalls</span>
                            </div>
                            <div>
                                <span className="block text-gray-500 text-xs uppercase tracking-wider mb-1">Total Area</span>
                                <span className="block text-2xl text-white font-mono">{project.specs.totalSqft} sq.ft</span>
                            </div>
                            <div>
                                <span className="block text-gray-500 text-xs uppercase tracking-wider mb-1">Finished Area</span>
                                <span className="block text-2xl text-white font-mono">{project.specs.finishedSqft} sq.ft</span>
                            </div>
                            <div>
                                <span className="block text-gray-500 text-xs uppercase tracking-wider mb-1">Unfinished</span>
                                <span className="block text-2xl text-white font-mono">{project.specs.unfinishedSqft} sq.ft</span>
                            </div>
                        </div>
                    </div>

                    {/* Realtor 1 (Right) */}
                    <div className="md:col-span-4 flex flex-col">
                        <ContactCard
                            realtor={project.realtors?.[0]}
                            className="h-full"
                        />
                    </div>
                </div>

                {/* ROW 2: Narrative and Realtor 2 */}
                <div className="grid md:grid-cols-12 gap-8 py-[20px]">
                    {/* Narrative (Left) */}
                    <div className="md:col-span-8 flex flex-col">
                        <div className="relative border border-blueprint-line p-6 md:p-8 bg-blueprint/70 backdrop-blur-md h-full">
                            {/* Technical corners */}
                            <div className="absolute -top-1 -left-1 w-3 h-3 border-t border-l border-white/50" />
                            <div className="absolute -top-1 -right-1 w-3 h-3 border-t border-r border-white/50" />
                            <div className="absolute -bottom-1 -left-1 w-3 h-3 border-b border-l border-white/50" />
                            <div className="absolute -bottom-1 -right-1 w-3 h-3 border-b border-r border-white/50" />

                            <h3 className="text-white font-bold uppercase tracking-widest mb-4 font-mono text-sm">Design Narrative</h3>
                            <p className="text-gray-400 leading-relaxed font-tech text-sm">
                                {project.longDescription || project.description}
                            </p>
                        </div>
                    </div>

                    {/* Realtor 2 (Right) - Only if exists */}
                    <div className="md:col-span-4 flex flex-col">
                        {project.realtors?.[1] ? (
                            <ContactCard
                                realtor={project.realtors[1]}
                                className="h-full"
                            />
                        ) : null}
                    </div>
                </div>
            </header>

            {/* Visual Documentation */}
            <section className="w-full px-[40px] md:px-[80px] mb-[40px]">
                <div className="mb-0 flex items-end justify-between border-b border-blueprint-line pb-2">
                    <h3 className="font-architect text-2xl text-white mr-12">Visual Documentation</h3>
                    <ProjectTabs view={tab} onChange={setTab} />
                </div>

                <div className="pt-10 min-h-[500px]">
                    {tab === 'photos' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-[40px] animate-in fade-in duration-500">
                            {/* Primary Image */}
                            <div
                                onClick={() => openLightbox(0)}
                                className="col-span-1 md:col-span-2 aspect-video border border-blueprint-line p-2 relative cursor-zoom-in group"
                            >
                                <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-blueprint-accent" />
                                <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-blueprint-accent" />
                                <img src={project.image} className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all" alt="Primary View" />
                            </div>

                            {/* Gallery Grid */}
                            {project.gallery?.map((img, i) => (
                                <div
                                    key={i}
                                    onClick={() => openLightbox(i + 1)}
                                    className="aspect-[4/3] border border-blueprint-line p-2 relative group hover:border-white transition-colors cursor-zoom-in"
                                >
                                    <img src={img} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" alt={`Detail ${i}`} />
                                    <span className="absolute bottom-3 right-3 text-[10px] text-white bg-black/50 px-1 font-mono">FIG. {i + 1}</span>
                                </div>
                            ))}
                        </div>
                    )}

                    {tab === 'plans' && (
                        <div className="space-y-8 animate-in fade-in zoom-in-95 duration-500">
                            {(project.blueprints || (project.blueprint ? [project.blueprint] : [])).map((plan, i) => (
                                <div key={i} className="border border-blueprint-line relative bg-blueprint/50 overflow-hidden flex flex-col">
                                    <div className="relative w-full flex justify-center py-4">
                                        <img src={plan} className="max-w-full max-h-[85vh] w-auto h-auto object-contain shadow-sm" alt={`Blueprint ${i + 1}`} />
                                        <div className="hidden md:block absolute bottom-6 left-6 border border-blueprint-accent bg-black/80 p-4 max-w-xs">
                                            <h4 className="text-blueprint-accent text-xs font-bold uppercase mb-1">Plan View {i + 1}</h4>
                                            <p className="text-gray-400 text-[10px] leading-tight">
                                                All dimensions are approximate. Actual construction may vary.
                                                Refer to official CAD documents for precise measurements.
                                            </p>
                                        </div>
                                    </div>
                                    <div className="md:hidden border-t border-blueprint-line bg-black/40 p-4">
                                        <h4 className="text-blueprint-accent text-xs font-bold uppercase mb-1">Plan View {i + 1}</h4>
                                        <p className="text-gray-400 text-[10px] leading-tight">
                                            All dimensions are approximate. Actual construction may vary.
                                            Refer to official CAD documents for precise measurements.
                                        </p>
                                    </div>
                                </div>
                            ))}
                            {!(project.blueprints?.length) && !project.blueprint && (
                                <div className="text-center text-gray-500 py-20 border border-dashed border-gray-800">No blueprints available.</div>
                            )}
                        </div>
                    )}
                </div>
            </section>

            <Lightbox
                isOpen={lightboxOpen}
                images={allPhotos}
                initialIndex={photoIndex}
                onClose={() => setLightboxOpen(false)}
                onNext={() => setPhotoIndex((i) => (i + 1) % allPhotos.length)}
                onPrev={() => setPhotoIndex((i) => (i - 1 + allPhotos.length) % allPhotos.length)}
            />
        </main>
    );
}
