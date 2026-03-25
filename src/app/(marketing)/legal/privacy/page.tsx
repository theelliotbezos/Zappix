import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Zappix collects, uses, and protects your data.",
};

export default function PrivacyPolicyPage() {
  return (
    <article className="py-section-sm lg:py-section">
      <div className="section-container">
        <div className="mx-auto max-w-3xl prose prose-green">
          <h1>Privacy Policy</h1>
          <p className="text-gray-500">Last updated: March 2025</p>

          <h2>1. Information We Collect</h2>
          <p>
            We collect information you provide directly to us, including your
            name, email address, phone number, and payment information when
            you create an account and subscribe to our services.
          </p>

          <h2>2. WhatsApp Data</h2>
          <p>
            Zappix accesses your WhatsApp account through the Evolution API to
            provide our services. We process message metadata, contact lists,
            and status updates as necessary to deliver scheduled posts and
            broadcasts. We do not read or store the content of your personal
            WhatsApp conversations.
          </p>

          <h2>3. How We Use Your Information</h2>
          <ul>
            <li>To provide and maintain our services</li>
            <li>To process your subscription payments</li>
            <li>To send you service-related communications</li>
            <li>To improve and optimize our platform</li>
            <li>To process referral payouts to your bank account</li>
          </ul>

          <h2>4. Third-Party Services</h2>
          <p>We use the following third-party services:</p>
          <ul>
            <li><strong>Clerk</strong> - Authentication and user management</li>
            <li><strong>Paystack</strong> - Payment processing and bank transfers</li>
            <li><strong>Cloudinary</strong> - Media storage and delivery</li>
            <li><strong>Resend</strong> - Email communications</li>
            <li><strong>Neon</strong> - Database hosting</li>
          </ul>

          <h2>5. Data Security</h2>
          <p>
            We implement industry-standard security measures to protect your
            data. All data is encrypted in transit and at rest. Payment
            information is handled directly by Paystack and never stored on our
            servers.
          </p>

          <h2>6. Data Retention</h2>
          <p>
            We retain your data for as long as your account is active. You can
            request deletion of your data at any time by contacting us at
            hello@zappix.ng.
          </p>

          <h2>7. Contact Us</h2>
          <p>
            If you have questions about this privacy policy, please contact us
            at <a href="mailto:hello@zappix.ng">hello@zappix.ng</a>.
          </p>
        </div>
      </div>
    </article>
  );
}
