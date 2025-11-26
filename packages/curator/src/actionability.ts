// src/actionability.ts
import { ScrapedArticle } from '@actionable-newsletter/scraper';
import { callClaude } from './client';

/**
 * Detect if an article contains actionable, hands-on content.
 * Returns true if the article has code examples, tutorials, exercises, or project ideas.
 */
export async function detectActionability(
    article: ScrapedArticle
): Promise<boolean> {
    const prompt = `Analyze if this article is ACTIONABLE (has hands-on content).

Article:
Title: ${article.title}
Source: ${article.source}

An article is actionable if it contains:
- Code examples or snippets
- Step-by-step tutorials
- Exercises or challenges
- Project ideas or starter templates
- Hands-on demonstrations
- "How to" guides

An article is NOT actionable if it's:
- Just news or announcements
- Pure discussion or opinion
- Theory without examples
- Link aggregation

Return ONLY "true" or "false". No explanation.`;

    try {
        const response = await callClaude(prompt, {
            maxTokens: 5,
            temperature: 0.2,
        });

        const cleaned = response.trim().toLowerCase();
        return cleaned === 'true';
    } catch (error) {
        console.error(`Error detecting actionability for "${article.title}":`, error);

        // Fallback: check if source suggests actionable content
        const actionableSources = ['tutorial', 'guide', 'example', 'workshop'];
        return actionableSources.some(keyword =>
            article.source.toLowerCase().includes(keyword) ||
            article.title.toLowerCase().includes(keyword)
        );
    }
}

/**
 * Detect actionability for multiple articles
 */
export async function detectActionabilityBatch(
    articles: ScrapedArticle[],
    batchSize: number = 1 // Process 1 at a time
): Promise<Map<string, boolean>> {
    const results = new Map<string, boolean>();

    for (let i = 0; i < articles.length; i += batchSize) {
        const batch = articles.slice(i, i + batchSize);
        const batchResults = await Promise.all(
            batch.map(article => detectActionability(article))
        );

        batch.forEach((article, idx) => {
            results.set(article.url, batchResults[idx]);
        });

        if (i + batchSize < articles.length) {
            await new Promise(resolve => setTimeout(resolve, 6500));
        }
    }

    return results;
}
