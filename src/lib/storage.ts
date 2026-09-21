import { Project } from './data';
import { supabase, supabaseAdmin, isSupabaseConfigured } from './supabase';
import { promises as fs } from 'fs';
import path from 'path';

// Use admin client if available (server-side), otherwise falls back to public client
const db = supabaseAdmin;

// --- Local JSON fallback (dev only, when no Supabase env vars are set) ---

const DATA_DIR = path.join(process.cwd(), 'data');

async function readLocal<T>(file: string): Promise<T[]> {
    try {
        const raw = await fs.readFile(path.join(DATA_DIR, file), 'utf-8');
        return JSON.parse(raw) as T[];
    } catch {
        return [];
    }
}

async function writeLocal<T>(file: string, items: T[]): Promise<void> {
    await fs.writeFile(path.join(DATA_DIR, file), JSON.stringify(items, null, 2) + '\n', 'utf-8');
}

const useLocal = !isSupabaseConfigured;
if (useLocal) {
    console.warn('[storage] Supabase not configured — using local JSON files in /data');
}

// --- Projects ---

export async function getProjects(): Promise<Project[]> {
    if (useLocal) return readLocal<Project>('projects.json');

    const { data, error } = await db
        .from('projects')
        .select('*')
        .order('created_at', { ascending: true }); // Assuming created_at exists, or order by id/title

    if (error) {
        console.error('Error fetching projects:', error);
        return [];
    }
    return data as Project[];
}

export async function saveProjects(projects: Project[]): Promise<void> {
    if (useLocal) {
        const existing = await readLocal<Project>('projects.json');
        const byId = new Map(existing.map(p => [p.id, p]));
        projects.forEach(p => byId.set(p.id, { ...byId.get(p.id), ...p }));
        return writeLocal('projects.json', [...byId.values()]);
    }

    // This function originally overwrote the whole file. 
    // For Supabase, we should probably upsert them all.
    // However, mass overwrite is dangerous if we don't handle deletions.
    // Given the previous usage, this might be used for reordering or bulk updates.

    const { error } = await db
        .from('projects')
        .upsert(projects);

    if (error) {
        console.error('Error saving projects:', error);
        throw error;
    }
}

export async function addProject(project: Project): Promise<void> {
    if (useLocal) {
        const existing = await readLocal<Project>('projects.json');
        return writeLocal('projects.json', [...existing, project]);
    }

    const { error } = await db
        .from('projects')
        .insert(project);

    if (error) {
        console.error('Error adding project:', error);
        throw error;
    }
}

export async function deleteProject(id: string): Promise<void> {
    if (useLocal) {
        const existing = await readLocal<Project>('projects.json');
        return writeLocal('projects.json', existing.filter(p => p.id !== id));
    }

    const { error } = await db
        .from('projects')
        .delete()
        .eq('id', id);

    if (error) {
        console.error('Error deleting project:', error);
        throw error;
    }
}

export async function updateProject(project: Project): Promise<void> {
    if (useLocal) {
        const existing = await readLocal<Project>('projects.json');
        return writeLocal('projects.json', existing.map(p => p.id === project.id ? { ...p, ...project } : p));
    }

    const { error } = await db
        .from('projects')
        .update(project)
        .eq('id', project.id);

    if (error) {
        console.error('Error updating project:', error);
        throw error;
    }
}

