'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Header() {
    const pathname = usePathname();
    const isListingPage = pathname?.startsWith('/projects/') && pathname !== '/projects';

    return (
        <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 pt-3 pb-3 md:px-12 md:py-6 bg-blueprint/80 backdrop-blur-md">
            <Link href="/" className="font-architect text-2xl md:text-3xl text-white tracking-widest hover:text-blueprint-accent transition-colors">
                FALLS EDGE
            </Link>

            <nav>
                <Link href="/projects" className="font-tech text-xs md:text-sm uppercase tracking-[0.2em] text-blueprint-text hover:text-white transition-colors">
                    Our Homes
                </Link>
            </nav>

            {/* Attached Frame Line - Hidden on Listing Page */}
            {!isListingPage && (
                <div className="absolute bottom-0 left-4 right-4 h-[2px] bg-blueprint-line opacity-60 hidden md:block" />
            )}
        </header>
    );
}
