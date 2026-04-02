import { supabaseAdmin } from './supabase';

const db = supabaseAdmin;

export type SiteSettings = {
    hideOurHomesPage: boolean;
};

const DEFAULT_SETTINGS: SiteSettings = {
    hideOurHomesPage: false,
};

export async function getSiteSettings(): Promise<SiteSettings> {
    try {
        const { data, error } = await db
            .from('site_settings')
            .select('*')
            .limit(10);

        if (error) {
            console.error('Error fetching site settings:', error);
            return DEFAULT_SETTINGS;
        }

        // Build settings from key-value rows
        const settings = { ...DEFAULT_SETTINGS };
        for (const row of (data || [])) {
            if (row.key === 'hideOurHomesPage') {
                settings.hideOurHomesPage = row.value === 'true' || row.value === true;
            }
        }
        return settings;
    } catch (e) {
        console.error('Error fetching site settings:', e);
        return DEFAULT_SETTINGS;
    }
}

export async function updateSiteSetting(key: string, value: string): Promise<void> {
    // Upsert the setting
    const { error } = await db
        .from('site_settings')
        .upsert({ key, value }, { onConflict: 'key' });

    if (error) {
        console.error('Error updating site setting:', error);
        throw error;
    }
}
