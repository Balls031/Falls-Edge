export type Realtor = {
    id: string;
    name: string;
    phone: string;
    title: string;
    email: string;
    agency?: string;
    image?: string;
};

export type Project = {
    id: string;
    projectNumber?: string;
    title: string;
    location: string;
    description: string;
    longDescription?: string;
    image: string;
    blueprint: string; // Deprecated but kept for type compat if needed for now
    blueprints?: string[]; // New multi-blueprint support
    gallery?: string[];
    specs: { totalSqft: string; finishedSqft: string; unfinishedSqft: string; bed: number; bath: number; garage: string; price?: string };
    contact?: { email: string; phone: string };
    realtors?: Realtor[]; // Support for multiple realtors
    status: 'available' | 'sold' | 'pending';
    featured?: boolean;
    imageFit?: 'contain' | 'cover' | 'fill';
    qrCode?: string; // e.g. 'sign1', 'sign2'
    address?: string; // Full street address for calendar/maps navigation
    coordinates?: { lat: number; lng: number }; // GPS coordinates for new construction
    scanCount?: { mobile: number; desktop: number };
    openHouses?: { date: string; startTime: string; endTime: string }[];
    model3dUrl?: string; // Chief Architect 3D Viewer share link (view or embed URL)
    aiImages?: string[]; // Gallery URLs that are AI-generated renderings (shown with an "AI" badge)
};
