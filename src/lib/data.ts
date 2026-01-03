<<<<<<< HEAD
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
};

export const PROJECTS: Project[] = [
    {
        id: '1',
        title: 'The Highland',
        location: 'Falls Edge, Sioux Falls',
        description: 'A modern ranch layout featuring vaulted ceilings and an expansive covered deck.',
        longDescription: 'The Highland defines modern prairie living. With its sharp lines and warm textures, this home offers a sanctuary for families. The open-concept living area features 12-foot ceilings and a floor-to-ceiling stone fireplace. The kitchen is a chef\'s dream with a hidden pantry and quartzite island.',
        image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b91d?auto=format&fit=crop&q=80',
        blueprint: 'https://images.unsplash.com/photo-1581094285065-2bc2e9432822?auto=format&fit=crop&q=80',
        gallery: [
            'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c',
            'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea',
            'https://images.unsplash.com/photo-1600585154340-be6161a56a0c',
        ],
        specs: { totalSqft: '3,100', finishedSqft: '1,550', unfinishedSqft: '1,550 (Unfinished)', bed: 4, bath: 3, garage: '3', price: '$645,000' },
        contact: { email: 'sales@fallsedge.build', phone: '(605) 413-7661' },
        realtors: [
            {
                id: 'r1',
                name: 'David',
                phone: '(605) 413-7661',
                title: 'Project Lead / Builder',
                email: 'sales@fallsedge.build',
                image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80',
            }
        ],
        status: 'available'
    },
    {
        id: '2',
        title: 'The Summit',
        location: 'Willow Ridge, Hartford',
        description: 'Split-foyer design optimizing space and natural light with lower-level walkout.',
        longDescription: 'The Summit maximizes efficiency without sacrificing style. The split-foyer entry welcomes you with abundant natural light. The lower level features a walkout directly to the backyard patio, perfect for entertainment. Includes a custom oversized garage workshop.',
        image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80',
        blueprint: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&q=80',
        gallery: [
            'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0',
            'https://images.unsplash.com/photo-1600566752355-35792bedcfe1',
        ],
        specs: { totalSqft: '2,400', finishedSqft: '1,200', unfinishedSqft: '1,200 (Partially Fin.)', bed: 3, bath: 2.5, garage: '3+', price: '$525,000' },
        contact: { email: 'sales@fallsedge.build', phone: '(605) 413-7661' },
        realtors: [
            {
                id: 'r1',
                name: 'David',
                phone: '(605) 413-7661',
                title: 'Project Lead / Builder',
                email: 'sales@fallsedge.build',
                image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80',
            }
        ],
        status: 'sold'
    }
];

export const SIGN_MAPPING: Record<string, string> = {
    'sign1': '1', // The Highland
    'sign2': '2', // The Summit
};
=======
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
};

export const PROJECTS: Project[] = [
    {
        id: '1',
        title: 'The Highland',
        location: 'Falls Edge, Sioux Falls',
        description: 'A modern ranch layout featuring vaulted ceilings and an expansive covered deck.',
        longDescription: 'The Highland defines modern prairie living. With its sharp lines and warm textures, this home offers a sanctuary for families. The open-concept living area features 12-foot ceilings and a floor-to-ceiling stone fireplace. The kitchen is a chef\'s dream with a hidden pantry and quartzite island.',
        image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b91d?auto=format&fit=crop&q=80',
        blueprint: 'https://images.unsplash.com/photo-1581094285065-2bc2e9432822?auto=format&fit=crop&q=80',
        gallery: [
            'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c',
            'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea',
            'https://images.unsplash.com/photo-1600585154340-be6161a56a0c',
        ],
        specs: { totalSqft: '3,100', finishedSqft: '1,550', unfinishedSqft: '1,550 (Unfinished)', bed: 4, bath: 3, garage: '3', price: '$645,000' },
        contact: { email: 'sales@fallsedge.build', phone: '(605) 413-7661' },
        realtors: [
            {
                id: 'r1',
                name: 'David',
                phone: '(605) 413-7661',
                title: 'Project Lead / Builder',
                email: 'sales@fallsedge.build',
                image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80',
            }
        ],
        status: 'available'
    },
    {
        id: '2',
        title: 'The Summit',
        location: 'Willow Ridge, Hartford',
        description: 'Split-foyer design optimizing space and natural light with lower-level walkout.',
        longDescription: 'The Summit maximizes efficiency without sacrificing style. The split-foyer entry welcomes you with abundant natural light. The lower level features a walkout directly to the backyard patio, perfect for entertainment. Includes a custom oversized garage workshop.',
        image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80',
        blueprint: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&q=80',
        gallery: [
            'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0',
            'https://images.unsplash.com/photo-1600566752355-35792bedcfe1',
        ],
        specs: { totalSqft: '2,400', finishedSqft: '1,200', unfinishedSqft: '1,200 (Partially Fin.)', bed: 3, bath: 2.5, garage: '3+', price: '$525,000' },
        contact: { email: 'sales@fallsedge.build', phone: '(605) 413-7661' },
        realtors: [
            {
                id: 'r1',
                name: 'David',
                phone: '(605) 413-7661',
                title: 'Project Lead / Builder',
                email: 'sales@fallsedge.build',
                image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80',
            }
        ],
        status: 'sold'
    }
];

export const SIGN_MAPPING: Record<string, string> = {
    'sign1': '1', // The Highland
    'sign2': '2', // The Summit
};
>>>>>>> f23c7ec5816116c984b5737788af5cbb8de299c1
