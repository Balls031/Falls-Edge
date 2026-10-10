/**
 * Discord notifications for sign scans.
 *
 * Set DISCORD_WEBHOOK_URL (Discord: Server Settings → Integrations → Webhooks → New Webhook → Copy URL).
 * When it's unset, notifications are silently skipped. Sending never throws — a Discord outage must
 * not break the QR redirect.
 */
import { Project } from './data';

const ACCENT = 0x00f0ff;

export function isNotifyConfigured(): boolean {
    return !!process.env.DISCORD_WEBHOOK_URL;
}

export type ScanInfo = {
    project: Project;
    sign: string;
    device: 'mobile' | 'desktop';
    siteUrl: string;
    location?: string; // e.g. "Sioux Falls, SD, US"
};

async function postToDiscord(payload: unknown): Promise<boolean> {
    const url = process.env.DISCORD_WEBHOOK_URL;
    if (!url) return false;
    try {
        const res = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
            signal: AbortSignal.timeout(5000),
        });
        if (!res.ok) console.error('Discord webhook responded', res.status, await res.text().catch(() => ''));
        return res.ok;
    } catch (e) {
        console.error('Discord webhook failed:', e);
        return false;
    }
}

export async function notifyScan({ project, sign, device, siteUrl, location }: ScanInfo): Promise<boolean> {
    const counts = project.scanCount || { mobile: 0, desktop: 0 };
    const fields = [
        { name: 'Sign', value: sign, inline: true },
        { name: 'Device', value: device === 'mobile' ? '📱 Phone' : '💻 Desktop', inline: true },
        { name: 'Total scans', value: `${counts.mobile} phone · ${counts.desktop} desktop`, inline: true },
    ];
    if (location) fields.push({ name: 'Location', value: location, inline: true });

    return postToDiscord({
        username: 'Falls Edge Signs',
        embeds: [{
            title: `📍 Sign scanned — ${project.title}`,
            url: `${siteUrl}/projects/${project.id}`,
            description: project.location || undefined,
            color: ACCENT,
            fields,
            timestamp: new Date().toISOString(),
        }],
    });
}

export async function notifyTest(siteUrl: string): Promise<boolean> {
    return postToDiscord({
        username: 'Falls Edge Signs',
        embeds: [{
            title: '✅ Test notification',
            description: 'Sign-scan notifications are working. You will get a message here each time a sign QR code is scanned.',
            url: siteUrl,
            color: ACCENT,
            timestamp: new Date().toISOString(),
        }],
    });
}
