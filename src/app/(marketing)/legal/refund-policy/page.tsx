import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Refund Policy",
  description: "Zappix refund policy - 7-day refund window for new subscribers.",
};

export default function RefundPolicyPage() {
  return (
    <article className="py-section-sm lg:py-section">
      <div className="section-container">
        <div className="mx-auto max-w-3xl prose prose-green">
          <h1>Refund Policy</h1>
          <p className="text-gray-500">Last updated: March 2025</p>

          <h2>7-Day Refund Window</h2>
          <p>
            We offer a full refund within 7 days of your first subscription
            payment. If you are not satisfied with Zappix, contact us within
            this window for a complete refund, no questions asked.
          </p>

          <h2>Conditions</h2>
          <ul>
            <li>Refunds are only available for the first payment</li>
            <li>Request must be made within 7 days of payment</li>
            <li>Refunds are processed back to the original payment method</li>
            <li>Processing takes 5-10 business days</li>
          </ul>

          <h2>After the 7-Day Window</h2>
          <p>
            After the 7-day refund window, subscriptions are non-refundable.
            You can cancel your subscription at any time to prevent future
            charges. Your access continues until the end of the current
            billing period.
          </p>

          <h2>How to Request a Refund</h2>
          <p>
            Send an email to{" "}
            <a href="mailto:hello@zappix.ng">hello@zappix.ng</a> with your
            account email and the reason for your refund request. We will
            process it within 48 hours.
          </p>
        </div>
      </div>
    </article>
  );
}
