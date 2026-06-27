import { Resend } from 'resend';
import dotenv from 'dotenv';
import path from 'path';

// Ensure env variables are loaded (specifically for RESEND_API_KEY)
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const RESEND_API_KEY = process.env.RESEND_API_KEY;
let resend: Resend | null = null;

if (RESEND_API_KEY) {
  resend = new Resend(RESEND_API_KEY);
} else {
  console.warn('⚠️ RESEND_API_KEY is not set. Emails will be logged to the console instead of sent.');
}

const FROM_EMAIL = process.env.FROM_EMAIL || 'DeadlineAI <reminders@deadlineai.com>';

export interface EmailPayload {
  to: string;
  subject: string;
  html: string;
}

/**
 * Wraps the email content in the standard branded HTML template with an unsubscribe link.
 */
function wrapWithBrandedTemplate(content: string, unsubscribeToken: string) {
  const unsubscribeUrl = `${process.env.PUBLIC_URL || 'http://localhost:5173'}/api/unsubscribe?token=${unsubscribeToken}`;
  
  return `
    <div style="font-family: 'Inter', -apple-system, sans-serif; background-color: #02040a; color: #f0f4f8; padding: 40px 20px;">
      <div style="max-w: 600px; margin: 0 auto; background-color: #060a14; border: 1px solid rgba(255,255,255,0.06); border-radius: 12px; padding: 40px; box-shadow: 0 20px 40px rgba(0,0,0,0.5);">
        
        <!-- Header -->
        <div style="text-align: center; margin-bottom: 30px;">
          <h2 style="margin: 0; font-weight: 800; font-size: 24px; tracking-tight; color: #ffffff;">
            Deadline<span style="color: #00e5ff;">AI</span>
          </h2>
        </div>

        <!-- Content -->
        <div style="font-size: 16px; line-height: 1.6; color: #d1d5db;">
          ${content}
        </div>

        <!-- Footer -->
        <div style="margin-top: 50px; padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.1); text-align: center; font-size: 12px; color: #6b7280;">
          <p style="margin: 0;">You're receiving this because you enabled email reminders in your Profile settings.</p>
          <p style="margin: 10px 0 0 0;">
            <a href="${unsubscribeUrl}" style="color: #00e5ff; text-decoration: none;">1-Click Unsubscribe</a>
          </p>
        </div>
      </div>
    </div>
  `;
}

/**
 * Sends an email using Resend, or logs it to the console if the API key is missing.
 */
export async function sendEmail({ to, subject, html }: EmailPayload, userId: string): Promise<boolean> {
  const finalHtml = wrapWithBrandedTemplate(html, userId); // Simple token for now (just user_id)

  if (!resend) {
    console.log('\n' + '='.repeat(60));
    console.log(`✉️  MOCK EMAIL SENT TO: ${to}`);
    console.log(`Subject: ${subject}`);
    console.log(`Content:\n${finalHtml}`);
    console.log('='.repeat(60) + '\n');
    return true; // Simulate success
  }

  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject,
      html: finalHtml,
    });

    if (error) {
      console.error('[Email Service] Failed to send email via Resend:', error);
      return false;
    }

    return true;
  } catch (err) {
    console.error('[Email Service] Unexpected error sending email:', err);
    return false;
  }
}
