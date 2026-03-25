import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms and conditions for using the Zappix platform.",
};

export default function TermsPage() {
  return (
    <article className="py-section-sm lg:py-section">
      <div className="section-container">
        <div className="mx-auto max-w-3xl prose prose-green">
          <h1>Terms of Service</h1>
          <p className="text-gray-500">Last updated: March 2025</p>

          <h2>1. Acceptance of Terms</h2>
          <p>
            By accessing and using Zappix, you agree to be bound by these
            Terms of Service. If you do not agree to these terms, do not use
            our services.
          </p>

          <h2>2. Service Description</h2>
          <p>
            Zappix provides tools for managing WhatsApp TV businesses,
            including status scheduling, broadcast messaging, contact
            management, analytics, and ad slot management.
          </p>

          <h2>3. WhatsApp Risk Acceptance</h2>
          <p>
            <strong>Important:</strong> Zappix uses unofficial WhatsApp
            automation through the Evolution API. While we implement best
            practices to minimize risks, there is an inherent risk of
            WhatsApp account restrictions or bans. By using Zappix, you
            acknowledge and accept this risk. Zappix is not responsible for
            any WhatsApp account restrictions that may occur.
          </p>

          <h2>4. Account Responsibilities</h2>
          <ul>
            <li>You must provide accurate account information</li>
            <li>You are responsible for maintaining account security</li>
            <li>You must not use the service for spam or harassment</li>
            <li>You must comply with WhatsApp terms of service</li>
            <li>You must not share your account credentials</li>
          </ul>

          <h2>5. Billing and Payments</h2>
          <ul>
            <li>Subscriptions are billed monthly or annually via Paystack</li>
            <li>You can cancel your subscription at any time</li>
            <li>Cancellation takes effect at the end of the current billing period</li>
            <li>All prices are in Nigerian Naira (NGN)</li>
          </ul>

          <h2>6. Referral Programme</h2>
          <ul>
            <li>Referral commissions are 25% of the referred user subscription</li>
            <li>Commissions have a 30-day hold period before release</li>
            <li>Minimum withdrawal amount is N5,000</li>
            <li>Payouts are made via Paystack Transfer to your Nigerian bank account</li>
            <li>Zappix reserves the right to modify commission rates with 30 days notice</li>
          </ul>

          <h2>7. Limitation of Liability</h2>
          <p>
            Zappix is provided as-is. We are not liable for any damages
            arising from the use of our services, including but not limited
            to WhatsApp account restrictions, data loss, or service
            interruptions.
          </p>

          <h2>8. Contact</h2>
          <p>
            Questions about these terms? Email us at{" "}
            <a href="mailto:hello@zappix.ng">hello@zappix.ng</a>.
          </p>
        </div>
      </div>
    </article>
  );
}
