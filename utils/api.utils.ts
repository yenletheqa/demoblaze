import { expect } from '@playwright/test';

export function extractAuthToken(raw: string): string {
    const match = raw.match(/Auth_token:\s*(.+)/);
    if (!match) {
        throw new Error(`Auth token not found in response: ${raw}`);
    }
    return match[1]!.replace(/"/g, '').trim();
}