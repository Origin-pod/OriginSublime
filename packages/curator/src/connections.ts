// src/connections.ts
import { ScrapedArticle } from '@actionable-newsletter/scraper';
import { ArticleConnection } from './types';
import { callClaude } from './client';

/**
 * Find thematic connections across articles.
 * Identifies patterns, recurring topics, and cross-domain insights.
 */
export async function findConnections(
    articles: ScrapedArticle[],
    weekNumber: number
): Promise<ArticleConnection[]> {
    if (articles.length < 3) {
        return []; // Need at least 3 articles to find connections
    }

    const articleList = articles
        .slice(0, 20) // Limit to avoid token limits
        .map((a, i) => `${i + 1}. [${a.source}] ${a.title}`)
        .join('\n');

    const prompt = `You are analyzing a week's worth of tech articles to find interesting connections and themes.

Articles from this week:
${articleList}

Find 2-4 interesting connections or themes across these articles. Look for:
- Recurring technical concepts (e.g., "3 articles mention zero-cost abstractions")
- Cross-domain insights (e.g., "Rust ownership ↔ Stoic philosophy both emphasize constraints")
- Emerging trends (e.g., "Multiple articles exploring async patterns")
- Surprising parallels (e.g., "Poetry line breaks ↔ Code structure as meaning")

Return a JSON array of connections:
[
  {
    "theme": "Short, catchy theme name",
    "description": "2-3 sentence explanation of the connection and why it's interesting",
    "articleIndices": [1, 3, 7]
  }
]

Be creative but grounded. Focus on genuine insights, not forced connections.
Return ONLY valid JSON, no markdown.`;

    try {
        const response = await callClaude(prompt, {
            maxTokens: 1000,
            temperature: 0.9, // Higher for creative connections
        });

        const cleaned = response.trim().replace(/^```json\n?/, '').replace(/\n?```$/, '');
        const parsed = JSON.parse(cleaned);

        if (!Array.isArray(parsed)) {
            return [];
        }

        return parsed.map((conn: any) => ({
            theme: conn.theme || 'Untitled Connection',
            description: conn.description || '',
            articleUrls: (conn.articleIndices || [])
                .map((idx: number) => articles[idx - 1]?.url)
                .filter(Boolean),
            weekNumber,
        }));
    } catch (error) {
        console.error('Error finding connections:', error);
        return [];
    }
}

/**
 * Get the ISO week number for a date
 */
export function getWeekNumber(date: Date = new Date()): number {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
}
