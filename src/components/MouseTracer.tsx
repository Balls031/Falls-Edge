'use client';

import { useEffect, useState } from 'react';

type Point = {
    x: number;
    y: number;
    id: number;
};

export default function MouseTracer() {
    const [points, setPoints] = useState<Point[]>([]);

    useEffect(() => {
        let count = 0;

        const addPoint = (x: number, y: number) => {
            const newPoint = { x, y, id: count++ };
            setPoints((prev) => [...prev, newPoint].slice(-50)); // Keep last 50 points

            // Remove points after a short delay to create a tail effect
            setTimeout(() => {
                setPoints((prev) => prev.filter((p) => p.id !== newPoint.id));
            }, 600);
        };

        const handleMouseMove = (e: MouseEvent) => {
            addPoint(e.clientX, e.clientY);
        };

        const handleTouchMove = (e: TouchEvent) => {
            if (e.touches.length > 0) {
                // Prevent default to separate scrolling from drawing if needed, 
                // but usually we want to just track. 
                // For a purely visual effect allowing scroll is often better unless it obstructs.
                // Given "mouse trailing", likely want it to just follow.
                const touch = e.touches[0];
                addPoint(touch.clientX, touch.clientY);
            }
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('touchmove', handleTouchMove);
        window.addEventListener('touchstart', handleTouchMove); // Trigger on initial touch too

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('touchmove', handleTouchMove);
            window.removeEventListener('touchstart', handleTouchMove);
        };
    }, []);

    if (points.length < 3) return null;

    // Smooth curve using Quadratic Bezier
    // Start at p0
    let pathData = `M ${points[0].x} ${points[0].y}`;

    for (let i = 1; i < points.length - 1; i++) {
        const p1 = points[i];
        const p2 = points[i + 1];
        // Control point is p1, end point is midpoint between p1 and p2
        const midX = (p1.x + p2.x) / 2;
        const midY = (p1.y + p2.y) / 2;
        pathData += ` Q ${p1.x} ${p1.y} ${midX} ${midY}`;
    }

    // Connect last point
    pathData += ` L ${points[points.length - 1].x} ${points[points.length - 1].y}`;

    return (
        <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden mix-blend-screen">
            <svg className="w-full h-full">
                <path
                    d={pathData}
                    fill="none"
                    stroke="rgba(255, 255, 255, 0.6)"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{ filter: 'drop-shadow(0 0 2px rgba(255,255,255,0.8))' }}
                />
            </svg>
        </div>
    );
}
