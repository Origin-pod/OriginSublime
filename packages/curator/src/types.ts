// src/types.ts
import { ScrapedArticle } from '@actionable-newsletter/scraper';

export interface UserPreferences {
    rustWeight: number;        // 0-100
    cppWeight: number;         // 0-100
    aiWeight: number;          // 0-100
    philosophyWeight: number;  // 0-100
    poetryWeight: number;      // 0-100
    selfHelpWeight: number;    // 0-100
}

export interface CuratedArticle extends ScrapedArticle {
    relevanceScore: number;    // 0-100
    category: string;          // RUST, CPP, AI, etc.
    summary: string;           // 2-3 sentence summary
    whyItMatters: string;      // Casual "builder friend" explanation
    actionable: boolean;       // Has hands-on content
    timeToRead: number;        // Estimated minutes
    tags: string[];            // Extracted topics
}

export interface ArticleConnection {
    theme: string;
    description: string;
    articleUrls: string[];
    weekNumber: number;
}
