'use client';

import { motion } from 'framer-motion';

export default function Hero() {
    return (
        <section className="relative w-full min-h-[35vh] md:min-h-[55vh] flex flex-col items-center justify-end pb-12 px-4 pt-20 md:pb-24 md:px-8 md:pt-8 overflow-hidden">
            {/* Animated "Draw" Container */}
            <div className="relative p-6 md:p-20">
                {/* Technical Corners - Thicker */}
                <div className="absolute top-0 left-0 w-8 h-8 border-t-[4px] border-l-[4px] border-white z-20" />
                <div className="absolute top-0 right-0 w-8 h-8 border-t-[4px] border-r-[4px] border-white z-20" />
                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-[4px] border-l-[4px] border-white z-20" />
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-[4px] border-r-[4px] border-white z-20" />

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.5, duration: 1 }}
                    className="relative z-10 text-center"
                >
                    <h1 className="font-architect text-4xl sm:text-6xl md:text-8xl lg:text-9xl text-white tracking-wider break-words">
                        FALLS EDGE
                    </h1>
                    <p className="font-tech text-blueprint-accent tracking-[0.2em] mt-2 uppercase text-xs sm:text-sm md:text-base">
                        From Blueprint to Backyard
                    </p>
                </motion.div>

                {/* SVG Frame that draws itself */}
                <div className="absolute inset-0 pointer-events-none">
                    <svg className="w-full h-full overflow-visible">
                        <motion.rect
                            x="0" y="0" width="100%" height="100%"
                            fill="none"
                            stroke="rgba(255,255,255,0.8)"
                            strokeWidth="2"
                            initial={{ pathLength: 0, opacity: 0 }}
                            animate={{ pathLength: 1, opacity: 1 }}
                            transition={{ duration: 2, ease: "easeInOut" }}
                        />


                    </svg>

                    {/* Dimensions Text */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 2 }}
                        className="absolute -left-12 top-1/2 -translate-y-1/2 -rotate-90 text-[10px] text-white/50 font-mono hidden md:block"
                    >
                        ELEV. 1,463&apos;
                    </motion.div>
                </div>
            </div>

            {/* Stamp */}

        </section >
    )
}
