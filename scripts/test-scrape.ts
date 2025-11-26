#!/usr/bin/env tsx
import { scrapeAll } from '../packages/scraper/src/index';

async function main() {
    console.log('🚀 Testing scraper...\n');

    try {
        const articles = await scrapeAll();
        console.log(`✅ Scraped ${articles.length} articles\n`);

        // Show first 5 articles
        console.log('📰 Sample articles:');
        articles.slice(0, 5).forEach((article, i) => {
            console.log(`\n${i + 1}. ${article.title || '(No title)'}`);
            console.log(`   Source: ${article.source}`);
            console.log(`   URL: ${article.url || '(No URL)'}`);
            if (article.publishedAt && !isNaN(article.publishedAt.getTime())) {
                console.log(`   Published: ${article.publishedAt.toISOString()}`);
            }
        });

        console.log(`\n\n📊 Summary by source:`);
        const bySource = articles.reduce((acc, a) => {
            acc[a.source] = (acc[a.source] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        Object.entries(bySource).forEach(([source, count]) => {
            console.log(`   ${source}: ${count} articles`);
        });

    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

main();
