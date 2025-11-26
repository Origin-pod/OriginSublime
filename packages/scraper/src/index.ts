// src/index.ts
import { scrapeHackerNews } from './sources/hackernews';
import { scrapeReddit } from './sources/reddit';
import { scrapeGithubTrending } from './sources/github-trending';
import { scrapeRSSFeeds } from './sources/rss-feeds';
import { ScrapedArticle } from './types';

export async function scrapeAll(): Promise<ScrapedArticle[]> {
    const results = await Promise.allSettled([
        scrapeHackerNews(),
        scrapeReddit('rust'),
        scrapeReddit('cpp'),
        scrapeGithubTrending('rust'),
        scrapeGithubTrending('cpp'),
        scrapeRSSFeeds(),
    ]);

    const articles: ScrapedArticle[] = [];
    for (const r of results) {
        if (r.status === 'fulfilled') {
            articles.push(...r.value);
        }
    }

    // Deduplicate by URL
    const unique = new Map<string, ScrapedArticle>();
    for (const a of articles) {
        if (!unique.has(a.url)) unique.set(a.url, a);
    }

    // Sort by publishedAt descending (newest first)
    return Array.from(unique.values()).sort((a, b) => {
        const da = a.publishedAt?.getTime() ?? 0;
        const db = b.publishedAt?.getTime() ?? 0;
        return db - da;
    });
}

export * from './types';
