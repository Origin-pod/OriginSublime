import { scrapeAll } from '@actionable-newsletter/scraper';
import { curateArticles, UserPreferences } from '@actionable-newsletter/curator';

async function runDemo() {
    console.log('🚀 Starting Demo Run (Top 5 Articles)...\n');

    try {
        // 1. Scrape
        console.log('1️⃣  Scraping articles...');
        const articles = await scrapeAll();
        console.log(`   Found ${articles.length} raw articles.\n`);

        // 2. Curate (Top 3 - limited to avoid rate limits)
        console.log('2️⃣  Curating with Claude AI (limiting to 3 articles to avoid rate limits)...');
        const preferences: UserPreferences = {
            rustWeight: 80,
            cppWeight: 70,
            aiWeight: 70,
            philosophyWeight: 50,
            poetryWeight: 40,
            selfHelpWeight: 30,
        };

        // Slice FIRST, then curate
        const limitedArticles = articles.slice(0, 3);

        const curated = await curateArticles(limitedArticles, preferences, {
            minScore: 0, // Accept all for demo
            maxArticles: 3,
        });

        console.log(`\n✅ DONE! Here are your top 5 actionable articles:\n`);
        console.log('='.repeat(60));

        curated.forEach((article, index) => {
            console.log(`\n📄 #${index + 1}: ${article.title}`);
            console.log(`   🔗 ${article.url}`);
            console.log(`   🎯 Score: ${article.relevanceScore}/100`);
            console.log(`   ⏱️  Read: ${article.timeToRead} min`);
            console.log(`   🏷️  Tags: ${article.tags.join(', ')}`);
            console.log(`   💡 Summary: ${article.summary}`);
            console.log(`   🚀 Why it matters: ${article.whyItMatters}`);
            console.log('-'.repeat(60));
        });

    } catch (error) {
        console.error('❌ Error:', error);
    }
}

runDemo();
