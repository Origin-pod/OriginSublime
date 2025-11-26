// src/index.ts
import { ScrapedArticle } from '@actionable-newsletter/scraper';
import { CuratedArticle, UserPreferences } from './types';
import { scoreArticles } from './scorer';
import { summarizeArticles } from './summarizer';
import { detectActionabilityBatch } from './actionability';

/**
 * Curate a batch of scraped articles.
 * Scores, summarizes, and enriches articles with AI-generated metadata.
 */
export async function curateArticles(
    articles: ScrapedArticle[],
    preferences: UserPreferences,
    options: {
        minScore?: number;
        maxArticles?: number;
    } = {}
): Promise<CuratedArticle[]> {
    const { minScore = 60, maxArticles = 10 } = options;

    console.log(`🤖 Curating ${articles.length} articles...`);

    // Step 1: Score all articles
    console.log('📊 Scoring relevance...');
    const scores = await scoreArticles(articles, preferences);

    // Step 2: Group by Category and Select Top 1
    const grouped = new Map<string, { article: ScrapedArticle, score: number }[]>();
    const TARGET_CATEGORIES = ['RUST', 'CPP', 'AI', 'PHILOSOPHY', 'POETRY', 'SELF_HELP', 'META_SKILLS'];

    TARGET_CATEGORIES.forEach(cat => grouped.set(cat, []));

    articles.forEach(article => {
        const result = scores.get(article.url);
        if (result && result.score >= minScore) {
            let cat = result.category.toUpperCase();
            // Map OTHER or unknown to closest if possible, or ignore
            if (grouped.has(cat)) {
                grouped.get(cat)!.push({ article, score: result.score });
            }
        }
    });

    const topArticles: ScrapedArticle[] = [];
    const articleMetadata = new Map<string, { score: number, category: string }>();

    grouped.forEach((candidates, category) => {
        // Sort by score desc
        candidates.sort((a, b) => b.score - a.score);

        // Take top 1 (User requested exactly 1 per domain)
        const top = candidates.slice(0, 1);

        top.forEach(item => {
            topArticles.push(item.article);
            articleMetadata.set(item.article.url, { score: item.score, category });
        });

        console.log(`   ${category}: Found ${candidates.length} candidates, selected ${top.length}`);
    });

    if (topArticles.length === 0) {
        console.log('⚠️ No articles met the criteria.');
        return [];
    }

    // Step 3: Generate summaries
    console.log('📝 Generating summaries...');
    const summaries = await summarizeArticles(topArticles);

    // Step 4: Detect actionability
    console.log('🔍 Detecting actionable content...');
    const actionability = await detectActionabilityBatch(topArticles);

    // Step 5: Combine everything
    const curated: CuratedArticle[] = topArticles.map(article => {
        const meta = articleMetadata.get(article.url)!;
        const summary = summaries.get(article.url);
        const isActionable = actionability.get(article.url) || false;

        return {
            ...article,
            relevanceScore: meta.score,
            category: meta.category,
            summary: summary?.summary || 'No summary available',
            whyItMatters: summary?.whyItMatters || 'Worth exploring',
            actionable: isActionable,
            timeToRead: summary?.timeToRead || 5,
            tags: summary?.tags || [],
        };
    });

    console.log(`✨ Curation complete! ${curated.length} articles ready.`);
    return curated;
}

// Re-export everything
export * from './types';
export * from './scorer';
export * from './summarizer';
export * from './actionability';
export * from './connections';
export { getAnthropicClient, callClaude } from './client';
