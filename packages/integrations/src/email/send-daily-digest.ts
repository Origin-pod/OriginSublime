// src/email/send-daily-digest.ts
import { render } from '@react-email/render';
import { getResendClient, FROM_EMAIL } from './client';
import DailyDigestEmail from './templates/daily-digest';

interface SendDailyDigestParams {
    to: string;
    userName: string;
    articles: any[];
    exercises: any[];
    challenge?: any;
    stats: {
        articlesRead: number;
        exercisesCompleted: number;
        currentStreak: number;
    };
}

export async function sendDailyDigest(params: SendDailyDigestParams): Promise<{ success: boolean; messageId?: string; error?: string }> {
    try {
        const resend = getResendClient();

        const emailHtml = await render(
            DailyDigestEmail({
                userName: params.userName,
                articles: params.articles,
                exercises: params.exercises,
                challenge: params.challenge,
                stats: params.stats,
            })
        );

        const { data, error } = await resend.emails.send({
            from: FROM_EMAIL,
            to: params.to,
            subject: `Your Daily Digest - ${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`,
            html: emailHtml,
        });

        if (error) {
            console.error('❌ Failed to send daily digest:', error);
            return { success: false, error: error.message };
        }

        console.log(`✅ Sent daily digest to ${params.to}`);
        return { success: true, messageId: data?.id };
    } catch (error: any) {
        console.error('❌ Error sending daily digest:', error);
        return { success: false, error: error.message };
    }
}

export async function sendDailyDigestsToUsers(users: Array<{
    email: string;
    name: string;
    articles: any[];
    exercises: any[];
    challenge?: any;
    stats: any;
}>): Promise<{ sent: number; failed: number }> {
    let sent = 0;
    let failed = 0;

    for (const user of users) {
        const result = await sendDailyDigest({
            to: user.email,
            userName: user.name,
            articles: user.articles,
            exercises: user.exercises,
            challenge: user.challenge,
            stats: user.stats,
        });

        if (result.success) {
            sent++;
        } else {
            failed++;
        }

        // Rate limit: wait 100ms between emails
        await new Promise(resolve => setTimeout(resolve, 100));
    }

    console.log(`\n📊 Sent ${sent}/${users.length} daily digests (${failed} failed)`);
    return { sent, failed };
}
