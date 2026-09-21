'use client';

import Link from 'next/link';
import { Project } from '@/lib/data';
import ContactCard from '@/components/ContactCard';
import ProjectTabs, { ViewMode } from '@/components/ProjectTabs';
import { toModel3dEmbedUrl } from '@/lib/model3d';
import Lightbox from '@/components/Lightbox';
import { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, Sparkles } from 'lucide-react';
import AddToCalendarButton from './AddToCalendarButton';
import { getNextOpenHouse, getOpenHouseWindow, daysUntilOpenHouse, formatOpenHouseDate, formatOpenHouseTime } from '@/lib/openHouse';


export default function ProjectDetailView({ project }: { project: Project }) {
    const [tab, setTab] = useState<ViewMode>('photos');
    const [tourLoaded, setTourLoaded] = useState(false);
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [photoIndex, setPhotoIndex] = useState(0);
    const [isNarrativeOpen, setIsNarrativeOpen] = useState(false);
    const [calOpen, setCalOpen] = useState(false); // Add-to-Calendar chooser for the open house box

    // Force re-render every 60s so the urgency label stays current (e.g. at midnight)
    const [, setTick] = useState(0);
    useEffect(() => {
        const interval = setInterval(() => setTick((t: number) => t + 1), 60_000);
        return () => clearInterval(interval);
    }, []);

    const galleryPhotos = (project.gallery && project.gallery.length > 0) ? project.gallery : [project.image];
    const blueprints = project.blueprints || (project.blueprint ? [project.blueprint] : []);
    const allPhotos = [...galleryPhotos, ...blueprints];
    const tourUrl = toModel3dEmbedUrl(project.model3dUrl);
    const aiImages = project.aiImages || [];

    // The 3D tour is desktop-only. If the viewport drops below md while it's open, fall back to photos.
    useEffect(() => {
        const mq = window.matchMedia('(max-width: 767px)');
        const check = () => { if (mq.matches) setTab(t => (t === 'tour' ? 'photos' : t)); };
        check();
        mq.addEventListener('change', check);
        return () => mq.removeEventListener('change', check);
    }, []);

    const openLightbox = (index: number) => {
        setPhotoIndex(index);
        setLightboxOpen(true);
    };

    // Open House Logic — shows while upcoming or in progress (Central time)
    const nextOpenHouse = project.status !== 'sold' ? getNextOpenHouse(project.openHouses) : undefined;
    const isSoon = nextOpenHouse && (getOpenHouseWindow(nextOpenHouse).start.getTime() - Date.now() < 10 * 24 * 60 * 60 * 1000); // 10 days

    return (
        <main className="pt-20 pb-20 w-full max-w-[1340px] min-[2000px]:max-w-[1700px] mx-auto px-4 md:px-8 relative">
            {/* Back Nav */}
            <div className="fixed top-6 left-6 z-50">
                <Link href="/" className="flex items-center gap-2 text-white/50 hover:text-blueprint-accent transition-colors font-mono text-xs uppercase tracking-widest border border-white/20 bg-blueprint/80 px-4 py-2 backdrop-blur">
                    &larr; Back Home
                </Link>
            </div>

            {/* Header Area: Title & Contact Card */}
            <header className="w-full px-[40px] md:px-[80px] mb-4 md:mb-8">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end border-b border-blueprint-line pb-4 md:pb-8">
                    {/* Left: Title & Info */}
                    <div className="border-l-2 border-blueprint-accent pl-4 md:pl-6 mt-4 md:mt-12 mb-8 lg:mb-0">
                        <span className="block text-blueprint-accent font-mono text-xs md:text-sm tracking-[0.3em] mb-1">PROJECT NO. {(project.projectNumber || project.id).padStart(3, '0')}</span>
                        <h1 className="text-3xl sm:text-5xl md:text-7xl font-architect text-white mb-1 leading-none">{project.title}</h1>
                        <p className="text-base md:text-xl text-gray-400 font-tech">{project.location}</p>
                    </div>

                    {/* Status Stamp — sits in the flow (below the title on mobile, beside it on desktop) so it never lands under the fixed header or on top of the title. */}
                    {project.status !== 'available' && (
                        <div className="shrink-0 whitespace-nowrap self-end lg:self-center mr-[10%] lg:mr-[25%] mb-2 lg:mb-0 border-[4px] md:border-[6px] border-red-700/80 text-red-700/80 p-2 md:p-4 font-bold uppercase text-2xl md:text-4xl -rotate-12 opacity-80 mix-blend-screen select-none pointer-events-none">
                            <div className="border border-red-700/80 px-3 md:px-4 py-1">
                                {project.status}
                            </div>
                        </div>
                    )}
                </div>
            </header>

            {/* Open House Banner */}
            {isSoon && (() => {
                const daysUntil = daysUntilOpenHouse(nextOpenHouse.date);
                const isToday = daysUntil <= 0;
                const isTomorrow = daysUntil === 1;
                const urgencyLabel = isToday ? 'TODAY' : isTomorrow ? 'TOMORROW' : `IN ${daysUntil} DAYS`;

                return (
                <div className="w-full px-[40px] md:px-[80px] mb-8">
                    {/* Whole box opens the Add-to-Calendar chooser */}
                    <div
                        role="button"
                        tabIndex={0}
                        onClick={() => setCalOpen(true)}
                        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setCalOpen(true); } }}
                        title="Add this open house to your calendar"
                        className="relative border-2 border-blueprint-accent bg-gradient-to-r from-blueprint-accent/15 via-blueprint/60 to-blueprint-accent/15 p-6 md:p-8 backdrop-blur-lg overflow-hidden shadow-[0_0_30px_rgba(0,240,255,0.15)] cursor-pointer hover:border-white hover:shadow-[0_0_40px_rgba(0,240,255,0.3)] transition-all duration-300 outline-none focus-visible:ring-2 focus-visible:ring-white"
                    >
                        {/* Shimmer animation */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blueprint-accent/5 to-transparent animate-[shimmer_3s_ease-in-out_infinite] pointer-events-none" />

                        {/* Corner accents */}
                        <div className="absolute top-0 left-0 w-6 h-6 border-t-[3px] border-l-[3px] border-blueprint-accent" />
                        <div className="absolute top-0 right-0 w-6 h-6 border-t-[3px] border-r-[3px] border-blueprint-accent" />
                        <div className="absolute bottom-0 left-0 w-6 h-6 border-b-[3px] border-l-[3px] border-blueprint-accent" />
                        <div className="absolute bottom-0 right-0 w-6 h-6 border-b-[3px] border-r-[3px] border-blueprint-accent" />

                        <div className="relative z-10 flex flex-col gap-4">
                            {/* Icon + Details */}
                            <div className="flex items-start gap-3 md:gap-5">
                                {/* Calendar dropdown — add to preferred calendar */}
                                <div className="mt-0.5">
                                    <AddToCalendarButton
                                        event={{
                                            title: project.title,
                                            location: project.location,
                                            date: nextOpenHouse.date,
                                            startTime: nextOpenHouse.startTime,
                                            endTime: nextOpenHouse.endTime,
                                            address: project.address,
                                            coordinates: project.coordinates,
                                        }}
                                        size="lg"
                                        open={calOpen}
                                        onOpenChange={setCalOpen}
                                    />
                                </div>

                                <div className="min-w-0 flex-1">
                                    <div className="flex flex-wrap items-center gap-2 md:gap-3 mb-1.5 md:mb-2">
                                        <h3 className="text-blueprint-accent font-bold uppercase tracking-[0.15em] md:tracking-[0.2em] text-sm md:text-lg">Open House</h3>
                                        <span className={`text-[9px] md:text-xs font-bold uppercase tracking-widest px-1.5 md:px-2 py-0.5 border whitespace-nowrap ${isToday ? 'bg-red-500/20 text-red-400 border-red-500/50 animate-pulse' : isTomorrow ? 'bg-amber-500/20 text-amber-400 border-amber-500/50' : 'bg-blueprint-accent/10 text-blueprint-accent border-blueprint-accent/30'}`}>
                                            {urgencyLabel}
                                        </span>
                                    </div>
                                    <p className="text-white font-mono text-base md:text-2xl flex flex-col gap-0.5 md:gap-0">
                                        <span className="font-bold leading-tight">{formatOpenHouseDate(nextOpenHouse.date, { weekday: 'long', month: 'long', day: 'numeric' })}</span>
                                        <span className="text-blueprint-accent text-sm md:text-xl">
                                            {formatOpenHouseTime(nextOpenHouse.startTime)} – {formatOpenHouseTime(nextOpenHouse.endTime)}
                                        </span>
                                    </p>
                                    <p className="text-white/40 font-mono text-[9px] md:text-[10px] uppercase tracking-widest mt-2">Click anywhere to add to your calendar</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                );
            })()}

            {/* Main Content: Image (Left) & Details (Right) */}
            <section className="w-full px-[40px] md:px-[80px] mb-[60px]">
                <div className="grid md:grid-cols-12 gap-8">
                    {/* LEFT: Main Image (The 'Hero' Image) */}
                    <div className="md:col-span-8">
                        <div
                            onClick={() => openLightbox(0)}
                            className="w-full aspect-video border border-blueprint-line p-2 relative cursor-pointer group"
                        >
                            <div className="absolute -top-[1px] -left-[1px] w-4 h-4 border-t border-l border-white/50" />
                            <div className="absolute -top-[1px] -right-[1px] w-4 h-4 border-t border-r border-white/50" />
                            <div className="absolute -bottom-[1px] -left-[1px] w-4 h-4 border-b border-l border-white/50" />
                            <div className="absolute -bottom-[1px] -right-[1px] w-4 h-4 border-b border-r border-white/50" />
                            <img src={project.image} className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all" alt="Main View" />
                        </div>

                        {/* Design Narrative Block (Moved here) */}
                        <div className="relative border border-blueprint-line bg-blueprint/70 backdrop-blur-md mt-8">
                            <div className="absolute -top-[1px] -left-[1px] w-3 h-3 border-t border-l border-white/50" />
                            <div className="absolute -top-[1px] -right-[1px] w-3 h-3 border-t border-r border-white/50" />
                            <div className="absolute -bottom-[1px] -left-[1px] w-3 h-3 border-b border-l border-white/50" />
                            <div className="absolute -bottom-[1px] -right-[1px] w-3 h-3 border-b border-r border-white/50" />

                            {/* Header / Toggle */}
                            <button
                                onClick={() => setIsNarrativeOpen(!isNarrativeOpen)}
                                className="w-full flex items-center justify-between p-6 md:cursor-default"
                            >
                                <h3 className="text-white font-bold uppercase tracking-widest font-mono text-sm">Narrative</h3>
                                <div className="md:hidden text-blueprint-accent">
                                    {isNarrativeOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                </div>
                            </button>

                            {/* Content - Hidden on Mobile unless Open, Always visible on Desktop */}
                            <div className={`px-6 pb-6 md:block ${isNarrativeOpen ? 'block' : 'hidden'}`}>
                                <div className="border-t border-blueprint-line pt-4 md:pt-2 md:border-t-0 md:mt-0"> {/* Mobile has top border when open */}
                                    <p className="text-gray-400 leading-relaxed font-tech text-sm">
                                        {project.longDescription || project.description}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT: Details & Narrative */}
                    <div className="md:col-span-4 flex flex-col gap-8">
                        {/* Specs Grid (Compacted & Refactored) */}
                        <div className="flex flex-col gap-6">
                            {/* Price - Centered Top - Hide if Sold */}
                            {project.status !== 'sold' && (
                                <div className="text-center border-b border-blueprint-line pb-6">
                                    <span className="block text-4xl md:text-5xl text-white font-mono tracking-widest mb-1 md:mb-0 md:mt-2">{project.specs.price || 'Inquire'}</span>
                                    <span className="block text-gray-500 text-xs md:text-sm uppercase tracking-wider">Price</span>
                                </div>
                            )}

                            {/* Details Grid */}
                            <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                                {/* Left Column */}
                                <div className="space-y-6 md:space-y-6">
                                    <div className="flex flex-col-reverse items-center gap-1 border-b border-white/10 pb-2">
                                        <span className="text-gray-500 text-xs md:text-sm uppercase tracking-wider">Beds</span>
                                        <span className="text-2xl text-white font-mono">{project.specs.bed}</span>
                                    </div>
                                    <div className="flex flex-col-reverse items-center gap-1 border-b border-white/10 pb-2">
                                        <span className="text-gray-500 text-xs md:text-sm uppercase tracking-wider">Baths</span>
                                        <span className="text-2xl text-white font-mono">{project.specs.bath}</span>
                                    </div>
                                    <div className="flex flex-col-reverse items-center gap-1 border-b border-white/10 pb-2">
                                        <span className="text-gray-500 text-xs md:text-sm uppercase tracking-wider">Garage</span>
                                        <span className="text-2xl text-white font-mono">{project.specs.garage}</span>
                                    </div>
                                </div>

                                {/* Right Column */}
                                <div className="space-y-6 md:space-y-6">
                                    <div className="flex flex-col-reverse items-center gap-1 border-b border-white/10 pb-2">
                                        <span className="text-gray-500 text-xs md:text-sm uppercase tracking-wider">Finished Sq Ft</span>
                                        <span className="text-2xl text-white font-mono">{project.specs.finishedSqft}</span>
                                    </div>
                                    <div className="flex flex-col-reverse items-center gap-1 border-b border-white/10 pb-2">
                                        <span className="text-gray-500 text-xs md:text-sm uppercase tracking-wider">Unfinished Sq Ft</span>
                                        <span className="text-2xl text-white font-mono">{project.specs.unfinishedSqft}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Contact Cards - Moved below Specs */}
                        <div className="flex flex-col gap-8">
                            <ContactCard
                                realtor={project.realtors?.[0]}
                                className="w-full"
                            />
                            {project.realtors?.[1] && (
                                <ContactCard realtor={project.realtors[1]} className="w-full" />
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* Gallery Section */}
            <section className="w-full px-[40px] md:px-[80px] mb-[40px]">
                <div className="mb-0 flex items-end justify-between border-b border-blueprint-line pb-2">
                    <h3 className="font-architect text-2xl text-white mr-12">Images</h3>
                    <ProjectTabs view={tab} onChange={setTab} hasTour={!!tourUrl} />
                </div>

                <div className="pt-10 min-h-[400px]">
                    <div className={tab === 'photos' ? 'block' : 'hidden'}>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in duration-500">
                            {/* Gallery Grid (skipping main image if we want, but array usually doesn't include it so iterating gallery) */}
                            {project.gallery?.map((img, i) => (
                                <div
                                    key={i}
                                    onClick={() => openLightbox(i)}
                                    className="aspect-[4/3] border border-blueprint-line p-2 relative group hover:border-white transition-colors cursor-pointer"
                                >
                                    <div className="absolute -top-[1px] -left-[1px] w-2 h-2 border-t border-l border-white/50" />
                                    <div className="absolute -top-[1px] -right-[1px] w-2 h-2 border-t border-r border-white/50" />
                                    <div className="absolute -bottom-[1px] -left-[1px] w-2 h-2 border-b border-l border-white/50" />
                                    <div className="absolute -bottom-[1px] -right-[1px] w-2 h-2 border-b border-r border-white/50" />
                                    <img src={img} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" alt={`Detail ${i}`} />
                                    <span className="absolute bottom-3 right-3 flex items-center gap-1.5 font-mono text-[10px]">
                                        {aiImages.includes(img) && (
                                            <span className="flex items-center gap-1 bg-blueprint-accent/90 text-black font-bold px-1.5 py-px" title="AI-generated rendering">
                                                <Sparkles size={10} /> AI
                                            </span>
                                        )}
                                        <span className="text-white bg-black/50 px-1">FIG. {i + 1}</span>
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className={tab === 'plans' ? 'block' : 'hidden'}>
                        <div className="space-y-8">
                            {(project.blueprints || (project.blueprint ? [project.blueprint] : [])).map((plan, i) => (
                                <div key={i} className="border border-blueprint-line relative bg-blueprint/50 overflow-hidden flex flex-col">
                                    <div className="relative w-full flex justify-center py-4">
                                        <img src={plan} className="max-w-full max-h-[85vh] w-auto h-auto object-contain shadow-sm" alt={`Blueprint ${i + 1}`} />
                                    </div>
                                </div>
                            ))}
                            {!(project.blueprints?.length) && !project.blueprint && (
                                <div className="text-center text-gray-500 py-20 border border-dashed border-gray-800">No blueprints available.</div>
                            )}
                        </div>
                    </div>

                    {/* 3D Tour — Chief Architect 3D Viewer embed. Iframe is only mounted once the tab is opened so the model doesn't download on every page view. */}
                    {tourUrl && (
                        <div className={tab === 'tour' ? 'hidden md:block' : 'hidden'}>
                            <div className="border border-blueprint-line relative bg-blueprint/50 overflow-hidden">
                                <div className="absolute -top-[1px] -left-[1px] w-2 h-2 border-t border-l border-white/50 z-10" />
                                <div className="absolute -top-[1px] -right-[1px] w-2 h-2 border-t border-r border-white/50 z-10" />
                                <div className="absolute -bottom-[1px] -left-[1px] w-2 h-2 border-b border-l border-white/50 z-10" />
                                <div className="absolute -bottom-[1px] -right-[1px] w-2 h-2 border-b border-r border-white/50 z-10" />
                                <div className="relative w-full aspect-[4/3] md:aspect-video bg-black/40">
                                    {(tab === 'tour' || tourLoaded) ? (
                                        <iframe
                                            src={tourUrl}
                                            title={`${project.title} 3D Tour`}
                                            className="absolute inset-0 w-full h-full border-0"
                                            allow="fullscreen; xr-spatial-tracking"
                                            allowFullScreen
                                            loading="lazy"
                                            onLoad={() => setTourLoaded(true)}
                                        />
                                    ) : null}
                                </div>
                                <div className="border-t border-blueprint-line bg-black/40 p-4">
                                    <h4 className="text-blueprint-accent text-xs font-bold uppercase mb-1">Interactive 3D Walkthrough</h4>
                                    <p className="text-gray-400 text-[10px] leading-tight">
                                        Click and drag to look around. Use the menu inside the viewer to switch cameras or open a cross section.
                                        Finishes and colors shown are for illustration only.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </section >

            <Lightbox
                isOpen={lightboxOpen}
                images={allPhotos}
                aiImages={aiImages}
                initialIndex={photoIndex}
                onClose={() => setLightboxOpen(false)}
                onNext={() => setPhotoIndex((i) => (i + 1) % allPhotos.length)}
                onPrev={() => setPhotoIndex((i) => (i - 1 + allPhotos.length) % allPhotos.length)}
            />
        </main >
    );
}
