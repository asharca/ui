export type MobileDomainId =
  | "all"
  | "ai"
  | "finance"
  | "core"
  | "auth"
  | "paywalls"
  | "profile"
  | "states";

export const MOBILE_DOMAINS: readonly { id: MobileDomainId; label: string }[] = [
  { id: "all", label: "All" },
  { id: "ai", label: "AI agents" },
  { id: "finance", label: "Finance & crypto" },
  { id: "core", label: "Core app" },
  { id: "auth", label: "Authentication" },
  { id: "paywalls", label: "Paywalls" },
  { id: "profile", label: "Profile & settings" },
  { id: "states", label: "States" },
];

export type MobileScreenVariant = {
  slug: string;
  name: string;
  kind: "Screen" | "Block";
  description: string;
  previewKey: string;
  filename: string;
  libraries: string[];
};

export type MobileScreenGroup = {
  slug: string;
  title: string;
  description: string;
  domain: Exclude<MobileDomainId, "all">;
  libraries: string[];
  badge?: "new";
  launchedAt?: string;
  variants: MobileScreenVariant[];
};

export const MOBILE_SCREENS_PATH = "/components/mobile";

export function mobileScreenPath(slug: string) {
  return `${MOBILE_SCREENS_PATH}/${slug}`;
}

export const MOBILE_SCREEN_GROUPS: readonly MobileScreenGroup[] = [
  {
    slug: "accounts-and-history",
    title: "Accounts & history",
    domain: "finance",
    badge: "new",
    launchedAt: "2026-11-12",
    description:
      "A multi-currency money home with horizontally paging currency cards, privacy amount masking, and filterable daily ledger activity.",
    libraries: [
      "react-native-reanimated",
      "react-native-gesture-handler",
      "expo-haptics",
      "lucide-react-native",
    ],
    variants: [
      {
        slug: "accounts-screen",
        name: "Accounts Screen",
        kind: "Screen",
        description:
          "Currency balance carousel with instant privacy masking, quick actions, and live incoming/outgoing activity rows.",
        previewKey: "mobile/accounts-and-history/accounts-screen",
        filename: "src/screens/finance/accounts-screen.tsx",
        libraries: ["react-native-reanimated", "expo-haptics", "lucide-react-native"],
      },
      {
        slug: "transaction-history",
        name: "Transaction History",
        kind: "Screen",
        description:
          "Searchable daily ledger with category pills, monthly money in/out summary bar, and expandable transfer receipts.",
        previewKey: "mobile/accounts-and-history/transaction-history",
        filename: "src/screens/finance/transaction-history.tsx",
        libraries: ["react-native-reanimated", "lucide-react-native"],
      },
    ],
  },
  {
    slug: "send-and-split",
    title: "Send & split",
    domain: "finance",
    description:
      "Peer transfer keypad with contact avatar carousel, balance guardrails, and an interactive bill-splitting sheet with live per-person totals.",
    libraries: ["react-native-reanimated", "expo-haptics", "lucide-react-native"],
    variants: [
      {
        slug: "send-money",
        name: "Send Money",
        kind: "Screen",
        description:
          "Recipient selector and custom tactile keypad that rolls digits cleanly as you compose an instant payment.",
        previewKey: "mobile/send-and-split/send-money",
        filename: "src/screens/finance/send-money.tsx",
        libraries: ["react-native-reanimated", "expo-haptics", "lucide-react-native"],
      },
      {
        slug: "split-bill",
        name: "Split Bill",
        kind: "Screen",
        description:
          "Shared expense breakdown with selectable contacts, equal or custom weights, and single-tap payment reminders.",
        previewKey: "mobile/send-and-split/split-bill",
        filename: "src/screens/finance/split-bill.tsx",
        libraries: ["react-native-reanimated", "expo-haptics", "lucide-react-native"],
      },
    ],
  },
  {
    slug: "add-and-receive",
    title: "Add & receive",
    domain: "finance",
    description:
      "Fast wallet top-up with preset funding chips and a branded QR receive sheet with copyable handle and share trigger.",
    libraries: ["react-native-reanimated", "expo-haptics", "lucide-react-native"],
    variants: [
      {
        slug: "add-money",
        name: "Add Money",
        kind: "Screen",
        description:
          "Top-up composer with Apple Pay / bank card source switcher, preset amount pills, and instant confirmation feedback.",
        previewKey: "mobile/add-and-receive/add-money",
        filename: "src/screens/finance/add-money.tsx",
        libraries: ["react-native-reanimated", "expo-haptics", "lucide-react-native"],
      },
      {
        slug: "receive-screen",
        name: "Receive Screen",
        kind: "Screen",
        description:
          "High-contrast QR code card with network selector, copied toast confirmation, and request-link sharing.",
        previewKey: "mobile/add-and-receive/receive-screen",
        filename: "src/screens/finance/receive-screen.tsx",
        libraries: ["react-native-reanimated", "expo-haptics", "lucide-react-native"],
      },
    ],
  },
  {
    slug: "swap-and-earn",
    title: "Swap & earn",
    domain: "finance",
    badge: "new",
    launchedAt: "2026-11-10",
    description:
      "Token swap screen with animated leg reversal and live slippage readout, paired with an APY yield vault deposit flow.",
    libraries: ["react-native-reanimated", "expo-haptics", "lucide-react-native"],
    variants: [
      {
        slug: "swap-screen",
        name: "Swap Screen",
        kind: "Screen",
        description:
          "Two-asset conversion card with spring token-flip button, quick percentage presets, and estimated route fees.",
        previewKey: "mobile/swap-and-earn/swap-screen",
        filename: "src/screens/finance/swap-screen.tsx",
        libraries: ["react-native-reanimated", "expo-haptics", "lucide-react-native"],
      },
      {
        slug: "yield-vault",
        name: "Yield Vault",
        kind: "Screen",
        description:
          "Staking vault card displaying variable APY trajectory, projected annual earnings, and lock-term selector.",
        previewKey: "mobile/swap-and-earn/yield-vault",
        filename: "src/screens/finance/yield-vault.tsx",
        libraries: ["react-native-reanimated", "lucide-react-native"],
      },
    ],
  },
  {
    slug: "card-controls",
    title: "Card controls",
    domain: "finance",
    description:
      "Virtual debit card showcase with revealable CVV, instant freeze toggle, and monthly spending limit sliders.",
    libraries: ["react-native-reanimated", "expo-haptics", "lucide-react-native"],
    variants: [
      {
        slug: "card-controls",
        name: "Card Controls",
        kind: "Screen",
        description:
          "Interactive metal card preview with frost overlay when frozen, PIN reveal, and contact-free toggle switches.",
        previewKey: "mobile/card-controls/card-controls",
        filename: "src/screens/finance/card-controls.tsx",
        libraries: ["react-native-reanimated", "expo-haptics", "lucide-react-native"],
      },
    ],
  },
  {
    slug: "leaderboard",
    title: "Leaderboard",
    domain: "core",
    description:
      "Competitive podium standings with timeframe switcher, animated delta badges, and sticky current-user rank footer.",
    libraries: ["react-native-reanimated", "lucide-react-native"],
    variants: [
      {
        slug: "leaderboard",
        name: "Leaderboard",
        kind: "Screen",
        description:
          "Top-three stepped podium followed by ranked contributor rows and a pinned bottom summary bar for your score.",
        previewKey: "mobile/leaderboard/leaderboard",
        filename: "src/screens/core/leaderboard.tsx",
        libraries: ["react-native-reanimated", "lucide-react-native"],
      },
    ],
  },
  {
    slug: "prompt-input",
    title: "Prompt input",
    domain: "ai",
    badge: "new",
    launchedAt: "2026-11-15",
    description:
      "Expanding chat composer with hold-to-talk waveform and attachment drawer, paired with a searchable model selector and reasoning effort control.",
    libraries: [
      "react-native-reanimated",
      "react-native-gesture-handler",
      "expo-haptics",
      "lucide-react-native",
    ],
    variants: [
      {
        slug: "prompt-composer",
        name: "Prompt Composer",
        kind: "Block",
        description:
          "Composer bar that opens into a focused multi-line sheet with photo uploads, web search toggle, and voice trigger.",
        previewKey: "mobile/prompt-input/prompt-composer",
        filename: "src/blocks/ai/prompt-composer.tsx",
        libraries: ["react-native-reanimated", "expo-haptics", "lucide-react-native"],
      },
      {
        slug: "model-picker",
        name: "Model Picker",
        kind: "Block",
        description:
          "Bottom-sheet style catalog grouping flagship models by latency, context window, and selectable reasoning effort.",
        previewKey: "mobile/prompt-input/model-picker",
        filename: "src/blocks/ai/model-picker.tsx",
        libraries: ["react-native-reanimated", "lucide-react-native"],
      },
    ],
  },
  {
    slug: "voice-mode",
    title: "Voice mode",
    domain: "ai",
    badge: "new",
    launchedAt: "2026-11-14",
    description:
      "Hands-free voice conversation canvas with animated breathing orb, listening/thinking/speaking states, and streaming word captions.",
    libraries: ["react-native-reanimated", "expo-haptics", "lucide-react-native"],
    variants: [
      {
        slug: "voice-mode",
        name: "Voice Mode",
        kind: "Screen",
        description:
          "Full-screen ambient voice interface with pulsing acoustic halo, mute toggle, and live turn captions.",
        previewKey: "mobile/voice-mode/voice-mode",
        filename: "src/screens/ai/voice-mode.tsx",
        libraries: ["react-native-reanimated", "expo-haptics", "lucide-react-native"],
      },
    ],
  },
  {
    slug: "agent-tasks",
    title: "Agent tasks",
    domain: "ai",
    badge: "new",
    launchedAt: "2026-11-13",
    description:
      "Background agent workflows from inbox triage with progress rings to step-by-step PR execution and parallel sub-agent convergence.",
    libraries: ["react-native-reanimated", "expo-haptics", "lucide-react-native"],
    variants: [
      {
        slug: "agent-inbox",
        name: "Agent Inbox",
        kind: "Screen",
        description:
          "Filterable task feed showing active autonomous runs, circular progress rings, and needs-review badges.",
        previewKey: "mobile/agent-tasks/agent-inbox",
        filename: "src/screens/ai/agent-inbox.tsx",
        libraries: ["react-native-reanimated", "lucide-react-native"],
      },
      {
        slug: "agent-run",
        name: "Agent Run",
        kind: "Screen",
        description:
          "Live execution timeline tracking repository scan, patch diff, and test verification before opening a pull request.",
        previewKey: "mobile/agent-tasks/agent-run",
        filename: "src/screens/ai/agent-run.tsx",
        libraries: ["react-native-reanimated", "lucide-react-native"],
      },
      {
        slug: "parallel-agents",
        name: "Parallel Agents",
        kind: "Screen",
        description:
          "Multi-branch fan-out view displaying concurrent researcher, builder, and verifier workers merging into one plan.",
        previewKey: "mobile/agent-tasks/parallel-agents",
        filename: "src/screens/ai/parallel-agents.tsx",
        libraries: ["react-native-reanimated", "lucide-react-native"],
      },
    ],
  },
  {
    slug: "deep-research",
    title: "Deep research",
    domain: "ai",
    description:
      "Research synthesis screen where source citations illuminate as they are read, transitioning smoothly into a structured executive report.",
    libraries: ["react-native-reanimated", "lucide-react-native"],
    variants: [
      {
        slug: "deep-research",
        name: "Deep Research",
        kind: "Screen",
        description:
          "Multi-source reading ticker paired with inline clickable citations and concise findings summary cards.",
        previewKey: "mobile/deep-research/deep-research",
        filename: "src/screens/ai/deep-research.tsx",
        libraries: ["react-native-reanimated", "lucide-react-native"],
      },
    ],
  },
  {
    slug: "agent-questions",
    title: "Agent questions",
    domain: "ai",
    description:
      "Multi-step clarifying questionnaire allowing agents to confirm scope, deployment targets, and constraints directly inside mobile flows.",
    libraries: ["react-native-reanimated", "expo-haptics", "lucide-react-native"],
    variants: [
      {
        slug: "agent-questionnaire",
        name: "Agent Questionnaire",
        kind: "Screen",
        description:
          "Interactive paged question cards with single-select pills, progress bar, and instant summary confirmation.",
        previewKey: "mobile/agent-questions/agent-questionnaire",
        filename: "src/screens/ai/agent-questionnaire.tsx",
        libraries: ["react-native-reanimated", "expo-haptics", "lucide-react-native"],
      },
    ],
  },
  {
    slug: "usage-and-context",
    title: "Usage & context",
    domain: "ai",
    description:
      "Mobile token budget monitor and context window inspector with breakdown by system prompt, tool outputs, and conversation turns.",
    libraries: ["react-native-reanimated", "lucide-react-native"],
    variants: [
      {
        slug: "usage-budget",
        name: "Usage Budget",
        kind: "Screen",
        description:
          "Monthly credit consumption ring, daily spend bars, and configurable soft-cap threshold alert toggle.",
        previewKey: "mobile/usage-and-context/usage-budget",
        filename: "src/screens/ai/usage-budget.tsx",
        libraries: ["react-native-reanimated", "lucide-react-native"],
      },
      {
        slug: "context-usage",
        name: "Context Usage",
        kind: "Block",
        description:
          "Compact segmented meter visualizing context window allocation with interactive segment inspection and compact trigger.",
        previewKey: "mobile/usage-and-context/context-usage",
        filename: "src/blocks/ai/context-usage.tsx",
        libraries: ["react-native-reanimated", "lucide-react-native"],
      },
    ],
  },
  {
    slug: "log-in",
    title: "Log in",
    domain: "auth",
    description:
      "Three mobile authentication entry patterns: social + email card, minimal magic-link login, and SMS phone verification.",
    libraries: ["react-native-reanimated", "expo-haptics", "lucide-react-native"],
    variants: [
      {
        slug: "login-screen",
        name: "Login Screen",
        kind: "Screen",
        description:
          "Full-screen sign-in with Apple/Google/passkey buttons, divider, email validation, and loading button feedback.",
        previewKey: "mobile/log-in/login-screen",
        filename: "src/screens/auth/login-screen.tsx",
        libraries: ["react-native-reanimated", "expo-haptics", "lucide-react-native"],
      },
      {
        slug: "simple-login",
        name: "Simple Login",
        kind: "Screen",
        description:
          "Focused minimal email and password layout with password visibility toggle and biometric quick-fill prompt.",
        previewKey: "mobile/log-in/simple-login",
        filename: "src/screens/auth/simple-login.tsx",
        libraries: ["react-native-reanimated", "lucide-react-native"],
      },
      {
        slug: "phone-login",
        name: "Phone Login",
        kind: "Screen",
        description:
          "Country code selector with formatted phone input seamlessly transitioning to a 6-digit SMS code step.",
        previewKey: "mobile/log-in/phone-login",
        filename: "src/screens/auth/phone-login.tsx",
        libraries: ["react-native-reanimated", "expo-haptics", "lucide-react-native"],
      },
    ],
  },
  {
    slug: "sign-up",
    title: "Sign up",
    domain: "auth",
    description:
      "Brand-first welcome entry screen and multi-field registration form with live password strength meter.",
    libraries: ["react-native-reanimated", "expo-haptics", "lucide-react-native"],
    variants: [
      {
        slug: "welcome-screen",
        name: "Welcome Screen",
        kind: "Screen",
        description:
          "Hero artwork carousel introducing value props with primary account creation CTA and subtle sign-in link.",
        previewKey: "mobile/sign-up/welcome-screen",
        filename: "src/screens/auth/welcome-screen.tsx",
        libraries: ["react-native-reanimated", "lucide-react-native"],
      },
      {
        slug: "sign-up-screen",
        name: "Sign Up Screen",
        kind: "Screen",
        description:
          "Account registration sheet with name, email, real-time strength bars, and terms consent checkbox.",
        previewKey: "mobile/sign-up/sign-up-screen",
        filename: "src/screens/auth/sign-up-screen.tsx",
        libraries: ["react-native-reanimated", "expo-haptics", "lucide-react-native"],
      },
    ],
  },
  {
    slug: "password-and-passcode",
    title: "Password & passcode",
    domain: "auth",
    description:
      "Account recovery reset flow and tactile biometric/PIN unlock keypad with shake feedback on wrong entry.",
    libraries: ["react-native-reanimated", "expo-haptics", "lucide-react-native"],
    variants: [
      {
        slug: "forgot-password",
        name: "Forgot Password",
        kind: "Screen",
        description:
          "Two-state password recovery flow transitioning smoothly from email prompt to sent confirmation state.",
        previewKey: "mobile/password-and-passcode/forgot-password",
        filename: "src/screens/auth/forgot-password.tsx",
        libraries: ["react-native-reanimated", "lucide-react-native"],
      },
      {
        slug: "unlock-screen",
        name: "Unlock Screen",
        kind: "Screen",
        description:
          "Four-dot PIN keypad with spring dot fills, Face ID trigger, and horizontal shake feedback for invalid attempts.",
        previewKey: "mobile/password-and-passcode/unlock-screen",
        filename: "src/screens/auth/unlock-screen.tsx",
        libraries: ["react-native-reanimated", "expo-haptics", "lucide-react-native"],
      },
    ],
  },
  {
    slug: "paywalls",
    title: "Paywalls",
    domain: "paywalls",
    description:
      "Three mobile upgrade sheets for consumer and creator apps: plan comparison, aurora gradient showcase, and transparent timeline trial.",
    libraries: ["react-native-reanimated", "expo-haptics", "lucide-react-native"],
    variants: [
      {
        slug: "paywall-screen",
        name: "Paywall Screen",
        kind: "Screen",
        description:
          "Clean comparison paywall with Annual/Monthly toggle, perk checklist, and sticky restore purchases action.",
        previewKey: "mobile/paywalls/paywall-screen",
        filename: "src/screens/paywalls/paywall-screen.tsx",
        libraries: ["react-native-reanimated", "expo-haptics", "lucide-react-native"],
      },
      {
        slug: "aurora-paywall",
        name: "Aurora Paywall",
        kind: "Screen",
        description:
          "Atmospheric radial-glow upgrade sheet highlighting studio membership tiers and savings badge.",
        previewKey: "mobile/paywalls/aurora-paywall",
        filename: "src/screens/paywalls/aurora-paywall.tsx",
        libraries: ["react-native-reanimated", "expo-haptics", "lucide-react-native"],
      },
      {
        slug: "trial-screen",
        name: "Trial Screen",
        kind: "Screen",
        description:
          "Step-by-step 7-day free trial timeline building trust around reminder notifications and cancellation.",
        previewKey: "mobile/paywalls/trial-screen",
        filename: "src/screens/paywalls/trial-screen.tsx",
        libraries: ["react-native-reanimated", "lucide-react-native"],
      },
    ],
  },
  {
    slug: "subscription",
    title: "Subscription",
    domain: "paywalls",
    description:
      "Post-purchase celebration confirmation and plan management screen with billing cycle details and clean cancel guard.",
    libraries: ["react-native-reanimated", "expo-haptics", "lucide-react-native"],
    variants: [
      {
        slug: "purchase-success",
        name: "Purchase Success",
        kind: "Screen",
        description:
          "Animated badge reveal with receipt summary, unlocked perks list, and immediate workspace launch button.",
        previewKey: "mobile/subscription/purchase-success",
        filename: "src/screens/paywalls/purchase-success.tsx",
        libraries: ["react-native-reanimated", "expo-haptics", "lucide-react-native"],
      },
      {
        slug: "manage-subscription",
        name: "Manage Subscription",
        kind: "Screen",
        description:
          "Active membership card showing renewal date, billing history, plan switcher, and pause/cancel controls.",
        previewKey: "mobile/subscription/manage-subscription",
        filename: "src/screens/paywalls/manage-subscription.tsx",
        libraries: ["react-native-reanimated", "lucide-react-native"],
      },
    ],
  },
  {
    slug: "profile",
    title: "Profile",
    domain: "profile",
    description:
      "User account profile with banner avatar header, key activity counters, bio badges, and quick edit modal trigger.",
    libraries: ["react-native-reanimated", "lucide-react-native"],
    variants: [
      {
        slug: "profile-screen",
        name: "Profile Screen",
        kind: "Screen",
        description:
          "Member card with verified status, streak/collection metrics, and recent saved collections grid.",
        previewKey: "mobile/profile/profile-screen",
        filename: "src/screens/profile/profile-screen.tsx",
        libraries: ["react-native-reanimated", "lucide-react-native"],
      },
    ],
  },
  {
    slug: "settings",
    title: "Settings",
    domain: "profile",
    description:
      "Five modular settings screens and rows covering grouped navigation, appearance theme switching, notifications, and destructive confirmation.",
    libraries: ["react-native-reanimated", "expo-haptics", "lucide-react-native"],
    variants: [
      {
        slug: "settings-screen",
        name: "Settings Screen",
        kind: "Screen",
        description:
          "Root settings directory with profile summary banner, categorized groups, status pills, and version footer.",
        previewKey: "mobile/settings/settings-screen",
        filename: "src/screens/settings/settings-screen.tsx",
        libraries: ["react-native-reanimated", "lucide-react-native"],
      },
      {
        slug: "settings-list",
        name: "Settings List",
        kind: "Block",
        description:
          "Reusable inset-grouped settings section supporting toggles, external links, and chevron drill-downs.",
        previewKey: "mobile/settings/settings-list",
        filename: "src/blocks/settings/settings-list.tsx",
        libraries: ["react-native-reanimated", "expo-haptics", "lucide-react-native"],
      },
      {
        slug: "appearance-picker",
        name: "Appearance Picker",
        kind: "Block",
        description:
          "System/Light/Dark mini phone cards paired with accent swatch dots that preview theme updates immediately.",
        previewKey: "mobile/settings/appearance-picker",
        filename: "src/blocks/settings/appearance-picker.tsx",
        libraries: ["react-native-reanimated", "expo-haptics", "lucide-react-native"],
      },
      {
        slug: "notification-preferences",
        name: "Notification Preferences",
        kind: "Screen",
        description:
          "Granular push and email category switches with quiet-hours schedule selector and digest cadence.",
        previewKey: "mobile/settings/notification-preferences",
        filename: "src/screens/settings/notification-preferences.tsx",
        libraries: ["react-native-reanimated", "expo-haptics", "lucide-react-native"],
      },
      {
        slug: "delete-account",
        name: "Delete Account",
        kind: "Screen",
        description:
          "High-friction account deletion confirmation requiring typed keyword match and checklist acknowledgment.",
        previewKey: "mobile/settings/delete-account",
        filename: "src/screens/settings/delete-account.tsx",
        libraries: ["react-native-reanimated", "expo-haptics", "lucide-react-native"],
      },
    ],
  },
  {
    slug: "app-states",
    title: "Empty & error states",
    domain: "states",
    description:
      "Clear recovery patterns for zero-data screens and intermittent connectivity drops with spring retry feedback.",
    libraries: ["react-native-reanimated", "expo-haptics", "lucide-react-native"],
    variants: [
      {
        slug: "empty-state",
        name: "Empty State",
        kind: "Screen",
        description:
          "Illustrated zero-state layout with contextual suggestion chips and single primary creation button.",
        previewKey: "mobile/app-states/empty-state",
        filename: "src/screens/states/empty-state.tsx",
        libraries: ["react-native-reanimated", "lucide-react-native"],
      },
      {
        slug: "offline-state",
        name: "Offline State",
        kind: "Screen",
        description:
          "Network interruption screen with cached-data banner, diagnostics details, and animated retry trigger.",
        previewKey: "mobile/app-states/offline-state",
        filename: "src/screens/states/offline-state.tsx",
        libraries: ["react-native-reanimated", "expo-haptics", "lucide-react-native"],
      },
    ],
  },
  {
    slug: "update-app",
    title: "Update app",
    domain: "states",
    description:
      "Non-intrusive or blocking app version prompt highlighting new release highlights and direct store update CTA.",
    libraries: ["react-native-reanimated", "lucide-react-native"],
    variants: [
      {
        slug: "update-required",
        name: "Update Required",
        kind: "Screen",
        description:
          "Version delta card comparing installed vs latest release notes with primary store action and dismiss option.",
        previewKey: "mobile/update-app/update-required",
        filename: "src/screens/states/update-required.tsx",
        libraries: ["react-native-reanimated", "lucide-react-native"],
      },
    ],
  },
  {
    slug: "notifications",
    title: "Notifications",
    domain: "states",
    description:
      "Pre-permission push priming screen displaying realistic sample alerts before triggering the native OS dialog.",
    libraries: ["react-native-reanimated", "expo-haptics", "lucide-react-native"],
    variants: [
      {
        slug: "notification-prompt",
        name: "Notification Prompt",
        kind: "Screen",
        description:
          "Stacked live-preview notification cards showing value before requesting OS push authorization.",
        previewKey: "mobile/notifications/notification-prompt",
        filename: "src/screens/states/notification-prompt.tsx",
        libraries: ["react-native-reanimated", "expo-haptics", "lucide-react-native"],
      },
    ],
  },
  {
    slug: "location-permission",
    title: "Location permission",
    domain: "states",
    description:
      "Contextual location request screen with stylized vector map radar ring and clear privacy explanation.",
    libraries: ["react-native-reanimated", "expo-haptics", "lucide-react-native"],
    variants: [
      {
        slug: "permission-prompt",
        name: "Permission Prompt",
        kind: "Screen",
        description:
          "Animated radar pulse over map grid explaining precise vs approximate location before system prompt.",
        previewKey: "mobile/location-permission/permission-prompt",
        filename: "src/screens/states/location-permission.tsx",
        libraries: ["react-native-reanimated", "expo-haptics", "lucide-react-native"],
      },
    ],
  },
  {
    slug: "ratings",
    title: "Ratings",
    domain: "states",
    description:
      "Progressive 5-star review prompt branching cleanly between App Store praise and internal feedback notes.",
    libraries: ["react-native-reanimated", "expo-haptics", "lucide-react-native"],
    variants: [
      {
        slug: "rate-the-app",
        name: "Rate the App",
        kind: "Screen",
        description:
          "Interactive springing star rating selector that unlocks optional feedback field for low scores or store CTA.",
        previewKey: "mobile/ratings/rate-the-app",
        filename: "src/screens/states/rate-the-app.tsx",
        libraries: ["react-native-reanimated", "expo-haptics", "lucide-react-native"],
      },
    ],
  },
  {
    slug: "onboarding",
    title: "Onboarding",
    domain: "core",
    description:
      "Interactive multi-slide onboarding pager with expanding dot indicator and smooth spring slide transitions.",
    libraries: [
      "react-native-reanimated",
      "react-native-gesture-handler",
      "expo-haptics",
      "lucide-react-native",
    ],
    variants: [
      {
        slug: "onboarding-pager",
        name: "Onboarding Pager",
        kind: "Screen",
        description:
          "Three-slide product walkthrough with visual stage, morphing dot indicators, Skip link, and Continue CTA.",
        previewKey: "mobile/onboarding/onboarding-pager",
        filename: "src/screens/core/onboarding-pager.tsx",
        libraries: ["react-native-reanimated", "expo-haptics", "lucide-react-native"],
      },
    ],
  },
  {
    slug: "mascot",
    title: "Mascot",
    domain: "core",
    description:
      "Expressive animated companion badge reacting to tap, thinking, celebrating, and idle breathing states.",
    libraries: ["react-native-reanimated", "expo-haptics"],
    variants: [
      {
        slug: "mascot",
        name: "Mascot",
        kind: "Block",
        description:
          "Interactive SVG character block switching between happy, curious, celebrating, and resting expressions.",
        previewKey: "mobile/mascot/mascot",
        filename: "src/blocks/core/mascot.tsx",
        libraries: ["react-native-reanimated", "expo-haptics"],
      },
    ],
  },
  {
    slug: "home-dashboard",
    title: "Home dashboard",
    domain: "core",
    description:
      "Personal daily mobile home combining greeting header, habit/focus summary rings, quick actions, and recent workspace items.",
    libraries: ["react-native-reanimated", "lucide-react-native"],
    variants: [
      {
        slug: "home-dashboard",
        name: "Home Dashboard",
        kind: "Screen",
        description:
          "Card-based app home screen with greeting, 3 KPI metric tiles, mini activity chart, and quick resume row.",
        previewKey: "mobile/home-dashboard/home-dashboard",
        filename: "src/screens/core/home-dashboard.tsx",
        libraries: ["react-native-reanimated", "lucide-react-native"],
      },
    ],
  },
  {
    slug: "agenda",
    title: "Agenda",
    domain: "core",
    description:
      "Week strip day picker paired with collapsible timeline blocks and live time-marker indicator.",
    libraries: ["react-native-reanimated", "expo-haptics", "lucide-react-native"],
    variants: [
      {
        slug: "agenda",
        name: "Agenda",
        kind: "Screen",
        description:
          "Scrollable 7-day calendar strip that updates the day schedule and lets users check off agenda blocks.",
        previewKey: "mobile/agenda/agenda",
        filename: "src/screens/core/agenda.tsx",
        libraries: ["react-native-reanimated", "expo-haptics", "lucide-react-native"],
      },
    ],
  },
  {
    slug: "messaging",
    title: "Messaging",
    domain: "core",
    description:
      "Complete mobile messaging kit: unread inbox list, spring-animated chat thread with reactions, and modal comment sheet.",
    libraries: ["react-native-reanimated", "expo-haptics", "lucide-react-native"],
    variants: [
      {
        slug: "inbox-screen",
        name: "Inbox Screen",
        kind: "Screen",
        description:
          "Filterable conversation list (All / Unread) with pinned threads, online presence dots, and swipe-to-read state.",
        previewKey: "mobile/messaging/inbox-screen",
        filename: "src/screens/core/inbox-screen.tsx",
        libraries: ["react-native-reanimated", "lucide-react-native"],
      },
      {
        slug: "chat-thread",
        name: "Chat Thread",
        kind: "Screen",
        description:
          "Live messaging conversation supporting quick emoji reactions, typing indicator, and interactive message sending.",
        previewKey: "mobile/messaging/chat-thread",
        filename: "src/screens/core/chat-thread.tsx",
        libraries: ["react-native-reanimated", "expo-haptics", "lucide-react-native"],
      },
      {
        slug: "comments-sheet",
        name: "Comments Sheet",
        kind: "Block",
        description:
          "Threaded reply drawer with heart upvote toggle, nested replies, and sticky composer input.",
        previewKey: "mobile/messaging/comments-sheet",
        filename: "src/blocks/core/comments-sheet.tsx",
        libraries: ["react-native-reanimated", "expo-haptics", "lucide-react-native"],
      },
    ],
  },
  {
    slug: "social",
    title: "Social",
    domain: "core",
    description:
      "Social feed primitives: interactive post card with double-tap like, full-screen stories progress viewer, and activity notifications.",
    libraries: ["react-native-reanimated", "expo-haptics", "lucide-react-native"],
    variants: [
      {
        slug: "feed-card",
        name: "Feed Card",
        kind: "Block",
        description:
          "Media post card with springing heart/bookmark toggles, carousel dot switcher, and author follow button.",
        previewKey: "mobile/social/feed-card",
        filename: "src/blocks/core/feed-card.tsx",
        libraries: ["react-native-reanimated", "expo-haptics", "lucide-react-native"],
      },
      {
        slug: "stories-viewer",
        name: "Stories Viewer",
        kind: "Screen",
        description:
          "Segmented story viewer with tap-to-advance segments, hold-to-pause state, and quick reaction bar.",
        previewKey: "mobile/social/stories-viewer",
        filename: "src/screens/core/stories-viewer.tsx",
        libraries: ["react-native-reanimated", "lucide-react-native"],
      },
      {
        slug: "activity-screen",
        name: "Activity Screen",
        kind: "Screen",
        description:
          "Grouped social activity stream for mentions, likes, and instant inline Follow / Following toggles.",
        previewKey: "mobile/social/activity-screen",
        filename: "src/screens/core/activity-screen.tsx",
        libraries: ["react-native-reanimated", "expo-haptics", "lucide-react-native"],
      },
    ],
  },
  {
    slug: "search-and-filters",
    title: "Search & filters",
    domain: "core",
    description:
      "Instant mobile search experience with recent history chips paired with a multi-facet bottom filter sheet.",
    libraries: ["react-native-reanimated", "expo-haptics", "lucide-react-native"],
    variants: [
      {
        slug: "search-screen",
        name: "Search Screen",
        kind: "Screen",
        description:
          "Live query input with removable history tags, trending categories, and instant filtered result rows.",
        previewKey: "mobile/search-and-filters/search-screen",
        filename: "src/screens/core/search-screen.tsx",
        libraries: ["react-native-reanimated", "lucide-react-native"],
      },
      {
        slug: "filter-sheet",
        name: "Filter Sheet",
        kind: "Block",
        description:
          "Structured facet drawer with sort selector, multi-select tags, price range presets, and dynamic result counter CTA.",
        previewKey: "mobile/search-and-filters/filter-sheet",
        filename: "src/blocks/core/filter-sheet.tsx",
        libraries: ["react-native-reanimated", "expo-haptics", "lucide-react-native"],
      },
    ],
  },
  {
    slug: "ecommerce",
    title: "Ecommerce",
    domain: "core",
    description:
      "End-to-end mobile storefront flow: product detail configurator, interactive bag with stepper, Apple Pay checkout sheet, and live parcel tracking.",
    libraries: ["react-native-reanimated", "expo-haptics", "lucide-react-native"],
    variants: [
      {
        slug: "product-detail",
        name: "Product Detail",
        kind: "Screen",
        description:
          "Gallery pager, color swatch & size pills, wishlist heart toggle, and persistent Add to Bag footer.",
        previewKey: "mobile/ecommerce/product-detail",
        filename: "src/screens/commerce/product-detail.tsx",
        libraries: ["react-native-reanimated", "expo-haptics", "lucide-react-native"],
      },
      {
        slug: "bag",
        name: "Bag",
        kind: "Screen",
        description:
          "Cart items with quantity steppers, promo code apply pill, itemized subtotal/shipping, and checkout button.",
        previewKey: "mobile/ecommerce/bag",
        filename: "src/screens/commerce/bag.tsx",
        libraries: ["react-native-reanimated", "expo-haptics", "lucide-react-native"],
      },
      {
        slug: "checkout-sheet",
        name: "Checkout Sheet",
        kind: "Block",
        description:
          "Compact confirmation sheet displaying delivery address, Express Pay card selector, and Slide-to-Pay / Confirm action.",
        previewKey: "mobile/ecommerce/checkout-sheet",
        filename: "src/blocks/commerce/checkout-sheet.tsx",
        libraries: ["react-native-reanimated", "expo-haptics", "lucide-react-native"],
      },
      {
        slug: "order-tracking",
        name: "Order Tracking",
        kind: "Screen",
        description:
          "Real-time shipment progress bar with courier map preview, ETA window, and timestamped delivery milestones.",
        previewKey: "mobile/ecommerce/order-tracking",
        filename: "src/screens/commerce/order-tracking.tsx",
        libraries: ["react-native-reanimated", "lucide-react-native"],
      },
    ],
  },
  {
    slug: "wallet-and-passes",
    title: "Wallet & passes",
    domain: "finance",
    description:
      "Layered digital pass stack that fans apart smoothly on selection plus a high-contrast flight boarding pass with gate alerts.",
    libraries: ["react-native-reanimated", "expo-haptics", "lucide-react-native"],
    variants: [
      {
        slug: "wallet-screen",
        name: "Wallet Screen",
        kind: "Screen",
        description:
          "Accordion pass stack where tapping any card promotes it to active view with quick QR barcode preview.",
        previewKey: "mobile/wallet-and-passes/wallet-screen",
        filename: "src/screens/finance/wallet-screen.tsx",
        libraries: ["react-native-reanimated", "expo-haptics", "lucide-react-native"],
      },
      {
        slug: "boarding-pass",
        name: "Boarding Pass",
        kind: "Screen",
        description:
          "Perforated ticket layout showing flight route codes, gate/seat/boarding group badges, and brightness boost toggle.",
        previewKey: "mobile/wallet-and-passes/boarding-pass",
        filename: "src/screens/finance/boarding-pass.tsx",
        libraries: ["react-native-reanimated", "lucide-react-native"],
      },
    ],
  },
  {
    slug: "tab-bars",
    title: "Tab bars",
    domain: "core",
    description:
      "Floating pill bottom tab bar with spring indicator and horizontal scrolling category tabs with active underline pill.",
    libraries: ["react-native-reanimated", "expo-haptics", "lucide-react-native"],
    variants: [
      {
        slug: "tab-bar",
        name: "Tab Bar",
        kind: "Block",
        description:
          "Glassmorphic bottom dock with spring active pill, notification badge counter, and haptic selection feedback.",
        previewKey: "mobile/tab-bars/tab-bar",
        filename: "src/blocks/navigation/tab-bar.tsx",
        libraries: ["react-native-reanimated", "expo-haptics", "lucide-react-native"],
      },
      {
        slug: "scroll-tabs",
        name: "Scroll Tabs",
        kind: "Block",
        description:
          "Horizontal scrollable segmented filter bar keeping the active tab pill centered while content swaps smoothly.",
        previewKey: "mobile/tab-bars/scroll-tabs",
        filename: "src/blocks/navigation/scroll-tabs.tsx",
        libraries: ["react-native-reanimated", "lucide-react-native"],
      },
    ],
  },
  {
    slug: "headers-and-menus",
    title: "Headers & menus",
    domain: "core",
    description:
      "Native-style large title collapsing header on scroll and contextual action menu popover anchored to top-right controls.",
    libraries: ["react-native-reanimated", "expo-haptics", "lucide-react-native"],
    variants: [
      {
        slug: "collapsing-header",
        name: "Collapsing Header",
        kind: "Block",
        description:
          "Scroll-reactive header interpolating large title scale and sticky compact title blur as list items scroll.",
        previewKey: "mobile/headers-and-menus/collapsing-header",
        filename: "src/blocks/navigation/collapsing-header.tsx",
        libraries: ["react-native-reanimated", "lucide-react-native"],
      },
      {
        slug: "action-menu",
        name: "Action Menu",
        kind: "Block",
        description:
          "Origin-anchored spring popover menu with checkmark toggles, keyboard/haptic actions, and destructive section.",
        previewKey: "mobile/headers-and-menus/action-menu",
        filename: "src/blocks/navigation/action-menu.tsx",
        libraries: ["react-native-reanimated", "expo-haptics", "lucide-react-native"],
      },
    ],
  },
];

export const MOBILE_SCREEN_GROUP_COUNT = MOBILE_SCREEN_GROUPS.length;
export const MOBILE_SCREEN_VARIANT_COUNT = MOBILE_SCREEN_GROUPS.reduce(
  (sum, group) => sum + group.variants.length,
  0,
);

export function findMobileScreenGroup(slug: string): MobileScreenGroup | undefined {
  return MOBILE_SCREEN_GROUPS.find((group) => group.slug === slug);
}

export function adjacentMobileScreenGroups(slug: string) {
  const index = MOBILE_SCREEN_GROUPS.findIndex((group) => group.slug === slug);
  if (index === -1) return { prev: undefined, next: undefined };
  return {
    prev: MOBILE_SCREEN_GROUPS[index - 1],
    next: MOBILE_SCREEN_GROUPS[index + 1],
  };
}
