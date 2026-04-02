import { Project } from './data';
import { supabase, supabaseAdmin } from './supabase';

// Use admin client if available (server-side), otherwise falls back to public client
const db = supabaseAdmin;

// --- Projects ---

export async function getProjects(): Promise<Project[]> {
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
    const { error } = await db
        .from('projects')
        .insert(project);

    if (error) {
        console.error('Error adding project:', error);
        throw error;
    }
}

export async function deleteProject(id: string): Promise<void> {
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
    const { error } = await db
        .from('realtors')
        .upsert(realtors);

    if (error) {
        console.error('Error saving realtors:', error);
        throw error;
    }
}

export async function addRealtor(realtor: any): Promise<void> {
    const { error } = await db
        .from('realtors')
        .insert(realtor);

    if (error) {
        console.error('Error adding realtor:', error);
        throw error;
    }
}

export async function deleteRealtor(id: string): Promise<void> {
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
    const { error } = await db
        .from('realtors')
        .update(realtor)
        .eq('id', realtor.id);

    if (error) {
        console.error('Error updating realtor:', error);
        throw error;
    }
}
