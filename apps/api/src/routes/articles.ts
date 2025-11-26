// src/routes/articles.ts
import { FastifyInstance } from 'fastify';
import { scrapeAll } from '@actionable-newsletter/scraper';
import { curateArticles, UserPreferences } from '@actionable-newsletter/curator';

// In-memory cache (replace with database in production)
let cachedArticles: any[] = [];
let lastScrape: Date | null = null;

export async function articlesRoutes(server: FastifyInstance) {
    // GET /api/articles - Get all curated articles
    server.get('/api/articles', async (request, reply) => {
        const { minScore = 60, limit = 10 } = request.query as any;

        // Return cached if less than 1 hour old
        if (cachedArticles.length > 0 && lastScrape && Date.now() - lastScrape.getTime() < 3600000) {
            return {
                articles: cachedArticles.slice(0, limit),
                cached: true,
                lastUpdate: lastScrape,
            };
        }

        return {
            articles: cachedArticles.slice(0, limit),
            cached: false,
            message: 'Run POST /api/articles/refresh to update',
        };
    });

    // POST /api/articles/refresh - Scrape and curate new articles
    server.post('/api/articles/refresh', async (request, reply) => {
        try {
            const preferences: UserPreferences = {
                rustWeight: 80,
                cppWeight: 70,
                aiWeight: 70,
                philosophyWeight: 50,
                poetryWeight: 40,
                selfHelpWeight: 30,
            };

            // Scrape articles
            const scraped = await scrapeAll();

            // Curate articles
            const curated = await curateArticles(scraped, preferences, {
                minScore: 60,
                maxArticles: 20,
            });

            // Update cache
            cachedArticles = curated;
            lastScrape = new Date();

            return {
                success: true,
                count: curated.length,
                lastUpdate: lastScrape,
            };
        } catch (error: any) {
            reply.code(500);
            return {
                success: false,
                error: error.message,
            };
        }
    });

    // GET /api/articles/:id - Get single article (placeholder)
    server.get('/api/articles/:id', async (request, reply) => {
        const { id } = request.params as any;
        const article = cachedArticles.find(a => a.url === id);

        if (!article) {
            reply.code(404);
            return { error: 'Article not found' };
        }

        return { article };
    });

    // GET /api/articles/today - Get today's top articles
    server.get('/api/articles/today', async (request, reply) => {
        const today = cachedArticles
            .filter(a => a.relevanceScore >= 70)
            .slice(0, 5);

        return {
            articles: today,
            date: new Date().toISOString().split('T')[0],
        };
    });
}
