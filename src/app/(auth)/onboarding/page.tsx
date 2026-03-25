"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Check, AlertTriangle, QrCode, CreditCard } from "lucide-react";

const steps = [
  { label: "Account Type", icon: "user" },
  { label: "Risk Disclosure", icon: "alert" },
  { label: "Connect Number", icon: "qr" },
  { label: "Choose Plan", icon: "card" },
];

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [accountType, setAccountType] = useState<string | null>(null);
  const [riskAccepted, setRiskAccepted] = useState(false);
  const router = useRouter();

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-lg">
        <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
          <h1 className="mb-2 text-2xl font-bold">Welcome to Zappix!</h1>
          <p className="mb-8 text-gray-500">
            Let us get you set up in a few simple steps.
          </p>

          {/* Step indicators */}
          <div className="mb-8 flex items-center justify-between">
            {steps.map((step, i) => (
              <div key={step.label} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-medium transition-colors ${
                      i < currentStep
                        ? "bg-green-600 text-white"
                        : i === currentStep
                        ? "bg-green-600 text-white"
                        : "bg-gray-100 text-gray-400"
                    }`}
                  >
                    {i < currentStep ? (
                      <Check className="h-5 w-5" />
                    ) : (
                      i + 1
                    )}
                  </div>
                  <span className="mt-1 text-[10px] text-gray-500">
                    {step.label}
                  </span>
                </div>
                {i < steps.length - 1 && (
                  <div
                    className={`mx-2 h-0.5 w-12 ${
                      i < currentStep ? "bg-green-600" : "bg-gray-200"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Step 1: Account Type */}
          {currentStep === 0 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">What type of account?</h2>
              <p className="text-sm text-gray-500">
                Tell us how you plan to use Zappix so we can customize your
                experience.
              </p>
              <div className="grid gap-3">
                {[
                  {
                    id: "whatsapp-tv",
                    label: "WhatsApp TV Owner",
                    desc: "I run my own WhatsApp TV channel",
                  },
                  {
                    id: "agency",
                    label: "Agency / Manager",
                    desc: "I manage WhatsApp TVs for clients",
                  },
                  {
                    id: "business",
                    label: "Business Owner",
                    desc: "I use WhatsApp for my business marketing",
                  },
                ].map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setAccountType(type.id)}
                    className={`flex flex-col rounded-xl border p-4 text-left transition-all ${
                      accountType === type.id
                        ? "border-green-500 bg-green-50 ring-2 ring-green-500/20"
                        : "border-gray-200 hover:border-green-300 hover:bg-green-50/50"
                    }`}
                  >
                    <span className="font-medium">{type.label}</span>
                    <span className="text-sm text-gray-500">{type.desc}</span>
                  </button>
                ))}
              </div>
              <Button
                onClick={nextStep}
                disabled={!accountType}
                className="w-full"
                size="lg"
              >
                Continue
              </Button>
            </div>
          )}

          {/* Step 2: Risk Disclosure */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div className="flex items-start gap-3 rounded-xl bg-yellow-50 border border-yellow-200 p-4">
                <AlertTriangle className="mt-0.5 h-5 w-5 flex-shrink-0 text-yellow-600" />
                <div>
                  <h3 className="font-semibold text-yellow-800">
                    Important: WhatsApp Account Risk
                  </h3>
                  <p className="mt-1 text-sm text-yellow-700">
                    Zappix uses unofficial WhatsApp automation through the
                    Evolution API. While we implement best practices (rate
                    limiting, warm-up protocols) to minimize risk, there is an
                    inherent possibility of WhatsApp account restrictions or
                    temporary bans.
                  </p>
                </div>
              </div>

              <div className="space-y-3 text-sm text-gray-600">
                <p>By proceeding, you acknowledge that:</p>
                <ul className="list-disc space-y-1 pl-5">
                  <li>You understand the risk of WhatsApp restrictions</li>
                  <li>You will follow the recommended warm-up schedule</li>
                  <li>You will not use Zappix for spam or harassment</li>
                  <li>
                    Zappix is not responsible for account restrictions
                  </li>
                </ul>
              </div>

              <label className="flex items-start gap-3 rounded-xl border border-gray-200 p-4 cursor-pointer hover:bg-gray-50">
                <input
                  type="checkbox"
                  checked={riskAccepted}
                  onChange={(e) => setRiskAccepted(e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
                />
                <span className="text-sm">
                  I understand and accept the risks associated with WhatsApp
                  automation.
                </span>
              </label>

              <div className="flex gap-3">
                <Button variant="outline" onClick={prevStep} className="flex-1">
                  Back
                </Button>
                <Button
                  onClick={nextStep}
                  disabled={!riskAccepted}
                  className="flex-1"
                  size="lg"
                >
                  I Accept
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Connect Number */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">
                Connect Your WhatsApp Number
              </h2>
              <p className="text-sm text-gray-500">
                Scan the QR code with your phone to connect your WhatsApp
                account. You can also do this later from the dashboard.
              </p>

              <div className="flex flex-col items-center rounded-xl border border-gray-200 bg-gray-50 p-8">
                <div className="mb-4 flex h-48 w-48 items-center justify-center rounded-xl bg-white border border-gray-200">
                  <QrCode className="h-16 w-16 text-gray-300" />
                </div>
                <p className="text-sm text-gray-500">
                  QR code will appear here after connecting to Evolution API
                </p>
              </div>

              <div className="flex gap-3">
                <Button variant="outline" onClick={prevStep} className="flex-1">
                  Back
                </Button>
                <Button onClick={nextStep} className="flex-1" size="lg">
                  Continue
                </Button>
              </div>
              <button
                onClick={nextStep}
                className="w-full text-center text-sm text-gray-500 hover:text-green-600"
              >
                Skip for now - I will connect later
              </button>
            </div>
          )}

          {/* Step 4: Choose Plan */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Choose Your Plan</h2>
              <p className="text-sm text-gray-500">
                Start with a 7-day free trial. No credit card required.
              </p>

              <div className="space-y-3">
                {[
                  { name: "Starter", price: "N10,000/mo", accounts: "1 WhatsApp account" },
                  { name: "Growth", price: "N25,000/mo", accounts: "3 WhatsApp accounts", popular: true },
                  { name: "Business", price: "N55,000/mo", accounts: "7 WhatsApp accounts" },
                  { name: "Scale", price: "N100,000/mo", accounts: "15 WhatsApp accounts" },
                ].map((plan) => (
                  <div
                    key={plan.name}
                    className={`flex items-center justify-between rounded-xl border p-4 ${
                      plan.popular
                        ? "border-green-500 bg-green-50"
                        : "border-gray-200"
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">{plan.name}</span>
                        {plan.popular && (
                          <span className="rounded-full bg-green-600 px-2 py-0.5 text-[10px] font-medium text-white">
                            Popular
                          </span>
                        )}
                      </div>
                      <span className="text-sm text-gray-500">
                        {plan.accounts}
                      </span>
                    </div>
                    <span className="font-semibold">{plan.price}</span>
                  </div>
                ))}
              </div>

              <div className="flex gap-3">
                <Button variant="outline" onClick={prevStep} className="flex-1">
                  Back
                </Button>
                <Button
                  onClick={() => router.push("/app/dashboard")}
                  className="flex-1"
                  size="lg"
                >
                  Start Free Trial
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
