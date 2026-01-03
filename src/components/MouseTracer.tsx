<<<<<<< HEAD
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
        const handleMouseMove = (e: MouseEvent) => {
            const newPoint = { x: e.clientX, y: e.clientY, id: count++ };
            setPoints((prev) => [...prev, newPoint].slice(-50)); // Keep last 50 points

            // Remove points after a short delay to create a tail effect
            setTimeout(() => {
                setPoints((prev) => prev.filter((p) => p.id !== newPoint.id));
            }, 600); // Slightly shorter trail
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
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
=======
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
        const handleMouseMove = (e: MouseEvent) => {
            const newPoint = { x: e.clientX, y: e.clientY, id: count++ };
            setPoints((prev) => [...prev, newPoint].slice(-50)); // Keep last 50 points

            // Remove points after a short delay to create a tail effect
            setTimeout(() => {
                setPoints((prev) => prev.filter((p) => p.id !== newPoint.id));
            }, 600); // Slightly shorter trail
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
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
>>>>>>> f23c7ec5816116c984b5737788af5cbb8de299c1
