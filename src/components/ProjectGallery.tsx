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

                <div className="flex flex-col-reverse md:grid lg:grid-cols-[40%_60%] gap-0 bg-blueprint">
                    {/* Content Left (Bottom on Mobile) */}
                    <div className="p-6 md:p-10 flex flex-col justify-between border-t md:border-t-0 md:border-r border-blueprint-line/50 cursor-pointer"
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

                            <div className="mt-8 grid grid-cols-2 md:grid-cols-4 py-4 border-t border-b border-blueprint-line h-auto md:h-24">
                                <div className="text-center group cursor-default border-r border-b md:border-b-0 border-blueprint-line flex flex-col justify-center items-center h-full p-2">
                                    <span className="block text-2xl text-white font-architect transition-colors tracking-widest leading-none mb-1">{project.specs.finishedSqft}</span>
                                    <span className="text-xs uppercase text-gray-500 tracking-wider block leading-none">Finished Sq Ft</span>
                                </div>
                                <div className="text-center group cursor-default border-b md:border-b-0 md:border-r border-blueprint-line flex flex-col justify-center items-center h-full p-2">
                                    <span className="block text-2xl text-white font-architect transition-colors tracking-widest leading-none mb-1">{project.specs.bed}</span>
                                    <span className="text-xs uppercase text-gray-500 tracking-wider leading-none">Beds</span>
                                </div>
                                <div className="text-center group cursor-default border-r border-blueprint-line flex flex-col justify-center items-center h-full p-2">
                                    <span className="block text-2xl text-white font-architect transition-colors tracking-widest leading-none mb-1">{project.specs.bath}</span>
                                    <span className="text-xs uppercase text-gray-500 tracking-wider leading-none">Baths</span>
                                </div>
                                <div className="text-center group cursor-default flex flex-col justify-center items-center h-full p-2">
                                    <span className="block text-2xl text-white font-architect transition-colors tracking-widest leading-none mb-1">{project.specs.garage}</span>
                                    <span className="text-xs uppercase text-gray-500 tracking-wider leading-none">Garage</span>
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


                        {/* Preload/Stack both images */}
                        <div className="absolute inset-0 w-full h-full">
                            {/* Photo View */}
                            <div
                                className={`absolute inset-0 w-full h-full transition-opacity duration-500 ease-in-out ${view === 'photo' ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
                            >
                                <Link href={`/projects/${project.id}`} className="block w-full h-full">
                                    <img
                                        src={project.image}
                                        alt={project.title}
                                        className={`w-full h-full ${project.imageFit === 'cover' ? 'object-cover' : project.imageFit === 'fill' ? 'object-fill' : 'object-contain'}`}
                                    />
                                </Link>
                            </div>

                            {/* Plan View */}
                            <div
                                className={`absolute inset-0 w-full h-full bg-blueprint transition-opacity duration-500 ease-in-out ${view === 'blueprint' ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
                            >
                                <Link href={`/projects/${project.id}`} className="block w-full h-full flex items-center justify-center p-4">
                                    <img
                                        src={project.blueprint || (project.blueprints && project.blueprints[0]) || ''}
                                        alt={`${project.title} Blueprint`}
                                        className="w-full h-full object-contain"
                                    />
                                </Link>
                            </div>
                        </div>



                        {/* Price Tag Overlay - Hide if Sold */}
                        {project.status !== 'sold' && (
                            <div className="absolute bottom-6 right-6 bg-black/70 text-white font-mono tracking-widest px-4 py-2 border border-white/30 backdrop-blur-sm z-10 text-sm md:text-base cursor-default">
                                {project.specs.price || 'Inquire'}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </article>
    )
}
