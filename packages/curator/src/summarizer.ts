// src/summarizer.ts
import { ScrapedArticle } from '@actionable-newsletter/scraper';
import { callClaude } from './client';

export interface ArticleSummary {
    summary: string;
    whyItMatters: string;
    tags: string[];
    timeToRead: number;
}

/**
 * Generate a summary and "why it matters" for an article.
 * Uses a casual "builder friend" tone.
 */
export async function summarizeArticle(
    article: ScrapedArticle
): Promise<ArticleSummary> {
    const prompt = `You are a friendly software developer helping a friend discover interesting content.

Article:
Title: ${article.title}
Source: ${article.source}
URL: ${article.url}

Generate a summary for this article. Use a casual, enthusiastic "builder friend" tone.

Return a JSON object with:
{
  "summary": "2-3 sentence technical summary of what this is about",
  "whyItMatters": "Why your developer friend should care. Use phrases like 'This is cool because...', 'You'll want to check this out if...', 'Imagine using this for...'",
  "tags": ["tag1", "tag2", "tag3"],
  "timeToRead": 5
}

Guidelines:
- Be enthusiastic but not over-the-top
- Focus on practical value
- Mention specific technologies/concepts
- Keep it concise
- timeToRead should be realistic (3-15 minutes)

Return ONLY valid JSON, no markdown formatting.`;

    try {
        const response = await callClaude(prompt, {
            maxTokens: 500,
            temperature: 0.8, // Higher for creative, friendly tone
        });

        // Clean up response (remove markdown code blocks if present)
        const cleaned = response.trim().replace(/^```json\n?/, '').replace(/\n?```$/, '');
        const parsed = JSON.parse(cleaned);

        return {
            summary: parsed.summary || 'No summary available',
            whyItMatters: parsed.whyItMatters || 'Interesting content worth exploring',
            tags: Array.isArray(parsed.tags) ? parsed.tags : [],
            timeToRead: typeof parsed.timeToRead === 'number' ? parsed.timeToRead : 5,
        };
    } catch (error) {
        console.error(`Error summarizing article "${article.title}":`, error);

        // Return fallback summary
        return {
            summary: `Article from ${article.source}: ${article.title}`,
            whyItMatters: 'Worth checking out for more details.',
            tags: [article.source],
            timeToRead: 5,
        };
    }
}

/**
 * Summarize multiple articles with rate limiting
 */
export async function summarizeArticles(
    articles: ScrapedArticle[],
    batchSize: number = 1 // Process 1 at a time
): Promise<Map<string, ArticleSummary>> {
    const summaries = new Map<string, ArticleSummary>();

    for (let i = 0; i < articles.length; i += batchSize) {
        const batch = articles.slice(i, i + batchSize);
        const batchSummaries = await Promise.all(
            batch.map(article => summarizeArticle(article))
        );

        batch.forEach((article, idx) => {
            summaries.set(article.url, batchSummaries[idx]);
        });

        // Delay between batches
        if (i + batchSize < articles.length) {
            await new Promise(resolve => setTimeout(resolve, 6500));
        }
    }

    return summaries;
}
