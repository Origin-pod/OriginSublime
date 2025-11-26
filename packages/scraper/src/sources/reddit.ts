// src/sources/reddit.ts
import fetch from 'node-fetch';
import * as cheerio from 'cheerio';
import { ScrapedArticle } from '../types';

/**
 * Scrape top posts from a subreddit (e.g. "rust" or "cpp").
 * Returns only posts that link to external URLs and have a minimum score.
 */
export async function scrapeReddit(subreddit: string): Promise<ScrapedArticle[]> {
    const url = `https://www.reddit.com/r/${subreddit}/top/?t=day`;
    const response = await fetch(url, {
        headers: { 'User-Agent': 'actionable-newsletter-bot' },
    });
    const html = await response.text();
    const $ = cheerio.load(html);

    const articles: ScrapedArticle[] = [];
    $('div.Post').each((_, el) => {
        const title = $(el).find('h3').first().text().trim();
        const link = $(el).find('a[data-click-id="body"]').attr('href') ?? '';
        const scoreText = $(el).find('div[data-test-id="post-content"] span[data-click-id="score"]').text();
        const score = parseInt(scoreText.replace(/[^0-9]/g, ''), 10) || 0;

        // Only keep external links and enforce a score threshold (e.g., 50)
        if (link && !link.includes('reddit.com') && score >= 50) {
            const absolute = link.startsWith('http') ? link : `https://www.reddit.com${link}`;
            articles.push({
                title,
                url: absolute,
                source: `reddit-${subreddit}`,
            });
        }
    });

    return articles;
}
