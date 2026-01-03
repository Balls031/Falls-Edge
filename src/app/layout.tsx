import type { Metadata } from "next";
import { Architects_Daughter, JetBrains_Mono, Cabin_Sketch } from "next/font/google"; // 1. Import
import "./globals.css";

import MouseTracer from "@/components/MouseTracer";
import Header from "@/components/Header";
<Header />

{/* Grid Background - Full on mobile, constrained to frame on desktop to match vertical lines */ }
<div className="fixed inset-0 md:inset-4 pointer-events-none z-0 bg-blueprint-grid" />

{/* Fixed Viewport Frame usually for "Blueprint" look */ }
        <div className="fixed inset-4 border-2 border-blueprint-line pointer-events-none z-50 rounded-sm opacity-60 hidden md:block" />
        <div className="fixed bottom-4 left-4 right-4 h-8 border-t-2 border-blueprint-line pointer-events-none z-50 hidden md:block" />

        <div className="relative z-10 min-h-screen flex flex-col items-center">
          {/* Main Content Wrapper - Aligned to Grid - Increased for large screens */}
          <div className="w-full max-w-[1600px] xl:max-w-[90vw]">
            {children}
          </div>
        </div>
      </body >
    </html >
  );
}
