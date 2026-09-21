/**
 * Normalize a Chief Architect 3D Viewer link into its embeddable iframe URL.
 *
 * Accepts any of:
 *   https://accounts.chiefarchitect.com/3DV/view?share=830104566111110
 *   https://accounts.chiefarchitect.com/3DV/embed?share=830104566111110
 *   830104566111110   (bare share ID)
 *
 * Returns null for anything it doesn't recognize.
 */
export function toModel3dEmbedUrl(input?: string | null): string | null {
    if (!input) return null;
    const trimmed = input.trim();
    if (!trimmed) return null;

    // Bare share ID
    if (/^\d+$/.test(trimmed)) {
        return `https://accounts.chiefarchitect.com/3DV/embed?share=${trimmed}`;
    }

    try {
        const url = new URL(trimmed);
        if (url.hostname.endsWith('chiefarchitect.com')) {
            const share = url.searchParams.get('share');
            if (share) return `https://accounts.chiefarchitect.com/3DV/embed?share=${share}`;
        }
    } catch {
        return null;
    }

    return null;
}
