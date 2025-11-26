// src/index.ts
import cron from 'node-cron';
import { dailyScrapeJob } from './jobs/daily-scrape';
import { dailyChallengeJob } from './jobs/daily-challenge';

console.log('🤖 Actionable Newsletter Scheduler Starting...\n');

// Daily scrape at 6 AM UTC
const scrapeSchedule = process.env.DAILY_SCRAPE_CRON || '0 6 * * *';
console.log(`📅 Daily Scrape scheduled: ${scrapeSchedule} (6 AM UTC)`);
cron.schedule(scrapeSchedule, async () => {
    try {
        await dailyScrapeJob();
    } catch (error) {
        console.error('Daily scrape job failed:', error);
    }
});

// Daily AI challenge at 7 AM UTC (after scraping)
const challengeSchedule = process.env.DAILY_CHALLENGE_CRON || '0 7 * * *';
console.log(`📅 Daily Challenge scheduled: ${challengeSchedule} (7 AM UTC)`);
cron.schedule(challengeSchedule, async () => {
    try {
        await dailyChallengeJob();
    } catch (error) {
        console.error('Daily challenge job failed:', error);
    }
});

// Manual trigger endpoints (for testing)
console.log('\n🔧 Manual Triggers:');
console.log('   - Run daily scrape: npm run trigger:scrape');
console.log('   - Run daily challenge: npm run trigger:challenge\n');

// Keep process alive
console.log('✅ Scheduler is running. Press Ctrl+C to stop.\n');

// Handle graceful shutdown
process.on('SIGINT', () => {
    console.log('\n\n👋 Shutting down scheduler...');
    process.exit(0);
});

process.on('SIGTERM', () => {
    console.log('\n\n👋 Shutting down scheduler...');
    process.exit(0);
});
