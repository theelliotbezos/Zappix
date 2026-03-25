import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Welcome to Zappix",
  description: "Set up your Zappix account in a few simple steps.",
};

export default function OnboardingPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-lg">
        <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
          <h1 className="mb-2 text-2xl font-bold">Welcome to Zappix!</h1>
          <p className="mb-8 text-gray-500">
            Let us get you set up in a few simple steps.
          </p>

          {/* Step indicators */}
          <div className="mb-8 flex items-center gap-2">
            {["Account Type", "Risk Disclosure", "Connect Number", "Choose Plan"].map(
              (step, i) => (
                <div key={step} className="flex items-center gap-2">
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium ${
                      i === 0
                        ? "bg-green-600 text-white"
                        : "bg-gray-100 text-gray-400"
                    }`}
                  >
                    {i + 1}
                  </div>
                  {i < 3 && (
                    <div className="h-0.5 w-8 bg-gray-200" />
                  )}
                </div>
              )
            )}
          </div>

          {/* Onboarding form content - to be implemented */}
          <div className="rounded-xl bg-gray-50 p-8 text-center">
            <p className="text-gray-400">
              Onboarding flow will be implemented here
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
