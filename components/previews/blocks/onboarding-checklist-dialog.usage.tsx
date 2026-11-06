"use client";

import { OnboardingPage, type OnboardingPageProps } from "@/components/motion/onboarding-pages";

/** Supply your own data and service callbacks. No demo controller is installed. */
export function OnboardingChecklistDialogExample(props: Omit<OnboardingPageProps, "variant">) {
  return <OnboardingPage {...props} variant="checklist-dialog" />;
}
