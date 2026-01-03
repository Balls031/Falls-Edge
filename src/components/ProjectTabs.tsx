'use client';

type ViewMode = 'photos' | 'plans';

export default function ProjectTabs({ view, onChange }: { view: ViewMode; onChange: (v: ViewMode) => void }) {
    return (
        <div className="flex bg-blueprint/90 border border-blueprint-line rounded-none box-content shadow-[4px_4px_0_0_rgba(0,0,0,0.3)]">
            <button
                onClick={() => onChange('photos')}
                className={`px-4 py-2 text-xs uppercase tracking-widest transition-all ${view === 'photos' ? 'bg-white text-blueprint font-bold' : 'text-gray-400 hover:text-white'}`}
            >
                Photos
            </button>
            <div className="w-px bg-blueprint-line my-1" />
            <button
                onClick={() => onChange('plans')}
                className={`px-4 py-2 text-xs uppercase tracking-widest transition-all ${view === 'plans' ? 'bg-white text-blueprint font-bold' : 'text-gray-400 hover:text-white'}`}
            >
                Floor Plan
            </button>
        </div>
    )
}
