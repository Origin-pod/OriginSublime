// src/sources/github-trending.ts
import fetch from 'node-fetch';
import * as cheerio from 'cheerio';
import { ScrapedArticle } from '../types';

/**
 * Scrape the daily trending repositories for a given language from GitHub Trending.
 * Returns an array of ScrapedArticle objects.
 */
export async function scrapeGithubTrending(language: string): Promise<ScrapedArticle[]> {
  const url = `https://github.com/trending/${encodeURIComponent(language)}?since=daily`;
  const response = await fetch(url);
  const html = await response.text();
  const $ = cheerio.load(html);

  const articles: ScrapedArticle[] = [];
  $('article.Box-row').each((_, el) => {
    const repoLink = $(el).find('h1.h3 a').attr('href')?.trim();
    if (!repoLink) return;
    const [owner, name] = repoLink.split('/').filter(Boolean);
    const title = `${owner}/${name}`;
    const repoUrl = `https://github.com/${owner}/${name}`;
    const description = $(el).find('p.col-9').text().trim();

    articles.push({
      title: description || title,
      url: repoUrl,
      source: `github-trending-${language}`,
    });
  });

  return articles;
}
