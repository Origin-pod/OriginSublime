// src/sources/hackernews.ts
import fetch from 'node-fetch';
import * as cheerio from 'cheerio';
import { ScrapedArticle } from '../types';

/** Fetch top stories from Hacker News */
export async function scrapeHackerNews(): Promise<ScrapedArticle[]> {
    const response = await fetch('https://news.ycombinator.com/');
    const html = await response.text();
    const $ = cheerio.load(html);

    const articles: ScrapedArticle[] = [];
    $('tr.athing').each((_, el) => {
        const title = $(el).find('a.storylink').text().trim();
        const href = $(el).find('a.storylink').attr('href') ?? '';
        const url = href.startsWith('item?id=') ? `https://news.ycombinator.com/${href}` : href;
        const age = $(el).next().find('span.age').attr('title'); // e.g. "2025-11-24T12:34:56"
        const publishedAt = age ? new Date(age) : undefined;

        articles.push({
            title,
            url,
            source: 'hackernews',
            publishedAt,
        });
    });

    // Return top 30 stories (or fewer)
    return articles.slice(0, 30);
}
