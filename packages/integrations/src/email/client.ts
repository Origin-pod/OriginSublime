// src/email/client.ts
import { Resend } from 'resend';

let resendClient: Resend | null = null;

export function getResendClient(): Resend {
    if (!resendClient) {
        const apiKey = process.env.RESEND_API_KEY;
        if (!apiKey) {
            throw new Error('RESEND_API_KEY environment variable is required');
        }
        resendClient = new Resend(apiKey);
    }
    return resendClient;
}

export function isEmailConfigured(): boolean {
    return !!(process.env.RESEND_API_KEY && process.env.FROM_EMAIL);
}

export const FROM_EMAIL = process.env.FROM_EMAIL || 'noreply@actionablenewsletter.com';
