// src/notion/sync-challenges.ts
import { getNotionClient } from './client';
import { AIChallenge } from '@actionable-newsletter/generator';

/**
 * Sync an AI challenge to Notion 100 Days database
 */
export async function syncChallengeToNotion(challenge: AIChallenge): Promise<string | null> {
    try {
        const notion = getNotionClient();
        const databaseId = process.env.NOTION_AI_CHALLENGE_DB;

        if (!databaseId) {
            console.warn('NOTION_AI_CHALLENGE_DB not configured, skipping sync');
            return null;
        }

        const response = await notion.pages.create({
            parent: { database_id: databaseId },
            properties: {
                Name: {
                    title: [
                        {
                            text: {
                                content: `Day ${challenge.dayNumber}: ${challenge.toolName}`,
                            },
                        },
                    ],
                },
                Day: {
                    number: challenge.dayNumber,
                },
                Tool: {
                    select: {
                        name: challenge.toolName,
                    },
                },
                Category: {
                    select: {
                        name: challenge.category,
                    },
                },
                Status: {
                    select: {
                        name: 'Not Started',
                    },
                },
                'Time Estimate': {
                    number: challenge.timeEstimate,
                },
                Date: {
                    date: {
                        start: new Date().toISOString().split('T')[0],
                    },
                },
            },
            children: [
                {
                    object: 'block',
                    type: 'heading_1',
                    heading_1: {
                        rich_text: [{ type: 'text', text: { content: challenge.projectIdea } }],
                    },
                },
                {
                    object: 'block',
                    type: 'paragraph',
                    paragraph: {
                        rich_text: [{ type: 'text', text: { content: challenge.description } }],
                    },
                },
                {
                    object: 'block',
                    type: 'heading_2',
                    heading_2: {
                        rich_text: [{ type: 'text', text: { content: '🔧 Setup Instructions' } }],
                    },
                },
                ...challenge.setupInstructions.map(step => ({
                    object: 'block' as const,
                    type: 'bulleted_list_item' as const,
                    bulleted_list_item: {
                        rich_text: [{ type: 'text' as const, text: { content: step } }],
                    },
                })),
                {
                    object: 'block',
                    type: 'heading_2',
                    heading_2: {
                        rich_text: [{ type: 'text', text: { content: '✅ Success Criteria' } }],
                    },
                },
                ...challenge.successCriteria.map(criterion => ({
                    object: 'block' as const,
                    type: 'to_do' as const,
                    to_do: {
                        rich_text: [{ type: 'text' as const, text: { content: criterion } }],
                        checked: false,
                    },
                })),
            ],
        });

        console.log(`✅ Synced challenge to Notion: Day ${challenge.dayNumber}`);
        return response.id;
    } catch (error) {
        console.error(`❌ Failed to sync challenge to Notion: Day ${challenge.dayNumber}`, error);
        return null;
    }
}
