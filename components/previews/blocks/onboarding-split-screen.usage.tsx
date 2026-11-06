"use client";

import { OnboardingPage, type OnboardingPageProps } from "@/components/motion/onboarding-pages";

/** Supply your own data and service callbacks. No demo controller is installed. */
export function OnboardingSplitScreenExample(props: Omit<OnboardingPageProps, "variant">) {
  return <OnboardingPage {...props} variant="split-screen" />;
}
