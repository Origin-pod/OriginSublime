#!/usr/bin/env tsx
import { dailyScrapeJob } from '../apps/scheduler/src/jobs/daily-scrape';

async function main() {
    console.log('🚀 Manually triggering daily scrape job...\n');

    try {
        const result = await dailyScrapeJob();
        console.log('\n📊 Results:', result);
        process.exit(0);
    } catch (error) {
        console.error('\n❌ Job failed:', error);
        process.exit(1);
    }
}

main();
