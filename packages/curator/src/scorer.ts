// src/scorer.ts
import { ScrapedArticle } from '@actionable-newsletter/scraper';
import { UserPreferences } from './types';
import { callClaude } from './client';

export interface ScoredResult {
    score: number;
    category: string;
}

/**
 * Score an article's quality and classify it into one of the 6 domains.
 */
export async function scoreRelevance(
    article: ScrapedArticle,
    preferences: UserPreferences
): Promise<ScoredResult> {
    const prompt = `Analyze this article for a developer newsletter.
1. Classify it into EXACTLY ONE of these domains: [RUST, CPP, AI, PHILOSOPHY, POETRY, SELF_HELP, META_SKILLS, OTHER].
   - Use "RUST" for Rust programming.
   - Use "CPP" for C++ programming.
   - Use "AI" for Artificial Intelligence / ML.
   - Use "PHILOSOPHY" for philosophical concepts, stoicism, ethics.
   - Use "POETRY" for poems or poetic analysis.
   - Use "SELF_HELP" for productivity, habits, mental models.
   - Use "META_SKILLS" for learning how to learn, mental models, soft skills, career growth.
   - Use "OTHER" if it fits none (e.g. general tech news).

2. Score its quality/relevance (0-100).
   - High score (80-100): Deep technical insight, actionable advice, or profound thought.
   - Low score (0-40): Generic news, clickbait, or shallow content.

Article:
Title: ${article.title}
Source: ${article.source}
URL: ${article.url}

Return a JSON object:
{
  "category": "CATEGORY_NAME",
  "score": 85
}
Return ONLY valid JSON.`;

    try {
        const response = await callClaude(prompt, {
            maxTokens: 100,
            temperature: 0.1, // Low temp for consistent classification
        });

        const cleaned = response.trim().replace(/^```json\n?/, '').replace(/\n?```$/, '');
        const parsed = JSON.parse(cleaned);

        return {
            score: typeof parsed.score === 'number' ? parsed.score : 50,
            category: parsed.category || 'OTHER',
        };
    } catch (error) {
        console.error(`Error scoring article "${article.title}":`, error);
        // Fallback classification based on source/tags
        let category = 'OTHER';
        const lowerSource = article.source.toLowerCase();
        if (lowerSource.includes('rust')) category = 'RUST';
        else if (lowerSource.includes('cpp')) category = 'CPP';
        else if (lowerSource.includes('ai')) category = 'AI';
        else if (lowerSource.includes('philosophy')) category = 'PHILOSOPHY';
        else if (lowerSource.includes('poetry')) category = 'POETRY';
        else if (lowerSource.includes('self')) category = 'SELF_HELP';
        else if (lowerSource.includes('meta') || lowerSource.includes('learning') || lowerSource.includes('fs.blog')) category = 'META_SKILLS';

        return { score: 50, category };
    }
}

/**
 * Score multiple articles in parallel with rate limiting
 */
export async function scoreArticles(
    articles: ScrapedArticle[],
    preferences: UserPreferences,
    batchSize: number = 1 // Process 1 at a time to be safe
): Promise<Map<string, ScoredResult>> {
    const scores = new Map<string, ScoredResult>();

    // Process in batches to avoid rate limits
    for (let i = 0; i < articles.length; i += batchSize) {
        const batch = articles.slice(i, i + batchSize);
        const batchScores = await Promise.all(
            batch.map(article => scoreRelevance(article, preferences))
        );

        batch.forEach((article, idx) => {
            scores.set(article.url, batchScores[idx]);
        });

        // Delay between batches (6 seconds for 10 RPM limit)
        if (i + batchSize < articles.length) {
            await new Promise(resolve => setTimeout(resolve, 6500));
        }
    }

    return scores;
}