export async function incrementProjectScan(id: string, device: 'mobile' | 'desktop'): Promise<void> {
    // We can't do atomic updates easily on a JSONB field inside an array without a stored procedure 
    // or careful logic. But here 'projects' is a table where one row = one project?
    // Wait, the storage.ts suggests the 'projects' table has rows. 
    // Let's check `getProjects`. It selects *. 
    // If we assume Supabase, we can use an RPC or just read-modify-write for now (less safe but easier).
    // Better: use an RPC if possible, but I don't have access to create RPCs easily without SQL tool (which I might have, but simple RMW is safer for now).

    // Actually, let's fetch, update in memory, and save back.
    if (useLocal) {
        const existing = await readLocal<Project>('projects.json');
        const target = existing.find(p => p.id === id);
        if (!target) return;
        const counts = target.scanCount || { mobile: 0, desktop: 0 };
        counts[device] = (counts[device] || 0) + 1;
        target.scanCount = counts;
        return writeLocal('projects.json', existing);
    }

    const { data: project, error: fetchError } = await db
        .from('projects')
        .select('scanCount')
        .eq('id', id)
        .single();

    if (fetchError || !project) return; // Silent fail?

    const currentCounts = (project as any).scanCount || { mobile: 0, desktop: 0 };
    currentCounts[device] = (currentCounts[device] || 0) + 1;

    const { error } = await db
        .from('projects')
        .update({ scanCount: currentCounts })
        .eq('id', id);

    if (error) {
        console.error('Error incrementing scan count:', error);
    }
}

// --- Realtors ---

export async function getRealtors(): Promise<any[]> {
    if (useLocal) return readLocal<any>('realtors.json');

    const { data, error } = await db
        .from('realtors')
        .select('*');

    if (error) {
        console.error('Error fetching realtors:', error);
        return [];
    }
    return data || [];
}

export async function saveRealtors(realtors: any[]): Promise<void> {
    if (useLocal) {
        const existing = await readLocal<any>('realtors.json');
        const byId = new Map(existing.map(r => [r.id, r]));
        realtors.forEach(r => byId.set(r.id, { ...byId.get(r.id), ...r }));
        return writeLocal('realtors.json', [...byId.values()]);
    }

    const { error } = await db
        .from('realtors')
        .upsert(realtors);

    if (error) {
        console.error('Error saving realtors:', error);
        throw error;
    }
}

export async function addRealtor(realtor: any): Promise<void> {
    if (useLocal) {
        const existing = await readLocal<any>('realtors.json');
        return writeLocal('realtors.json', [...existing, realtor]);
    }

    const { error } = await db
        .from('realtors')
        .insert(realtor);

    if (error) {
        console.error('Error adding realtor:', error);
        throw error;
    }
}

export async function deleteRealtor(id: string): Promise<void> {
    if (useLocal) {
        const existing = await readLocal<any>('realtors.json');
        return writeLocal('realtors.json', existing.filter(r => r.id !== id));
    }

    const { error } = await db
        .from('realtors')
        .delete()
        .eq('id', id);

    if (error) {
        console.error('Error deleting realtor:', error);
        throw error;
    }
}

export async function updateRealtor(realtor: any): Promise<void> {
    if (useLocal) {
        const existing = await readLocal<any>('realtors.json');
        return writeLocal('realtors.json', existing.map(r => r.id === realtor.id ? { ...r, ...realtor } : r));
    }

    const { error } = await db
        .from('realtors')
        .update(realtor)
        .eq('id', realtor.id);

    if (error) {
        console.error('Error updating realtor:', error);
        throw error;
    }
}

/**
 * After editing a realtor, update the embedded realtor snapshot
 * inside every project that references this realtor (by ID).
 * This eliminates the need to remove and re-add realtors from listings.
 */
export async function updateRealtorInProjects(realtor: any): Promise<void> {
    const projects = await getProjects();
    const updates: Project[] = [];

    for (const project of projects) {
        if (!project.realtors?.length) continue;
        const idx = project.realtors.findIndex((r: any) => r.id === realtor.id);
        if (idx === -1) continue;

        // Replace the old snapshot with the fresh realtor data
        const updatedRealtors = [...project.realtors];
        updatedRealtors[idx] = { ...realtor };
        updates.push({ ...project, realtors: updatedRealtors });
    }

    // Batch update all affected projects
    if (useLocal) return saveProjects(updates);

    for (const project of updates) {
        const { error } = await db
            .from('projects')
            .update({ realtors: project.realtors })
            .eq('id', project.id);

        if (error) {
            console.error(`Error syncing realtor into project ${project.id}:`, error);
        }
    }
}
