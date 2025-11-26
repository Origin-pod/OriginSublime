// src/sources/rss-feeds.ts
import Parser from 'rss-parser';
import { ScrapedArticle } from '../types';

const parser = new Parser();

const FEEDS: { url: string; category: string }[] = [
    { url: 'https://blog.rust-lang.org/feed.xml', category: 'RUST' },
    { url: 'https://this-week-in-rust.org/rss.xml', category: 'RUST' },
    { url: 'https://isocpp.org/blog/rss', category: 'CPP' },
    { url: 'https://openai.com/blog/rss.xml', category: 'AI' },
    { url: 'https://daily-philosophy.com/feed/', category: 'PHILOSOPHY' },
    // Poetry (Try multiple reliable sources)
    { url: 'https://poetrydaily.org/feed/', category: 'POETRY' },
    { url: 'https://lithub.com/category/poetry/feed/', category: 'POETRY' },
    // Self Help
    { url: 'https://zenhabits.net/feed/', category: 'SELF_HELP' },
    // Meta Skills (Learning, Mental Models, Soft Skills)
    { url: 'https://fs.blog/feed/', category: 'META_SKILLS' },
    { url: 'https://jamesclear.com/feed', category: 'META_SKILLS' },
    { url: 'https://www.scotthyoung.com/blog/feed/', category: 'META_SKILLS' },
];

export async function scrapeRSSFeeds(): Promise<ScrapedArticle[]> {
    const articles: ScrapedArticle[] = [];
    for (const feed of FEEDS) {
        try {
            const parsed = await parser.parseURL(feed.url);
            // Limit to 5 newest items per feed to avoid overwhelming the curator
            const items = parsed.items.slice(0, 5);
            for (const item of items) {
                articles.push({
                    title: item.title ?? 'Untitled',
                    url: item.link ?? '',
                    source: `rss-${feed.category.toLowerCase()}`,
                    publishedAt: item.isoDate ? new Date(item.isoDate) : undefined,
                });
            }
        } catch (e) {
            console.error(`Failed to parse RSS feed ${feed.url}:`, e);
        }
    }
    return articles;
}
