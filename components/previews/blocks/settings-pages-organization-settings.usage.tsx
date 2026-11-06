"use client";

import { AccountSettingsPage, type AccountSettingsPageProps } from "@/components/motion/account-settings-pages";

/** Supply your own data and service callbacks. No demo controller is installed. */
export function SettingsPagesOrganizationSettingsExample(props: Omit<AccountSettingsPageProps, "variant">) {
  return <AccountSettingsPage {...props} variant="organization-settings" />;
}
