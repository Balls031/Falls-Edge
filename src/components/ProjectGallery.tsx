'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Project } from '@/lib/data';

interface ProjectGalleryProps {
    initialProjects?: Project[];
    showTitle?: boolean;
}

export default function ProjectGallery({ initialProjects = [], showTitle = true }: ProjectGalleryProps) {
    const projects = initialProjects;

    return (
        <section className="w-full max-w-[1340px] min-[2000px]:max-w-[1700px] mx-auto pt-0 pb-12 md:pb-40 relative z-10 px-4 md:px-12">

            {/* Section Header */}
            {showTitle && (
                <div className="text-center mb-8 md:mb-20 relative">
                    <h2 className="font-architect text-3xl md:text-4xl text-white inline-block border-b border-blueprint-accent pb-2">Selected Projects</h2>
                </div>
            )}

            <div className="space-y-[40px] md:space-y-[80px]"> {/* 80px gap = 2 grid units */}
                {projects.map((project, index) => (
                    <ProjectItem key={project.id} project={project} index={index} />
                ))}
            </div>
        </section>
    )
}

function ProjectItem({ project, index }: { project: Project; index: number }) {
    const [view, setView] = useState<'photo' | 'blueprint'>('photo');

    return (
        <article className="relative group/card">
            {/* ... keeping previous logic ... */}
            {index > 0 && (
                <div className="absolute -top-[80px] left-1/2 w-px h-[80px] bg-blueprint-line border-l border-dashed border-white/20" />
            )}

            <div className={`border border-blueprint-line p-0 relative transition-all duration-500 hover:border-blueprint-accent`}>
                <div className="absolute -top-[1px] -left-[1px] w-4 h-4 border-t-2 border-l-2 border-white/30" />
                <div className="absolute -top-[1px] -right-[1px] w-4 h-4 border-t-2 border-r-2 border-white/30" />
                <div className="absolute -bottom-[1px] -left-[1px] w-4 h-4 border-b-2 border-l-2 border-white/30" />
                <div className="absolute -bottom-[1px] -right-[1px] w-4 h-4 border-b-2 border-r-2 border-white/30" />

                <div className="grid lg:grid-cols-[40%_60%] gap-0 bg-blueprint/40 backdrop-blur-sm">
                    {/* Content Left */}
                    <div className="p-6 md:p-10 flex flex-col justify-between border-r border-blueprint-line/50 cursor-pointer"
                        onClick={() => { }}
                    >
                        <Link href={`/projects/${project.id}`} className="block h-full flex flex-col justify-between">
                            <div className="space-y-6 relative">
                                {project.status !== 'available' && (
                                    <div className="absolute top-0 right-0 border-[4px] md:border-[6px] border-red-700/80 text-red-700/80 p-2 font-bold uppercase text-lg md:text-xl -rotate-12 z-10 mix-blend-screen pointer-events-none select-none"
                                        style={{ borderStyle: 'double' }}
                                    >
                                        <div className="border border-red-700/80 px-2 py-1">
                                            {project.status === 'sold' ? 'SOLD' : 'PENDING'}
                                        </div>
                                    </div>
                                )}
                                <div>
                                    <div className="text-blueprint-accent font-mono text-xs mb-2 tracking-widest">
                                        PROJECT {(project.projectNumber || project.id).padStart(3, '0')}
                                    </div>
                                    <h3 className="font-architect text-3xl md:text-4xl text-white group-hover/card:text-blueprint-accent transition-colors">
                                        {project.title} &rarr;
                                    </h3>
                                    <p className="font-tech text-sm text-gray-400 mt-1">{project.location}</p>
                                </div>
                                <p className="font-mono text-sm text-gray-400 leading-relaxed border-l-2 border-blueprint-line pl-4">
                                    {project.description}
                                </p>
                            </div>

                            <div className="mt-8 grid grid-cols-2 md:grid-cols-4 py-4 border-t border-b border-blueprint-line divide-x divide-blueprint-line">
                                <div className="text-center group cursor-default">
                                    <span className="block text-2xl text-white font-architect transition-colors tracking-widest">{project.specs.bed}</span>
                                    <span className="text-[10px] uppercase text-gray-500 tracking-wider">Beds</span>
                                </div>
                                <div className="text-center group cursor-default">
                                    <span className="block text-2xl text-white font-architect transition-colors tracking-widest">{project.specs.bath}</span>
                                    <span className="text-[10px] uppercase text-gray-500 tracking-wider">Baths</span>
                                </div>
                                <div className="text-center group cursor-default">
                                    <span className="block text-2xl text-white font-architect transition-colors tracking-widest">{project.specs.garage}</span>
                                    <span className="text-[10px] uppercase text-gray-500 tracking-wider">Garage</span>
                                </div>
                                <div className="text-center group cursor-default">
                                    <span className="block text-2xl text-white font-architect transition-colors tracking-widest">{project.specs.finishedSqft}</span>
                                    <span className="text-[10px] uppercase text-gray-500 tracking-wider block">Finished</span>
                                </div>
                            </div>
                        </Link>
                    </div>

                    {/* Viewport Right */}
                    <div className="relative border-l border-blueprint-line/0 bg-black/20 group overflow-hidden h-[300px] md:h-auto md:min-h-[400px]">

                        {/* Mode Toggle */}
                        <div className="absolute top-2 right-2 md:top-6 md:right-6 z-20 flex bg-blueprint/90 border border-blueprint-line rounded-none box-content">
                            <button
                                onClick={(e) => { e.preventDefault(); e.stopPropagation(); setView('photo'); }}
                                className={`px-2 py-1 md:px-4 md:py-2 text-[10px] md:text-xs uppercase tracking-widest transition-all ${view === 'photo' ? 'bg-white text-blueprint font-bold' : 'text-gray-400 hover:text-white'}`}
                            >
                                Photo
                            </button>
                            <div className="w-px bg-blueprint-line my-1" />
                            <button
                                onClick={(e) => { e.preventDefault(); e.stopPropagation(); setView('blueprint'); }}
                                className={`px-2 py-1 md:px-4 md:py-2 text-[10px] md:text-xs uppercase tracking-widest transition-all ${view === 'blueprint' ? 'bg-white text-blueprint font-bold' : 'text-gray-400 hover:text-white'}`}
                            >
                                Plan
                            </button>
                        </div>

                        <AnimatePresence mode="popLayout">
                            <motion.div
                                key={view}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.4 }}
                                className="absolute inset-0 w-full h-full flex items-center justify-center bg-black/40"
                            >
                                <img
                                    src={view === 'photo' ? project.image : (project.blueprint || (project.blueprints && project.blueprints[0]) || '')}
                                    alt={project.title}
                                    className={`w-full h-full ${view === 'photo' && project.imageFit === 'cover' ? 'object-cover' : view === 'photo' && project.imageFit === 'fill' ? 'object-fill' : 'object-contain'}`}
                                />
                            </motion.div>
                        </AnimatePresence>



                        {/* Detail Link Overlay helper message */}
                        <Link href={`/projects/${project.id}`} className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 text-white text-xs px-3 py-1 font-mono border border-white/50 hover:bg-blueprint-accent hover:text-black hover:border-blueprint-accent">
                            VIEW DETAILS
                        </Link>
                    </div>
                </div>
            </div>
        </article>
    )
}
