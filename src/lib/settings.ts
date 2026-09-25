import { supabaseAdmin, isSupabaseConfigured } from './supabase';
import { promises as fs } from 'fs';
import path from 'path';

const db = supabaseAdmin;

export type SiteSettings = {
    hideOurHomesPage: boolean;
};

const DEFAULT_SETTINGS: SiteSettings = {
    hideOurHomesPage: false,
};

// --- Local JSON fallback (dev only, when no Supabase env vars are set) ---
const LOCAL_FILE = path.join(process.cwd(), 'data', 'settings.json');

async function readLocalSettings(): Promise<Record<string, string>> {
    try {
        return JSON.parse(await fs.readFile(LOCAL_FILE, 'utf-8'));
    } catch {
        return {};
    }
}

async function writeLocalSettings(settings: Record<string, string>): Promise<void> {
    await fs.writeFile(LOCAL_FILE, JSON.stringify(settings, null, 2) + '\n', 'utf-8');
}

/** Raw value of one setting row, or null if it isn't set. */
export async function getSettingValue(key: string): Promise<string | null> {
    if (!isSupabaseConfigured) return (await readLocalSettings())[key] ?? null;

    const { data, error } = await db
        .from('site_settings')
        .select('value')
        .eq('key', key)
        .maybeSingle();

    if (error) {
        console.error(`Error fetching setting ${key}:`, error);
        return null;
    }
    return data?.value ?? null;
}

/** Public, typed site settings. Only known keys are exposed — never the admin password hash. */
export async function getSiteSettings(): Promise<SiteSettings> {
    const raw = await getSettingValue('hideOurHomesPage');
    return {
        ...DEFAULT_SETTINGS,
        hideOurHomesPage: raw === 'true',
    };
}

export async function updateSiteSetting(key: string, value: string): Promise<void> {
    if (!isSupabaseConfigured) {
        const settings = await readLocalSettings();
        settings[key] = value;
        return writeLocalSettings(settings);
    }

    const { error } = await db
        .from('site_settings')
        .upsert({ key, value }, { onConflict: 'key' });

    if (error) {
        console.error('Error updating site setting:', error);
        throw error;
    }
}
