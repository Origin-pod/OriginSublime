#!/usr/bin/env tsx
import { dailyChallengeJob } from '../apps/scheduler/src/jobs/daily-challenge';

async function main() {
    console.log('🚀 Manually triggering daily AI challenge job...\n');

    try {
        const result = await dailyChallengeJob();
        console.log('\n📊 Results:', result);
        process.exit(0);
    } catch (error) {
        console.error('\n❌ Job failed:', error);
        process.exit(1);
    }
}

main();
