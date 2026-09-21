'use client';

export type ViewMode = 'photos' | 'plans' | 'tour';

export default function ProjectTabs({ view, onChange, hasTour = false }: { view: ViewMode; onChange: (v: ViewMode) => void; hasTour?: boolean }) {
    // The 3D tour is desktop-only (the Chief Architect viewer doesn't work well in mobile browsers), so its tab is hidden below md.
    const tabs: { key: ViewMode; label: string; desktopOnly?: boolean }[] = [
        { key: 'photos', label: 'Photos' },
        { key: 'plans', label: 'Floor Plan' },
        ...(hasTour ? [{ key: 'tour' as ViewMode, label: '3D Tour', desktopOnly: true }] : []),
    ];

    return (
        <div className="flex bg-blueprint/90 border border-blueprint-line rounded-none box-content shadow-[4px_4px_0_0_rgba(0,0,0,0.3)]">
            {tabs.map((t, i) => (
                <div key={t.key} className={t.desktopOnly ? 'hidden md:flex' : 'flex'}>
                    {i > 0 && <div className="w-px bg-blueprint-line my-1" />}
                    <button
                        onClick={() => onChange(t.key)}
                        className={`px-4 py-2 text-xs uppercase tracking-widest transition-all ${view === t.key ? 'bg-white text-blueprint font-bold' : 'text-gray-400 hover:text-white'}`}
                    >
                        {t.label}
                    </button>
                </div>
            ))}
        </div>
    )
}
