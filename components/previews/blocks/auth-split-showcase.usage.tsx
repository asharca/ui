"use client";

import { AuthPage, type AuthPageProps } from "@/components/motion/auth-pages";

/** Supply your own data and service callbacks. No demo controller is installed. */
export function AuthSplitShowcaseExample(props: Omit<AuthPageProps, "variant">) {
  return <AuthPage {...props} variant="split-showcase" />;
}
