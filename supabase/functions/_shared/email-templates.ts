/**
 * @file email-templates.ts
 * @description Transactional email templates for the Alawein Platform
 *
 * TODO: Configure email provider:
 * - RESEND_API_KEY: Resend API key for sending emails
 * - OR use Supabase built-in email (Auth → Email Templates)
 */

// Brand configuration
const BRAND = {
  name: 'Alawein Platform',
  logo: 'https://alawein.dev/logo.png', // TODO: Update with actual logo URL
  primaryColor: '#00d4ff',
  supportEmail: 'support@alawein.dev',
  websiteUrl: 'https://alawein.dev',
};

// Base email wrapper with consistent styling
function baseTemplate(content: string, preheader: string = ''): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${BRAND.name}</title>
  <style>
    body { margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #0a0a0f; color: #ffffff; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { text-align: center; padding: 30px 0; }
    .logo { height: 40px; }
    .content { background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); border-radius: 12px; padding: 40px; margin: 20px 0; }
    .button { display: inline-block; background: ${BRAND.primaryColor}; color: #000000; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: 600; margin: 20px 0; }
    .button:hover { opacity: 0.9; }
    .footer { text-align: center; padding: 30px 0; color: #6b7280; font-size: 12px; }
    h1 { color: #ffffff; margin: 0 0 20px 0; font-size: 24px; }
    p { color: #d1d5db; line-height: 1.6; margin: 0 0 16px 0; }
    .highlight { color: ${BRAND.primaryColor}; }
    .preheader { display: none; max-height: 0; overflow: hidden; }
  </style>
</head>
<body>
  <div class="preheader">${preheader}</div>
  <div class="container">
    <div class="header">
      <img src="${BRAND.logo}" alt="${BRAND.name}" class="logo" />
    </div>
    <div class="content">
      ${content}
    </div>
    <div class="footer">
      <p>© ${new Date().getFullYear()} ${BRAND.name}. All rights reserved.</p>
      <p><a href="${BRAND.websiteUrl}" style="color: #6b7280;">Website</a> • <a href="${BRAND.websiteUrl}/terms" style="color: #6b7280;">Terms</a> • <a href="${BRAND.websiteUrl}/privacy" style="color: #6b7280;">Privacy</a></p>
    </div>
  </div>
</body>
</html>
  `.trim();
}

// Welcome email for new users
export function welcomeEmail(userName: string): { subject: string; html: string } {
  const content = `
    <h1>Welcome to ${BRAND.name}, ${userName}! 🎉</h1>
    <p>Thank you for joining our scientific computing platform. We're excited to have you on board!</p>
    <p>With ${BRAND.name}, you can:</p>
    <ul style="color: #d1d5db; padding-left: 20px;">
      <li>Run scientific simulations with SimCore</li>
      <li>Automate workflows with MEZAN</li>
      <li>Conduct AI research with TalAI</li>
      <li>Optimize algorithms with OptiLibria</li>
      <li>Explore quantum mechanics with QMLab</li>
    </ul>
    <a href="${BRAND.websiteUrl}/projects" class="button">Get Started →</a>
    <p style="font-size: 14px; margin-top: 30px;">Need help? Reply to this email or check our <a href="${BRAND.websiteUrl}/docs" style="color: ${BRAND.primaryColor};">documentation</a>.</p>
  `;
  return {
    subject: `Welcome to ${BRAND.name}! 🚀`,
    html: baseTemplate(content, 'Start your scientific computing journey today'),
  };
}

// Subscription confirmation email
export function subscriptionConfirmEmail(
  userName: string,
  planName: string,
  amount: string,
  nextBillingDate: string
): { subject: string; html: string } {
  const content = `
    <h1>Subscription Confirmed! ✅</h1>
    <p>Hi ${userName},</p>
    <p>Your <span class="highlight">${planName}</span> subscription is now active.</p>
    <div style="background: rgba(0, 212, 255, 0.1); border-radius: 8px; padding: 20px; margin: 20px 0;">
      <p style="margin: 0;"><strong>Plan:</strong> ${planName}</p>
      <p style="margin: 8px 0 0 0;"><strong>Amount:</strong> ${amount}</p>
      <p style="margin: 8px 0 0 0;"><strong>Next billing:</strong> ${nextBillingDate}</p>
    </div>
    <a href="${BRAND.websiteUrl}/settings" class="button">Manage Subscription</a>
    <p style="font-size: 14px;">You can update or cancel your subscription anytime from your settings.</p>
  `;
  return {
    subject: `Your ${planName} subscription is active`,
    html: baseTemplate(content, `${planName} subscription confirmed`),
  };
}

// Usage limit warning email
export function usageLimitWarningEmail(
  userName: string,
  resourceType: string,
  usedPercent: number,
  limit: number
): { subject: string; html: string } {
  const content = `
    <h1>Usage Alert ⚠️</h1>
    <p>Hi ${userName},</p>
    <p>You've used <span class="highlight">${usedPercent}%</span> of your monthly ${resourceType} quota.</p>
    <div style="background: rgba(255, 193, 7, 0.1); border-radius: 8px; padding: 20px; margin: 20px 0;">
      <p style="margin: 0;"><strong>Resource:</strong> ${resourceType}</p>
      <p style="margin: 8px 0 0 0;"><strong>Current usage:</strong> ${usedPercent}% of ${limit}</p>
    </div>
    <p>To avoid service interruption, consider upgrading your plan.</p>
    <a href="${BRAND.websiteUrl}/pricing" class="button">Upgrade Plan</a>
  `;
  return {
    subject: `Usage alert: ${usedPercent}% of ${resourceType} used`,
    html: baseTemplate(content, `You've used ${usedPercent}% of your ${resourceType} quota`),
  };
}

// Password reset email
export function passwordResetEmail(resetLink: string): { subject: string; html: string } {
  const content = `
    <h1>Reset Your Password</h1>
    <p>We received a request to reset your password. Click the button below to create a new password:</p>
    <a href="${resetLink}" class="button">Reset Password</a>
    <p style="font-size: 14px; color: #6b7280;">This link expires in 1 hour. If you didn't request this, you can safely ignore this email.</p>
  `;
  return {
    subject: 'Reset your password',
    html: baseTemplate(content, 'Reset your password'),
  };
}

// Export all templates
export const emailTemplates = {
  welcome: welcomeEmail,
  subscriptionConfirm: subscriptionConfirmEmail,
  usageLimitWarning: usageLimitWarningEmail,
  passwordReset: passwordResetEmail,
};
