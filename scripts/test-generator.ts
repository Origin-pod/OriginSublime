#!/usr/bin/env tsx
import { scrapeAll } from '../packages/scraper/src/index';
import { curateArticles } from '../packages/curator/src/index';
import { generateActionItems, generateAIChallengeProject, SAMPLE_AI_TOOLS } from '../packages/generator/src/index';
import { UserPreferences } from '../packages/curator/src/types';

async function main() {
    console.log('🚀 Testing Action Generator (Phase 3)\n');

    if (!process.env.ANTHROPIC_API_KEY) {
        console.error('❌ ANTHROPIC_API_KEY environment variable is required');
        process.exit(1);
    }

    try {
        // Step 1: Scrape articles
        console.log('📰 Scraping articles...\n');
        const articles = await scrapeAll();
        console.log(`✅ Scraped ${articles.length} articles\n`);

        // Step 2: Curate articles
        const preferences: UserPreferences = {
            rustWeight: 80,
            cppWeight: 70,
            aiWeight: 70,
            philosophyWeight: 50,
            poetryWeight: 40,
            selfHelpWeight: 30,
        };

        console.log('🤖 Curating articles...\n');
        const curated = await curateArticles(articles, preferences, {
            minScore: 60,
            maxArticles: 5,
        });
        console.log(`✅ Curated ${curated.length} articles\n`);

        // Step 3: Generate action items
        const actionItems = await generateActionItems(curated, {
            includeExercises: true,
            includeProjects: false, // Skip projects to save time
            includeReflections: true,
        });

        // Display exercises
        if (actionItems.exercises.length > 0) {
            console.log(`\n💻 Generated ${actionItems.exercises.length} Coding Exercises:\n`);
            actionItems.exercises.forEach((exercise, i) => {
                console.log(`${i + 1}. ${exercise.title}`);
                console.log(`   Type: ${exercise.type}`);
                console.log(`   Language: ${exercise.language}`);
                console.log(`   Difficulty: ${exercise.difficulty}`);
                console.log(`   Time: ${exercise.timeEstimate} min`);
                console.log(`\n   📝 Description:`);
                console.log(`   ${exercise.description}\n`);

                if (exercise.starterCode) {
                    console.log(`   🔧 Starter Code:`);
                    console.log(`   ${exercise.starterCode.split('\n').slice(0, 5).join('\n   ')}`);
                    console.log(`   ...\n`);
                }

                if (exercise.hints && exercise.hints.length > 0) {
                    console.log(`   💡 Hints:`);
                    exercise.hints.forEach(hint => console.log(`      - ${hint}`));
                    console.log();
                }
            });
        }

        // Display reflection prompts
        if (actionItems.reflections.length > 0) {
            console.log(`\n🤔 Generated ${actionItems.reflections.length} Reflection Prompts:\n`);
            actionItems.reflections.forEach((reflection, i) => {
                console.log(`${i + 1}. ${reflection.theme}`);
                console.log(`   Format: ${reflection.suggestedFormat}`);
                console.log(`   Time: ${reflection.timeEstimate} min`);
                console.log(`\n   Questions:`);
                reflection.prompts.forEach(prompt => console.log(`   • ${prompt}`));
                console.log();
            });
        }

        // Step 4: Generate AI challenge for today
        console.log('\n🎯 Generating Daily AI Challenge (100 Days of Building with AI):\n');
        const todaysTool = SAMPLE_AI_TOOLS[0]; // Use first tool as example
        const challenge = await generateAIChallengeProject(todaysTool, 1);

        console.log(`Day ${challenge.dayNumber}/100: ${challenge.toolName}`);
        console.log(`Category: ${challenge.category}`);
        console.log(`Time: ${challenge.timeEstimate} min\n`);
        console.log(`📌 Project Idea: ${challenge.projectIdea}\n`);
        console.log(`📝 Description:\n${challenge.description}\n`);
        console.log(`🔧 Setup:`);
        challenge.setupInstructions.forEach((step, i) => {
            console.log(`   ${i + 1}. ${step}`);
        });
        console.log(`\n✅ Success Criteria:`);
        challenge.successCriteria.forEach(criterion => {
            console.log(`   • ${criterion}`);
        });

        console.log('\n\n✨ Action generation test complete!');
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

main();
