// src/email/send-welcome.ts
import { render } from '@react-email/render';
import { getResendClient, FROM_EMAIL } from './client';
import WelcomeEmail from './templates/welcome';

export async function sendWelcomeEmail(
    to: string,
    userName: string
): Promise<{ success: boolean; messageId?: string; error?: string }> {
    try {
        const resend = getResendClient();

        const emailHtml = await render(WelcomeEmail({ userName }));

        const { data, error } = await resend.emails.send({
            from: FROM_EMAIL,
            to,
            subject: 'Welcome to Actionable Newsletter! 🚀',
            html: emailHtml,
        });

        if (error) {
            console.error('❌ Failed to send welcome email:', error);
            return { success: false, error: error.message };
        }

        console.log(`✅ Sent welcome email to ${to}`);
        return { success: true, messageId: data?.id };
    } catch (error: any) {
        console.error('❌ Error sending welcome email:', error);
        return { success: false, error: error.message };
    }
}
