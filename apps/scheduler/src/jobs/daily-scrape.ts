// src/jobs/daily-scrape.ts
import { scrapeAll } from '@actionable-newsletter/scraper';
import { curateArticles, UserPreferences } from '@actionable-newsletter/curator';
import { generateActionItems } from '@actionable-newsletter/generator';
import { syncArticlesToNotion, isNotionConfigured } from '@actionable-newsletter/integrations';
import { prisma } from '@actionable-newsletter/database';
import * as fs from 'fs';
import * as path from 'path';

const DEFAULT_PREFERENCES: UserPreferences = {
    rustWeight: 80,
    cppWeight: 70,
    aiWeight: 70,
    philosophyWeight: 50,
    poetryWeight: 40,
    selfHelpWeight: 30,
};

/**
 * Daily scrape and curation job
 * Runs every day at 6 AM UTC
 */
export async function dailyScrapeJob() {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`🌅 Daily Scrape Job Started - ${new Date().toISOString()}`);
    console.log('='.repeat(60));

    try {
        // Step 1: Scrape articles
        console.log('\n📰 Scraping articles from all sources...');
        const articles = await scrapeAll();
        console.log(`✅ Scraped ${articles.length} articles`);

        // Step 2: Curate articles
        console.log('\n🤖 Curating articles with AI...');
        const curated = await curateArticles(articles, DEFAULT_PREFERENCES, {
            minScore: 60,
            maxArticles: 20,
        });
        console.log(`✅ Curated ${curated.length} high-quality articles`);

        // Step 4: Generate action items
        console.log('💡 Generating action items...');
        const actionItems = await generateActionItems(curated, {
            includeExercises: true,
            includeProjects: false, // Save tokens
            includeReflections: true,
        });

        // Step 4b: Generate Daily Rust Learning Exercise
        const START_DATE = new Date('2025-11-25'); // Start of the curriculum
        const dayNumber = Math.max(1, Math.floor((Date.now() - START_DATE.getTime()) / (1000 * 60 * 60 * 24)) + 1);
        console.log(`🦀 Generating Rust Learning Exercise for Day ${dayNumber}...`);

        // Import dynamically if needed or assume it's available in generator exports
        // Note: We need to update the import statement at the top of the file first
        const { generateRustLearningExercise } = await import('@actionable-newsletter/generator');
        const rustExercise = await generateRustLearningExercise(dayNumber);

        if (rustExercise) {
            console.log('✅ Generated Rust Learning Exercise');
            actionItems.exercises.unshift(rustExercise); // Add to top of exercises
        }
        console.log(`✅ Generated ${actionItems.exercises.length} exercises`);
        console.log(`✅ Generated ${actionItems.reflections.length} reflection prompts`);

        // Step 4: Sync to Notion
        if (isNotionConfigured()) {
            console.log('\n📝 Syncing to Notion...');
            const syncedCount = await syncArticlesToNotion(curated);
            console.log(`✅ Synced ${syncedCount} articles to Notion`);
        } else {
            console.log('\n⚠️  Notion not configured, skipping sync');
        }

        // Step 5: Save to database
        console.log('\n💾 Saving to database...');
        try {
            await saveToDatabase(curated, actionItems);
            console.log('✅ Saved to database');
        } catch (dbError) {
            console.error('❌ Failed to save to database:', dbError);
        }

        // Step 6: Save to Markdown file (for testing)
        console.log('\n📝 Saving to Markdown file...');
        try {
            const mdPath = await saveToMarkdown(curated, actionItems);
            console.log(`✅ Saved to Markdown: ${mdPath}`);
        } catch (mdError) {
            console.error('❌ Failed to save to Markdown:', mdError);
        }

        console.log(`\n${'='.repeat(60)}`);
        console.log(`✨ Daily Scrape Job Completed Successfully`);
        console.log('='.repeat(60));

        return {
            success: true,
            articlesScraped: articles.length,
            articlesCurated: curated.length,
            exercisesGenerated: actionItems.exercises.length,
            reflectionsGenerated: actionItems.reflections.length,
        };
    } catch (error) {
        console.error('\n❌ Daily Scrape Job Failed:', error);
        throw error;
    }
}

async function saveToDatabase(articles: any[], actionItems: any) {
    // Save articles
    for (const article of articles) {
        // Upsert article
        const savedArticle = await prisma.article.upsert({
            where: { url: article.url },
            update: {
                relevanceScore: article.relevanceScore,
                summary: article.summary,
                whyItMatters: article.whyItMatters,
                actionable: article.actionable,
                timeToRead: article.timeToRead,
                tags: article.tags,
            },
            create: {
                title: article.title,
                url: article.url,
                source: article.source,
                category: (article.category as any) || 'GENERAL_TECH', // Cast to any to avoid enum mismatch issues for now
                relevanceScore: article.relevanceScore,
                summary: article.summary,
                whyItMatters: article.whyItMatters,
                actionable: article.actionable,
                timeToRead: article.timeToRead,
                tags: article.tags,
                publishedAt: new Date(), // Approximation
            },
        });

        // Save exercises for this article
        const articleExercises = actionItems.exercises.filter((ex: any) => ex.articleUrl === article.url);
        for (const ex of articleExercises) {
            await prisma.exercise.create({
                data: {
                    articleId: savedArticle.id,
                    type: ex.type,
                    title: ex.title,
                    description: ex.description,
                    starterCode: ex.starterCode,
                    timeEstimate: ex.timeEstimate,
                    difficulty: ex.difficulty,
                },
            });
        }
    }
}

async function saveToMarkdown(articles: any[], actionItems: any): Promise<string> {
    const date = new Date().toISOString().split('T')[0];
    const outputDir = path.join(process.cwd(), 'output');

    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    const filename = `daily-scrape-${date}.md`;
    const filePath = path.join(outputDir, filename);

    let content = `# Daily Scrape - ${date}\n\n`;
    content += `Generated at: ${new Date().toISOString()}\n\n`;

    content += `## 📊 Stats\n`;
    content += `- Articles Curated: ${articles.length}\n`;
    content += `- Exercises: ${actionItems.exercises.length}\n`;
    content += `- Reflections: ${actionItems.reflections.length}\n\n`;

    content += `## 📰 Articles\n\n`;
    articles.forEach((article: any, index: number) => {
        content += `### ${index + 1}. ${article.title}\n`;
        content += `- **Category:** ${article.category}\n`;
        content += `- **Score:** ${article.relevanceScore}\n`;
        content += `- **Source:** ${article.source}\n`;
        content += `- **URL:** ${article.url}\n`;
        content += `- **Summary:** ${article.summary}\n`;
        content += `- **Why It Matters:** ${article.whyItMatters}\n\n`;
    });

    content += `## 💻 Exercises\n\n`;
    actionItems.exercises.forEach((ex: any, index: number) => {
        content += `### ${index + 1}. ${ex.title} (${ex.difficulty})\n`;
        content += `- **Type:** ${ex.type}\n`;
        content += `- **Time:** ${ex.timeEstimate} min\n`;
        content += `- **Description:** ${ex.description}\n`;
        if (ex.starterCode) {
            content += `\n\`\`\`${ex.language || 'text'}\n${ex.starterCode}\n\`\`\`\n`;
        }
        content += `\n`;
    });

    fs.writeFileSync(filePath, content);
    return filePath;
}
