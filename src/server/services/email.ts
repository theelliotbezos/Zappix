import { Resend } from "resend";
import { APP_URL } from "@/lib/constants";

const resend = new Resend(process.env.RESEND_API_KEY || "re_placeholder");

const FROM_EMAIL = "Zappix <hello@zappix.ng>";

export const emailService = {
  /** Send a welcome email after signup. */
  async sendWelcome(to: string, name: string) {
    return resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: "Welcome to Zappix!",
      html: `
        <h1>Welcome to Zappix, ${name}!</h1>
        <p>You are now part of the most powerful platform for WhatsApp TV businesses in Nigeria.</p>
        <p>Here is what to do next:</p>
        <ol>
          <li>Connect your WhatsApp number</li>
          <li>Import your contacts</li>
          <li>Schedule your first status post</li>
        </ol>
        <p>If you need help, reply to this email or reach out on WhatsApp.</p>
        <p>Let us grow together,<br/>The Zappix Team</p>
      `,
    });
  },

  /** Send payout confirmation email. */
  async sendPayoutConfirmation(
    to: string,
    name: string,
    amount: string,
    bankName: string
  ) {
    return resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: "Payout Processed - Zappix",
      html: `
        <h1>Payout Processed</h1>
        <p>Hi ${name},</p>
        <p>Your withdrawal of <strong>${amount}</strong> has been sent to your <strong>${bankName}</strong> account.</p>
        <p>Funds should arrive within 24 hours.</p>
        <p>Keep referring and earning!<br/>The Zappix Team</p>
      `,
    });
  },

  /** Send subscription confirmation email. */
  async sendSubscriptionConfirmation(
    to: string,
    name: string,
    planName: string,
    amount: string
  ) {
    return resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: `Subscription Confirmed - ${planName} Plan`,
      html: `
        <h1>Subscription Confirmed</h1>
        <p>Hi ${name},</p>
        <p>You are now on the <strong>${planName}</strong> plan at <strong>${amount}/month</strong>.</p>
        <p>Your features have been upgraded. Go to your dashboard to start using them.</p>
        <p>The Zappix Team</p>
      `,
    });
  },

  /** Send team invite email. */
  async sendTeamInvite(
    to: string,
    name: string,
    inviterName: string,
    role: string
  ) {
    return resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: `You have been invited to join a team on Zappix`,
      html: `
        <h1>Team Invitation</h1>
        <p>Hi ${name},</p>
        <p><strong>${inviterName}</strong> has invited you to join their team on Zappix as a <strong>${role}</strong>.</p>
        <p>Zappix is the operating system for WhatsApp TV businesses in Nigeria.</p>
        <p>
          <a href="${APP_URL}/sign-up" style="display:inline-block;padding:12px 24px;background:#16A34A;color:white;text-decoration:none;border-radius:8px;font-weight:bold;">
            Accept Invitation
          </a>
        </p>
        <p>If you did not expect this invitation, you can safely ignore this email.</p>
        <p>The Zappix Team</p>
      `,
    });
  },

  /** Send ad booking notification to the slot owner. */
  async sendAdBookingNotification(
    to: string,
    name: string,
    advertiserName: string,
    slotTitle: string,
    amount: string
  ) {
    return resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: `New Ad Booking - ${slotTitle}`,
      html: `
        <h1>New Ad Booking</h1>
        <p>Hi ${name},</p>
        <p><strong>${advertiserName}</strong> has booked your ad slot "<strong>${slotTitle}</strong>" for <strong>${amount}</strong>.</p>
        <p>Go to your dashboard to approve or reject this booking.</p>
        <p>
          <a href="${APP_URL}/app/ad-slots" style="display:inline-block;padding:12px 24px;background:#16A34A;color:white;text-decoration:none;border-radius:8px;font-weight:bold;">
            View Booking
          </a>
        </p>
        <p>The Zappix Team</p>
      `,
    });
  },

  /** Send blog newsletter. */
  async sendNewsletter(
    to: string[],
    subject: string,
    htmlContent: string
  ) {
    // Resend supports batch sending
    const emails = to.map((email) => ({
      from: FROM_EMAIL,
      to: email,
      subject,
      html: htmlContent,
    }));

    return resend.batch.send(emails);
  },
};
