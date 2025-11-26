// src/notion/sync-articles.ts
import { getNotionClient } from './client';
import { CuratedArticle } from '@actionable-newsletter/curator';

/**
 * Sync a curated article to Notion Daily Digest database
 */
export async function syncArticleToNotion(article: CuratedArticle): Promise<string | null> {
    try {
        const notion = getNotionClient();
        const databaseId = process.env.NOTION_DAILY_DIGEST_DB;

        if (!databaseId) {
            console.warn('NOTION_DAILY_DIGEST_DB not configured, skipping sync');
            return null;
        }

        const response = await notion.pages.create({
            parent: { database_id: databaseId },
            properties: {
                Title: {
                    title: [
                        {
                            text: {
                                content: article.title,
                            },
                        },
                    ],
                },
                URL: {
                    url: article.url,
                },
                Source: {
                    select: {
                        name: article.source,
                    },
                },
                'Relevance Score': {
                    number: article.relevanceScore,
                },
                Status: {
                    select: {
                        name: 'Unread',
                    },
                },
                Actionable: {
                    checkbox: article.actionable,
                },
                'Time to Read': {
                    number: article.timeToRead,
                },
                Tags: {
                    multi_select: article.tags.map(tag => ({ name: tag })),
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
                    type: 'heading_2',
                    heading_2: {
                        rich_text: [{ type: 'text', text: { content: 'Summary' } }],
                    },
                },
                {
                    object: 'block',
                    type: 'paragraph',
                    paragraph: {
                        rich_text: [{ type: 'text', text: { content: article.summary } }],
                    },
                },
                {
                    object: 'block',
                    type: 'heading_2',
                    heading_2: {
                        rich_text: [{ type: 'text', text: { content: 'Why It Matters' } }],
                    },
                },
                {
                    object: 'block',
                    type: 'paragraph',
                    paragraph: {
                        rich_text: [{ type: 'text', text: { content: article.whyItMatters } }],
                    },
                },
            ],
        });

        console.log(`✅ Synced article to Notion: ${article.title}`);
        return response.id;
    } catch (error) {
        console.error(`❌ Failed to sync article to Notion: ${article.title}`, error);
        return null;
    }
}

/**
 * Sync multiple articles to Notion
 */
export async function syncArticlesToNotion(articles: CuratedArticle[]): Promise<number> {
    let successCount = 0;

    for (const article of articles) {
        const pageId = await syncArticleToNotion(article);
        if (pageId) {
            successCount++;
        }
        // Rate limiting
        await new Promise(resolve => setTimeout(resolve, 300));
    }

    console.log(`\n📊 Synced ${successCount}/${articles.length} articles to Notion`);
    return successCount;
}
