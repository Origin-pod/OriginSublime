// src/jobs/daily-challenge.ts
import { generateAIChallengeProject, SAMPLE_AI_TOOLS } from '@actionable-newsletter/generator';
import {
    syncChallengeToNotion,
    commitDailyChallenge,
    updateMainReadme,
    isNotionConfigured,
    isGitHubConfigured,
} from '@actionable-newsletter/integrations';

let currentDay = 1;

/**
 * Daily AI challenge generation job
 * Runs every day at 7 AM UTC (after scraping)
 */
export async function dailyChallengeJob() {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`🎯 Daily AI Challenge Job Started - ${new Date().toISOString()}`);
    console.log(`Day ${currentDay}/100`);
    console.log('='.repeat(60));

    try {
        // Select today's tool (cycle through available tools)
        const toolIndex = (currentDay - 1) % SAMPLE_AI_TOOLS.length;
        const tool = SAMPLE_AI_TOOLS[toolIndex];

        console.log(`\n🔧 Generating challenge for: ${tool.name}`);
        const challenge = await generateAIChallengeProject(tool, currentDay);

        console.log(`\n✅ Challenge Generated:`);
        console.log(`   Project: ${challenge.projectIdea}`);
        console.log(`   Time: ${challenge.timeEstimate} min`);
        console.log(`   Category: ${challenge.category}`);

        // Sync to Notion
        if (isNotionConfigured()) {
            console.log('\n📝 Syncing to Notion...');
            await syncChallengeToNotion(challenge);
        } else {
            console.log('\n⚠️  Notion not configured, skipping sync');
        }

        // Commit to GitHub
        if (isGitHubConfigured()) {
            console.log('\n🐙 Committing to GitHub...');
            await commitDailyChallenge(challenge);
            await updateMainReadme(currentDay);
        } else {
            console.log('\n⚠️  GitHub not configured, skipping commit');
        }

        // Save to database (placeholder)
        console.log('\n💾 Saving challenge to database...');
        // TODO: Implement database save
        console.log('✅ Saved to database (placeholder)');

        console.log(`\n${'='.repeat(60)}`);
        console.log(`✨ Daily AI Challenge Job Completed`);
        console.log('='.repeat(60));

        // Increment day for next run
        currentDay++;

        return {
            success: true,
            day: currentDay - 1,
            tool: tool.name,
            challenge,
        };
    } catch (error) {
        console.error('\n❌ Daily Challenge Job Failed:', error);
        throw error;
    }
}

export function getCurrentDay(): number {
    return currentDay;
}

export function setCurrentDay(day: number): void {
    currentDay = day;
}
