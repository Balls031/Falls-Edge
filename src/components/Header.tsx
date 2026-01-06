'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

export default function Header() {
    const pathname = usePathname();
    const isListingPage = pathname?.startsWith('/projects/') && pathname !== '/projects';

    return (
        <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 pt-3 pb-3 md:px-12 md:py-6 bg-blueprint/80 backdrop-blur-md">
            <Link href="/" className="relative h-10 w-auto hover:opacity-80 transition-opacity">
                <Image
                    src="/logo.png"
                    alt="Falls Edge Logo"
                    width={100}
                    height={40}
                    className="h-full w-auto object-contain"
                    priority
                />
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
