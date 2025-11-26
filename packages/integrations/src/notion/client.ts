// src/notion/client.ts
import { Client } from '@notionhq/client';

let notionClient: Client | null = null;

export function getNotionClient(): Client {
    if (!notionClient) {
        const apiKey = process.env.NOTION_API_KEY;
        if (!apiKey) {
            throw new Error('NOTION_API_KEY environment variable is required');
        }
        notionClient = new Client({ auth: apiKey });
    }
    return notionClient;
}

export function isNotionConfigured(): boolean {
    return !!(
        process.env.NOTION_API_KEY &&
        process.env.NOTION_DAILY_DIGEST_DB &&
        process.env.NOTION_AI_CHALLENGE_DB
    );
}
