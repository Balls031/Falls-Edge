'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useEffect } from 'react';

type LightboxProps = {
    images: string[];
    initialIndex: number;
    isOpen: boolean;
    onClose: () => void;
    onNext: () => void;
    onPrev: () => void;
};

export default function Lightbox({ images, initialIndex, isOpen, onClose, onNext, onPrev }: LightboxProps) {
    // Keyboard support
    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if (!isOpen) return;
            if (e.key === 'Escape') onClose();
            if (e.key === 'ArrowRight') onNext();
            if (e.key === 'ArrowLeft') onPrev();
        };
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, [isOpen, onClose, onNext, onPrev]);

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onClick={onClose}
                className="fixed inset-0 z-[100] bg-blueprint/95 backdrop-blur-xl flex items-center justify-center bg-[size:40px_40px] bg-center cursor-zoom-out"
                style={{
                    backgroundImage: `linear-gradient(to right, rgba(255, 255, 255, 0.05) 1px, transparent 1px),
                                    linear-gradient(to bottom, rgba(255, 255, 255, 0.05) 1px, transparent 1px)`
                }}
            >
                {/* Close Button */}
                <button onClick={onClose} className="absolute top-24 right-6 text-white hover:text-blueprint-accent bg-black/20 hover:bg-black/40 border border-white/10 p-2 z-20 transition-all rounded-sm backdrop-blur-sm">
                    <X size={32} />
                </button>

                {/* Left Arrow (Fixed Position) */}
                <button onClick={(e) => { e.stopPropagation(); onPrev(); }} className="absolute left-6 md:left-12 top-1/2 -translate-y-1/2 text-white hover:text-blueprint-accent p-4 z-20 bg-black/10 hover:bg-black/30 rounded-full transition-all">
                    <ChevronLeft size={48} />
                </button>

                {/* Right Arrow (Fixed Position) */}
                <button onClick={(e) => { e.stopPropagation(); onNext(); }} className="absolute right-6 md:right-12 top-1/2 -translate-y-1/2 text-white hover:text-blueprint-accent p-4 z-20 bg-black/10 hover:bg-black/30 rounded-full transition-all">
                    <ChevronRight size={48} />
                </button>

                {/* Image Container */}
                <motion.div
                    key={initialIndex}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.2 }}
                    onClick={(e) => e.stopPropagation()}
                    className="relative max-w-7xl max-h-[85vh] w-full p-4 flex items-center justify-center cursor-default"
                >
                    <img
                        src={images[initialIndex]}
                        alt="Gallery View"
                        className="max-h-[85vh] w-auto object-contain border border-blueprint-line shadow-[0_0_50px_rgba(0,0,0,0.5)]"
                    />

                    {/* Counter */}
                    <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 text-white/50 font-mono text-xs tracking-widest">
                        IMAGE {initialIndex + 1} / {images.length}
                    </div>
                </motion.div>

            </motion.div>
        </AnimatePresence>
    )
}
