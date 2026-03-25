"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    question: "What is Zappix?",
    answer:
      "Zappix is a platform built specifically for Nigerian WhatsApp TV businesses. It lets you schedule statuses, send broadcasts, manage contacts, sell ad slots, and more - all from one dashboard.",
  },
  {
    question: "Is my WhatsApp account safe?",
    answer:
      "Zappix uses the Evolution API which is built on the Baileys library for WhatsApp Web automation. While we implement rate limiting and warm-up protocols to minimize risk, there is an inherent risk of WhatsApp restrictions with any automation tool. We recommend starting slowly and following our warm-up guide.",
  },
  {
    question: "How do I connect my WhatsApp number?",
    answer:
      "Simply scan a QR code from your Zappix dashboard, just like connecting WhatsApp Web. It takes less than 30 seconds.",
  },
  {
    question: "Can I manage multiple WhatsApp numbers?",
    answer:
      "Yes! Depending on your plan, you can manage up to 15 WhatsApp numbers from a single dashboard. This is great for running multiple TVs or managing client accounts.",
  },
  {
    question: "How does the referral programme work?",
    answer:
      "Share your unique referral link with others. When they subscribe, you earn 25% of their subscription fee as recurring commission. Commissions are released after a 30-day hold period and paid directly to your Nigerian bank account via Paystack.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept all Nigerian bank cards (Visa, Mastercard, Verve), bank transfers, and USSD payments through Paystack.",
  },
  {
    question: "Can I cancel anytime?",
    answer:
      "Yes, you can cancel your subscription at any time. Your access continues until the end of your current billing period. We also offer a 7-day refund policy for new subscribers.",
  },
  {
    question: "Do you have an API?",
    answer:
      "API access is available on the Business and Scale plans. It allows you to integrate Zappix features into your own applications and workflows.",
  },
];

export function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="bg-gray-50 py-section-sm lg:py-section">
      <div className="section-container">
        <h2 className="mb-4 text-center text-3xl font-bold lg:text-4xl">
          Frequently Asked Questions
        </h2>
        <p className="mx-auto mb-12 max-w-2xl text-center text-gray-500">
          Got questions? We have got answers.
        </p>
        <div className="mx-auto max-w-2xl space-y-3">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="overflow-hidden rounded-xl border border-gray-200 bg-white"
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="flex w-full items-center justify-between px-6 py-4 text-left"
              >
                <span className="font-medium">{faq.question}</span>
                <ChevronDown
                  className={`h-5 w-5 flex-shrink-0 text-gray-400 transition-transform ${
                    openIndex === i ? "rotate-180" : ""
                  }`}
                />
              </button>
              {openIndex === i && (
                <div className="border-t border-gray-100 px-6 py-4">
                  <p className="text-gray-500">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
