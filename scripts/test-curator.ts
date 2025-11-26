#!/usr/bin/env tsx
import { scrapeAll } from '../packages/scraper/src/index';
import { curateArticles, findConnections, getWeekNumber } from '../packages/curator/src/index';
import { UserPreferences } from '../packages/curator/src/types';

async function main() {
    console.log('🚀 Testing AI Curator (Phase 2)\n');

    // Check for API key
    if (!process.env.ANTHROPIC_API_KEY) {
        console.error('❌ ANTHROPIC_API_KEY environment variable is required');
        console.log('\nSet it in your .env file or run:');
        console.log('export ANTHROPIC_API_KEY="sk-ant-..."');
        process.exit(1);
    }

    try {
        // Step 1: Scrape articles
        console.log('📰 Scraping articles...\n');
        const articles = await scrapeAll();
        console.log(`✅ Scraped ${articles.length} articles\n`);

        // Step 2: Define user preferences
        const preferences: UserPreferences = {
            rustWeight: 80,
            cppWeight: 70,
            aiWeight: 70,
            philosophyWeight: 50,
            poetryWeight: 40,
            selfHelpWeight: 30,
        };

        console.log('👤 User preferences:');
        console.log(`   Rust: ${preferences.rustWeight}%`);
        console.log(`   C++: ${preferences.cppWeight}%`);
        console.log(`   AI/ML: ${preferences.aiWeight}%`);
        console.log(`   Philosophy: ${preferences.philosophyWeight}%\n`);

        // Step 3: Curate articles
        const curated = await curateArticles(articles, preferences, {
            minScore: 60,
            maxArticles: 5,
        });

        console.log(`\n📋 Top ${curated.length} Curated Articles:\n`);
        curated.forEach((article, i) => {
            console.log(`${i + 1}. ${article.title}`);
            console.log(`   Score: ${article.relevanceScore}/100`);
            console.log(`   Actionable: ${article.actionable ? '✅ Yes' : '❌ No'}`);
            console.log(`   Time to read: ${article.timeToRead} min`);
            console.log(`   Tags: ${article.tags.join(', ')}`);
            console.log(`\n   📝 Summary: ${article.summary}`);
            console.log(`\n   💡 Why it matters: ${article.whyItMatters}\n`);
        });

        // Step 4: Find connections
        if (curated.length >= 3) {
            console.log('🔗 Finding cross-domain connections...\n');
            const connections = await findConnections(
                curated,
                getWeekNumber()
            );

            if (connections.length > 0) {
                console.log(`✨ Found ${connections.length} connections:\n`);
                connections.forEach((conn, i) => {
                    console.log(`${i + 1}. ${conn.theme}`);
                    console.log(`   ${conn.description}`);
                    console.log(`   Articles: ${conn.articleUrls.length}\n`);
                });
            } else {
                console.log('No strong connections found this week.\n');
            }
        }

        console.log('✅ Curation test complete!');
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

main();
