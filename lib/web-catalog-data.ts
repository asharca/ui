import type { WebCatalogFamily } from "@/lib/web-catalog";

/** Independent public Web compositions; original catalog entries remain authoritative. */
export const webCatalogFamilies: WebCatalogFamily[] = [
  {
    "publicSlug": "illustration-app-preview",
    "category": "motion",
    "entry": {
      "slug": "illustration-app-preview",
      "name": "App Preview",
      "description": "Three distinct mobile compositions: configurable portfolio with asset inspection, callback-driven assistant, and controlled social feed.",
      "file": "components/motion/illustration-app-preview.tsx",
      "extraFiles": [
        "components/motion/illustration-product-scene.tsx"
      ],
      "examples": [
        { "slug": "illustration-1", "name": "Portfolio phone", "description": "A cropped mobile portfolio with supplied balances, a compact history line, and selectable assets.", "file": "components/motion/illustration-app-preview.tsx", "previewKey": "motion/illustration-app-preview-illustration-1", "previewFile": "components/previews/motion/illustration-app-preview-illustration-1.preview.tsx", "author": "asharca",
        "badge": "new",
        "launchedAt": "2026-11-04",
        "installSlug": "illustration-app-preview" },
        { "slug": "illustration-2", "name": "Assistant phone", "description": "A cropped assistant screen with prompt, thinking state, launch-plan response, steps and a follow-up composer.", "file": "components/motion/illustration-app-preview.tsx", "previewKey": "motion/illustration-app-preview-illustration-2", "previewFile": "components/previews/motion/illustration-app-preview-illustration-2.preview.tsx", "author": "asharca",
        "badge": "new",
        "launchedAt": "2026-11-04",
        "installSlug": "illustration-app-preview-illustration-2" },
        { "slug": "illustration-3", "name": "Social phone", "description": "A cropped social feed with stories, post artwork, likes and saved-post controls.", "file": "components/motion/illustration-app-preview.tsx", "previewKey": "motion/illustration-app-preview-illustration-3", "previewFile": "components/previews/motion/illustration-app-preview-illustration-3.preview.tsx", "author": "asharca",
        "badge": "new",
        "launchedAt": "2026-11-04",
        "installSlug": "illustration-app-preview-illustration-3" }
      ],
      "author": "asharca",
      "credit": {
        "name": "Asharca",
        "url": "https://github.com/asharca/ui"
      },
      "badge": "new",
      "launchedAt": "2026-11-04"
    }
  },
  {
    "publicSlug": "illustration-chat-exchange",
    "category": "motion",
    "entry": {
      "slug": "illustration-chat-exchange",
      "name": "AI & Chat",
      "description": "Original conversation, source-led research, and creative generation illustrations with host-provided asynchronous results.",
      "file": "components/motion/illustration-chat-exchange.tsx",
      "extraFiles": [
        "components/motion/illustration-product-scene.tsx"
      ],
      "examples": [
        { "slug": "illustration-1", "name": "Assistant conversation", "description": "A launch-brief message, assistant progress, response, steps and artifact chips.", "file": "components/motion/illustration-chat-exchange.tsx", "previewKey": "motion/illustration-chat-exchange-illustration-1", "previewFile": "components/previews/motion/illustration-chat-exchange-illustration-1.preview.tsx", "author": "asharca",
        "badge": "new",
        "launchedAt": "2026-11-04",
        "installSlug": "illustration-chat-exchange" },
        { "slug": "illustration-2", "name": "Research composer", "description": "A large AI composer with research prompt, web-search state and send control.", "file": "components/motion/illustration-chat-exchange.tsx", "previewKey": "motion/illustration-chat-exchange-illustration-2", "previewFile": "components/previews/motion/illustration-chat-exchange-illustration-2.preview.tsx", "author": "asharca",
        "badge": "new",
        "launchedAt": "2026-11-04",
        "installSlug": "illustration-chat-exchange-illustration-2" },
        { "slug": "illustration-3", "name": "Prompt roller", "description": "A vertically rolling collection of large AI prompts around one active selection.", "file": "components/motion/illustration-chat-exchange.tsx", "previewKey": "motion/illustration-chat-exchange-illustration-3", "previewFile": "components/previews/motion/illustration-chat-exchange-illustration-3.preview.tsx", "author": "asharca",
        "badge": "new",
        "launchedAt": "2026-11-04",
        "installSlug": "illustration-chat-exchange-illustration-3" }
      ],
      "author": "asharca",
      "credit": {
        "name": "Asharca",
        "url": "https://github.com/asharca/ui"
      },
      "badge": "new",
      "launchedAt": "2026-11-04"
    }
  },
  {
    "publicSlug": "illustration-payments",
    "category": "motion",
    "entry": {
      "slug": "illustration-payments",
      "name": "Payments & Checkout",
      "description": "Checkout confirmation and incoming-payment stream concepts; all financial outcomes and amounts come from the host.",
      "file": "components/motion/illustration-payments.tsx",
      "extraFiles": [
        "components/motion/illustration-product-scene.tsx"
      ],
      "examples": [
        { "slug": "illustration-1", "name": "Checkout and receipt", "description": "An itemized product checkout with payment method, amount, pending button, confirmation and receipt notice.", "file": "components/motion/illustration-payments.tsx", "previewKey": "motion/illustration-payments-illustration-1", "previewFile": "components/previews/motion/illustration-payments-illustration-1.preview.tsx", "author": "asharca",
        "badge": "new",
        "launchedAt": "2026-11-04",
        "installSlug": "illustration-payments" },
        { "slug": "illustration-2", "name": "Incoming payment feed", "description": "An available-balance card with a vertically arriving payment feed.", "file": "components/motion/illustration-payments.tsx", "previewKey": "motion/illustration-payments-illustration-2", "previewFile": "components/previews/motion/illustration-payments-illustration-2.preview.tsx", "author": "asharca",
        "badge": "new",
        "launchedAt": "2026-11-04",
        "installSlug": "illustration-payments-illustration-2" }
      ],
      "author": "asharca",
      "credit": {
        "name": "Asharca",
        "url": "https://github.com/asharca/ui"
      },
      "badge": "new",
      "launchedAt": "2026-11-04"
    }
  },
  {
    "publicSlug": "illustration-security",
    "category": "motion",
    "entry": {
      "slug": "illustration-security",
      "name": "Security & Auth",
      "description": "Threat scan and verification/unlock concepts with explicit non-security disclaimers and host-supplied results.",
      "file": "components/motion/illustration-security.tsx",
      "extraFiles": [
        "components/motion/illustration-product-scene.tsx"
      ],
      "examples": [
        { "slug": "illustration-1", "name": "Threat scan", "description": "A shield and sweep line surrounded by incoming threat labels.", "file": "components/motion/illustration-security.tsx", "previewKey": "motion/illustration-security-illustration-1", "previewFile": "components/previews/motion/illustration-security-illustration-1.preview.tsx", "author": "asharca",
        "badge": "new",
        "launchedAt": "2026-11-04",
        "installSlug": "illustration-security" },
        { "slug": "illustration-2", "name": "Six-digit verification", "description": "A compact verification card with six code slots and a verified lock state.", "file": "components/motion/illustration-security.tsx", "previewKey": "motion/illustration-security-illustration-2", "previewFile": "components/previews/motion/illustration-security-illustration-2.preview.tsx", "author": "asharca",
        "badge": "new",
        "launchedAt": "2026-11-04",
        "installSlug": "illustration-security-illustration-2" }
      ],
      "author": "asharca",
      "credit": {
        "name": "Asharca",
        "url": "https://github.com/asharca/ui"
      },
      "badge": "new",
      "launchedAt": "2026-11-04"
    }
  },
  {
    "publicSlug": "illustration-metrics",
    "category": "motion",
    "entry": {
      "slug": "illustration-metrics",
      "name": "Metrics & Growth",
      "description": "Configurable range-switching, accessible scrubbable trends and data-backed conversion funnel compositions.",
      "file": "components/motion/illustration-metrics.tsx",
      "extraFiles": [
        "components/motion/illustration-product-scene.tsx"
      ],
      "examples": [
        { "slug": "illustration-1", "name": "Revenue trend", "description": "A compact revenue card with range controls, total, change, history line and value inspection.", "file": "components/motion/illustration-metrics.tsx", "previewKey": "motion/illustration-metrics-illustration-1", "previewFile": "components/previews/motion/illustration-metrics-illustration-1.preview.tsx", "author": "asharca",
        "badge": "new",
        "launchedAt": "2026-11-04",
        "installSlug": "illustration-metrics" },
        { "slug": "illustration-2", "name": "Conversion funnel", "description": "A colored, tapered conversion funnel with stage counts, drop-off context and overall conversion.", "file": "components/motion/illustration-metrics.tsx", "previewKey": "motion/illustration-metrics-illustration-2", "previewFile": "components/previews/motion/illustration-metrics-illustration-2.preview.tsx", "author": "asharca",
        "badge": "new",
        "launchedAt": "2026-11-04",
        "installSlug": "illustration-metrics-illustration-2" }
      ],
      "author": "asharca",
      "credit": {
        "name": "Asharca",
        "url": "https://github.com/asharca/ui"
      },
      "badge": "new",
      "launchedAt": "2026-11-04"
    }
  },
  {
    "publicSlug": "illustration-voice-note",
    "category": "motion",
    "entry": {
      "slug": "illustration-voice-note",
      "name": "Voice Note",
      "description": "Perspective memo stack, input-matched waveform and transcript state, with explicitly silent concept animation or host-provided audio playback.",
      "file": "components/motion/illustration-voice-note.tsx",
      "extraFiles": [
        "components/motion/illustration-product-scene.tsx"
      ],
      "examples": [
        { "slug": "voice-note", "name": "Perspective voice note", "description": "A rotated transcript card sits above a green audio-player pill and waveform.", "file": "components/motion/illustration-voice-note.tsx", "previewKey": "motion/illustration-voice-note-voice-note", "previewFile": "components/previews/motion/illustration-voice-note-voice-note.preview.tsx", "author": "asharca",
        "badge": "new",
        "launchedAt": "2026-11-04",
        "installSlug": "illustration-voice-note" }
      ],
      "author": "asharca",
      "credit": {
        "name": "Asharca",
        "url": "https://github.com/asharca/ui"
      },
      "badge": "new",
      "launchedAt": "2026-11-04"
    }
  },
  {
    "publicSlug": "pricing",
    "category": "blocks",
    "entry": {
      "slug": "pricing",
      "name": "Pricing",
      "description": "Eleven original pricing compositions with host-owned rates, consistent minor-unit calculations, billing controls and real checkout callbacks.",
      "file": "components/motion/pricing.tsx",
      "examples": [
        {
          "slug": "ai-pricing",
          "name": "AI pricing",
          "description": "Free, Pro and Team cards with explicit 5×/20× Pro rates and monthly/yearly billing.",
          "file": "components/motion/pricing.tsx",
          "previewKey": "blocks/pricing-ai-pricing",
          "previewFile": "components/previews/blocks/pricing-ai-pricing.preview.tsx",
          "usageFile": "components/previews/blocks/pricing-ai-pricing.preview.tsx",
          "author": "asharca",
          "badge": "new",
          "launchedAt": "2026-11-04",
          "installSlug": "pricing"
        },
        {
          "slug": "shared-benefits",
          "name": "Shared benefits",
          "description": "Banner and shared benefits beside radio-selectable plans and a live billing summary.",
          "file": "components/motion/pricing.tsx",
          "previewKey": "blocks/pricing-shared-benefits",
          "previewFile": "components/previews/blocks/pricing-shared-benefits.preview.tsx",
          "usageFile": "components/previews/blocks/pricing-shared-benefits.preview.tsx",
          "author": "asharca",
          "badge": "new",
          "launchedAt": "2026-11-04",
          "installSlug": "pricing-shared-benefits"
        },
        {
          "slug": "team-calculator",
          "name": "Team calculator",
          "description": "Seat slider and numeric input with host-defined volume discounts and a transparent estimate.",
          "file": "components/motion/pricing.tsx",
          "previewKey": "blocks/pricing-team-calculator",
          "previewFile": "components/previews/blocks/pricing-team-calculator.preview.tsx",
          "usageFile": "components/previews/blocks/pricing-team-calculator.preview.tsx",
          "author": "asharca",
          "badge": "new",
          "launchedAt": "2026-11-04",
          "installSlug": "pricing-team-calculator"
        },
        {
          "slug": "aurora-duo",
          "name": "Aurora duo",
          "description": "Compact two-plan comparison with billing switch and a WebGL-enhanced featured card.",
          "file": "components/motion/pricing.tsx",
          "previewKey": "blocks/pricing-aurora-duo",
          "previewFile": "components/previews/blocks/pricing-aurora-duo.preview.tsx",
          "usageFile": "components/previews/blocks/pricing-aurora-duo.preview.tsx",
          "author": "asharca",
          "badge": "new",
          "launchedAt": "2026-11-04",
          "installSlug": "pricing-aurora-duo"
        },
        {
          "slug": "aurora-flow",
          "name": "Aurora flow",
          "description": "Single lifetime offer with animated benefit reveal, one-time price and real host action.",
          "file": "components/motion/pricing.tsx",
          "previewKey": "blocks/pricing-aurora-flow",
          "previewFile": "components/previews/blocks/pricing-aurora-flow.preview.tsx",
          "usageFile": "components/previews/blocks/pricing-aurora-flow.preview.tsx",
          "author": "asharca",
          "badge": "new",
          "launchedAt": "2026-11-04",
          "installSlug": "pricing-aurora-flow"
        },
        {
          "slug": "visual-plans",
          "name": "Visual plans",
          "description": "Original animated artwork headers and distinct self-serve and guided plan actions.",
          "file": "components/motion/pricing.tsx",
          "previewKey": "blocks/pricing-visual-plans",
          "previewFile": "components/previews/blocks/pricing-visual-plans.preview.tsx",
          "usageFile": "components/previews/blocks/pricing-visual-plans.preview.tsx",
          "author": "asharca",
          "badge": "new",
          "launchedAt": "2026-11-04",
          "installSlug": "pricing-visual-plans"
        },
        {
          "slug": "pricing-command-deck",
          "name": "Pricing command deck",
          "description": "Three-plan technical deck with monospaced price panels and annual savings.",
          "file": "components/motion/pricing.tsx",
          "previewKey": "blocks/pricing-pricing-command-deck",
          "previewFile": "components/previews/blocks/pricing-pricing-command-deck.preview.tsx",
          "usageFile": "components/previews/blocks/pricing-pricing-command-deck.preview.tsx",
          "author": "asharca",
          "badge": "new",
          "launchedAt": "2026-11-04",
          "installSlug": "pricing-pricing-command-deck"
        },
        {
          "slug": "upgrade-panel",
          "name": "Upgrade panel",
          "description": "Layered draggable plan card with dot and keyboard navigation, segmented plans, billing and editor stepper, and real host-owned upgrade action.",
          "file": "components/motion/pricing.tsx",
          "previewKey": "blocks/pricing-upgrade-panel",
          "previewFile": "components/previews/blocks/pricing-upgrade-panel.preview.tsx",
          "usageFile": "components/previews/blocks/pricing-upgrade-panel.preview.tsx",
          "author": "asharca",
          "badge": "new",
          "launchedAt": "2026-11-04",
          "installSlug": "pricing-upgrade-panel"
        },
        {
          "slug": "usage-slider",
          "name": "Usage slider",
          "description": "Existing snapping RangeSlider maps host metered tiers to monthly and annual totals.",
          "file": "components/motion/pricing.tsx",
          "previewKey": "blocks/pricing-usage-slider",
          "previewFile": "components/previews/blocks/pricing-usage-slider.preview.tsx",
          "usageFile": "components/previews/blocks/pricing-usage-slider.preview.tsx",
          "author": "asharca",
          "badge": "new",
          "launchedAt": "2026-11-04",
          "installSlug": "pricing-usage-slider"
        },
        {
          "slug": "plans-grid",
          "name": "Plans grid",
          "description": "Centered plan comparison with billing switch, annual reference rates, savings and featured aurora.",
          "file": "components/motion/pricing.tsx",
          "previewKey": "blocks/pricing-plans-grid",
          "previewFile": "components/previews/blocks/pricing-plans-grid.preview.tsx",
          "usageFile": "components/previews/blocks/pricing-plans-grid.preview.tsx",
          "author": "asharca",
          "badge": "new",
          "launchedAt": "2026-11-04",
          "installSlug": "pricing-plans-grid"
        },
        {
          "slug": "pricing-ledger",
          "name": "Pricing ledger",
          "description": "Base-plus-seat pricing ledger with plan and billing selection, included-seat allowance, extra-seat line items, monthly equivalents and host-owned checkout.",
          "file": "components/motion/pricing.tsx",
          "previewKey": "blocks/pricing-pricing-ledger",
          "previewFile": "components/previews/blocks/pricing-pricing-ledger.preview.tsx",
          "usageFile": "components/previews/blocks/pricing-pricing-ledger.preview.tsx",
          "author": "asharca",
          "badge": "new",
          "launchedAt": "2026-11-04",
          "installSlug": "pricing-pricing-ledger"
        }
      ],
      "author": "asharca",
      "credit": {
        "name": "Asharca",
        "url": "https://github.com/asharca/ui"
      },
      "badge": "new",
      "launchedAt": "2026-11-04"
    }
  },
  {
    "publicSlug": "footer-sections",
    "category": "blocks",
    "entry": {
      "slug": "footer-sections",
      "name": "Footer Sections",
      "description": "Nine original responsive footer compositions with externalized content, real navigation, local time, pointer spotlight and host-owned newsletter submission.",
      "file": "components/motion/footer-sections.tsx",
      "examples": [
        {
          "slug": "panorama-footer",
          "name": "Panorama footer",
          "description": "Original coastal vector artwork, closing message, host actions, social links and legal row.",
          "file": "components/motion/footer-sections.tsx",
          "previewKey": "blocks/footer-sections-panorama-footer",
          "previewFile": "components/previews/blocks/footer-sections-panorama-footer.preview.tsx",
          "usageFile": "components/previews/blocks/footer-sections-panorama-footer.preview.tsx",
          "author": "asharca",
          "badge": "new",
          "launchedAt": "2026-11-04",
          "installSlug": "footer-sections"
        },
        {
          "slug": "wordmark-footer",
          "name": "Wordmark footer",
          "description": "Rounded statement and link panel above an oversized theme-tinted wordmark.",
          "file": "components/motion/footer-sections.tsx",
          "previewKey": "blocks/footer-sections-wordmark-footer",
          "previewFile": "components/previews/blocks/footer-sections-wordmark-footer.preview.tsx",
          "usageFile": "components/previews/blocks/footer-sections-wordmark-footer.preview.tsx",
          "author": "asharca",
          "badge": "new",
          "launchedAt": "2026-11-04",
          "installSlug": "footer-sections-wordmark-footer"
        },
        {
          "slug": "landscape-footer",
          "name": "Landscape footer",
          "description": "Brand and five-column navigation above a faded original landscape.",
          "file": "components/motion/footer-sections.tsx",
          "previewKey": "blocks/footer-sections-landscape-footer",
          "previewFile": "components/previews/blocks/footer-sections-landscape-footer.preview.tsx",
          "usageFile": "components/previews/blocks/footer-sections-landscape-footer.preview.tsx",
          "author": "asharca",
          "badge": "new",
          "launchedAt": "2026-11-04",
          "installSlug": "footer-sections-landscape-footer"
        },
        {
          "slug": "studio-footer",
          "name": "Studio footer",
          "description": "Independent studio footer with a prominent email link, host primary navigation, side landscape image and optional location captions.",
          "file": "components/motion/footer-sections.tsx",
          "previewKey": "blocks/footer-sections-studio-footer",
          "previewFile": "components/previews/blocks/footer-sections-studio-footer.preview.tsx",
          "usageFile": "components/previews/blocks/footer-sections-studio-footer.preview.tsx",
          "author": "asharca",
          "badge": "new",
          "launchedAt": "2026-11-04",
          "installSlug": "footer-sections-studio-footer"
        },
        {
          "slug": "local-time-footer",
          "name": "Local time footer",
          "description": "Two-group footer with an analog city clock, actual timezone date, and large live hour, minute and second display.",
          "file": "components/motion/footer-sections.tsx",
          "previewKey": "blocks/footer-sections-local-time-footer",
          "previewFile": "components/previews/blocks/footer-sections-local-time-footer.preview.tsx",
          "usageFile": "components/previews/blocks/footer-sections-local-time-footer.preview.tsx",
          "author": "asharca",
          "badge": "new",
          "launchedAt": "2026-11-04",
          "installSlug": "footer-sections-local-time-footer"
        },
        {
          "slug": "gradient-frame-footer",
          "name": "Gradient frame footer",
          "description": "Theme-native gradient frame around grouped navigation and compact legal links.",
          "file": "components/motion/footer-sections.tsx",
          "previewKey": "blocks/footer-sections-gradient-frame-footer",
          "previewFile": "components/previews/blocks/footer-sections-gradient-frame-footer.preview.tsx",
          "usageFile": "components/previews/blocks/footer-sections-gradient-frame-footer.preview.tsx",
          "author": "asharca",
          "badge": "new",
          "launchedAt": "2026-11-04",
          "installSlug": "footer-sections-gradient-frame-footer"
        },
        {
          "slug": "spotlight-footer",
          "name": "Spotlight footer",
          "description": "Outlined giant wordmark with a pointer-following fill gated by hover and reduced-motion preferences.",
          "file": "components/motion/footer-sections.tsx",
          "previewKey": "blocks/footer-sections-spotlight-footer",
          "previewFile": "components/previews/blocks/footer-sections-spotlight-footer.preview.tsx",
          "usageFile": "components/previews/blocks/footer-sections-spotlight-footer.preview.tsx",
          "author": "asharca",
          "badge": "new",
          "launchedAt": "2026-11-04",
          "installSlug": "footer-sections-spotlight-footer"
        },
        {
          "slug": "mega-footer",
          "name": "Mega footer",
          "description": "Link-rich navigation, host status link and asynchronous newsletter with pending, success and error states.",
          "file": "components/motion/footer-sections.tsx",
          "previewKey": "blocks/footer-sections-mega-footer",
          "previewFile": "components/previews/blocks/footer-sections-mega-footer.preview.tsx",
          "usageFile": "components/previews/blocks/footer-sections-mega-footer.preview.tsx",
          "author": "asharca",
          "badge": "new",
          "launchedAt": "2026-11-04",
          "installSlug": "footer-sections-mega-footer"
        },
        {
          "slug": "directory-footer",
          "name": "Directory footer",
          "description": "Compact brand and two-group navigation panel with separate legal row.",
          "file": "components/motion/footer-sections.tsx",
          "previewKey": "blocks/footer-sections-directory-footer",
          "previewFile": "components/previews/blocks/footer-sections-directory-footer.preview.tsx",
          "usageFile": "components/previews/blocks/footer-sections-directory-footer.preview.tsx",
          "author": "asharca",
          "badge": "new",
          "launchedAt": "2026-11-04",
          "installSlug": "footer-sections-directory-footer"
        }
      ],
      "author": "asharca",
      "credit": {
        "name": "Asharca",
        "url": "https://github.com/asharca/ui"
      },
      "badge": "new",
      "launchedAt": "2026-11-04"
    }
  },
  {
    "publicSlug": "ai-thinking-loader",
    "category": "motion",
    "entry": {
      "slug": "ai-thinking-loader",
      "name": "AI Thinking Loaders",
      "description": "Six distinct pixel and node structures with host-owned thinking, stopped and complete states.",
      "file": "components/motion/ai-thinking-patterns.tsx",
      "examples": [
        {
          "slug": "pixel-orbit",
          "name": "Pixel orbit",
          "description": "Six distinct pixel and node structures with host-owned thinking, stopped and complete states.",
          "file": "components/motion/ai-thinking-patterns.tsx",
          "previewKey": "AIThinkingLoaderPixelOrbitPreview",
          "previewFile": "components/previews/motion/ai-thinking-loader-pixel-orbit.preview.tsx",
          "usageFile": "components/previews/motion/ai-thinking-loader-pixel-orbit.preview.tsx",
          "author": "asharca",
          "badge": "new",
          "launchedAt": "2026-11-04",
          "installSlug": "ai-thinking-loader"
        },
        {
          "slug": "grid-scan",
          "name": "Grid scan",
          "description": "Six distinct pixel and node structures with host-owned thinking, stopped and complete states.",
          "file": "components/motion/ai-thinking-patterns.tsx",
          "previewKey": "AIThinkingLoaderGridScanPreview",
          "previewFile": "components/previews/motion/ai-thinking-loader-grid-scan.preview.tsx",
          "usageFile": "components/previews/motion/ai-thinking-loader-grid-scan.preview.tsx",
          "author": "asharca",
          "badge": "new",
          "launchedAt": "2026-11-04",
          "installSlug": "ai-thinking-loader-grid-scan"
        },
        {
          "slug": "diagonal-wave",
          "name": "Diagonal wave",
          "description": "Six distinct pixel and node structures with host-owned thinking, stopped and complete states.",
          "file": "components/motion/ai-thinking-patterns.tsx",
          "previewKey": "AIThinkingLoaderDiagonalWavePreview",
          "previewFile": "components/previews/motion/ai-thinking-loader-diagonal-wave.preview.tsx",
          "usageFile": "components/previews/motion/ai-thinking-loader-diagonal-wave.preview.tsx",
          "author": "asharca",
          "badge": "new",
          "launchedAt": "2026-11-04",
          "installSlug": "ai-thinking-loader-diagonal-wave"
        },
        {
          "slug": "assembling-tiles",
          "name": "Assembling tiles",
          "description": "Six distinct pixel and node structures with host-owned thinking, stopped and complete states.",
          "file": "components/motion/ai-thinking-patterns.tsx",
          "previewKey": "AIThinkingLoaderAssemblingTilesPreview",
          "previewFile": "components/previews/motion/ai-thinking-loader-assembling-tiles.preview.tsx",
          "usageFile": "components/previews/motion/ai-thinking-loader-assembling-tiles.preview.tsx",
          "author": "asharca",
          "badge": "new",
          "launchedAt": "2026-11-04",
          "installSlug": "ai-thinking-loader-assembling-tiles"
        },
        {
          "slug": "diamond-loop",
          "name": "Diamond loop",
          "description": "Six distinct pixel and node structures with host-owned thinking, stopped and complete states.",
          "file": "components/motion/ai-thinking-patterns.tsx",
          "previewKey": "AIThinkingLoaderDiamondLoopPreview",
          "previewFile": "components/previews/motion/ai-thinking-loader-diamond-loop.preview.tsx",
          "usageFile": "components/previews/motion/ai-thinking-loader-diamond-loop.preview.tsx",
          "author": "asharca",
          "badge": "new",
          "launchedAt": "2026-11-04",
          "installSlug": "ai-thinking-loader-diamond-loop"
        },
        {
          "slug": "connected-nodes",
          "name": "Connected nodes",
          "description": "Six distinct pixel and node structures with host-owned thinking, stopped and complete states.",
          "file": "components/motion/ai-thinking-patterns.tsx",
          "previewKey": "AIThinkingLoaderConnectedNodesPreview",
          "previewFile": "components/previews/motion/ai-thinking-loader-connected-nodes.preview.tsx",
          "usageFile": "components/previews/motion/ai-thinking-loader-connected-nodes.preview.tsx",
          "author": "asharca",
          "badge": "new",
          "launchedAt": "2026-11-04",
          "installSlug": "ai-thinking-loader-connected-nodes"
        }
      ],
      "author": "asharca",
      "credit": {
        "name": "Asharca",
        "url": "https://github.com/asharca/ui"
      },
      "badge": "new",
      "launchedAt": "2026-11-04"
    }
  },
  {
    "publicSlug": "animated-text",
    "category": "motion",
    "existingEntrySlug": "text-animation",
    "entry": {
      "slug": "text-animation",
      "name": "Animated Text Treatments",
      "description": "Alternating letter hover labels, a cycling phrase marker and accumulating blur highlights.",
      "file": "components/motion/animated-text-treatments.tsx",
      "examples": [
        {
          "slug": "animated-text-alternating-text-swap",
          "name": "Alternating text swap",
          "description": "Alternating letter hover labels, a cycling phrase marker and accumulating blur highlights.",
          "file": "components/motion/animated-text-treatments.tsx",
          "previewKey": "AlternatingTextSwapPreview",
          "previewFile": "components/previews/motion/animated-text-alternating-text-swap.preview.tsx",
          "usageFile": "components/previews/motion/animated-text-alternating-text-swap.preview.tsx",
          "author": "asharca",
          "badge": "new",
          "launchedAt": "2026-11-04",
          "installSlug": "animated-text-alternating-text-swap"
        },
        {
          "slug": "animated-text-blur-highlight",
          "name": "Blur highlight",
          "description": "Alternating letter hover labels, a cycling phrase marker and accumulating blur highlights.",
          "file": "components/motion/animated-text-treatments.tsx",
          "previewKey": "BlurHighlightPreview",
          "previewFile": "components/previews/motion/animated-text-blur-highlight.preview.tsx",
          "usageFile": "components/previews/motion/animated-text-blur-highlight.preview.tsx",
          "author": "asharca",
          "badge": "new",
          "launchedAt": "2026-11-04",
          "installSlug": "animated-text-blur-highlight"
        },
        {
          "slug": "animated-text-progressive-blur-highlight",
          "name": "Progressive blur highlight",
          "description": "Alternating letter hover labels, a cycling phrase marker and accumulating blur highlights.",
          "file": "components/motion/animated-text-treatments.tsx",
          "previewKey": "ProgressiveBlurHighlightPreview",
          "previewFile": "components/previews/motion/animated-text-progressive-blur-highlight.preview.tsx",
          "usageFile": "components/previews/motion/animated-text-progressive-blur-highlight.preview.tsx",
          "author": "asharca",
          "badge": "new",
          "launchedAt": "2026-11-04",
          "installSlug": "animated-text-progressive-blur-highlight"
        }
      ]
    }
  },
  {
    "publicSlug": "flip-card",
    "category": "motion",
    "entry": {
      "slug": "flip-card",
      "name": "Flip Card",
      "description": "Independent two-sided artwork cards and a shared-layout, focus-managed modal flip.",
      "file": "components/motion/flip-cards.tsx",
      "extraFiles": [
        "components/motion/morphic-card-modal.tsx"
      ],
      "examples": [
        {
          "slug": "image-flip-cards",
          "name": "Image flip cards",
          "description": "Independent two-sided artwork cards and a shared-layout, focus-managed modal flip.",
          "file": "components/motion/flip-cards.tsx",
          "previewKey": "ImageFlipCardsPreview",
          "previewFile": "components/previews/motion/flip-card-image-flip-cards.preview.tsx",
          "usageFile": "components/previews/motion/flip-card-image-flip-cards.preview.tsx",
          "author": "asharca",
          "badge": "new",
          "launchedAt": "2026-11-04",
          "installSlug": "flip-card"
        },
        {
          "slug": "modal-flip-card",
          "name": "Modal flip card",
          "description": "Independent two-sided artwork cards and a shared-layout, focus-managed modal flip.",
          "file": "components/motion/flip-cards.tsx",
          "previewKey": "ModalFlipCardPreview",
          "previewFile": "components/previews/motion/flip-card-modal-flip-card.preview.tsx",
          "usageFile": "components/previews/motion/flip-card-modal-flip-card.preview.tsx",
          "author": "asharca",
          "badge": "new",
          "launchedAt": "2026-11-04",
          "installSlug": "flip-card-modal-flip-card"
        }
      ],
      "author": "asharca",
      "credit": {
        "name": "Asharca",
        "url": "https://github.com/asharca/ui"
      },
      "badge": "new",
      "launchedAt": "2026-11-04"
    }
  },
  {
    "publicSlug": "morphic-tooltip",
    "category": "motion",
    "entry": {
      "slug": "morphic-tooltip",
      "name": "Morphic Tooltip",
      "description": "A single tooltip surface glides and resizes between hover and keyboard focus targets.",
      "file": "components/motion/morphic-tooltip.tsx",
      "examples": [
        {
          "slug": "morphic-tooltip",
          "name": "Morphic Tooltip",
          "description": "A single tooltip surface glides and resizes between hover and keyboard focus targets.",
          "file": "components/motion/morphic-tooltip.tsx",
          "previewKey": "MorphicTooltipPreview",
          "previewFile": "components/previews/motion/morphic-tooltip-morphic-tooltip.preview.tsx",
          "usageFile": "components/previews/motion/morphic-tooltip-morphic-tooltip.preview.tsx",
          "author": "asharca",
          "badge": "new",
          "launchedAt": "2026-11-04",
          "installSlug": "morphic-tooltip"
        }
      ],
      "author": "asharca",
      "credit": {
        "name": "Asharca",
        "url": "https://github.com/asharca/ui"
      },
      "badge": "new",
      "launchedAt": "2026-11-04"
    }
  },
  {
    "publicSlug": "morphic-card-modal",
    "category": "motion",
    "entry": {
      "slug": "morphic-card-modal",
      "name": "Morphic Card Modal",
      "description": "Host-provided card content expands into a shared-layout dialog and returns to the same trigger.",
      "file": "components/motion/morphic-card-modal.tsx",
      "examples": [
        {
          "slug": "morphic-card-modal",
          "name": "Morphic Card Modal",
          "description": "Host-provided card content expands into a shared-layout dialog and returns to the same trigger.",
          "file": "components/motion/morphic-card-modal.tsx",
          "previewKey": "MorphicCardModalPreview",
          "previewFile": "components/previews/motion/morphic-card-modal-morphic-card-modal.preview.tsx",
          "usageFile": "components/previews/motion/morphic-card-modal-morphic-card-modal.preview.tsx",
          "author": "asharca",
          "badge": "new",
          "launchedAt": "2026-11-04",
          "installSlug": "morphic-card-modal"
        }
      ],
      "author": "asharca",
      "credit": {
        "name": "Asharca",
        "url": "https://github.com/asharca/ui"
      },
      "badge": "new",
      "launchedAt": "2026-11-04"
    }
  },
  {
    "publicSlug": "waitlist-pages",
    "category": "blocks",
    "entry": {
      "slug": "waitlist-pages",
      "name": "Waitlist Pages",
      "description": "Two complete launch compositions with validated host-connected signup, UTC countdowns and optional invitation links.",
      "file": "components/motion/waitlist-pages.tsx",
      "extraFiles": [
        "components/motion/product-page-signup.tsx"
      ],
      "examples": [
        {
          "slug": "early-access",
          "name": "Early access",
          "description": "Centered early-access signup with live launch timing and a staged host-supplied product preview.",
          "file": "components/motion/waitlist-pages.tsx",
          "previewKey": "blocks/waitlist-pages-early-access",
          "previewFile": "components/previews/blocks/waitlist-pages-early-access.preview.tsx",
          "author": "asharca",
          "badge": "new",
          "launchedAt": "2026-11-04",
          "installSlug": "waitlist-pages"
        },
        {
          "slug": "blueprint-launch",
          "name": "Blueprint launch",
          "description": "Typographic grid canvas with selected-word headline, invitation action and oversized live countdown.",
          "file": "components/motion/waitlist-pages.tsx",
          "previewKey": "blocks/waitlist-pages-blueprint-launch",
          "previewFile": "components/previews/blocks/waitlist-pages-blueprint-launch.preview.tsx",
          "author": "asharca",
          "badge": "new",
          "launchedAt": "2026-11-04",
          "installSlug": "waitlist-pages-blueprint-launch"
        }
      ],
      "author": "asharca",
      "credit": {
        "name": "Asharca",
        "url": "https://github.com/asharca/ui"
      },
      "badge": "new",
      "launchedAt": "2026-11-04"
    }
  },
  {
    "publicSlug": "status-pages",
    "category": "blocks",
    "entry": {
      "slug": "status-pages",
      "name": "Status Pages",
      "description": "Published service health, interactive uptime history, incident details and follow-up subscriptions with explicit UTC times.",
      "file": "components/motion/status-pages.tsx",
      "extraFiles": [
        "components/motion/product-page-signup.tsx",
        "components/motion/animated-badge.tsx"
      ],
      "examples": [
        {
          "slug": "status-overview",
          "name": "Status overview",
          "description": "Service-level health and day details, active/all incident history and a host-connected update subscription.",
          "file": "components/motion/status-pages.tsx",
          "previewKey": "blocks/status-pages-status-overview",
          "previewFile": "components/previews/blocks/status-pages-status-overview.preview.tsx",
          "author": "asharca",
          "badge": "new",
          "launchedAt": "2026-11-04",
          "installSlug": "status-pages"
        },
        {
          "slug": "incident-response",
          "name": "Incident response",
          "description": "Host-updated incident state, chronological publications, affected services/regions and incident-specific subscriptions.",
          "file": "components/motion/status-pages.tsx",
          "previewKey": "blocks/status-pages-incident-response",
          "previewFile": "components/previews/blocks/status-pages-incident-response.preview.tsx",
          "author": "asharca",
          "badge": "new",
          "launchedAt": "2026-11-04",
          "installSlug": "status-pages-incident-response"
        }
      ],
      "author": "asharca",
      "credit": {
        "name": "Asharca",
        "url": "https://github.com/asharca/ui"
      },
      "badge": "new",
      "launchedAt": "2026-11-04"
    }
  },
  {
    "publicSlug": "pricing-pages",
    "category": "blocks",
    "entry": {
      "slug": "pricing-pages",
      "name": "Pricing Pages",
      "description": "Per-editor plans with controlled billing, keyboard-accessible team-size guidance, live comparison and host-owned checkout.",
      "file": "components/motion/pricing-pages.tsx",
      "extraFiles": [
        "components/motion/range-slider-inline.tsx",
        "components/motion/switch.tsx",
        "lib/hooks/use-slider.ts",
        "lib/touch.ts"
      ],
      "examples": [
        {
          "slug": "plan-explorer",
          "name": "Plan explorer",
          "description": "Monthly/annual rates and exact team totals, slider-driven recommendation, focused plan comparison and billing FAQ.",
          "file": "components/motion/pricing-pages.tsx",
          "previewKey": "blocks/pricing-pages-plan-explorer",
          "previewFile": "components/previews/blocks/pricing-pages-plan-explorer.preview.tsx",
          "author": "asharca",
          "badge": "new",
          "launchedAt": "2026-11-04",
          "installSlug": "pricing-pages"
        }
      ],
      "author": "asharca",
      "credit": {
        "name": "Asharca",
        "url": "https://github.com/asharca/ui"
      },
      "badge": "new",
      "launchedAt": "2026-11-04"
    }
  },
  {
    "publicSlug": "search-pages",
    "category": "blocks",
    "entry": {
      "slug": "search-pages",
      "name": "Search Pages",
      "description": "Live-ranked grouped knowledge search with product/type filters, gliding keyboard selection, result previews, paging and optional scoped URL state.",
      "file": "components/motion/search-pages.tsx",
      "examples": [
        {
          "slug": "search-results",
          "name": "Search results",
          "description": "Real query ranking, match highlights, grouped results and preview with loading/error/empty states, suggestions and keyboard activation.",
          "file": "components/motion/search-pages.tsx",
          "previewKey": "blocks/search-pages-search-results",
          "previewFile": "components/previews/blocks/search-pages-search-results.preview.tsx",
          "author": "asharca",
          "badge": "new",
          "launchedAt": "2026-11-04",
          "installSlug": "search-pages"
        }
      ],
      "author": "asharca",
      "credit": {
        "name": "Asharca",
        "url": "https://github.com/asharca/ui"
      },
      "badge": "new",
      "launchedAt": "2026-11-04"
    }
  },
  {
    "publicSlug": "docs-pages",
    "category": "blocks",
    "entry": {
      "slug": "docs-pages",
      "name": "Docs Pages",
      "description": "Three-column documentation with searchable navigation, copyable install/code samples, delivery diagram, payload reference, outline/progress and feedback.",
      "file": "components/motion/docs-pages.tsx",
      "extraFiles": [
        "components/motion/product-page-code.tsx",
        "components/agents/code-block.tsx",
        "components/agents/agent-code.tsx"
      ],
      "examples": [
        {
          "slug": "docs-article",
          "name": "Docs article",
          "description": "Configurable article sections and code, package-manager switching, real clipboard states, scroll-aware outline, mobile directory and host feedback.",
          "file": "components/motion/docs-pages.tsx",
          "previewKey": "blocks/docs-pages-docs-article",
          "previewFile": "components/previews/blocks/docs-pages-docs-article.preview.tsx",
          "author": "asharca",
          "badge": "new",
          "launchedAt": "2026-11-04",
          "installSlug": "docs-pages"
        }
      ],
      "author": "asharca",
      "credit": {
        "name": "Asharca",
        "url": "https://github.com/asharca/ui"
      },
      "badge": "new",
      "launchedAt": "2026-11-04"
    }
  },
  {
    "publicSlug": "approval-queue",
    "category": "blocks",
    "entry": {
      "slug": "approval-queue",
      "name": "Approval Queue",
      "description": "Searchable requests with contextual review, attachments and host-owned asynchronous decisions.",
      "file": "components/motion/business-decisions/approval-queue.tsx",
      "extraFiles": [
        "components/motion/business-decisions/decision-support.tsx"
      ],
      "examples": [
        {
          "slug": "review-queue",
          "name": "Review queue",
          "description": "Review queue: Searchable requests with contextual review, attachments and host-owned asynchronous decisions.",
          "file": "components/motion/business-decisions/approval-queue.tsx",
          "previewKey": "ApprovalQueueReviewQueuePreview",
          "previewFile": "components/previews/blocks/approval-queue-review-queue.preview.tsx",
          "usageFile": "components/previews/blocks/approval-queue-review-queue.preview.tsx",
          "installSlug": "approval-queue",
          "author": "asharca",
          "badge": "new",
          "launchedAt": "2026-11-04"
        }
      ],
      "author": "asharca",
      "credit": {
        "name": "Asharca",
        "url": "https://github.com/asharca/ui"
      },
      "badge": "new",
      "launchedAt": "2026-11-04"
    }
  },
  {
    "publicSlug": "questionnaire",
    "category": "blocks",
    "entry": {
      "slug": "questionnaire",
      "name": "Questionnaire",
      "description": "Validated question flows with keyboard choices, retained answers and optional skipping.",
      "file": "components/motion/business-decisions/questionnaire.tsx",
      "extraFiles": [
        "components/motion/business-decisions/decision-support.tsx"
      ],
      "examples": [
        {
          "slug": "guided-questions",
          "name": "Guided questions",
          "description": "Guided questions: Validated question flows with keyboard choices, retained answers and optional skipping.",
          "file": "components/motion/business-decisions/questionnaire.tsx",
          "previewKey": "QuestionnaireGuidedQuestionsPreview",
          "previewFile": "components/previews/blocks/questionnaire-guided-questions.preview.tsx",
          "usageFile": "components/previews/blocks/questionnaire-guided-questions.preview.tsx",
          "installSlug": "questionnaire",
          "author": "asharca",
          "badge": "new",
          "launchedAt": "2026-11-04"
        },
        {
          "slug": "selection-list",
          "name": "Selection list",
          "description": "Selection list: Validated question flows with keyboard choices, retained answers and optional skipping.",
          "file": "components/motion/business-decisions/questionnaire.tsx",
          "previewKey": "QuestionnaireSelectionListPreview",
          "previewFile": "components/previews/blocks/questionnaire-selection-list.preview.tsx",
          "usageFile": "components/previews/blocks/questionnaire-selection-list.preview.tsx",
          "installSlug": "questionnaire-selection-list",
          "author": "asharca",
          "badge": "new",
          "launchedAt": "2026-11-04"
        }
      ],
      "author": "asharca",
      "credit": {
        "name": "Asharca",
        "url": "https://github.com/asharca/ui"
      },
      "badge": "new",
      "launchedAt": "2026-11-04"
    }
  },
  {
    "publicSlug": "step-form",
    "category": "blocks",
    "entry": {
      "slug": "step-form",
      "name": "Step Form",
      "description": "Four form presentations sharing controlled answer data, conditional branches and async submission.",
      "file": "components/motion/business-decisions/step-form.tsx",
      "extraFiles": [
        "components/motion/business-decisions/decision-support.tsx",
        "components/motion/business-decisions/questionnaire.tsx"
      ],
      "examples": [
        {
          "slug": "focused-step-form",
          "name": "Focused step form",
          "description": "Focused step form: Four form presentations sharing controlled answer data, conditional branches and async submission.",
          "file": "components/motion/business-decisions/step-form.tsx",
          "previewKey": "StepFormFocusedStepFormPreview",
          "previewFile": "components/previews/blocks/step-form-focused-step-form.preview.tsx",
          "usageFile": "components/previews/blocks/step-form-focused-step-form.preview.tsx",
          "installSlug": "step-form",
          "author": "asharca",
          "badge": "new",
          "launchedAt": "2026-11-04"
        },
        {
          "slug": "card-stack",
          "name": "Card stack",
          "description": "Card stack: Four form presentations sharing controlled answer data, conditional branches and async submission.",
          "file": "components/motion/business-decisions/step-form.tsx",
          "previewKey": "StepFormCardStackPreview",
          "previewFile": "components/previews/blocks/step-form-card-stack.preview.tsx",
          "usageFile": "components/previews/blocks/step-form-card-stack.preview.tsx",
          "installSlug": "step-form-card-stack",
          "author": "asharca",
          "badge": "new",
          "launchedAt": "2026-11-04"
        },
        {
          "slug": "inline-prompt",
          "name": "Inline prompt",
          "description": "Inline prompt: Four form presentations sharing controlled answer data, conditional branches and async submission.",
          "file": "components/motion/business-decisions/step-form.tsx",
          "previewKey": "StepFormInlinePromptPreview",
          "previewFile": "components/previews/blocks/step-form-inline-prompt.preview.tsx",
          "usageFile": "components/previews/blocks/step-form-inline-prompt.preview.tsx",
          "installSlug": "step-form-inline-prompt",
          "author": "asharca",
          "badge": "new",
          "launchedAt": "2026-11-04"
        },
        {
          "slug": "onboarding-form",
          "name": "Onboarding form",
          "description": "Onboarding form: Four form presentations sharing controlled answer data, conditional branches and async submission.",
          "file": "components/motion/business-decisions/step-form.tsx",
          "previewKey": "StepFormOnboardingFormPreview",
          "previewFile": "components/previews/blocks/step-form-onboarding-form.preview.tsx",
          "usageFile": "components/previews/blocks/step-form-onboarding-form.preview.tsx",
          "installSlug": "step-form-onboarding-form",
          "author": "asharca",
          "badge": "new",
          "launchedAt": "2026-11-04"
        }
      ],
      "author": "asharca",
      "credit": {
        "name": "Asharca",
        "url": "https://github.com/asharca/ui"
      },
      "badge": "new",
      "launchedAt": "2026-11-04"
    }
  },
  {
    "publicSlug": "team-invite",
    "category": "blocks",
    "entry": {
      "slug": "team-invite",
      "name": "Team Invites",
      "description": "Validated batch invitations, roles, seats, pending/member lists and host-controlled invitation links.",
      "file": "components/motion/business-decisions/team-invite.tsx",
      "extraFiles": [
        "components/motion/business-decisions/decision-support.tsx"
      ],
      "examples": [
        {
          "slug": "invite-teammates",
          "name": "Invite teammates",
          "description": "Invite teammates: Validated batch invitations, roles, seats, pending/member lists and host-controlled invitation links.",
          "file": "components/motion/business-decisions/team-invite.tsx",
          "previewKey": "TeamInviteInviteTeammatesPreview",
          "previewFile": "components/previews/blocks/team-invite-invite-teammates.preview.tsx",
          "usageFile": "components/previews/blocks/team-invite-invite-teammates.preview.tsx",
          "installSlug": "team-invite",
          "author": "asharca",
          "badge": "new",
          "launchedAt": "2026-11-04"
        }
      ],
      "author": "asharca",
      "credit": {
        "name": "Asharca",
        "url": "https://github.com/asharca/ui"
      },
      "badge": "new",
      "launchedAt": "2026-11-04"
    }
  },
  {
    "publicSlug": "api-keys",
    "category": "blocks",
    "entry": {
      "slug": "api-keys",
      "name": "API Keys",
      "description": "Scoped credentials with one-time secret delivery, masking, rotation and typed revocation.",
      "file": "components/motion/business-decisions/api-keys.tsx",
      "extraFiles": [
        "components/motion/business-decisions/decision-support.tsx"
      ],
      "examples": [
        {
          "slug": "api-keys-manager",
          "name": "API keys manager",
          "description": "API keys manager: Scoped credentials with one-time secret delivery, masking, rotation and typed revocation.",
          "file": "components/motion/business-decisions/api-keys.tsx",
          "previewKey": "ApiKeysApiKeysManagerPreview",
          "previewFile": "components/previews/blocks/api-keys-api-keys-manager.preview.tsx",
          "usageFile": "components/previews/blocks/api-keys-api-keys-manager.preview.tsx",
          "installSlug": "api-keys",
          "author": "asharca",
          "badge": "new",
          "launchedAt": "2026-11-04"
        }
      ],
      "author": "asharca",
      "credit": {
        "name": "Asharca",
        "url": "https://github.com/asharca/ui"
      },
      "badge": "new",
      "launchedAt": "2026-11-04"
    }
  },
  {
    "publicSlug": "whats-new",
    "category": "blocks",
    "entry": {
      "slug": "whats-new",
      "name": "What's New",
      "description": "Version-aware release teasers and media spotlights with keyboard/touch navigation and host-owned read state.",
      "file": "components/motion/business-decisions/whats-new.tsx",
      "extraFiles": [
        "components/motion/business-decisions/decision-support.tsx"
      ],
      "examples": [
        {
          "slug": "release-spotlight",
          "name": "Release spotlight",
          "description": "Release spotlight: Version-aware release teasers and media spotlights with keyboard/touch navigation and host-owned read state.",
          "file": "components/motion/business-decisions/whats-new.tsx",
          "previewKey": "WhatsNewReleaseSpotlightPreview",
          "previewFile": "components/previews/blocks/whats-new-release-spotlight.preview.tsx",
          "usageFile": "components/previews/blocks/whats-new-release-spotlight.preview.tsx",
          "installSlug": "whats-new",
          "author": "asharca",
          "badge": "new",
          "launchedAt": "2026-11-04"
        }
      ],
      "author": "asharca",
      "credit": {
        "name": "Asharca",
        "url": "https://github.com/asharca/ui"
      },
      "badge": "new",
      "launchedAt": "2026-11-04"
    }
  },
  {
    "publicSlug": "empty-states",
    "category": "blocks",
    "entry": {
      "slug": "empty-states",
      "name": "Empty States",
      "description": "Four original animated empty-state illustrations with functional host recovery actions.",
      "file": "components/motion/business-decisions/empty-states.tsx",
      "extraFiles": [
        "components/motion/business-decisions/decision-support.tsx"
      ],
      "examples": [
        {
          "slug": "archive-drawer",
          "name": "Archive drawer",
          "description": "Archive drawer: Four original animated empty-state illustrations with functional host recovery actions.",
          "file": "components/motion/business-decisions/empty-states.tsx",
          "previewKey": "EmptyStatesArchiveDrawerPreview",
          "previewFile": "components/previews/blocks/empty-states-archive-drawer.preview.tsx",
          "usageFile": "components/previews/blocks/empty-states-archive-drawer.preview.tsx",
          "installSlug": "empty-states",
          "author": "asharca",
          "badge": "new",
          "launchedAt": "2026-11-04"
        },
        {
          "slug": "search-lens",
          "name": "Search lens",
          "description": "Search lens: Four original animated empty-state illustrations with functional host recovery actions.",
          "file": "components/motion/business-decisions/empty-states.tsx",
          "previewKey": "EmptyStatesSearchLensPreview",
          "previewFile": "components/previews/blocks/empty-states-search-lens.preview.tsx",
          "usageFile": "components/previews/blocks/empty-states-search-lens.preview.tsx",
          "installSlug": "empty-states-search-lens",
          "author": "asharca",
          "badge": "new",
          "launchedAt": "2026-11-04"
        },
        {
          "slug": "inbox-zero",
          "name": "Inbox zero",
          "description": "Inbox zero: Four original animated empty-state illustrations with functional host recovery actions.",
          "file": "components/motion/business-decisions/empty-states.tsx",
          "previewKey": "EmptyStatesInboxZeroPreview",
          "previewFile": "components/previews/blocks/empty-states-inbox-zero.preview.tsx",
          "usageFile": "components/previews/blocks/empty-states-inbox-zero.preview.tsx",
          "installSlug": "empty-states-inbox-zero",
          "author": "asharca",
          "badge": "new",
          "launchedAt": "2026-11-04"
        },
        {
          "slug": "blank-board",
          "name": "Blank board",
          "description": "Blank board: Four original animated empty-state illustrations with functional host recovery actions.",
          "file": "components/motion/business-decisions/empty-states.tsx",
          "previewKey": "EmptyStatesBlankBoardPreview",
          "previewFile": "components/previews/blocks/empty-states-blank-board.preview.tsx",
          "usageFile": "components/previews/blocks/empty-states-blank-board.preview.tsx",
          "installSlug": "empty-states-blank-board",
          "author": "asharca",
          "badge": "new",
          "launchedAt": "2026-11-04"
        }
      ],
      "author": "asharca",
      "credit": {
        "name": "Asharca",
        "url": "https://github.com/asharca/ui"
      },
      "badge": "new",
      "launchedAt": "2026-11-04"
    }
  },
  {
    "publicSlug": "notification-center",
    "category": "blocks",
    "entry": {
      "slug": "notification-center",
      "name": "Notification Center",
      "description": "Standalone dropdown and panel inboxes with search, filters, details and asynchronous host-owned actions.",
      "file": "components/motion/business-decisions/notification-center.tsx",
      "extraFiles": [
        "components/motion/business-decisions/decision-support.tsx"
      ],
      "examples": [
        {
          "slug": "notification-dropdown",
          "name": "Notification dropdown",
          "description": "Bell-triggered compact inbox with category filters, unread management and host-owned notification actions.",
          "file": "components/motion/business-decisions/notification-center.tsx",
          "previewKey": "NotificationCenterNotificationDropdownPreview",
          "previewFile": "components/previews/blocks/notification-center-notification-dropdown.preview.tsx",
          "usageFile": "components/previews/blocks/notification-center-notification-dropdown.preview.tsx",
          "installSlug": "notification-center",
          "author": "asharca",
          "badge": "new",
          "launchedAt": "2026-11-04"
        },
        {
          "slug": "notification-panel",
          "name": "Notification panel",
          "description": "Notification panel: Standalone dropdown and panel inboxes with search, filters, details and asynchronous host-owned actions.",
          "file": "components/motion/business-decisions/notification-center.tsx",
          "previewKey": "NotificationCenterNotificationPanelPreview",
          "previewFile": "components/previews/blocks/notification-center-notification-panel.preview.tsx",
          "usageFile": "components/previews/blocks/notification-center-notification-panel.preview.tsx",
          "installSlug": "notification-center-notification-panel",
          "author": "asharca",
          "badge": "new",
          "launchedAt": "2026-11-04"
        }
      ],
      "author": "asharca",
      "credit": {
        "name": "Asharca",
        "url": "https://github.com/asharca/ui"
      },
      "badge": "new",
      "launchedAt": "2026-11-04"
    }
  },
  {
    "publicSlug": "receipt",
    "category": "motion",
    "entry": {
      "slug": "receipt",
      "name": "Receipt",
      "description": "A thermal-style printed receipt with input-driven line items, signed adjustments, currency-aware totals, independent payment details, Code 39 barcode and replayable status stamp.",
      "file": "components/motion/receipt.tsx",
      "examples": [
        {
          "slug": "printed",
          "name": "Printed receipt",
          "description": "Replay the printer feed, change quantities and transaction status, and independently show or hide a real Code 39 barcode. All amounts are integer minor currency units; the host rounds tax and discounts once.",
          "file": "components/motion/receipt.tsx",
          "previewKey": "motion/receipt-printed",
          "previewFile": "components/previews/motion/receipt-printed.preview.tsx",
          "author": "asharca",
          "badge": "new",
          "launchedAt": "2026-11-04",
          "installSlug": "receipt"
        }
      ],
      "author": "asharca",
      "credit": {
        "name": "Asharca",
        "url": "https://github.com/asharca/ui"
      },
      "badge": "new",
      "launchedAt": "2026-11-04"
    }
  },
  {
    "publicSlug": "emoji-picker",
    "category": "motion",
    "entry": {
      "slug": "emoji-picker",
      "name": "Emoji Picker",
      "description": "A lazily loaded Unicode emoji picker with searchable categories, exact skin-tone sequences, recent history, keyboard navigation and a controlled or uncontrolled animated message-reaction bar.",
      "file": "components/motion/emoji-picker.tsx",
      "extraFiles": [
        "components/motion/emoji-picker-data.ts"
      ],
      "examples": [
        {
          "slug": "message-reactions",
          "name": "Message reactions",
          "description": "Toggle real reaction selections and counts, remove empty pills, and add reactions from a focus-managed morphing picker.",
          "file": "components/motion/emoji-picker.tsx",
          "previewKey": "motion/emoji-picker-message-reactions",
          "previewFile": "components/previews/motion/emoji-picker-message-reactions.preview.tsx",
          "author": "asharca",
          "badge": "new",
          "launchedAt": "2026-11-04",
          "installSlug": "emoji-picker"
        },
        {
          "slug": "panel",
          "name": "Picker panel",
          "description": "Insert emoji into an editable note at its cursor; search names and tags, browse scroll-synchronized categories, choose skin tones, and restore recent picks.",
          "file": "components/motion/emoji-picker.tsx",
          "previewKey": "motion/emoji-picker-panel",
          "previewFile": "components/previews/motion/emoji-picker-panel.preview.tsx",
          "author": "asharca",
          "badge": "new",
          "launchedAt": "2026-11-04",
          "installSlug": "emoji-picker-panel"
        }
      ],
      "author": "asharca",
      "credit": {
        "name": "Asharca",
        "url": "https://github.com/asharca/ui"
      },
      "badge": "new",
      "launchedAt": "2026-11-04"
    }
  },
  {
    "publicSlug": "animated-dropdown",
    "category": "motion",
    "entry": {
      "slug": "animated-dropdown",
      "name": "Animated Dropdown",
      "description": "A click-triggered menu composed on the existing corner-morph popover, with a spring focus surface, controlled selection, nested panels, disabled-item skipping and keyboard typeahead.",
      "file": "components/motion/animated-dropdown.tsx",
      "examples": [
        {
          "slug": "animated",
          "name": "Animated dropdown",
          "description": "Workspace actions, controlled document status and nested resource menus with independent option checks and optional trailing indicators.",
          "file": "components/motion/animated-dropdown.tsx",
          "previewKey": "motion/animated-dropdown-animated",
          "previewFile": "components/previews/motion/animated-dropdown-animated.preview.tsx",
          "author": "asharca",
          "badge": "new",
          "launchedAt": "2026-11-04",
          "installSlug": "animated-dropdown"
        }
      ],
      "author": "asharca",
      "credit": {
        "name": "Asharca",
        "url": "https://github.com/asharca/ui"
      },
      "badge": "new",
      "launchedAt": "2026-11-04"
    }
  },
  {
    "publicSlug": "diff-review",
    "category": "blocks",
    "entry": {
      "slug": "diff-review",
      "name": "Diff Review",
      "description": "A version-aware, multi-file code review workflow with per-hunk and whole-file decisions, comments, progress and host-backed commits.",
      "file": "components/agents/diff-review.tsx",
      "examples": [
        {
          "slug": "file-review",
          "name": "File Review",
          "description": "Review numbered changes, switch revisions, save comments, accept or reject hunks and commit the accepted snapshot.",
          "file": "components/agents/diff-review.tsx",
          "previewKey": "DiffReviewFileReviewPreview",
          "previewFile": "components/previews/blocks/diff-review-file-review.preview.tsx",
          "usageFile": "components/previews/blocks/diff-review-file-review.usage.tsx",
          "installSlug": "diff-review",
          "author": "asharca",
          "badge": "new",
          "launchedAt": "2026-11-04"
        }
      ],
      "author": "asharca",
      "credit": {
        "name": "Asharca",
        "url": "https://github.com/asharca/ui"
      },
      "badge": "new",
      "launchedAt": "2026-11-04"
    }
  },
  {
    "publicSlug": "file-upload",
    "category": "blocks",
    "existingEntrySlug": "file-upload",
    "entry": {
      "slug": "file-upload",
      "name": "File Upload",
      "description": "Host-connected file upload workflows with drag, browse and paste validation, recoverable queues and confirmed completion.",
      "file": "components/motion/file-upload.tsx",
      "examples": [
        {
          "slug": "file-upload-upload-dropzone",
          "name": "Upload Dropzone",
          "description": "Browse, drop or paste validated files with image previews, transport-driven progress and speed, abort/resume, retry, async deletion and a rolling summary.",
          "file": "components/motion/upload-dropzone.tsx",
          "previewKey": "FileUploadUploadDropzonePreview",
          "previewFile": "components/previews/blocks/file-upload-upload-dropzone.preview.tsx",
          "usageFile": "components/previews/blocks/file-upload-upload-dropzone.usage.tsx",
          "installSlug": "upload-dropzone",
          "author": "asharca",
          "badge": "new",
          "launchedAt": "2026-11-04"
        }
      ]
    }
  },
  {
    "publicSlug": "feature-sections",
    "category": "blocks",
    "entry": {
      "slug": "feature-sections",
      "name": "Feature Sections",
      "description": "Thirteen distinct product-feature compositions: visual benefits, alternating rows, synchronized hotspots, triptych, signal grid, operations and voice decks, lists, steps, looping bento and product tabs.",
      "file": "components/motion/marketing-feature-sections.tsx",
      "extraFiles": [
        "components/motion/marketing-features-playback.ts"
      ],
      "examples": [
        {
          "slug": "visual-benefits",
          "name": "Visual benefits",
          "description": "Visual benefits: original host-configurable composition with a self-contained interactive usage preview.",
          "file": "components/motion/marketing-feature-sections.tsx",
          "previewKey": "MarketingFeaturesVisualBenefits",
          "previewFile": "components/previews/blocks/feature-sections-visual-benefits.preview.tsx",
          "usageFile": "components/previews/blocks/feature-sections-visual-benefits.preview.tsx",
          "installSlug": "feature-sections",
          "author": "asharca",
          "badge": "new",
          "launchedAt": "2026-11-04"
        },
        {
          "slug": "alternating-feature-rows",
          "name": "Alternating feature rows",
          "description": "Alternating feature rows: original host-configurable composition with a self-contained interactive usage preview.",
          "file": "components/motion/marketing-feature-sections.tsx",
          "previewKey": "MarketingFeaturesAlternatingFeatureRows",
          "previewFile": "components/previews/blocks/feature-sections-alternating-feature-rows.preview.tsx",
          "usageFile": "components/previews/blocks/feature-sections-alternating-feature-rows.preview.tsx",
          "installSlug": "feature-sections-alternating-feature-rows",
          "author": "asharca",
          "badge": "new",
          "launchedAt": "2026-11-04"
        },
        {
          "slug": "product-hotspots",
          "name": "Product hotspots",
          "description": "Product hotspots: original host-configurable composition with a self-contained interactive usage preview.",
          "file": "components/motion/marketing-feature-sections.tsx",
          "previewKey": "MarketingFeaturesProductHotspots",
          "previewFile": "components/previews/blocks/feature-sections-product-hotspots.preview.tsx",
          "usageFile": "components/previews/blocks/feature-sections-product-hotspots.preview.tsx",
          "installSlug": "feature-sections-product-hotspots",
          "author": "asharca",
          "badge": "new",
          "launchedAt": "2026-11-04"
        },
        {
          "slug": "feature-showcase",
          "name": "Feature showcase",
          "description": "Feature showcase: original host-configurable composition with a self-contained interactive usage preview.",
          "file": "components/motion/marketing-feature-sections.tsx",
          "previewKey": "MarketingFeaturesFeatureShowcase",
          "previewFile": "components/previews/blocks/feature-sections-feature-showcase.preview.tsx",
          "usageFile": "components/previews/blocks/feature-sections-feature-showcase.preview.tsx",
          "installSlug": "feature-sections-feature-showcase",
          "author": "asharca",
          "badge": "new",
          "launchedAt": "2026-11-04"
        },
        {
          "slug": "benefits-triptych",
          "name": "Benefits triptych",
          "description": "Benefits triptych: original host-configurable composition with a self-contained interactive usage preview.",
          "file": "components/motion/marketing-feature-sections.tsx",
          "previewKey": "MarketingFeaturesBenefitsTriptych",
          "previewFile": "components/previews/blocks/feature-sections-benefits-triptych.preview.tsx",
          "usageFile": "components/previews/blocks/feature-sections-benefits-triptych.preview.tsx",
          "installSlug": "feature-sections-benefits-triptych",
          "author": "asharca",
          "badge": "new",
          "launchedAt": "2026-11-04"
        },
        {
          "slug": "signal-grid",
          "name": "Signal grid",
          "description": "Signal grid: original host-configurable composition with a self-contained interactive usage preview.",
          "file": "components/motion/marketing-feature-sections.tsx",
          "previewKey": "MarketingFeaturesSignalGrid",
          "previewFile": "components/previews/blocks/feature-sections-signal-grid.preview.tsx",
          "usageFile": "components/previews/blocks/feature-sections-signal-grid.preview.tsx",
          "installSlug": "feature-sections-signal-grid",
          "author": "asharca",
          "badge": "new",
          "launchedAt": "2026-11-04"
        },
        {
          "slug": "control-deck",
          "name": "Control deck",
          "description": "Control deck: original host-configurable composition with a self-contained interactive usage preview.",
          "file": "components/motion/marketing-feature-sections.tsx",
          "previewKey": "MarketingFeaturesControlDeck",
          "previewFile": "components/previews/blocks/feature-sections-control-deck.preview.tsx",
          "usageFile": "components/previews/blocks/feature-sections-control-deck.preview.tsx",
          "installSlug": "feature-sections-control-deck",
          "author": "asharca",
          "badge": "new",
          "launchedAt": "2026-11-04"
        },
        {
          "slug": "voice-ai",
          "name": "Voice AI",
          "description": "Voice AI: original host-configurable composition with a self-contained interactive usage preview.",
          "file": "components/motion/marketing-feature-sections.tsx",
          "previewKey": "MarketingFeaturesVoiceAI",
          "previewFile": "components/previews/blocks/feature-sections-voice-ai.preview.tsx",
          "usageFile": "components/previews/blocks/feature-sections-voice-ai.preview.tsx",
          "installSlug": "feature-sections-voice-ai",
          "author": "asharca",
          "badge": "new",
          "launchedAt": "2026-11-04"
        },
        {
          "slug": "feature-list",
          "name": "Feature list",
          "description": "Feature list: original host-configurable composition with a self-contained interactive usage preview.",
          "file": "components/motion/marketing-feature-sections.tsx",
          "previewKey": "MarketingFeaturesFeatureList",
          "previewFile": "components/previews/blocks/feature-sections-feature-list.preview.tsx",
          "usageFile": "components/previews/blocks/feature-sections-feature-list.preview.tsx",
          "installSlug": "feature-sections-feature-list",
          "author": "asharca",
          "badge": "new",
          "launchedAt": "2026-11-04"
        },
        {
          "slug": "feature-steps",
          "name": "Feature steps",
          "description": "Feature steps: original host-configurable composition with a self-contained interactive usage preview.",
          "file": "components/motion/marketing-feature-sections.tsx",
          "previewKey": "MarketingFeaturesFeatureSteps",
          "previewFile": "components/previews/blocks/feature-sections-feature-steps.preview.tsx",
          "usageFile": "components/previews/blocks/feature-sections-feature-steps.preview.tsx",
          "installSlug": "feature-sections-feature-steps",
          "author": "asharca",
          "badge": "new",
          "launchedAt": "2026-11-04"
        },
        {
          "slug": "feature-bento",
          "name": "Feature bento",
          "description": "Feature bento: original host-configurable composition with a self-contained interactive usage preview.",
          "file": "components/motion/marketing-feature-sections.tsx",
          "previewKey": "MarketingFeaturesFeatureBento",
          "previewFile": "components/previews/blocks/feature-sections-feature-bento.preview.tsx",
          "usageFile": "components/previews/blocks/feature-sections-feature-bento.preview.tsx",
          "installSlug": "feature-sections-feature-bento",
          "author": "asharca",
          "badge": "new",
          "launchedAt": "2026-11-04"
        },
        {
          "slug": "feature-tabs",
          "name": "Feature tabs",
          "description": "Feature tabs: original host-configurable composition with a self-contained interactive usage preview.",
          "file": "components/motion/marketing-feature-sections.tsx",
          "previewKey": "MarketingFeaturesFeatureTabs",
          "previewFile": "components/previews/blocks/feature-sections-feature-tabs.preview.tsx",
          "usageFile": "components/previews/blocks/feature-sections-feature-tabs.preview.tsx",
          "installSlug": "feature-sections-feature-tabs",
          "author": "asharca",
          "badge": "new",
          "launchedAt": "2026-11-04"
        },
        {
          "slug": "feature-stage-tabs",
          "name": "Feature stage tabs",
          "description": "Feature stage tabs: original host-configurable composition with a self-contained interactive usage preview.",
          "file": "components/motion/marketing-feature-sections.tsx",
          "previewKey": "MarketingFeaturesFeatureStageTabs",
          "previewFile": "components/previews/blocks/feature-sections-feature-stage-tabs.preview.tsx",
          "usageFile": "components/previews/blocks/feature-sections-feature-stage-tabs.preview.tsx",
          "installSlug": "feature-sections-feature-stage-tabs",
          "author": "asharca",
          "badge": "new",
          "launchedAt": "2026-11-04"
        }
      ],
      "author": "asharca",
      "credit": {
        "name": "Asharca",
        "url": "https://github.com/asharca/ui"
      },
      "badge": "new",
      "launchedAt": "2026-11-04"
    }
  },
  {
    "publicSlug": "use-cases",
    "category": "blocks",
    "entry": {
      "slug": "use-cases",
      "name": "Use Cases",
      "description": "Five people-first story layouts with photographic collage, role quotes, parallax outcomes, an expanding scenario rail, and a cinematic shader spotlight.",
      "file": "components/motion/marketing-use-cases.tsx",
      "extraFiles": [
        "components/motion/marketing-features-playback.ts"
      ],
      "examples": [
        {
          "slug": "animated-story-collage",
          "name": "Animated Story Collage",
          "description": "Animated Story Collage: original host-configurable composition with a self-contained interactive usage preview.",
          "file": "components/motion/marketing-use-cases.tsx",
          "previewKey": "MarketingFeaturesAnimatedStoryCollage",
          "previewFile": "components/previews/blocks/use-cases-animated-story-collage.preview.tsx",
          "usageFile": "components/previews/blocks/use-cases-animated-story-collage.preview.tsx",
          "installSlug": "use-cases",
          "author": "asharca",
          "badge": "new",
          "launchedAt": "2026-11-04"
        },
        {
          "slug": "role-stories",
          "name": "Role Stories",
          "description": "Role Stories: original host-configurable composition with a self-contained interactive usage preview.",
          "file": "components/motion/marketing-use-cases.tsx",
          "previewKey": "MarketingFeaturesRoleStories",
          "previewFile": "components/previews/blocks/use-cases-role-stories.preview.tsx",
          "usageFile": "components/previews/blocks/use-cases-role-stories.preview.tsx",
          "installSlug": "use-cases-role-stories",
          "author": "asharca",
          "badge": "new",
          "launchedAt": "2026-11-04"
        },
        {
          "slug": "outcome-stories",
          "name": "Outcome Stories",
          "description": "Outcome Stories: original host-configurable composition with a self-contained interactive usage preview.",
          "file": "components/motion/marketing-use-cases.tsx",
          "previewKey": "MarketingFeaturesOutcomeStories",
          "previewFile": "components/previews/blocks/use-cases-outcome-stories.preview.tsx",
          "usageFile": "components/previews/blocks/use-cases-outcome-stories.preview.tsx",
          "installSlug": "use-cases-outcome-stories",
          "author": "asharca",
          "badge": "new",
          "launchedAt": "2026-11-04"
        },
        {
          "slug": "everyday-scenario-rail",
          "name": "Everyday Scenario Rail",
          "description": "Everyday Scenario Rail: original host-configurable composition with a self-contained interactive usage preview.",
          "file": "components/motion/marketing-use-cases.tsx",
          "previewKey": "MarketingFeaturesEverydayScenarioRail",
          "previewFile": "components/previews/blocks/use-cases-everyday-scenario-rail.preview.tsx",
          "usageFile": "components/previews/blocks/use-cases-everyday-scenario-rail.preview.tsx",
          "installSlug": "use-cases-everyday-scenario-rail",
          "author": "asharca",
          "badge": "new",
          "launchedAt": "2026-11-04"
        },
        {
          "slug": "cinematic-shader-spotlight",
          "name": "Cinematic Shader Spotlight",
          "description": "Cinematic Shader Spotlight: original host-configurable composition with a self-contained interactive usage preview.",
          "file": "components/motion/marketing-use-cases.tsx",
          "previewKey": "MarketingFeaturesCinematicShaderSpotlight",
          "previewFile": "components/previews/blocks/use-cases-cinematic-shader-spotlight.preview.tsx",
          "usageFile": "components/previews/blocks/use-cases-cinematic-shader-spotlight.preview.tsx",
          "installSlug": "use-cases-cinematic-shader-spotlight",
          "author": "asharca",
          "badge": "new",
          "launchedAt": "2026-11-04"
        }
      ],
      "author": "asharca",
      "credit": {
        "name": "Asharca",
        "url": "https://github.com/asharca/ui"
      },
      "badge": "new",
      "launchedAt": "2026-11-04"
    }
  },
  {
    "publicSlug": "app-showcase",
    "category": "blocks",
    "entry": {
      "slug": "app-showcase",
      "name": "App Showcase",
      "description": "An interactive phone tour with directional screens, pointer tilt, contextual activity and lifecycle-aware autoplay.",
      "file": "components/motion/marketing-app-showcase.tsx",
      "extraFiles": [
        "components/motion/marketing-features-playback.ts"
      ],
      "examples": [
        {
          "slug": "phone-tour",
          "name": "Phone tour",
          "description": "Four selectable travel screens with short tab labels, image captions, saved-note interaction, responsive feature selection and lifecycle-aware tour playback.",
          "file": "components/motion/marketing-app-showcase.tsx",
          "previewKey": "MarketingFeaturesPhoneTour",
          "previewFile": "components/previews/blocks/app-showcase-phone-tour.preview.tsx",
          "usageFile": "components/previews/blocks/app-showcase-phone-tour.preview.tsx",
          "installSlug": "app-showcase",
          "author": "asharca",
          "badge": "new",
          "launchedAt": "2026-11-04"
        }
      ],
      "author": "asharca",
      "credit": {
        "name": "Asharca",
        "url": "https://github.com/asharca/ui"
      },
      "badge": "new",
      "launchedAt": "2026-11-04"
    }
  },
  {
    "publicSlug": "product-tour",
    "category": "blocks",
    "entry": {
      "slug": "product-tour",
      "name": "Product Tour",
      "description": "A responsive pinned product story that carries the same cards from inbox through planning, review and publication, driven by scroll or direct selection.",
      "file": "components/motion/marketing-product-tour.tsx",
      "extraFiles": [
        "components/motion/marketing-features-playback.ts"
      ],
      "examples": [
        {
          "slug": "pinned-story",
          "name": "Pinned story",
          "description": "Four pinned story stages move six persistent request cards through capture, planning, review and release presentation.",
          "file": "components/motion/marketing-product-tour.tsx",
          "previewKey": "MarketingFeaturesPinnedStory",
          "previewFile": "components/previews/blocks/product-tour-pinned-story.preview.tsx",
          "usageFile": "components/previews/blocks/product-tour-pinned-story.preview.tsx",
          "installSlug": "product-tour",
          "author": "asharca",
          "badge": "new",
          "launchedAt": "2026-11-04"
        }
      ],
      "author": "asharca",
      "credit": {
        "name": "Asharca",
        "url": "https://github.com/asharca/ui"
      },
      "badge": "new",
      "launchedAt": "2026-11-04"
    }
  },
  {
    "publicSlug": "illustration-search-command",
    "category": "motion",
    "entry": {
      "slug": "illustration-search-command",
      "name": "Search & Command",
      "description": "Inline command search with real input, filtered workspace results, stable keyboard selection, and explicitly separate demonstration playback.",
      "file": "components/motion/illustration-search-command.tsx",
      "examples": [
        { "slug": "illustration-search-command-default", "name": "Workspace command search", "description": "A search panel types a launch query and moves focus among four workspace results.", "file": "components/motion/illustration-search-command.tsx", "previewKey": "motion/illustration-search-command-default", "previewFile": "components/previews/motion/illustration-search-command-default.preview.tsx", "usageFile": "components/previews/motion/illustration-search-command-default.preview.tsx",
        "installSlug": "illustration-search-command",
        "author": "asharca",
        "badge": "new",
        "launchedAt": "2026-11-04" }
      ],
      "author": "asharca",
      "credit": {
        "name": "Asharca",
        "url": "https://github.com/asharca/ui"
      },
      "badge": "new",
      "launchedAt": "2026-11-04"
    }
  },
  {
    "publicSlug": "illustration-live-presence",
    "category": "motion",
    "entry": {
      "slug": "illustration-live-presence",
      "name": "Live Presence",
      "description": "Host-supplied document and canvas collaboration scenes linking avatars, cursors, selected content, and comments without implying synchronization.",
      "file": "components/motion/illustration-live-presence.tsx",
      "examples": [
        { "slug": "illustration-live-presence-illustration-1", "name": "Shared document presence", "description": "Collaborator cursors and changing selections animate over shared document text.", "file": "components/motion/illustration-live-presence.tsx", "previewKey": "motion/illustration-live-presence-illustration-1", "previewFile": "components/previews/motion/illustration-live-presence-illustration-1.preview.tsx", "usageFile": "components/previews/motion/illustration-live-presence-illustration-1.preview.tsx",
        "installSlug": "illustration-live-presence",
        "author": "asharca",
        "badge": "new",
        "launchedAt": "2026-11-04" },
        { "slug": "illustration-live-presence-illustration-2", "name": "Design canvas presence", "description": "Collaborators edit and comment around a framed homepage hero canvas.", "file": "components/motion/illustration-live-presence.tsx", "previewKey": "motion/illustration-live-presence-illustration-2", "previewFile": "components/previews/motion/illustration-live-presence-illustration-2.preview.tsx", "usageFile": "components/previews/motion/illustration-live-presence-illustration-2.preview.tsx",
        "installSlug": "illustration-live-presence-illustration-live-presence-illustration-2",
        "author": "asharca",
        "badge": "new",
        "launchedAt": "2026-11-04" }
      ],
      "author": "asharca",
      "credit": {
        "name": "Asharca",
        "url": "https://github.com/asharca/ui"
      },
      "badge": "new",
      "launchedAt": "2026-11-04"
    }
  },
  {
    "publicSlug": "illustration-split-reveal",
    "category": "motion",
    "entry": {
      "slug": "illustration-split-reveal",
      "name": "Split Reveal",
      "description": "A same-position before/after comparison with a native range input, complete-state pinning, explicit playback controls and reduced motion.",
      "file": "components/motion/illustration-split-reveal.tsx",
      "examples": [
        { "slug": "illustration-split-reveal-default", "name": "Context clarity reveal", "description": "A moving vertical light sweep reveals crisp content from a blurred context stack.", "file": "components/motion/illustration-split-reveal.tsx", "previewKey": "motion/illustration-split-reveal-default", "previewFile": "components/previews/motion/illustration-split-reveal-default.preview.tsx", "usageFile": "components/previews/motion/illustration-split-reveal-default.preview.tsx",
        "installSlug": "illustration-split-reveal",
        "author": "asharca",
        "badge": "new",
        "launchedAt": "2026-11-04" }
      ],
      "author": "asharca",
      "credit": {
        "name": "Asharca",
        "url": "https://github.com/asharca/ui"
      },
      "badge": "new",
      "launchedAt": "2026-11-04"
    }
  },
  {
    "publicSlug": "illustration-rolling-stack",
    "category": "motion",
    "entry": {
      "slug": "illustration-rolling-stack",
      "name": "Rolling Stack",
      "description": "Stable-ID vertical card and timeline stacks with controlled selection, keyboard navigation, configurable looping and pausable automatic advancement.",
      "file": "components/motion/illustration-rolling-stack.tsx",
      "examples": [
        { "slug": "illustration-rolling-stack-illustration-1", "name": "Interface item roller", "description": "Seven interface capability pills rotate vertically through one focused card.", "file": "components/motion/illustration-rolling-stack.tsx", "previewKey": "motion/illustration-rolling-stack-illustration-1", "previewFile": "components/previews/motion/illustration-rolling-stack-illustration-1.preview.tsx", "usageFile": "components/previews/motion/illustration-rolling-stack-illustration-1.preview.tsx",
        "installSlug": "illustration-rolling-stack",
        "author": "asharca",
        "badge": "new",
        "launchedAt": "2026-11-04" },
        { "slug": "illustration-rolling-stack-illustration-2", "name": "Wallet network roller", "description": "Crypto networks roll vertically beside a single wallet.", "file": "components/motion/illustration-rolling-stack.tsx", "previewKey": "motion/illustration-rolling-stack-illustration-2", "previewFile": "components/previews/motion/illustration-rolling-stack-illustration-2.preview.tsx", "usageFile": "components/previews/motion/illustration-rolling-stack-illustration-2.preview.tsx",
        "installSlug": "illustration-rolling-stack-illustration-rolling-stack-illustration-2",
        "author": "asharca",
        "badge": "new",
        "launchedAt": "2026-11-04" }
      ],
      "author": "asharca",
      "credit": {
        "name": "Asharca",
        "url": "https://github.com/asharca/ui"
      },
      "badge": "new",
      "launchedAt": "2026-11-04"
    }
  },
  {
    "publicSlug": "illustration-horizontal-stack",
    "category": "motion",
    "existingEntrySlug": "cylinder-carousel",
    "entry": {
      "slug": "cylinder-carousel",
      "name": "Cylinder Carousel",
      "description": "Flat icon-only CylinderCarousel composition with focused capability labels, manual rotation and pausable playback.",
      "file": "components/motion/cylinder-carousel.tsx",
      "extraFiles": [
        "components/motion/illustration-horizontal-stack.tsx"
      ],
      "examples": [
        { "slug": "illustration-horizontal-stack-illustration-horizontal-stack-default", "name": "Horizontal icon roller", "description": "Fixed 80px icon cards roll horizontally, preserving card size and clipping outer cards on narrow canvases.", "file": "components/motion/illustration-horizontal-stack.tsx", "previewKey": "motion/illustration-horizontal-stack-default", "previewFile": "components/previews/motion/illustration-horizontal-stack-default.preview.tsx", "usageFile": "components/previews/motion/illustration-horizontal-stack-default.preview.tsx",
        "installSlug": "illustration-horizontal-stack-illustration-horizontal-stack-default",
        "author": "asharca",
        "badge": "new",
        "launchedAt": "2026-11-04" }
      ]
    },
    "originalExample": {
      "slug": "original",
      "name": "Original",
      "file": "components/motion/cylinder-carousel.tsx",
      "previewKey": "motion/cylinder-carousel",
      "previewFile": "components/previews/motion/cylinder-carousel.preview.tsx",
      "installSlug": "cylinder-carousel"
    }
  },
  {
    "publicSlug": "illustration-icon-marquee",
    "category": "motion",
    "existingEntrySlug": "marquee",
    "entry": {
      "slug": "marquee",
      "name": "Marquee",
      "description": "Two counter-moving icon tracks composed from the existing seamless, accessible Marquee with explicit pause and reduced motion.",
      "file": "components/motion/marquee.tsx",
      "extraFiles": [
        "components/motion/illustration-icon-marquee.tsx"
      ],
      "examples": [
        { "slug": "illustration-icon-marquee-illustration-icon-marquee-default", "name": "Opposing icon marquee", "description": "Two eight-icon rows travel continuously in opposite directions.", "file": "components/motion/illustration-icon-marquee.tsx", "previewKey": "motion/illustration-icon-marquee-default", "previewFile": "components/previews/motion/illustration-icon-marquee-default.preview.tsx", "usageFile": "components/previews/motion/illustration-icon-marquee-default.preview.tsx",
        "installSlug": "illustration-icon-marquee-illustration-icon-marquee-default",
        "author": "asharca",
        "badge": "new",
        "launchedAt": "2026-11-04" }
      ]
    },
    "originalExample": {
      "slug": "original",
      "name": "Original",
      "file": "components/motion/marquee.tsx",
      "previewKey": "motion/marquee",
      "previewFile": "components/previews/motion/marquee.preview.tsx",
      "installSlug": "marquee"
    }
  },
  {
    "publicSlug": "illustration-arc-stack",
    "category": "motion",
    "existingEntrySlug": "cylinder-carousel",
    "entry": {
      "slug": "cylinder-carousel",
      "name": "Cylinder Carousel",
      "description": "Semicircular image and connector collections composed from the existing convex CylinderCarousel projection and input handling.",
      "file": "components/motion/cylinder-carousel.tsx",
      "extraFiles": [
        "components/motion/illustration-arc-stack.tsx"
      ],
      "examples": [
        { "slug": "illustration-arc-stack-illustration-arc-stack-illustration-1", "name": "Portrait arc stack", "description": "Seven portrait cards move through a semicircular focus stack.", "file": "components/motion/illustration-arc-stack.tsx", "previewKey": "motion/illustration-arc-stack-illustration-1", "previewFile": "components/previews/motion/illustration-arc-stack-illustration-1.preview.tsx", "usageFile": "components/previews/motion/illustration-arc-stack-illustration-1.preview.tsx",
        "installSlug": "illustration-arc-stack-illustration-arc-stack-illustration-1",
        "author": "asharca",
        "badge": "new",
        "launchedAt": "2026-11-04" },
        { "slug": "illustration-arc-stack-illustration-arc-stack-illustration-2", "name": "Connector arc stack", "description": "Connector symbols move through a semicircular icon stack.", "file": "components/motion/illustration-arc-stack.tsx", "previewKey": "motion/illustration-arc-stack-illustration-2", "previewFile": "components/previews/motion/illustration-arc-stack-illustration-2.preview.tsx", "usageFile": "components/previews/motion/illustration-arc-stack-illustration-2.preview.tsx",
        "installSlug": "illustration-arc-stack-illustration-arc-stack-illustration-2",
        "author": "asharca",
        "badge": "new",
        "launchedAt": "2026-11-04" }
      ]
    }
  },
  {
    "publicSlug": "animated-modal",
    "category": "motion",
    "existingEntrySlug": "morphing-modal",
    "entry": {
      "slug": "morphing-modal",
      "name": "Morphing Modal",
      "description": "Composes existing MorphingModal: portal, PresenceGate, reduced motion, nested-safe useFocusTrap and focus restoration remain owned by the existing primitive. The new composition supplies controlled/uncontrolled open state and title/description association without changing its public API.",
      "file": "components/motion/animated-dialog-composition.tsx",
      "examples": [
        {
          "slug": "animated-modal-animated-dialog",
          "name": "Animated dialog",
          "description": "A teammate email invitation dialog with named fields, focus restoration and an explicitly local invitation-list outcome.",
          "file": "components/motion/animated-dialog-composition.tsx",
          "previewKey": "animated-modal-animated-dialog",
          "previewFile": "components/previews/motion/animated-modal-animated-dialog.preview.tsx",
          "usageFile": "components/previews/motion/animated-modal-animated-dialog.preview.tsx",
          "author": "asharca",
          "badge": "new",
          "launchedAt": "2026-11-04",
          "installSlug": "animated-modal-animated-dialog"
        }
      ]
    },
    "originalExample": {
      "slug": "original",
      "name": "Original",
      "file": "components/motion/morphing-modal.tsx",
      "previewKey": "motion/morphing-modal",
      "previewFile": "components/previews/motion/morphing-modal.preview.tsx",
      "installSlug": "morphing-modal"
    }
  },
  {
    "publicSlug": "model-picker",
    "category": "blocks",
    "existingEntrySlug": "selector",
    "entry": {
      "slug": "selector",
      "name": "Selector",
      "description": "Reuses Selector and its exact SelectorOption data shape for grouped filtering, keyboard navigation, disabled options, portal positioning, selection and focus restoration. Provider rail is an additional composition, not a replacement Selector API; search is ordered at the panel bottom through supported classNames.",
      "file": "components/motion/model-provider-catalog.tsx",
      "examples": [
        {
          "slug": "model-picker-provider-catalog",
          "name": "Provider catalog",
          "description": "A searchable grouped provider catalog composed with MorphPopover, preserving host model data, disabled choices and selected details.",
          "file": "components/motion/model-provider-catalog.tsx",
          "previewKey": "model-picker-provider-catalog",
          "previewFile": "components/previews/blocks/model-picker-provider-catalog.preview.tsx",
          "usageFile": "components/previews/blocks/model-picker-provider-catalog.preview.tsx",
          "author": "asharca",
          "badge": "new",
          "launchedAt": "2026-11-04",
          "installSlug": "model-picker-provider-catalog"
        },
        {
          "slug": "model-picker-provider-rail",
          "name": "Provider rail",
          "description": "A searchable provider-rail catalog composed with MorphPopover and host-supplied SelectorOption data.",
          "file": "components/motion/model-provider-catalog.tsx",
          "previewKey": "model-picker-provider-rail",
          "previewFile": "components/previews/blocks/model-picker-provider-rail.preview.tsx",
          "usageFile": "components/previews/blocks/model-picker-provider-rail.preview.tsx",
          "author": "asharca",
          "badge": "new",
          "launchedAt": "2026-11-04",
          "installSlug": "model-picker-provider-rail"
        }
      ]
    }
  },
  {
    "publicSlug": "cards",
    "category": "motion",
    "existingEntrySlug": "card",
    "entry": {
      "slug": "card",
      "name": "Card",
      "description": "All six distinct compositions reuse Card, CardHeader, CardTitle, CardDescription, CardContent and CardFooter plus existing Button. Existing Card motion, reduced-motion handling, spacing and semantic tokens remain intact. Public actions are host callbacks, real clipboard operations or links; only previews simulate local balance adjustments.",
      "file": "components/motion/purposeful-cards.tsx",
      "examples": [
        {
          "slug": "cards-balance-card",
          "name": "Balance card",
          "description": "Framed account balance, overlapping marks and two callbacks with an explicitly local adjustment controller.",
          "file": "components/motion/purposeful-cards.tsx",
          "previewKey": "cards-balance-card",
          "previewFile": "components/previews/motion/cards-balance-card.preview.tsx",
          "usageFile": "components/previews/motion/cards-balance-card.preview.tsx",
          "author": "asharca",
          "badge": "new",
          "launchedAt": "2026-11-04",
          "installSlug": "cards-balance-card"
        },
        {
          "slug": "cards-compact-card",
          "name": "Compact card",
          "description": "Textured project backdrop, status, contributor initials, structured details and working detail disclosure.",
          "file": "components/motion/purposeful-cards.tsx",
          "previewKey": "cards-compact-card",
          "previewFile": "components/previews/motion/cards-compact-card.preview.tsx",
          "usageFile": "components/previews/motion/cards-compact-card.preview.tsx",
          "author": "asharca",
          "badge": "new",
          "launchedAt": "2026-11-04",
          "installSlug": "cards-compact-card"
        },
        {
          "slug": "cards-invite-card",
          "name": "Invite card",
          "description": "Reward art, three-step invitation, dismiss/restore, clipboard success/error feedback and selectable URL.",
          "file": "components/motion/purposeful-cards.tsx",
          "previewKey": "cards-invite-card",
          "previewFile": "components/previews/motion/cards-invite-card.preview.tsx",
          "usageFile": "components/previews/motion/cards-invite-card.preview.tsx",
          "author": "asharca",
          "badge": "new",
          "launchedAt": "2026-11-04",
          "installSlug": "cards-invite-card"
        },
        {
          "slug": "cards-folder-card",
          "name": "Folder card",
          "description": "Square media collection with a continuous folder-shaped lower surface and collection disclosure.",
          "file": "components/motion/purposeful-cards.tsx",
          "previewKey": "cards-folder-card",
          "previewFile": "components/previews/motion/cards-folder-card.preview.tsx",
          "usageFile": "components/previews/motion/cards-folder-card.preview.tsx",
          "author": "asharca",
          "badge": "new",
          "launchedAt": "2026-11-04",
          "installSlug": "cards-folder-card"
        },
        {
          "slug": "cards-story-card",
          "name": "Story card",
          "description": "Tall original landscape, editorial metadata, location marker and working in-document story link.",
          "file": "components/motion/purposeful-cards.tsx",
          "previewKey": "cards-story-card",
          "previewFile": "components/previews/motion/cards-story-card.preview.tsx",
          "usageFile": "components/previews/motion/cards-story-card.preview.tsx",
          "author": "asharca",
          "badge": "new",
          "launchedAt": "2026-11-04",
          "installSlug": "cards-story-card"
        },
        {
          "slug": "cards-profile-card",
          "name": "Profile card",
          "description": "Availability, avatar identity, native email contact, copy with failure feedback and separate status tray.",
          "file": "components/motion/purposeful-cards.tsx",
          "previewKey": "cards-profile-card",
          "previewFile": "components/previews/motion/cards-profile-card.preview.tsx",
          "usageFile": "components/previews/motion/cards-profile-card.preview.tsx",
          "author": "asharca",
          "badge": "new",
          "launchedAt": "2026-11-04",
          "installSlug": "cards-profile-card"
        }
      ]
    },
    "originalExample": {
      "slug": "original",
      "name": "Original",
      "file": "components/motion/card.tsx",
      "previewKey": "motion/card",
      "previewFile": "components/previews/motion/card.preview.tsx",
      "installSlug": "card"
    }
  },
  {
    "publicSlug": "command-palette",
    "category": "blocks",
    "existingEntrySlug": "command-palette",
    "entry": {
      "slug": "command-palette",
      "name": "Command Palette",
      "description": "Composes MorphPopover for trigger-to-panel reveal, portal, measurement, Escape/outside dismissal and focus; reuses existing CommandItem, searchCommands and useRowCursor. Adds disabled commands without changing the existing CommandPalette API. Uses one animated cursor and shared motion tokens.",
      "file": "components/motion/morphic-commands.tsx",
      "examples": [
        {
          "slug": "command-palette-morphic-command-palette",
          "name": "Morphic command palette",
          "description": "Trigger-anchored morph, grouped command search, keyboard shortcut and execution, disabled owner action, result panel and focus restoration.",
          "file": "components/motion/morphic-commands.tsx",
          "previewKey": "command-palette-morphic-command-palette",
          "previewFile": "components/previews/blocks/command-palette-morphic-command-palette.preview.tsx",
          "usageFile": "components/previews/blocks/command-palette-morphic-command-palette.preview.tsx",
          "author": "asharca",
          "badge": "new",
          "launchedAt": "2026-11-04",
          "installSlug": "command-palette-morphic-command-palette"
        }
      ]
    },
    "originalExample": {
      "slug": "original",
      "name": "Original",
      "file": "components/motion/command-palette.tsx",
      "previewKey": "blocks/command-palette",
      "previewFile": "components/previews/blocks/command-palette.preview.tsx",
      "installSlug": "command-palette"
    }
  },
  {
    "publicSlug": "charts",
    "category": "charts",
    "existingEntrySlug": "bar-chart",
    "entry": {
      "slug": "bar-chart",
      "name": "Bar Chart",
      "description": "Reuses complete BarChart plot/tooltip/legend/data table, CompositionChart normalization/context and Sparkline. Segmented capacity uses the existing composition model with a new horizontal button/legend surface; host selection is controlled/uncontrolled. Values and units stay data-driven; projections are explicitly labeled.",
      "file": "components/charts/usage-chart-compositions.tsx",
      "examples": [
        {
          "slug": "charts-stacked-bar-chart",
          "name": "Stacked bar chart",
          "description": "Compact daily stacks with independent outlined forecasts, target annotation, interactive legend and keyboard inspection.",
          "file": "components/charts/usage-chart-compositions.tsx",
          "previewKey": "charts-stacked-bar-chart",
          "previewFile": "components/previews/charts/charts-stacked-bar-chart.preview.tsx",
          "usageFile": "components/previews/charts/charts-stacked-bar-chart.preview.tsx",
          "author": "asharca",
          "badge": "new",
          "launchedAt": "2026-11-04",
          "installSlug": "charts-stacked-bar-chart"
        },
        {
          "slug": "charts-segmented-meter",
          "name": "Segmented meter",
          "description": "Capacity-normalized segments, available space, accessible values, linked selection and filtered file list.",
          "file": "components/charts/usage-chart-compositions.tsx",
          "previewKey": "charts-segmented-meter",
          "previewFile": "components/previews/charts/charts-segmented-meter.preview.tsx",
          "usageFile": "components/previews/charts/charts-segmented-meter.preview.tsx",
          "author": "asharca",
          "badge": "new",
          "launchedAt": "2026-11-04",
          "installSlug": "charts-segmented-meter"
        },
        {
          "slug": "charts-sparkline-composition",
          "name": "Sparkline",
          "description": "Four metric rows with colored sparklines and percentage changes, plus a comparison disclosure for supplied data.",
          "file": "components/charts/usage-chart-compositions.tsx",
          "previewKey": "charts-sparkline",
          "previewFile": "components/previews/charts/charts-sparkline.preview.tsx",
          "usageFile": "components/previews/charts/charts-sparkline.preview.tsx",
          "author": "asharca",
          "badge": "new",
          "launchedAt": "2026-11-04",
          "installSlug": "charts-sparkline-composition"
        }
      ]
    },
    "originalExample": {
      "slug": "original",
      "name": "Original",
      "file": "components/charts/bar-chart.tsx",
      "previewKey": "charts/bar-chart",
      "previewFile": "components/previews/charts/bar-chart.preview.tsx",
      "installSlug": "bar-chart"
    }
  },
  {
    "publicSlug": "data-table",
    "category": "motion",
    "existingEntrySlug": "table",
    "entry": {
      "slug": "table",
      "name": "Table",
      "description": "Reuses the existing generic Table renderer, virtualizer, columns, sorting UI and row selection. The new host-data composition applies global filter/sort before pagination, preserves stable IDs and provides mobile cards rather than duplicating a table primitive.",
      "file": "components/motion/product-data-table.tsx",
      "examples": [
        {
          "slug": "data-table-responsive-data-table",
          "name": "Responsive data table",
          "description": "Animated keyboard tabs, text search, multi-select filters, protected identity column, column visibility, sorting, stable selection and dedicated mobile cards.",
          "file": "components/motion/product-data-table.tsx",
          "previewKey": "data-table-responsive-data-table",
          "previewFile": "components/previews/motion/data-table-responsive-data-table.preview.tsx",
          "usageFile": "components/previews/motion/data-table-responsive-data-table.preview.tsx",
          "author": "asharca",
          "badge": "new",
          "launchedAt": "2026-11-04",
          "installSlug": "data-table-responsive-data-table"
        },
        {
          "slug": "data-table-virtual-data-table",
          "name": "Data table",
          "description": "10,000 explicit demo rows using existing Table virtualization with sorting, custom cells, filtering and stable selection.",
          "file": "components/motion/product-data-table.tsx",
          "previewKey": "data-table-data-table",
          "previewFile": "components/previews/motion/data-table-data-table.preview.tsx",
          "usageFile": "components/previews/motion/data-table-data-table.preview.tsx",
          "author": "asharca",
          "badge": "new",
          "launchedAt": "2026-11-04",
          "installSlug": "data-table-virtual-data-table"
        },
        {
          "slug": "data-table-paginated-data-table",
          "name": "Paginated data table",
          "description": "Global sorting before slicing, controlled/uncontrolled page and size, accessible first/previous/next/last navigation and clamp-on-shrink recovery.",
          "file": "components/motion/product-data-table.tsx",
          "previewKey": "data-table-paginated-data-table",
          "previewFile": "components/previews/motion/data-table-paginated-data-table.preview.tsx",
          "usageFile": "components/previews/motion/data-table-paginated-data-table.preview.tsx",
          "author": "asharca",
          "badge": "new",
          "launchedAt": "2026-11-04",
          "installSlug": "data-table-paginated-data-table"
        }
      ]
    }
  },
  {
    "publicSlug": "newsletter",
    "category": "blocks",
    "entry": {
      "slug": "newsletter",
      "name": "Newsletter",
      "description": "三种订阅布局；邮箱/偏好校验与异步提交；成功、失败与再次提交真实关联回调结果，不伪造订阅。",
      "file": "components/motion/newsletter.tsx",
      "examples": [
        {
          "slug": "issue-preview",
          "name": "Issue preview",
          "description": "Issue preview composition with host-owned content and accessible interactions.",
          "file": "components/motion/newsletter.tsx",
          "previewKey": "NewsletterIssuePreviewPreview",
          "previewFile": "components/previews/blocks/newsletter-issue-preview.preview.tsx",
          "usageFile": "components/previews/blocks/newsletter-issue-preview.usage.tsx",
          "author": "asharca",
          "badge": "new",
          "launchedAt": "2026-11-04",
          "installSlug": "newsletter"
        },
        {
          "slug": "inline-signup",
          "name": "Inline signup",
          "description": "Inline signup composition with host-owned content and accessible interactions.",
          "file": "components/motion/newsletter.tsx",
          "previewKey": "NewsletterInlineSignupPreview",
          "previewFile": "components/previews/blocks/newsletter-inline-signup.preview.tsx",
          "usageFile": "components/previews/blocks/newsletter-inline-signup.usage.tsx",
          "author": "asharca",
          "badge": "new",
          "launchedAt": "2026-11-04",
          "installSlug": "newsletter-inline-signup"
        },
        {
          "slug": "preferences-card",
          "name": "Preferences card",
          "description": "Topic and frequency preferences with an inset, shader-backed inbox of real host-supplied issue records.",
          "file": "components/motion/newsletter.tsx",
          "previewKey": "NewsletterPreferencesCardPreview",
          "previewFile": "components/previews/blocks/newsletter-preferences-card.preview.tsx",
          "usageFile": "components/previews/blocks/newsletter-preferences-card.usage.tsx",
          "author": "asharca",
          "badge": "new",
          "launchedAt": "2026-11-04",
          "installSlug": "newsletter-preferences-card"
        }
      ],
      "extraFiles": [
        "components/motion/conversion-artwork.tsx"
      ],
      "author": "asharca",
      "credit": {
        "name": "Asharca",
        "url": "https://github.com/asharca/ui"
      },
      "badge": "new",
      "launchedAt": "2026-11-04"
    }
  },
  {
    "publicSlug": "contact",
    "category": "blocks",
    "entry": {
      "slug": "contact",
      "name": "Contact",
      "description": "Routing、Office 与 Method 三种联系流程；字段校验与宿主提交；真实地址/渠道可配置，不伪造发送成功。",
      "file": "components/motion/contact.tsx",
      "examples": [
        {
          "slug": "routing-desk",
          "name": "Routing desk",
          "description": "Routing desk composition with host-owned content and accessible interactions.",
          "file": "components/motion/contact.tsx",
          "previewKey": "ContactRoutingDeskPreview",
          "previewFile": "components/previews/blocks/contact-routing-desk.preview.tsx",
          "usageFile": "components/previews/blocks/contact-routing-desk.usage.tsx",
          "author": "asharca",
          "badge": "new",
          "launchedAt": "2026-11-04",
          "installSlug": "contact"
        },
        {
          "slug": "office-split",
          "name": "Office split",
          "description": "Office split composition with host-owned content and accessible interactions.",
          "file": "components/motion/contact.tsx",
          "previewKey": "ContactOfficeSplitPreview",
          "previewFile": "components/previews/blocks/contact-office-split.preview.tsx",
          "usageFile": "components/previews/blocks/contact-office-split.usage.tsx",
          "author": "asharca",
          "badge": "new",
          "launchedAt": "2026-11-04",
          "installSlug": "contact-office-split"
        },
        {
          "slug": "method-cards",
          "name": "Method cards",
          "description": "Sales, support and community cards with original illustrative artwork, real destination links or a revealed host-submitted contact form, booking link and clipboard email action.",
          "file": "components/motion/contact.tsx",
          "previewKey": "ContactMethodCardsPreview",
          "previewFile": "components/previews/blocks/contact-method-cards.preview.tsx",
          "usageFile": "components/previews/blocks/contact-method-cards.usage.tsx",
          "author": "asharca",
          "badge": "new",
          "launchedAt": "2026-11-04",
          "installSlug": "contact-method-cards"
        }
      ],
      "author": "asharca",
      "credit": {
        "name": "Asharca",
        "url": "https://github.com/asharca/ui"
      },
      "badge": "new",
      "launchedAt": "2026-11-04"
    }
  },
  {
    "publicSlug": "team",
    "category": "blocks",
    "entry": {
      "slug": "team",
      "name": "Team",
      "description": "展开面板、Spotlight、网格与 Marquee 各有独立结构；成员选择、简介和社交链接同步；hover 以外提供焦点/触摸路径。",
      "file": "components/motion/team.tsx",
      "examples": [
        {
          "slug": "expanding-panels",
          "name": "Expanding panels",
          "description": "Expanding panels composition with host-owned content and accessible interactions.",
          "file": "components/motion/team.tsx",
          "previewKey": "TeamExpandingPanelsPreview",
          "previewFile": "components/previews/blocks/team-expanding-panels.preview.tsx",
          "usageFile": "components/previews/blocks/team-expanding-panels.usage.tsx",
          "author": "asharca",
          "badge": "new",
          "launchedAt": "2026-11-04",
          "installSlug": "team"
        },
        {
          "slug": "spotlight",
          "name": "Spotlight",
          "description": "Spotlight composition with host-owned content and accessible interactions.",
          "file": "components/motion/team.tsx",
          "previewKey": "TeamSpotlightPreview",
          "previewFile": "components/previews/blocks/team-spotlight.preview.tsx",
          "usageFile": "components/previews/blocks/team-spotlight.usage.tsx",
          "author": "asharca",
          "badge": "new",
          "launchedAt": "2026-11-04",
          "installSlug": "team-spotlight"
        },
        {
          "slug": "team-grid",
          "name": "Team grid",
          "description": "Four-column portrait grid with people and location social proof, role labels, live local clocks, hover and focus profile links, and a hiring card.",
          "file": "components/motion/team.tsx",
          "previewKey": "TeamTeamGridPreview",
          "previewFile": "components/previews/blocks/team-team-grid.preview.tsx",
          "usageFile": "components/previews/blocks/team-team-grid.usage.tsx",
          "author": "asharca",
          "badge": "new",
          "launchedAt": "2026-11-04",
          "installSlug": "team-team-grid"
        },
        {
          "slug": "team-marquee",
          "name": "Team marquee",
          "description": "Team marquee composition with host-owned content and accessible interactions.",
          "file": "components/motion/team.tsx",
          "previewKey": "TeamTeamMarqueePreview",
          "previewFile": "components/previews/blocks/team-team-marquee.preview.tsx",
          "usageFile": "components/previews/blocks/team-team-marquee.usage.tsx",
          "author": "asharca",
          "badge": "new",
          "launchedAt": "2026-11-04",
          "installSlug": "team-team-marquee"
        }
      ],
      "author": "asharca",
      "credit": {
        "name": "Asharca",
        "url": "https://github.com/asharca/ui"
      },
      "badge": "new",
      "launchedAt": "2026-11-04"
    }
  },
  {
    "publicSlug": "faq-blocks",
    "category": "blocks",
    "entry": {
      "slug": "faq-blocks",
      "name": "FAQ Blocks",
      "description": "编号、AI、堆叠、分栏与可搜索五种 FAQ；展开/收起、搜索空结果与定位有效；问题内容可配置。",
      "file": "components/motion/faq-blocks.tsx",
      "examples": [
        {
          "slug": "numbered-faq",
          "name": "Numbered FAQ",
          "description": "Numbered FAQ composition with host-owned content and accessible interactions.",
          "file": "components/motion/faq-blocks.tsx",
          "previewKey": "FaqBlocksNumberedFaqPreview",
          "previewFile": "components/previews/blocks/faq-blocks-numbered-faq.preview.tsx",
          "usageFile": "components/previews/blocks/faq-blocks-numbered-faq.usage.tsx",
          "author": "asharca",
          "badge": "new",
          "launchedAt": "2026-11-04",
          "installSlug": "faq-blocks"
        },
        {
          "slug": "ai-workspace-faq",
          "name": "AI workspace FAQ",
          "description": "AI workspace FAQ composition with host-owned content and accessible interactions.",
          "file": "components/motion/faq-blocks.tsx",
          "previewKey": "FaqBlocksAiWorkspaceFaqPreview",
          "previewFile": "components/previews/blocks/faq-blocks-ai-workspace-faq.preview.tsx",
          "usageFile": "components/previews/blocks/faq-blocks-ai-workspace-faq.usage.tsx",
          "author": "asharca",
          "badge": "new",
          "launchedAt": "2026-11-04",
          "installSlug": "faq-blocks-ai-workspace-faq"
        },
        {
          "slug": "stacked-faq",
          "name": "Stacked FAQ",
          "description": "Stacked FAQ composition with host-owned content and accessible interactions.",
          "file": "components/motion/faq-blocks.tsx",
          "previewKey": "FaqBlocksStackedFaqPreview",
          "previewFile": "components/previews/blocks/faq-blocks-stacked-faq.preview.tsx",
          "usageFile": "components/previews/blocks/faq-blocks-stacked-faq.usage.tsx",
          "author": "asharca",
          "badge": "new",
          "launchedAt": "2026-11-04",
          "installSlug": "faq-blocks-stacked-faq"
        },
        {
          "slug": "split-faq",
          "name": "Split FAQ",
          "description": "Split FAQ composition with host-owned content and accessible interactions.",
          "file": "components/motion/faq-blocks.tsx",
          "previewKey": "FaqBlocksSplitFaqPreview",
          "previewFile": "components/previews/blocks/faq-blocks-split-faq.preview.tsx",
          "usageFile": "components/previews/blocks/faq-blocks-split-faq.usage.tsx",
          "author": "asharca",
          "badge": "new",
          "launchedAt": "2026-11-04",
          "installSlug": "faq-blocks-split-faq"
        },
        {
          "slug": "searchable-faq",
          "name": "Searchable FAQ",
          "description": "Searchable FAQ composition with host-owned content and accessible interactions.",
          "file": "components/motion/faq-blocks.tsx",
          "previewKey": "FaqBlocksSearchableFaqPreview",
          "previewFile": "components/previews/blocks/faq-blocks-searchable-faq.preview.tsx",
          "usageFile": "components/previews/blocks/faq-blocks-searchable-faq.usage.tsx",
          "author": "asharca",
          "badge": "new",
          "launchedAt": "2026-11-04",
          "installSlug": "faq-blocks-searchable-faq"
        }
      ],
      "extraFiles": [
        "components/motion/conversion-artwork.tsx"
      ],
      "author": "asharca",
      "credit": {
        "name": "Asharca",
        "url": "https://github.com/asharca/ui"
      },
      "badge": "new",
      "launchedAt": "2026-11-04"
    }
  },
  {
    "publicSlug": "cta-sections",
    "category": "blocks",
    "entry": {
      "slug": "cta-sections",
      "name": "CTA Sections",
      "description": "十种 CTA 分别实现公开叙述的独立结构；链接、终端动作、FAQ 或媒体切换接宿主；无空点击按钮。",
      "file": "components/motion/cta-sections.tsx",
      "examples": [
        {
          "slug": "sunflower-cta",
          "name": "Sunflower CTA",
          "description": "Sunflower CTA composition with host-owned content and accessible interactions.",
          "file": "components/motion/cta-sections.tsx",
          "previewKey": "CtaSectionsSunflowerCtaPreview",
          "previewFile": "components/previews/blocks/cta-sections-sunflower-cta.preview.tsx",
          "usageFile": "components/previews/blocks/cta-sections-sunflower-cta.usage.tsx",
          "author": "asharca",
          "badge": "new",
          "launchedAt": "2026-11-04",
          "installSlug": "cta-sections"
        },
        {
          "slug": "floating-gallery-cta",
          "name": "Floating gallery CTA",
          "description": "Floating gallery CTA composition with host-owned content and accessible interactions.",
          "file": "components/motion/cta-sections.tsx",
          "previewKey": "CtaSectionsFloatingGalleryCtaPreview",
          "previewFile": "components/previews/blocks/cta-sections-floating-gallery-cta.preview.tsx",
          "usageFile": "components/previews/blocks/cta-sections-floating-gallery-cta.usage.tsx",
          "author": "asharca",
          "badge": "new",
          "launchedAt": "2026-11-04",
          "installSlug": "cta-sections-floating-gallery-cta"
        },
        {
          "slug": "portrait-frame-cta",
          "name": "Portrait frame CTA",
          "description": "Portrait frame CTA composition with host-owned content and accessible interactions.",
          "file": "components/motion/cta-sections.tsx",
          "previewKey": "CtaSectionsPortraitFrameCtaPreview",
          "previewFile": "components/previews/blocks/cta-sections-portrait-frame-cta.preview.tsx",
          "usageFile": "components/previews/blocks/cta-sections-portrait-frame-cta.usage.tsx",
          "author": "asharca",
          "badge": "new",
          "launchedAt": "2026-11-04",
          "installSlug": "cta-sections-portrait-frame-cta"
        },
        {
          "slug": "product-window-cta",
          "name": "Product window CTA",
          "description": "Product window CTA composition with host-owned content and accessible interactions.",
          "file": "components/motion/cta-sections.tsx",
          "previewKey": "CtaSectionsProductWindowCtaPreview",
          "previewFile": "components/previews/blocks/cta-sections-product-window-cta.preview.tsx",
          "usageFile": "components/previews/blocks/cta-sections-product-window-cta.usage.tsx",
          "author": "asharca",
          "badge": "new",
          "launchedAt": "2026-11-04",
          "installSlug": "cta-sections-product-window-cta"
        },
        {
          "slug": "proof-orbit-cta",
          "name": "Proof orbit CTA",
          "description": "Proof orbit CTA composition with host-owned content and accessible interactions.",
          "file": "components/motion/cta-sections.tsx",
          "previewKey": "CtaSectionsProofOrbitCtaPreview",
          "previewFile": "components/previews/blocks/cta-sections-proof-orbit-cta.preview.tsx",
          "usageFile": "components/previews/blocks/cta-sections-proof-orbit-cta.usage.tsx",
          "author": "asharca",
          "badge": "new",
          "launchedAt": "2026-11-04",
          "installSlug": "cta-sections-proof-orbit-cta"
        },
        {
          "slug": "shade-panel-cta",
          "name": "Shade panel CTA",
          "description": "Shade panel CTA composition with host-owned content and accessible interactions.",
          "file": "components/motion/cta-sections.tsx",
          "previewKey": "CtaSectionsShadePanelCtaPreview",
          "previewFile": "components/previews/blocks/cta-sections-shade-panel-cta.preview.tsx",
          "usageFile": "components/previews/blocks/cta-sections-shade-panel-cta.usage.tsx",
          "author": "asharca",
          "badge": "new",
          "launchedAt": "2026-11-04",
          "installSlug": "cta-sections-shade-panel-cta"
        },
        {
          "slug": "liquid-cta",
          "name": "Liquid CTA",
          "description": "Liquid CTA composition with host-owned content and accessible interactions.",
          "file": "components/motion/cta-sections.tsx",
          "previewKey": "CtaSectionsLiquidCtaPreview",
          "previewFile": "components/previews/blocks/cta-sections-liquid-cta.preview.tsx",
          "usageFile": "components/previews/blocks/cta-sections-liquid-cta.usage.tsx",
          "author": "asharca",
          "badge": "new",
          "launchedAt": "2026-11-04",
          "installSlug": "cta-sections-liquid-cta"
        },
        {
          "slug": "terminal-cta",
          "name": "Terminal CTA",
          "description": "Terminal CTA composition with host-owned content and accessible interactions.",
          "file": "components/motion/cta-sections.tsx",
          "previewKey": "CtaSectionsTerminalCtaPreview",
          "previewFile": "components/previews/blocks/cta-sections-terminal-cta.preview.tsx",
          "usageFile": "components/previews/blocks/cta-sections-terminal-cta.usage.tsx",
          "author": "asharca",
          "badge": "new",
          "launchedAt": "2026-11-04",
          "installSlug": "cta-sections-terminal-cta"
        },
        {
          "slug": "faq-cta",
          "name": "FAQ CTA",
          "description": "FAQ CTA composition with host-owned content and accessible interactions.",
          "file": "components/motion/cta-sections.tsx",
          "previewKey": "CtaSectionsFaqCtaPreview",
          "previewFile": "components/previews/blocks/cta-sections-faq-cta.preview.tsx",
          "usageFile": "components/previews/blocks/cta-sections-faq-cta.usage.tsx",
          "author": "asharca",
          "badge": "new",
          "launchedAt": "2026-11-04",
          "installSlug": "cta-sections-faq-cta"
        },
        {
          "slug": "split-cta",
          "name": "Split CTA",
          "description": "Split CTA composition with host-owned content and accessible interactions.",
          "file": "components/motion/cta-sections.tsx",
          "previewKey": "CtaSectionsSplitCtaPreview",
          "previewFile": "components/previews/blocks/cta-sections-split-cta.preview.tsx",
          "usageFile": "components/previews/blocks/cta-sections-split-cta.usage.tsx",
          "author": "asharca",
          "badge": "new",
          "launchedAt": "2026-11-04",
          "installSlug": "cta-sections-split-cta"
        }
      ],
      "extraFiles": [
        "components/motion/conversion-artwork.tsx"
      ],
      "author": "asharca",
      "credit": {
        "name": "Asharca",
        "url": "https://github.com/asharca/ui"
      },
      "badge": "new",
      "launchedAt": "2026-11-04"
    }
  },
  {
    "publicSlug": "hero-sections",
    "category": "blocks",
    "entry": {
      "slug": "hero-sections",
      "name": "Hero Sections",
      "description": "Twelve complete product hero compositions with source-backed demos, host actions and accessible navigation.",
      "file": "components/motion/hero-sections.tsx",
      "extraFiles": [
        "components/motion/marketing-story.tsx"
      ],
      "examples": [
        {
          "slug": "analytics-flow",
          "name": "Analytics flow",
          "description": "Centered analytics reports with totals, comparisons, source breakdowns and focused insight briefs.",
          "file": "components/motion/hero-sections.tsx",
          "previewKey": "blocks/hero-sections-analytics-flow",
          "previewFile": "components/previews/blocks/hero-sections-analytics-flow.preview.tsx",
          "author": "asharca",
          "badge": "new",
          "launchedAt": "2026-11-04",
          "installSlug": "hero-sections"
        },
        {
          "slug": "ai-teammates",
          "name": "AI teammates",
          "description": "Asymmetric teammate discovery with searchable roster, sample conversations, source notes and review briefs.",
          "file": "components/motion/hero-sections.tsx",
          "previewKey": "blocks/hero-sections-ai-teammates",
          "previewFile": "components/previews/blocks/hero-sections-ai-teammates.preview.tsx",
          "author": "asharca",
          "badge": "new",
          "launchedAt": "2026-11-04",
          "installSlug": "hero-sections-ai-teammates"
        },
        {
          "slug": "voice-mobile",
          "name": "Voice mobile",
          "description": "Editorial voice-note hero with transcript options, linked ready actions and controlled recording presentation or host-adapter lifecycle.",
          "file": "components/motion/hero-sections.tsx",
          "previewKey": "blocks/hero-sections-voice-mobile",
          "previewFile": "components/previews/blocks/hero-sections-voice-mobile.preview.tsx",
          "author": "asharca",
          "badge": "new",
          "launchedAt": "2026-11-04",
          "installSlug": "hero-sections-voice-mobile"
        },
        {
          "slug": "workflow-aurora",
          "name": "Workflow aurora",
          "description": "Aurora-framed SaaS positioning with responsive navigation, announcement and paired conversion paths.",
          "file": "components/motion/hero-sections.tsx",
          "previewKey": "blocks/hero-sections-workflow-aurora",
          "previewFile": "components/previews/blocks/hero-sections-workflow-aurora.preview.tsx",
          "author": "asharca",
          "badge": "new",
          "launchedAt": "2026-11-04",
          "installSlug": "hero-sections-workflow-aurora"
        },
        {
          "slug": "defi-routing",
          "name": "DeFi routing",
          "description": "Non-custodial wallet presentation with host email capture, selectable balances, expandable history, account and notification dialogs, and reviewed host-owned deposit or transfer requests.",
          "file": "components/motion/hero-sections.tsx",
          "previewKey": "blocks/hero-sections-defi-routing",
          "previewFile": "components/previews/blocks/hero-sections-defi-routing.preview.tsx",
          "author": "asharca",
          "badge": "new",
          "launchedAt": "2026-11-04",
          "installSlug": "hero-sections-defi-routing"
        },
        {
          "slug": "ai-marketplace",
          "name": "AI marketplace",
          "description": "Prompt composer with real file selection and removal, web-search intent and host-controlled matching context, pending, empty and rejection states.",
          "file": "components/motion/hero-sections.tsx",
          "previewKey": "blocks/hero-sections-ai-marketplace",
          "previewFile": "components/previews/blocks/hero-sections-ai-marketplace.preview.tsx",
          "author": "asharca",
          "badge": "new",
          "launchedAt": "2026-11-04",
          "installSlug": "hero-sections-ai-marketplace"
        },
        {
          "slug": "signal-aurora",
          "name": "Signal aurora",
          "description": "Editorial intelligence hero with WebGL/CSS atmosphere, signal proof and pausable company links.",
          "file": "components/motion/hero-sections.tsx",
          "previewKey": "blocks/hero-sections-signal-aurora",
          "previewFile": "components/previews/blocks/hero-sections-signal-aurora.preview.tsx",
          "author": "asharca",
          "badge": "new",
          "launchedAt": "2026-11-04",
          "installSlug": "hero-sections-signal-aurora"
        },
        {
          "slug": "workflow-split",
          "name": "Workflow split",
          "description": "Email capture and trusted marks beside a selectable agent-operations dashboard with task details.",
          "file": "components/motion/hero-sections.tsx",
          "previewKey": "blocks/hero-sections-workflow-split",
          "previewFile": "components/previews/blocks/hero-sections-workflow-split.preview.tsx",
          "author": "asharca",
          "badge": "new",
          "launchedAt": "2026-11-04",
          "installSlug": "hero-sections-workflow-split"
        },
        {
          "slug": "agent-centered",
          "name": "Agent centered",
          "description": "Two-tone centered positioning above a frosted incident timeline and corresponding chat playback.",
          "file": "components/motion/hero-sections.tsx",
          "previewKey": "blocks/hero-sections-agent-centered",
          "previewFile": "components/previews/blocks/hero-sections-agent-centered.preview.tsx",
          "author": "asharca",
          "badge": "new",
          "launchedAt": "2026-11-04",
          "installSlug": "hero-sections-agent-centered"
        },
        {
          "slug": "code-demo",
          "name": "Code demo",
          "description": "Split inference positioning above an original scenic terminal with sample streaming and clipboard copying.",
          "file": "components/motion/hero-sections.tsx",
          "previewKey": "blocks/hero-sections-code-demo",
          "previewFile": "components/previews/blocks/hero-sections-code-demo.preview.tsx",
          "author": "asharca",
          "badge": "new",
          "launchedAt": "2026-11-04",
          "installSlug": "hero-sections-code-demo"
        },
        {
          "slug": "centered-demo",
          "name": "Centered demo",
          "description": "Centered knowledge positioning above selectable, stepwise cited answer playback.",
          "file": "components/motion/hero-sections.tsx",
          "previewKey": "blocks/hero-sections-centered-demo",
          "previewFile": "components/previews/blocks/hero-sections-centered-demo.preview.tsx",
          "author": "asharca",
          "badge": "new",
          "launchedAt": "2026-11-04",
          "installSlug": "hero-sections-centered-demo"
        },
        {
          "slug": "centered-marquee",
          "name": "Centered marquee",
          "description": "Eyebrow, centered statement and paired CTAs above a hover/focus/explicitly pausable wordmark strip.",
          "file": "components/motion/hero-sections.tsx",
          "previewKey": "blocks/hero-sections-centered-marquee",
          "previewFile": "components/previews/blocks/hero-sections-centered-marquee.preview.tsx",
          "author": "asharca",
          "badge": "new",
          "launchedAt": "2026-11-04",
          "installSlug": "hero-sections-centered-marquee"
        }
      ],
      "author": "asharca",
      "credit": {
        "name": "Asharca",
        "url": "https://github.com/asharca/ui"
      },
      "badge": "new",
      "launchedAt": "2026-11-04"
    }
  },
  {
    "publicSlug": "content-sections",
    "category": "blocks",
    "entry": {
      "slug": "content-sections",
      "name": "Content Sections",
      "description": "Five illustrated narrative systems for capabilities, metrics, values and selectable customer journeys.",
      "file": "components/motion/content-sections.tsx",
      "extraFiles": [
        "components/motion/marketing-story.tsx"
      ],
      "examples": [
        {
          "slug": "platform-overview",
          "name": "Platform overview",
          "description": "Three independently illustrated capability columns with features, supporting metrics and links.",
          "file": "components/motion/content-sections.tsx",
          "previewKey": "blocks/content-sections-platform-overview",
          "previewFile": "components/previews/blocks/content-sections-platform-overview.preview.tsx",
          "author": "asharca",
          "badge": "new",
          "launchedAt": "2026-11-04",
          "installSlug": "content-sections"
        },
        {
          "slug": "isometric-metrics-gallery",
          "name": "Isometric metrics gallery",
          "description": "Responsive metric gallery with original isometric sketches, theme-aware fades and reveal motion.",
          "file": "components/motion/content-sections.tsx",
          "previewKey": "blocks/content-sections-isometric-metrics-gallery",
          "previewFile": "components/previews/blocks/content-sections-isometric-metrics-gallery.preview.tsx",
          "author": "asharca",
          "badge": "new",
          "launchedAt": "2026-11-04",
          "installSlug": "content-sections-isometric-metrics-gallery"
        },
        {
          "slug": "capability-showcase",
          "name": "Capability showcase",
          "description": "Asymmetric blur-revealed narrative, proof points and offset duotone nature capability cards.",
          "file": "components/motion/content-sections.tsx",
          "previewKey": "blocks/content-sections-capability-showcase",
          "previewFile": "components/previews/blocks/content-sections-capability-showcase.preview.tsx",
          "author": "asharca",
          "badge": "new",
          "launchedAt": "2026-11-04",
          "installSlug": "content-sections-capability-showcase"
        },
        {
          "slug": "value-grid",
          "name": "Value grid",
          "description": "Centered statement and paired CTAs above three grain-textured value illustration cards.",
          "file": "components/motion/content-sections.tsx",
          "previewKey": "blocks/content-sections-value-grid",
          "previewFile": "components/previews/blocks/content-sections-value-grid.preview.tsx",
          "author": "asharca",
          "badge": "new",
          "launchedAt": "2026-11-04",
          "installSlug": "content-sections-value-grid"
        },
        {
          "slug": "engagement-sequence",
          "name": "Engagement sequence",
          "description": "Selectable customer-story chapters with journey artwork, matching product conversations and viewport-aware playback.",
          "file": "components/motion/content-sections.tsx",
          "previewKey": "blocks/content-sections-engagement-sequence",
          "previewFile": "components/previews/blocks/content-sections-engagement-sequence.preview.tsx",
          "author": "asharca",
          "badge": "new",
          "launchedAt": "2026-11-04",
          "installSlug": "content-sections-engagement-sequence"
        }
      ],
      "author": "asharca",
      "credit": {
        "name": "Asharca",
        "url": "https://github.com/asharca/ui"
      },
      "badge": "new",
      "launchedAt": "2026-11-04"
    }
  },
  {
    "publicSlug": "what-we-offer",
    "category": "blocks",
    "entry": {
      "slug": "what-we-offer",
      "name": "What We Offer",
      "description": "Three interactive capability-offering compositions built around real content and host-owned outcomes.",
      "file": "components/motion/what-we-offer.tsx",
      "extraFiles": [
        "components/motion/marketing-story.tsx"
      ],
      "examples": [
        {
          "slug": "offer-bento",
          "name": "Offer bento",
          "description": "Wide lead tile, routing/knowledge/tool-check/trace illustrations and image-backed metric with working disclosures.",
          "file": "components/motion/what-we-offer.tsx",
          "previewKey": "blocks/what-we-offer-offer-bento",
          "previewFile": "components/previews/blocks/what-we-offer-offer-bento.preview.tsx",
          "author": "asharca",
          "badge": "new",
          "launchedAt": "2026-11-04",
          "installSlug": "what-we-offer"
        },
        {
          "slug": "layered-control-stack",
          "name": "Layered control stack",
          "description": "Layered workflow run presentation with host step state, elapsed time, errors and a real run callback.",
          "file": "components/motion/what-we-offer.tsx",
          "previewKey": "blocks/what-we-offer-layered-control-stack",
          "previewFile": "components/previews/blocks/what-we-offer-layered-control-stack.preview.tsx",
          "author": "asharca",
          "badge": "new",
          "launchedAt": "2026-11-04",
          "installSlug": "what-we-offer-layered-control-stack"
        },
        {
          "slug": "connected-workflow",
          "name": "Connected workflow",
          "description": "Four capability cards connected to a hub with selectable details, keyboard/hover focus and pulse playback.",
          "file": "components/motion/what-we-offer.tsx",
          "previewKey": "blocks/what-we-offer-connected-workflow",
          "previewFile": "components/previews/blocks/what-we-offer-connected-workflow.preview.tsx",
          "author": "asharca",
          "badge": "new",
          "launchedAt": "2026-11-04",
          "installSlug": "what-we-offer-connected-workflow"
        }
      ],
      "author": "asharca",
      "credit": {
        "name": "Asharca",
        "url": "https://github.com/asharca/ui"
      },
      "badge": "new",
      "launchedAt": "2026-11-04"
    }
  },
  {
    "publicSlug": "ai-artifacts",
    "category": "agents",
    "entry": {
      "slug": "ai-artifacts",
      "name": "AI Artifacts",
      "description": "Safe versioned code and document artifacts with exact-content copying, download and host-owned document saves.",
      "file": "components/agents/ai-artifacts.tsx",
      "examples": [
        {
          "slug": "code-artifact",
          "name": "Code artifact",
          "description": "Interactive code artifact with host-owned data and actions.",
          "file": "components/agents/ai-artifacts.tsx",
          "previewKey": "CodeArtifactPreview",
          "previewFile": "components/previews/agents/ai-artifacts-code-artifact.preview.tsx",
          "usageFile": "components/previews/agents/ai-artifacts-code-artifact.preview.tsx",
          "author": "asharca",
          "badge": "new",
          "launchedAt": "2026-11-04",
          "installSlug": "ai-artifacts"
        },
        {
          "slug": "document-artifact",
          "name": "Document artifact",
          "description": "Interactive document artifact with host-owned data and actions.",
          "file": "components/agents/ai-artifacts.tsx",
          "previewKey": "DocumentArtifactPreview",
          "previewFile": "components/previews/agents/ai-artifacts-document-artifact.preview.tsx",
          "usageFile": "components/previews/agents/ai-artifacts-document-artifact.preview.tsx",
          "author": "asharca",
          "badge": "new",
          "launchedAt": "2026-11-04",
          "installSlug": "ai-artifacts-document-artifact"
        }
      ],
      "author": "asharca",
      "credit": {
        "name": "Asharca",
        "url": "https://github.com/asharca/ui"
      },
      "badge": "new",
      "launchedAt": "2026-11-04"
    }
  },
  {
    "publicSlug": "research-sources",
    "category": "agents",
    "entry": {
      "slug": "research-sources",
      "name": "Research Sources",
      "description": "Searchable, typed reference cards with excerpts, source URLs and controlled context selection.",
      "file": "components/agents/research-sources.tsx",
      "examples": [
        {
          "slug": "research-sources",
          "name": "Research Sources",
          "description": "Interactive research sources with host-owned data and actions.",
          "file": "components/agents/research-sources.tsx",
          "previewKey": "ResearchSourcesPreview",
          "previewFile": "components/previews/agents/research-sources-research-sources.preview.tsx",
          "usageFile": "components/previews/agents/research-sources-research-sources.preview.tsx",
          "author": "asharca",
          "badge": "new",
          "launchedAt": "2026-11-04",
          "installSlug": "research-sources"
        }
      ],
      "author": "asharca",
      "credit": {
        "name": "Asharca",
        "url": "https://github.com/asharca/ui"
      },
      "badge": "new",
      "launchedAt": "2026-11-04"
    }
  },
  {
    "publicSlug": "agent-chat-input",
    "category": "agents",
    "entry": {
      "slug": "agent-chat-input",
      "name": "Agent Chat Input",
      "description": "Four distinct host-connected composers for creative output, compact messaging, agent studios and credits-aware workflows.",
      "file": "components/agents/agent-chat-input.tsx",
      "examples": [
        {
          "slug": "creative-composer",
          "name": "Creative composer",
          "description": "Image and video composer with output, resolution, aspect-ratio and model menus; attachments and send settings reach the host.",
          "file": "components/agents/agent-chat-input.tsx",
          "previewKey": "CreativeComposerPreview",
          "previewFile": "components/previews/agents/agent-chat-input-creative-composer.preview.tsx",
          "usageFile": "components/previews/agents/agent-chat-input-creative-composer.preview.tsx",
          "author": "asharca",
          "badge": "new",
          "launchedAt": "2026-11-04",
          "installSlug": "agent-chat-input"
        },
        {
          "slug": "pill-composer",
          "name": "Pill composer",
          "description": "Compact messaging pill that expands for multiline drafts, with model choice, attachments, dictation and voice callbacks.",
          "file": "components/agents/agent-chat-input.tsx",
          "previewKey": "PillComposerPreview",
          "previewFile": "components/previews/agents/agent-chat-input-pill-composer.preview.tsx",
          "usageFile": "components/previews/agents/agent-chat-input-pill-composer.preview.tsx",
          "author": "asharca",
          "badge": "new",
          "launchedAt": "2026-11-04",
          "installSlug": "agent-chat-input-pill-composer"
        },
        {
          "slug": "studio-composer",
          "name": "Studio composer",
          "description": "Studio composer with research trace, host-supplied agent choice, combined model, reasoning and speed menus, and queued messages.",
          "file": "components/agents/agent-chat-input.tsx",
          "previewKey": "StudioComposerPreview",
          "previewFile": "components/previews/agents/agent-chat-input-studio-composer.preview.tsx",
          "usageFile": "components/previews/agents/agent-chat-input-studio-composer.preview.tsx",
          "author": "asharca",
          "badge": "new",
          "launchedAt": "2026-11-04",
          "installSlug": "agent-chat-input-studio-composer"
        },
        {
          "slug": "credits-composer",
          "name": "Credits composer",
          "description": "Credits-layered composer with dismissible balance notice, upgrade callback, search, research and knowledge toggles, and real host submissions.",
          "file": "components/agents/agent-chat-input.tsx",
          "previewKey": "CreditsComposerPreview",
          "previewFile": "components/previews/agents/agent-chat-input-credits-composer.preview.tsx",
          "usageFile": "components/previews/agents/agent-chat-input-credits-composer.preview.tsx",
          "author": "asharca",
          "badge": "new",
          "launchedAt": "2026-11-04",
          "installSlug": "agent-chat-input-credits-composer"
        }
      ],
      "author": "asharca",
      "credit": {
        "name": "Asharca",
        "url": "https://github.com/asharca/ui"
      },
      "badge": "new",
      "launchedAt": "2026-11-04"
    }
  },
  {
    "publicSlug": "voice-agent",
    "category": "agents",
    "entry": {
      "slug": "voice-agent",
      "name": "Voice Agent",
      "description": "Centered orb sessions and compact voice docks with host-controlled phases, mute, device routing and connection actions.",
      "file": "components/agents/voice-agent.tsx",
      "examples": [
        {
          "slug": "orb-session",
          "name": "Orb session",
          "description": "Interactive orb session with host-owned data and actions.",
          "file": "components/agents/voice-agent.tsx",
          "previewKey": "OrbSessionPreview",
          "previewFile": "components/previews/agents/voice-agent-orb-session.preview.tsx",
          "usageFile": "components/previews/agents/voice-agent-orb-session.preview.tsx",
          "author": "asharca",
          "badge": "new",
          "launchedAt": "2026-11-04",
          "installSlug": "voice-agent"
        },
        {
          "slug": "voice-dock",
          "name": "Voice dock",
          "description": "Interactive voice dock with host-owned data and actions.",
          "file": "components/agents/voice-agent.tsx",
          "previewKey": "VoiceDockPreview",
          "previewFile": "components/previews/agents/voice-agent-voice-dock.preview.tsx",
          "usageFile": "components/previews/agents/voice-agent-voice-dock.preview.tsx",
          "author": "asharca",
          "badge": "new",
          "launchedAt": "2026-11-04",
          "installSlug": "voice-agent-voice-dock"
        }
      ],
      "author": "asharca",
      "credit": {
        "name": "Asharca",
        "url": "https://github.com/asharca/ui"
      },
      "badge": "new",
      "launchedAt": "2026-11-04"
    }
  },
  {
    "publicSlug": "voice-conversation",
    "category": "agents",
    "entry": {
      "slug": "voice-conversation",
      "name": "Voice Conversation",
      "description": "Audio-level meters, speaker-attributed transcript and real playback hooks alongside host-owned voice session controls.",
      "file": "components/agents/voice-conversation.tsx",
      "extraFiles": [
        "components/agents/voice-agent.tsx"
      ],
      "examples": [
        {
          "slug": "voice-conversation",
          "name": "Voice conversation",
          "description": "Interactive voice conversation with host-owned data and actions.",
          "file": "components/agents/voice-conversation.tsx",
          "previewKey": "VoiceConversationPreview",
          "previewFile": "components/previews/agents/voice-conversation-voice-conversation.preview.tsx",
          "usageFile": "components/previews/agents/voice-conversation-voice-conversation.preview.tsx",
          "author": "asharca",
          "badge": "new",
          "launchedAt": "2026-11-04",
          "installSlug": "voice-conversation"
        }
      ],
      "author": "asharca",
      "credit": {
        "name": "Asharca",
        "url": "https://github.com/asharca/ui"
      },
      "badge": "new",
      "launchedAt": "2026-11-04"
    }
  },
  {
    "publicSlug": "auth",
    "category": "blocks",
    "entry": {
      "slug": "auth",
      "name": "Auth",
      "description": "Host-connected account pages with six original layouts, validated credentials, social callbacks and a passwordless code flow.",
      "file": "components/motion/auth-pages.tsx",
      "examples": [
        {
          "slug": "landscape-card",
          "name": "Landscape card",
          "description": "Landscape card: interactive host-owned auth composition.",
          "file": "components/motion/auth-pages.tsx",
          "previewKey": "AuthLandscapeCardPreview",
          "previewFile": "components/previews/blocks/auth-landscape-card.preview.tsx",
          "usageFile": "components/previews/blocks/auth-landscape-card.usage.tsx",
          "author": "asharca",
          "badge": "new",
          "launchedAt": "2026-11-04",
          "installSlug": "auth"
        },
        {
          "slug": "split-showcase",
          "name": "Split showcase",
          "description": "Split showcase: interactive host-owned auth composition.",
          "file": "components/motion/auth-pages.tsx",
          "previewKey": "AuthSplitShowcasePreview",
          "previewFile": "components/previews/blocks/auth-split-showcase.preview.tsx",
          "usageFile": "components/previews/blocks/auth-split-showcase.usage.tsx",
          "author": "asharca",
          "badge": "new",
          "launchedAt": "2026-11-04",
          "installSlug": "auth-split-showcase"
        },
        {
          "slug": "centered-card",
          "name": "Centered card",
          "description": "Centered card: interactive host-owned auth composition.",
          "file": "components/motion/auth-pages.tsx",
          "previewKey": "AuthCenteredCardPreview",
          "previewFile": "components/previews/blocks/auth-centered-card.preview.tsx",
          "usageFile": "components/previews/blocks/auth-centered-card.usage.tsx",
          "author": "asharca",
          "badge": "new",
          "launchedAt": "2026-11-04",
          "installSlug": "auth-centered-card"
        },
        {
          "slug": "magic-code",
          "name": "Magic code",
          "description": "Magic code: interactive host-owned auth composition.",
          "file": "components/motion/auth-pages.tsx",
          "previewKey": "AuthMagicCodePreview",
          "previewFile": "components/previews/blocks/auth-magic-code.preview.tsx",
          "usageFile": "components/previews/blocks/auth-magic-code.usage.tsx",
          "author": "asharca",
          "badge": "new",
          "launchedAt": "2026-11-04",
          "installSlug": "auth-magic-code"
        },
        {
          "slug": "atlas-centered",
          "name": "Atlas centered",
          "description": "Atlas centered: interactive host-owned auth composition.",
          "file": "components/motion/auth-pages.tsx",
          "previewKey": "AuthAtlasCenteredPreview",
          "previewFile": "components/previews/blocks/auth-atlas-centered.preview.tsx",
          "usageFile": "components/previews/blocks/auth-atlas-centered.usage.tsx",
          "author": "asharca",
          "badge": "new",
          "launchedAt": "2026-11-04",
          "installSlug": "auth-atlas-centered"
        },
        {
          "slug": "atlas-split",
          "name": "Atlas split",
          "description": "Atlas split: interactive host-owned auth composition.",
          "file": "components/motion/auth-pages.tsx",
          "previewKey": "AuthAtlasSplitPreview",
          "previewFile": "components/previews/blocks/auth-atlas-split.preview.tsx",
          "usageFile": "components/previews/blocks/auth-atlas-split.usage.tsx",
          "author": "asharca",
          "badge": "new",
          "launchedAt": "2026-11-04",
          "installSlug": "auth-atlas-split"
        }
      ],
      "author": "asharca",
      "credit": {
        "name": "Asharca",
        "url": "https://github.com/asharca/ui"
      },
      "badge": "new",
      "launchedAt": "2026-11-04"
    }
  },
  {
    "publicSlug": "onboarding",
    "category": "blocks",
    "entry": {
      "slug": "onboarding",
      "name": "Onboarding",
      "description": "Three complete onboarding compositions with draft preservation, validation, file selection, live workspace preview and an accessible checklist dialog.",
      "file": "components/motion/onboarding-pages.tsx",
      "examples": [
        {
          "slug": "stepped-onboarding",
          "name": "Stepped onboarding",
          "description": "Stepped onboarding: interactive host-owned onboarding composition.",
          "file": "components/motion/onboarding-pages.tsx",
          "previewKey": "OnboardingSteppedOnboardingPreview",
          "previewFile": "components/previews/blocks/onboarding-stepped-onboarding.preview.tsx",
          "usageFile": "components/previews/blocks/onboarding-stepped-onboarding.usage.tsx",
          "author": "asharca",
          "badge": "new",
          "launchedAt": "2026-11-04",
          "installSlug": "onboarding"
        },
        {
          "slug": "split-screen",
          "name": "Split screen",
          "description": "Split screen: interactive host-owned onboarding composition.",
          "file": "components/motion/onboarding-pages.tsx",
          "previewKey": "OnboardingSplitScreenPreview",
          "previewFile": "components/previews/blocks/onboarding-split-screen.preview.tsx",
          "usageFile": "components/previews/blocks/onboarding-split-screen.usage.tsx",
          "author": "asharca",
          "badge": "new",
          "launchedAt": "2026-11-04",
          "installSlug": "onboarding-split-screen"
        },
        {
          "slug": "checklist-dialog",
          "name": "Checklist dialog",
          "description": "Checklist dialog: interactive host-owned onboarding composition.",
          "file": "components/motion/onboarding-pages.tsx",
          "previewKey": "OnboardingChecklistDialogPreview",
          "previewFile": "components/previews/blocks/onboarding-checklist-dialog.preview.tsx",
          "usageFile": "components/previews/blocks/onboarding-checklist-dialog.usage.tsx",
          "author": "asharca",
          "badge": "new",
          "launchedAt": "2026-11-04",
          "installSlug": "onboarding-checklist-dialog"
        }
      ],
      "author": "asharca",
      "credit": {
        "name": "Asharca",
        "url": "https://github.com/asharca/ui"
      },
      "badge": "new",
      "launchedAt": "2026-11-04"
    }
  },
  {
    "publicSlug": "checkout-pages",
    "category": "blocks",
    "entry": {
      "slug": "checkout-pages",
      "name": "Checkout Pages",
      "description": "A host-driven three-stage checkout with explicit pricing rules, secure payment composition, pending/error states and confirmed receipts.",
      "file": "components/motion/checkout-pages.tsx",
      "examples": [
        {
          "slug": "checkout-flow",
          "name": "Checkout flow",
          "description": "Checkout flow: interactive host-owned checkout pages composition.",
          "file": "components/motion/checkout-pages.tsx",
          "previewKey": "CheckoutPagesCheckoutFlowPreview",
          "previewFile": "components/previews/blocks/checkout-pages-checkout-flow.preview.tsx",
          "usageFile": "components/previews/blocks/checkout-pages-checkout-flow.usage.tsx",
          "author": "asharca",
          "badge": "new",
          "launchedAt": "2026-11-04",
          "installSlug": "checkout-pages"
        }
      ],
      "author": "asharca",
      "credit": {
        "name": "Asharca",
        "url": "https://github.com/asharca/ui"
      },
      "badge": "new",
      "launchedAt": "2026-11-04"
    }
  },
  {
    "publicSlug": "settings-pages",
    "category": "blocks",
    "entry": {
      "slug": "settings-pages",
      "name": "Settings Pages",
      "description": "Organization, workspace and billing settings with transactional save/discard, dirty-navigation protection and host-authorized team and payment operations.",
      "file": "components/motion/account-settings-pages.tsx",
      "examples": [
        {
          "slug": "organization-settings",
          "name": "Organization settings",
          "description": "Organization settings: interactive host-owned settings pages composition.",
          "file": "components/motion/account-settings-pages.tsx",
          "previewKey": "SettingsPagesOrganizationSettingsPreview",
          "previewFile": "components/previews/blocks/settings-pages-organization-settings.preview.tsx",
          "usageFile": "components/previews/blocks/settings-pages-organization-settings.usage.tsx",
          "author": "asharca",
          "badge": "new",
          "launchedAt": "2026-11-04",
          "installSlug": "settings-pages"
        },
        {
          "slug": "workspace-settings",
          "name": "Workspace settings",
          "description": "Workspace settings: interactive host-owned settings pages composition.",
          "file": "components/motion/account-settings-pages.tsx",
          "previewKey": "SettingsPagesWorkspaceSettingsPreview",
          "previewFile": "components/previews/blocks/settings-pages-workspace-settings.preview.tsx",
          "usageFile": "components/previews/blocks/settings-pages-workspace-settings.usage.tsx",
          "author": "asharca",
          "badge": "new",
          "launchedAt": "2026-11-04",
          "installSlug": "settings-pages-workspace-settings"
        },
        {
          "slug": "billing-settings",
          "name": "Billing settings",
          "description": "Billing settings: interactive host-owned settings pages composition.",
          "file": "components/motion/account-settings-pages.tsx",
          "previewKey": "SettingsPagesBillingSettingsPreview",
          "previewFile": "components/previews/blocks/settings-pages-billing-settings.preview.tsx",
          "usageFile": "components/previews/blocks/settings-pages-billing-settings.usage.tsx",
          "author": "asharca",
          "badge": "new",
          "launchedAt": "2026-11-04",
          "installSlug": "settings-pages-billing-settings"
        }
      ],
      "author": "asharca",
      "credit": {
        "name": "Asharca",
        "url": "https://github.com/asharca/ui"
      },
      "badge": "new",
      "launchedAt": "2026-11-04"
    }
  },
  {
    "publicSlug": "agent-plan",
    "category": "agents",
    "entry": {
      "slug": "agent-plan",
      "name": "Agent Plan",
      "description": "Editable, host-executed plans with streamed step activity, execution controls, queued guidance and a compact progress pill.",
      "file": "components/agents/agent-plan.tsx",
      "extraFiles": [
        "components/agents/lifecycle-actions.ts"
      ],
      "examples": [
        {
          "slug": "plan-runner",
          "name": "Plan Runner",
          "description": "Rename, reorder, add and remove steps, run or pause the plan, inspect streamed activity, queue guidance and retry failed steps.",
          "file": "components/agents/agent-plan.tsx",
          "previewKey": "AgentPlanRunnerPreview",
          "previewFile": "components/previews/agents/agent-plan-plan-runner.preview.tsx",
          "author": "asharca",
          "badge": "new",
          "launchedAt": "2026-11-04",
          "installSlug": "agent-plan"
        },
        {
          "slug": "plan-pill",
          "name": "Plan Pill",
          "description": "Compact shared-state progress that expands to the runner and automatically opens when a step fails.",
          "file": "components/agents/agent-plan.tsx",
          "previewKey": "AgentPlanPillPreview",
          "previewFile": "components/previews/agents/agent-plan-plan-pill.preview.tsx",
          "usageFile": "components/previews/agents/agent-plan-plan-pill.usage.tsx",
          "author": "asharca",
          "badge": "new",
          "launchedAt": "2026-11-04",
          "installSlug": "agent-plan-plan-pill"
        }
      ],
      "author": "asharca",
      "credit": {
        "name": "Asharca",
        "url": "https://github.com/asharca/ui"
      },
      "badge": "new",
      "launchedAt": "2026-11-04"
    }
  },
  {
    "publicSlug": "background-agents",
    "category": "agents",
    "entry": {
      "slug": "background-agents",
      "name": "Background Agents",
      "description": "Independent agent tasks with progress rings, input requests, host-owned queue scheduling, result/diff inspection and per-task actions.",
      "file": "components/agents/background-agents.tsx",
      "extraFiles": [
        "components/agents/lifecycle-actions.ts"
      ],
      "examples": [
        {
          "slug": "agent-list",
          "name": "Agent List",
          "description": "Queue tasks, answer an agent, inspect completed work, and cancel or retry one task without changing its siblings.",
          "file": "components/agents/background-agents.tsx",
          "previewKey": "BackgroundAgentsListPreview",
          "previewFile": "components/previews/agents/background-agents-agent-list.preview.tsx",
          "author": "asharca",
          "badge": "new",
          "launchedAt": "2026-11-04",
          "installSlug": "background-agents"
        }
      ],
      "author": "asharca",
      "credit": {
        "name": "Asharca",
        "url": "https://github.com/asharca/ui"
      },
      "badge": "new",
      "launchedAt": "2026-11-04"
    }
  },
  {
    "publicSlug": "tool-approval",
    "category": "agents",
    "existingEntrySlug": "tool-approval",
    "entry": {
      "slug": "tool-approval",
      "name": "Tool Approval",
      "description": "A recoverable review queue composed from the existing ToolApproval primitive.",
      "file": "components/agents/tool-approval.tsx",
      "extraFiles": [
        "components/agents/tool-approval-queue.tsx",
        "components/agents/lifecycle-actions.ts"
      ],
      "examples": [
        {
          "slug": "tool-approval-approval-queue",
          "name": "Approval Queue",
          "description": "Compact tool-request stack with command, diff and message previews, exact standing-rule approval and recoverable denial notes.",
          "file": "components/agents/tool-approval-queue.tsx",
          "previewKey": "ToolApprovalQueuePreview",
          "previewFile": "components/previews/agents/tool-approval-approval-queue.preview.tsx",
          "author": "asharca",
          "badge": "new",
          "launchedAt": "2026-11-04",
          "installSlug": "tool-approval-approval-queue"
        }
      ]
    },
    "originalExample": {
      "slug": "original",
      "name": "Original",
      "file": "components/agents/tool-approval.tsx",
      "previewKey": "agents/tool-approval",
      "previewFile": "components/previews/agents/tool-approval.preview.tsx",
      "installSlug": "tool-approval"
    }
  },
  {
    "publicSlug": "context-window",
    "category": "agents",
    "entry": {
      "slug": "context-window",
      "name": "Context Window",
      "description": "Capacity-aware segmented token usage with source inspection, warnings, overflow, host-controlled clearing and threshold-based compaction.",
      "file": "components/agents/context-window.tsx",
      "extraFiles": [
        "components/agents/lifecycle-actions.ts"
      ],
      "examples": [
        {
          "slug": "context-meter",
          "name": "Context Meter",
          "description": "Inspect category and source token counts, unpin files, clear categories and compact manually or on an opt-in threshold crossing.",
          "file": "components/agents/context-window.tsx",
          "previewKey": "ContextWindowMeterPreview",
          "previewFile": "components/previews/agents/context-window-context-meter.preview.tsx",
          "author": "asharca",
          "badge": "new",
          "launchedAt": "2026-11-04",
          "installSlug": "context-window"
        }
      ],
      "author": "asharca",
      "credit": {
        "name": "Asharca",
        "url": "https://github.com/asharca/ui"
      },
      "badge": "new",
      "launchedAt": "2026-11-04"
    }
  },
  {
    "publicSlug": "agent-team",
    "category": "agents",
    "entry": {
      "slug": "agent-team",
      "name": "Agent Team",
      "description": "A data-owned hierarchy of lead and subagents, their dependencies, step progress, reports and independently scoped lifecycle actions.",
      "file": "components/agents/agent-team.tsx",
      "extraFiles": [
        "components/agents/lifecycle-actions.ts"
      ],
      "examples": [
        {
          "slug": "subagent-tree",
          "name": "Subagent Tree",
          "description": "Start a lead goal, inspect parallel subagents and their dependencies, then review handoffs and independently stop or retry work.",
          "file": "components/agents/agent-team.tsx",
          "previewKey": "AgentTeamTreePreview",
          "previewFile": "components/previews/agents/agent-team-subagent-tree.preview.tsx",
          "author": "asharca",
          "badge": "new",
          "launchedAt": "2026-11-04",
          "installSlug": "agent-team"
        }
      ],
      "author": "asharca",
      "credit": {
        "name": "Asharca",
        "url": "https://github.com/asharca/ui"
      },
      "badge": "new",
      "launchedAt": "2026-11-04"
    }
  },
  {
    "publicSlug": "agent-traces",
    "category": "agents",
    "entry": {
      "slug": "agent-traces",
      "name": "Agent Traces",
      "description": "Recorded-run observability with nested span waterfalls, interactive replay, span I/O and token details, plus a searchable run history.",
      "file": "components/agents/agent-traces.tsx",
      "extraFiles": [
        "components/agents/lifecycle-actions.ts"
      ],
      "examples": [
        {
          "slug": "trace-waterfall",
          "name": "Trace Waterfall",
          "description": "Replay and scrub nested spans, dim kinds, collapse subtrees and inspect timing, model, tokens, cost, errors, payloads and attributes.",
          "file": "components/agents/agent-traces.tsx",
          "previewKey": "AgentTracesWaterfallPreview",
          "previewFile": "components/previews/agents/agent-traces-trace-waterfall.preview.tsx",
          "author": "asharca",
          "badge": "new",
          "launchedAt": "2026-11-04",
          "installSlug": "agent-traces"
        },
        {
          "slug": "runs-list",
          "name": "Runs List",
          "description": "Search and filter run history with latency sparklines, token/cost rollups and the same run's waterfall in a focus-managed dialog.",
          "file": "components/agents/agent-traces.tsx",
          "previewKey": "AgentTracesRunsListPreview",
          "previewFile": "components/previews/agents/agent-traces-runs-list.preview.tsx",
          "usageFile": "components/previews/agents/agent-traces-runs-list.usage.tsx",
          "author": "asharca",
          "badge": "new",
          "launchedAt": "2026-11-04",
          "installSlug": "agent-traces-runs-list"
        }
      ],
      "author": "asharca",
      "credit": {
        "name": "Asharca",
        "url": "https://github.com/asharca/ui"
      },
      "badge": "new",
      "launchedAt": "2026-11-04"
    }
  },
  {
    "publicSlug": "kanban-board",
    "category": "blocks",
    "entry": {
      "slug": "kanban-board",
      "name": "Kanban Board",
      "description": "Host-synchronized task columns with drag and keyboard status moves, filtering, column renaming and focused task editing.",
      "file": "components/motion/project-board.tsx",
      "examples": [
        {
          "slug": "project-board",
          "name": "Project board",
          "description": "Task creation, editing, deletion, custom column names, priority/search filters and immutable host updates.",
          "file": "components/motion/project-board.tsx",
          "previewKey": "KanbanProjectBoardPreview",
          "previewFile": "components/previews/blocks/kanban-board-project-board.preview.tsx",
          "usageFile": "components/previews/blocks/kanban-board-project-board.preview.tsx",
          "installSlug": "kanban-board",
          "author": "asharca",
          "badge": "new",
          "launchedAt": "2026-11-04"
        }
      ],
      "author": "asharca",
      "credit": {
        "name": "Asharca",
        "url": "https://github.com/asharca/ui"
      },
      "badge": "new",
      "launchedAt": "2026-11-04"
    }
  },
  {
    "publicSlug": "collaboration",
    "category": "blocks",
    "entry": {
      "slug": "collaboration",
      "name": "Live Collaboration",
      "description": "Host-driven document text, presence, carets, selections and anchored comment threads, without claiming built-in multiplayer networking.",
      "file": "components/motion/live-document.tsx",
      "examples": [
        {
          "slug": "live-document",
          "name": "Live document",
          "description": "Controlled editing, save-state feedback, named collaborator selections/follow, anchored replies and thread resolution.",
          "file": "components/motion/live-document.tsx",
          "previewKey": "CollaborationLiveDocumentPreview",
          "previewFile": "components/previews/blocks/collaboration-live-document.preview.tsx",
          "usageFile": "components/previews/blocks/collaboration-live-document.preview.tsx",
          "installSlug": "collaboration",
          "author": "asharca",
          "badge": "new",
          "launchedAt": "2026-11-04"
        }
      ],
      "author": "asharca",
      "credit": {
        "name": "Asharca",
        "url": "https://github.com/asharca/ui"
      },
      "badge": "new",
      "launchedAt": "2026-11-04"
    }
  },
  {
    "publicSlug": "messaging",
    "category": "blocks",
    "entry": {
      "slug": "messaging",
      "name": "Messaging",
      "description": "Human conversation workspace with host delivery/read/reaction contracts, per-conversation drafts, real attachment callbacks and independent failures.",
      "file": "components/motion/messaging-workspace.tsx",
      "examples": [
        {
          "slug": "messaging-app",
          "name": "Messaging app",
          "description": "Conversation selection/search, grouped messages, delivered/seen receipts, typing, double-click and picker reactions, emoji and attachment composer.",
          "file": "components/motion/messaging-workspace.tsx",
          "previewKey": "MessagingAppPreview",
          "previewFile": "components/previews/blocks/messaging-messaging-app.preview.tsx",
          "usageFile": "components/previews/blocks/messaging-messaging-app.preview.tsx",
          "installSlug": "messaging",
          "author": "asharca",
          "badge": "new",
          "launchedAt": "2026-11-04"
        }
      ],
      "author": "asharca",
      "credit": {
        "name": "Asharca",
        "url": "https://github.com/asharca/ui"
      },
      "badge": "new",
      "launchedAt": "2026-11-04"
    }
  },
  {
    "publicSlug": "calendar",
    "category": "blocks",
    "entry": {
      "slug": "calendar",
      "name": "Calendar",
      "description": "Separate host-backed booking and event-planning workflows, with explicit absolute instants and display time zones.",
      "file": "components/motion/calendar-workspaces.tsx",
      "examples": [
        {
          "slug": "appointment-booking",
          "name": "Appointment booking",
          "description": "Duration tabs, roving keyboard dates, availability, time zones, host confirmation/errors, downloadable calendar receipt and rescheduling.",
          "file": "components/motion/calendar-workspaces.tsx",
          "previewKey": "CalendarAppointmentBookingPreview",
          "previewFile": "components/previews/blocks/calendar-appointment-booking.preview.tsx",
          "usageFile": "components/previews/blocks/calendar-appointment-booking.preview.tsx",
          "installSlug": "calendar",
          "author": "asharca",
          "badge": "new",
          "launchedAt": "2026-11-04"
        },
        {
          "slug": "calendar-planner",
          "name": "Calendar planner",
          "description": "Distinct 42-cell month and 24-hour week views, navigation, category/search filters, event editing, creation, deletion and conflict rejection.",
          "file": "components/motion/calendar-workspaces.tsx",
          "previewKey": "CalendarPlannerPreview",
          "previewFile": "components/previews/blocks/calendar-calendar-planner.preview.tsx",
          "usageFile": "components/previews/blocks/calendar-calendar-planner.preview.tsx",
          "installSlug": "calendar-calendar-planner",
          "author": "asharca",
          "badge": "new",
          "launchedAt": "2026-11-04"
        }
      ],
      "author": "asharca",
      "credit": {
        "name": "Asharca",
        "url": "https://github.com/asharca/ui"
      },
      "badge": "new",
      "launchedAt": "2026-11-04"
    }
  },
  {
    "publicSlug": "sidebar",
    "category": "motion",
    "existingEntrySlug": "animated-sidebar",
    "entry": {
      "slug": "animated-sidebar",
      "name": "Animated Sidebar",
      "description": "Additional production compositions for the existing compound Animated Sidebar; existing source/examples must remain unchanged.",
      "file": "components/motion/animated-sidebar.tsx",
      "extraFiles": [
        "components/motion/workspace-navigation.tsx",
        "components/workspace/workspace-sidebar.tsx"
      ],
      "examples": [
        {
          "slug": "sidebar-rail-sidebar",
          "name": "Rail sidebar",
          "description": "Persistent workspace-area rail plus separately pinned or hover-revealed secondary panel, with no canvas shift during hover.",
          "file": "components/motion/workspace-navigation.tsx",
          "previewKey": "SidebarRailPreview",
          "previewFile": "components/previews/blocks/sidebar-rail-sidebar.preview.tsx",
          "usageFile": "components/previews/blocks/sidebar-rail-sidebar.preview.tsx",
          "installSlug": "workspace-navigation",
          "author": "asharca",
          "badge": "new",
          "launchedAt": "2026-11-04"
        },
        {
          "slug": "sidebar-workspace-sidebar",
          "name": "Workspace sidebar",
          "description": "Searchable grouped AnimatedSidebar navigation with workspace switching, host selection, icon collapse, account footer and mobile sheet.",
          "file": "components/motion/workspace-navigation.tsx",
          "previewKey": "SidebarWorkspacePreview",
          "previewFile": "components/previews/blocks/sidebar-workspace-sidebar.preview.tsx",
          "usageFile": "components/previews/blocks/sidebar-workspace-sidebar.preview.tsx",
          "installSlug": "sidebar-workspace-sidebar",
          "author": "asharca",
          "badge": "new",
          "launchedAt": "2026-11-04"
        },
        {
          "slug": "sidebar-off-canvas-sidebar",
          "name": "Off-canvas sidebar",
          "description": "Flat searchable navigation with complete desktop off-canvas collapse and existing mobile portal/focus trap.",
          "file": "components/motion/workspace-navigation.tsx",
          "previewKey": "SidebarOffCanvasPreview",
          "previewFile": "components/previews/blocks/sidebar-off-canvas-sidebar.preview.tsx",
          "usageFile": "components/previews/blocks/sidebar-off-canvas-sidebar.preview.tsx",
          "installSlug": "sidebar-off-canvas-sidebar",
          "author": "asharca",
          "badge": "new",
          "launchedAt": "2026-11-04"
        }
      ]
    },
    "originalExample": {
      "slug": "original",
      "name": "Original",
      "file": "components/motion/animated-sidebar.tsx",
      "previewKey": "motion/animated-sidebar",
      "previewFile": "components/previews/motion/animated-sidebar.preview.tsx",
      "installSlug": "animated-sidebar"
    }
  },
  {
    "publicSlug": "file-manager",
    "category": "blocks",
    "entry": {
      "slug": "file-manager",
      "name": "File Manager",
      "description": "Stable-ID host-backed file/folder browsing with grid/list layouts, preview, selection and recoverable asynchronous file mutations.",
      "file": "components/motion/file-workspace.tsx",
      "examples": [
        {
          "slug": "file-workspace",
          "name": "File workspace",
          "description": "Folder paths, cross-folder search, sorting, multi-selection, media/text preview, stars, rename/move/delete, folder creation and actual local upload callbacks.",
          "file": "components/motion/file-workspace.tsx",
          "previewKey": "FileManagerWorkspacePreview",
          "previewFile": "components/previews/blocks/file-manager-file-workspace.preview.tsx",
          "usageFile": "components/previews/blocks/file-manager-file-workspace.preview.tsx",
          "installSlug": "file-manager",
          "author": "asharca",
          "badge": "new",
          "launchedAt": "2026-11-04"
        }
      ],
      "author": "asharca",
      "credit": {
        "name": "Asharca",
        "url": "https://github.com/asharca/ui"
      },
      "badge": "new",
      "launchedAt": "2026-11-04"
    }
  },
  {
    "publicSlug": "conversion-funnel",
    "category": "blocks",
    "entry": {
      "slug": "conversion-funnel",
      "name": "Conversion Funnel",
      "description": "Interactive period-based conversion stages with unknown-data handling and drop-off details.",
      "file": "components/motion/conversion-funnel.tsx",
      "extraFiles": [
        "components/motion/commerce-ui.tsx"
      ],
      "examples": [
        {
          "slug": "conversion-funnel",
          "name": "Conversion Funnel",
          "description": "Conversion Funnel with copyable, self-contained interactive controller and explicit host data boundaries.",
          "file": "components/motion/conversion-funnel.tsx",
          "previewKey": "blocks/conversion-funnel-conversion-funnel",
          "previewFile": "components/previews/blocks/conversion-funnel-conversion-funnel.preview.tsx",
          "author": "asharca",
          "badge": "new",
          "launchedAt": "2026-11-04",
          "installSlug": "conversion-funnel"
        }
      ],
      "author": "asharca",
      "credit": {
        "name": "Asharca",
        "url": "https://github.com/asharca/ui"
      },
      "badge": "new",
      "launchedAt": "2026-11-04"
    }
  },
  {
    "publicSlug": "order-tracking",
    "category": "blocks",
    "entry": {
      "slug": "order-tracking",
      "name": "Order Tracking",
      "description": "Snapshot-driven delivery map, ETA, shipment stages, event history and delivery proof.",
      "file": "components/motion/order-tracking.tsx",
      "extraFiles": [
        "components/motion/commerce-ui.tsx"
      ],
      "examples": [
        {
          "slug": "delivery-tracker",
          "name": "Delivery tracker",
          "description": "Delivery tracker with copyable, self-contained interactive controller and explicit host data boundaries.",
          "file": "components/motion/order-tracking.tsx",
          "previewKey": "blocks/order-tracking-delivery-tracker",
          "previewFile": "components/previews/blocks/order-tracking-delivery-tracker.preview.tsx",
          "author": "asharca",
          "badge": "new",
          "launchedAt": "2026-11-04",
          "installSlug": "order-tracking"
        }
      ],
      "author": "asharca",
      "credit": {
        "name": "Asharca",
        "url": "https://github.com/asharca/ui"
      },
      "badge": "new",
      "launchedAt": "2026-11-04"
    }
  },
  {
    "publicSlug": "data-tables",
    "category": "blocks",
    "entry": {
      "slug": "data-tables",
      "name": "Data Tables",
      "description": "Virtualized orders, people, investment holdings and service-operation tables with distinct domain interactions.",
      "file": "components/motion/commerce-data-tables.tsx",
      "extraFiles": [
        "components/motion/commerce-ui.tsx"
      ],
      "examples": [
        {
          "slug": "orders-table",
          "name": "Orders table",
          "description": "Orders table with copyable, self-contained interactive controller and explicit host data boundaries.",
          "file": "components/motion/commerce-data-tables.tsx",
          "previewKey": "blocks/data-tables-orders-table",
          "previewFile": "components/previews/blocks/data-tables-orders-table.preview.tsx",
          "author": "asharca",
          "badge": "new",
          "launchedAt": "2026-11-04",
          "installSlug": "data-tables"
        },
        {
          "slug": "people-directory",
          "name": "People directory",
          "description": "People directory with copyable, self-contained interactive controller and explicit host data boundaries.",
          "file": "components/motion/commerce-data-tables.tsx",
          "previewKey": "blocks/data-tables-people-directory",
          "previewFile": "components/previews/blocks/data-tables-people-directory.preview.tsx",
          "author": "asharca",
          "badge": "new",
          "launchedAt": "2026-11-04",
          "installSlug": "data-tables-people-directory"
        },
        {
          "slug": "portfolio-table",
          "name": "Portfolio table",
          "description": "Portfolio table with copyable, self-contained interactive controller and explicit host data boundaries.",
          "file": "components/motion/commerce-data-tables.tsx",
          "previewKey": "blocks/data-tables-portfolio-table",
          "previewFile": "components/previews/blocks/data-tables-portfolio-table.preview.tsx",
          "author": "asharca",
          "badge": "new",
          "launchedAt": "2026-11-04",
          "installSlug": "data-tables-portfolio-table"
        },
        {
          "slug": "sla-monitoring-table",
          "name": "SLA monitoring table",
          "description": "SLA monitoring table with copyable, self-contained interactive controller and explicit host data boundaries.",
          "file": "components/motion/commerce-data-tables.tsx",
          "previewKey": "blocks/data-tables-sla-monitoring-table",
          "previewFile": "components/previews/blocks/data-tables-sla-monitoring-table.preview.tsx",
          "author": "asharca",
          "badge": "new",
          "launchedAt": "2026-11-04",
          "installSlug": "data-tables-sla-monitoring-table"
        }
      ],
      "author": "asharca",
      "credit": {
        "name": "Asharca",
        "url": "https://github.com/asharca/ui"
      },
      "badge": "new",
      "launchedAt": "2026-11-04"
    }
  },
  {
    "publicSlug": "crypto-markets",
    "category": "blocks",
    "entry": {
      "slug": "crypto-markets",
      "name": "Crypto Markets",
      "description": "Host-snapshot prices, grouped market depth and perpetual position management.",
      "file": "components/motion/crypto-markets.tsx",
      "extraFiles": [
        "components/motion/commerce-ui.tsx"
      ],
      "examples": [
        {
          "slug": "live-price-table",
          "name": "Live price table",
          "description": "Live price table with copyable, self-contained interactive controller and explicit host data boundaries.",
          "file": "components/motion/crypto-markets.tsx",
          "previewKey": "blocks/crypto-markets-live-price-table",
          "previewFile": "components/previews/blocks/crypto-markets-live-price-table.preview.tsx",
          "author": "asharca",
          "badge": "new",
          "launchedAt": "2026-11-04",
          "installSlug": "crypto-markets"
        },
        {
          "slug": "order-book",
          "name": "Order book",
          "description": "Order book with copyable, self-contained interactive controller and explicit host data boundaries.",
          "file": "components/motion/crypto-markets.tsx",
          "previewKey": "blocks/crypto-markets-order-book",
          "previewFile": "components/previews/blocks/crypto-markets-order-book.preview.tsx",
          "author": "asharca",
          "badge": "new",
          "launchedAt": "2026-11-04",
          "installSlug": "crypto-markets-order-book"
        },
        {
          "slug": "perps-positions",
          "name": "Perps positions",
          "description": "Perps positions with copyable, self-contained interactive controller and explicit host data boundaries.",
          "file": "components/motion/crypto-markets.tsx",
          "previewKey": "blocks/crypto-markets-perps-positions",
          "previewFile": "components/previews/blocks/crypto-markets-perps-positions.preview.tsx",
          "author": "asharca",
          "badge": "new",
          "launchedAt": "2026-11-04",
          "installSlug": "crypto-markets-perps-positions"
        }
      ],
      "author": "asharca",
      "credit": {
        "name": "Asharca",
        "url": "https://github.com/asharca/ui"
      },
      "badge": "new",
      "launchedAt": "2026-11-04"
    }
  },
  {
    "publicSlug": "tokenomics",
    "category": "blocks",
    "entry": {
      "slug": "tokenomics",
      "name": "Tokenomics",
      "description": "Quantity-based allocation, cumulative vesting, linked charts and timezone-aware unlock schedule.",
      "file": "components/motion/tokenomics.tsx",
      "extraFiles": [
        "components/motion/commerce-ui.tsx"
      ],
      "examples": [
        {
          "slug": "distribution-and-unlocks",
          "name": "Distribution and unlocks",
          "description": "Distribution and unlocks with copyable, self-contained interactive controller and explicit host data boundaries.",
          "file": "components/motion/tokenomics.tsx",
          "previewKey": "blocks/tokenomics-distribution-and-unlocks",
          "previewFile": "components/previews/blocks/tokenomics-distribution-and-unlocks.preview.tsx",
          "author": "asharca",
          "badge": "new",
          "launchedAt": "2026-11-04",
          "installSlug": "tokenomics"
        }
      ],
      "author": "asharca",
      "credit": {
        "name": "Asharca",
        "url": "https://github.com/asharca/ui"
      },
      "badge": "new",
      "launchedAt": "2026-11-04"
    }
  },
  {
    "publicSlug": "crypto-wallet",
    "category": "blocks",
    "entry": {
      "slug": "crypto-wallet",
      "name": "Crypto Wallet",
      "description": "Six host-integrated wallet compositions for transfers, bridging, holdings, staking, asset details and transaction activity.",
      "file": "components/motion/crypto-wallet-compositions.tsx",
      "extraFiles": [
        "components/motion/commerce-ui.tsx"
      ],
      "examples": [
        {
          "slug": "swap-send-and-buy",
          "name": "Swap, send, and buy",
          "description": "Swap, send, and buy with copyable, self-contained interactive controller and explicit host data boundaries.",
          "file": "components/motion/crypto-wallet-compositions.tsx",
          "previewKey": "blocks/crypto-wallet-swap-send-and-buy",
          "previewFile": "components/previews/blocks/crypto-wallet-swap-send-and-buy.preview.tsx",
          "author": "asharca",
          "badge": "new",
          "launchedAt": "2026-11-04",
          "installSlug": "crypto-wallet"
        },
        {
          "slug": "cross-chain-bridge",
          "name": "Cross-chain bridge",
          "description": "Cross-chain bridge with copyable, self-contained interactive controller and explicit host data boundaries.",
          "file": "components/motion/crypto-wallet-compositions.tsx",
          "previewKey": "blocks/crypto-wallet-cross-chain-bridge",
          "previewFile": "components/previews/blocks/crypto-wallet-cross-chain-bridge.preview.tsx",
          "author": "asharca",
          "badge": "new",
          "launchedAt": "2026-11-04",
          "installSlug": "crypto-wallet-cross-chain-bridge"
        },
        {
          "slug": "portfolio-overview",
          "name": "Portfolio overview",
          "description": "Portfolio overview with copyable, self-contained interactive controller and explicit host data boundaries.",
          "file": "components/motion/crypto-wallet-compositions.tsx",
          "previewKey": "blocks/crypto-wallet-portfolio-overview",
          "previewFile": "components/previews/blocks/crypto-wallet-portfolio-overview.preview.tsx",
          "author": "asharca",
          "badge": "new",
          "launchedAt": "2026-11-04",
          "installSlug": "crypto-wallet-portfolio-overview"
        },
        {
          "slug": "staking-vaults",
          "name": "Staking vaults",
          "description": "Staking vaults with copyable, self-contained interactive controller and explicit host data boundaries.",
          "file": "components/motion/crypto-wallet-compositions.tsx",
          "previewKey": "blocks/crypto-wallet-staking-vaults",
          "previewFile": "components/previews/blocks/crypto-wallet-staking-vaults.preview.tsx",
          "author": "asharca",
          "badge": "new",
          "launchedAt": "2026-11-04",
          "installSlug": "crypto-wallet-staking-vaults"
        },
        {
          "slug": "asset-detail",
          "name": "Asset detail",
          "description": "Asset detail with copyable, self-contained interactive controller and explicit host data boundaries.",
          "file": "components/motion/crypto-wallet-compositions.tsx",
          "previewKey": "blocks/crypto-wallet-asset-detail",
          "previewFile": "components/previews/blocks/crypto-wallet-asset-detail.preview.tsx",
          "author": "asharca",
          "badge": "new",
          "launchedAt": "2026-11-04",
          "installSlug": "crypto-wallet-asset-detail"
        },
        {
          "slug": "transaction-activity",
          "name": "Transaction activity",
          "description": "Transaction activity with copyable, self-contained interactive controller and explicit host data boundaries.",
          "file": "components/motion/crypto-wallet-compositions.tsx",
          "previewKey": "blocks/crypto-wallet-transaction-activity",
          "previewFile": "components/previews/blocks/crypto-wallet-transaction-activity.preview.tsx",
          "author": "asharca",
          "badge": "new",
          "launchedAt": "2026-11-04",
          "installSlug": "crypto-wallet-transaction-activity"
        }
      ],
      "author": "asharca",
      "credit": {
        "name": "Asharca",
        "url": "https://github.com/asharca/ui"
      },
      "badge": "new",
      "launchedAt": "2026-11-04"
    }
  },
  {
    "publicSlug": "ecommerce",
    "category": "blocks",
    "entry": {
      "slug": "ecommerce",
      "name": "Ecommerce",
      "description": "Product browsing, bundle selection and stock-aware shopping cart backed by host callbacks.",
      "file": "components/motion/ecommerce.tsx",
      "extraFiles": [
        "components/motion/commerce-ui.tsx"
      ],
      "examples": [
        {
          "slug": "product-grid",
          "name": "Product grid",
          "description": "Product grid with copyable, self-contained interactive controller and explicit host data boundaries.",
          "file": "components/motion/ecommerce.tsx",
          "previewKey": "blocks/ecommerce-product-grid",
          "previewFile": "components/previews/blocks/ecommerce-product-grid.preview.tsx",
          "author": "asharca",
          "badge": "new",
          "launchedAt": "2026-11-04",
          "installSlug": "ecommerce"
        },
        {
          "slug": "product-detail",
          "name": "Product detail",
          "description": "Product detail with copyable, self-contained interactive controller and explicit host data boundaries.",
          "file": "components/motion/ecommerce.tsx",
          "previewKey": "blocks/ecommerce-product-detail",
          "previewFile": "components/previews/blocks/ecommerce-product-detail.preview.tsx",
          "author": "asharca",
          "badge": "new",
          "launchedAt": "2026-11-04",
          "installSlug": "ecommerce-product-detail"
        },
        {
          "slug": "shopping-cart",
          "name": "Shopping cart",
          "description": "Shopping cart with copyable, self-contained interactive controller and explicit host data boundaries.",
          "file": "components/motion/ecommerce.tsx",
          "previewKey": "blocks/ecommerce-shopping-cart",
          "previewFile": "components/previews/blocks/ecommerce-shopping-cart.preview.tsx",
          "author": "asharca",
          "badge": "new",
          "launchedAt": "2026-11-04",
          "installSlug": "ecommerce-shopping-cart"
        }
      ],
      "author": "asharca",
      "credit": {
        "name": "Asharca",
        "url": "https://github.com/asharca/ui"
      },
      "badge": "new",
      "launchedAt": "2026-11-04"
    }
  },
  {
    "publicSlug": "illustration-isometric-scenes",
    "category": "motion",
    "entry": {
      "slug": "illustration-isometric-scenes",
      "name": "Isometric Scenes",
      "description": "Five inspectable perspective scenes for infrastructure, system layers, processing, replication and release pipelines.",
      "file": "components/motion/illustration-isometric-scenes.tsx",
      "examples": [
        { "slug": "illustration-1", "name": "Compute node", "description": "An isometric line-art compute node with data lanes and status signals.", "file": "components/motion/illustration-isometric-scenes.tsx", "previewKey": "motion/illustration-isometric-scenes-illustration-1", "previewFile": "components/previews/motion/illustration-isometric-scenes-illustration-1.preview.tsx", "author": "asharca",
        "badge": "new",
        "launchedAt": "2026-11-04",
        "installSlug": "illustration-isometric-scenes" },
        { "slug": "illustration-2", "name": "Event queue", "description": "Four system events move through the active focus position.", "file": "components/motion/illustration-isometric-scenes.tsx", "previewKey": "motion/illustration-isometric-scenes-illustration-2", "previewFile": "components/previews/motion/illustration-isometric-scenes-illustration-2.preview.tsx", "author": "asharca",
        "badge": "new",
        "launchedAt": "2026-11-04",
        "installSlug": "illustration-isometric-scenes-illustration-2" },
        { "slug": "illustration-3", "name": "Capability spine", "description": "Seven product capabilities alternate around a central vertical spine.", "file": "components/motion/illustration-isometric-scenes.tsx", "previewKey": "motion/illustration-isometric-scenes-illustration-3", "previewFile": "components/previews/motion/illustration-isometric-scenes-illustration-3.preview.tsx", "author": "asharca",
        "badge": "new",
        "launchedAt": "2026-11-04",
        "installSlug": "illustration-isometric-scenes-illustration-3" },
        { "slug": "illustration-4", "name": "Application runtime", "description": "A diagonal isometric signal path crosses Entry, API, Layers and App.", "file": "components/motion/illustration-isometric-scenes.tsx", "previewKey": "motion/illustration-isometric-scenes-illustration-4", "previewFile": "components/previews/motion/illustration-isometric-scenes-illustration-4.preview.tsx", "author": "asharca",
        "badge": "new",
        "launchedAt": "2026-11-04",
        "installSlug": "illustration-isometric-scenes-illustration-4" },
        { "slug": "illustration-5", "name": "Crypto towers", "description": "Three translucent blue crypto towers rise in an isometric composition.", "file": "components/motion/illustration-isometric-scenes.tsx", "previewKey": "motion/illustration-isometric-scenes-illustration-5", "previewFile": "components/previews/motion/illustration-isometric-scenes-illustration-5.preview.tsx", "author": "asharca",
        "badge": "new",
        "launchedAt": "2026-11-04",
        "installSlug": "illustration-isometric-scenes-illustration-5" }
      ],
      "author": "asharca",
      "credit": {
        "name": "Asharca",
        "url": "https://github.com/asharca/ui"
      },
      "badge": "new",
      "launchedAt": "2026-11-04"
    }
  },
  {
    "publicSlug": "illustration-document-cards",
    "category": "motion",
    "entry": {
      "slug": "illustration-document-cards",
      "name": "Document Cards",
      "description": "Host-configured document stacks, signature presentation and approval chains without claiming an electronic-signing service.",
      "file": "components/motion/illustration-document-cards.tsx",
      "examples": [
        { "slug": "illustration-1", "name": "Verified document fan", "description": "Three document sheets fan behind a blue verification seal.", "file": "components/motion/illustration-document-cards.tsx", "previewKey": "motion/illustration-document-cards-illustration-1", "previewFile": "components/previews/motion/illustration-document-cards-illustration-1.preview.tsx", "author": "asharca",
        "badge": "new",
        "launchedAt": "2026-11-04",
        "installSlug": "illustration-document-cards" },
        { "slug": "illustration-2", "name": "Agreement signature", "description": "An agreement sheet presents a supplied signature and signed state.", "file": "components/motion/illustration-document-cards.tsx", "previewKey": "motion/illustration-document-cards-illustration-2", "previewFile": "components/previews/motion/illustration-document-cards-illustration-2.preview.tsx", "author": "asharca",
        "badge": "new",
        "launchedAt": "2026-11-04",
        "installSlug": "illustration-document-cards-illustration-2" },
        { "slug": "illustration-3", "name": "Approval chain", "description": "A proposal card connects to named approvers with roles and approval statuses.", "file": "components/motion/illustration-document-cards.tsx", "previewKey": "motion/illustration-document-cards-illustration-3", "previewFile": "components/previews/motion/illustration-document-cards-illustration-3.preview.tsx", "author": "asharca",
        "badge": "new",
        "launchedAt": "2026-11-04",
        "installSlug": "illustration-document-cards-illustration-3" }
      ],
      "author": "asharca",
      "credit": {
        "name": "Asharca",
        "url": "https://github.com/asharca/ui"
      },
      "badge": "new",
      "launchedAt": "2026-11-04"
    }
  },
  {
    "publicSlug": "illustration-layered-cards",
    "category": "motion",
    "entry": {
      "slug": "illustration-layered-cards",
      "name": "Layered Cards",
      "description": "Keyboard-focusable wallet stacks, masked payment-card fans and pricing decks with controlled or uncontrolled billing.",
      "file": "components/motion/illustration-layered-cards.tsx",
      "examples": [
        { "slug": "illustration-1", "name": "Asset wallet stack", "description": "Colored crypto asset cards rotate below the portfolio total.", "file": "components/motion/illustration-layered-cards.tsx", "previewKey": "motion/illustration-layered-cards-illustration-1", "previewFile": "components/previews/motion/illustration-layered-cards-illustration-1.preview.tsx", "author": "asharca",
        "badge": "new",
        "launchedAt": "2026-11-04",
        "installSlug": "illustration-layered-cards" },
        { "slug": "illustration-2", "name": "Payment card fan", "description": "Three gradient payment cards fan around the selected front card.", "file": "components/motion/illustration-layered-cards.tsx", "previewKey": "motion/illustration-layered-cards-illustration-2", "previewFile": "components/previews/motion/illustration-layered-cards-illustration-2.preview.tsx", "author": "asharca",
        "badge": "new",
        "launchedAt": "2026-11-04",
        "installSlug": "illustration-layered-cards-illustration-2" },
        { "slug": "illustration-3", "name": "Pricing deck", "description": "Pricing plans move through a deck beneath monthly/yearly billing controls.", "file": "components/motion/illustration-layered-cards.tsx", "previewKey": "motion/illustration-layered-cards-illustration-3", "previewFile": "components/previews/motion/illustration-layered-cards-illustration-3.preview.tsx", "author": "asharca",
        "badge": "new",
        "launchedAt": "2026-11-04",
        "installSlug": "illustration-layered-cards-illustration-3" }
      ],
      "author": "asharca",
      "credit": {
        "name": "Asharca",
        "url": "https://github.com/asharca/ui"
      },
      "badge": "new",
      "launchedAt": "2026-11-04"
    }
  },
  {
    "publicSlug": "illustration-bar-wave",
    "category": "motion",
    "entry": {
      "slug": "illustration-bar-wave",
      "name": "Bar Wave",
      "description": "Perspective level bars with a traveling wave, pause control, keyboard inspection and optional hover-capable pointer response.",
      "file": "components/motion/illustration-bar-wave.tsx",
      "examples": [
        { "slug": "bar-wave", "name": "Isometric bar wave", "description": "An isometric stack of blue bars rises and falls in a slow wave.", "file": "components/motion/illustration-bar-wave.tsx", "previewKey": "motion/illustration-bar-wave-bar-wave", "previewFile": "components/previews/motion/illustration-bar-wave-bar-wave.preview.tsx", "author": "asharca",
        "badge": "new",
        "launchedAt": "2026-11-04",
        "installSlug": "illustration-bar-wave" }
      ],
      "author": "asharca",
      "credit": {
        "name": "Asharca",
        "url": "https://github.com/asharca/ui"
      },
      "badge": "new",
      "launchedAt": "2026-11-04"
    }
  },
  {
    "publicSlug": "illustration-connected-hub",
    "category": "motion",
    "entry": {
      "slug": "illustration-connected-hub",
      "name": "Connected Hub",
      "description": "Four distinct service topologies with configurable nodes, icons, labels, highlighted paths and inspectable descriptions.",
      "file": "components/motion/illustration-connected-hub.tsx",
      "examples": [
        { "slug": "illustration-1", "name": "Service hub", "description": "Four service tokens connect to one lower central hub on concentric arcs.", "file": "components/motion/illustration-connected-hub.tsx", "previewKey": "motion/illustration-connected-hub-illustration-1", "previewFile": "components/previews/motion/illustration-connected-hub-illustration-1.preview.tsx", "author": "asharca",
        "badge": "new",
        "launchedAt": "2026-11-04",
        "installSlug": "illustration-connected-hub" },
        { "slug": "illustration-2", "name": "Workspace hub", "description": "Four app tokens join a shared workspace route.", "file": "components/motion/illustration-connected-hub.tsx", "previewKey": "motion/illustration-connected-hub-illustration-2", "previewFile": "components/previews/motion/illustration-connected-hub-illustration-2.preview.tsx", "author": "asharca",
        "badge": "new",
        "launchedAt": "2026-11-04",
        "installSlug": "illustration-connected-hub-illustration-2" },
        { "slug": "illustration-3", "name": "Workflow router", "description": "A user passes through a workflow into two connected app groups.", "file": "components/motion/illustration-connected-hub.tsx", "previewKey": "motion/illustration-connected-hub-illustration-3", "previewFile": "components/previews/motion/illustration-connected-hub-illustration-3.preview.tsx", "author": "asharca",
        "badge": "new",
        "launchedAt": "2026-11-04",
        "installSlug": "illustration-connected-hub-illustration-3" },
        { "slug": "illustration-4", "name": "API and MCP router", "description": "A product routes API and MCP paths into three tool destinations.", "file": "components/motion/illustration-connected-hub.tsx", "previewKey": "motion/illustration-connected-hub-illustration-4", "previewFile": "components/previews/motion/illustration-connected-hub-illustration-4.preview.tsx", "author": "asharca",
        "badge": "new",
        "launchedAt": "2026-11-04",
        "installSlug": "illustration-connected-hub-illustration-4" }
      ],
      "author": "asharca",
      "credit": {
        "name": "Asharca",
        "url": "https://github.com/asharca/ui"
      },
      "badge": "new",
      "launchedAt": "2026-11-04"
    }
  },
  {
    "publicSlug": "illustration-file-flow",
    "category": "motion",
    "entry": {
      "slug": "illustration-file-flow",
      "name": "File Flow",
      "description": "An inspectable file narrative connecting configurable source formats, a processing gate and pending, ready or error output.",
      "file": "components/motion/illustration-file-flow.tsx",
      "examples": [
        { "slug": "file-flow", "name": "File conversion flow", "description": "PDF, XLS and JPG inputs move through Convert into a ready Markdown document.", "file": "components/motion/illustration-file-flow.tsx", "previewKey": "motion/illustration-file-flow-file-flow", "previewFile": "components/previews/motion/illustration-file-flow-file-flow.preview.tsx", "author": "asharca",
        "badge": "new",
        "launchedAt": "2026-11-04",
        "installSlug": "illustration-file-flow" }
      ],
      "author": "asharca",
      "credit": {
        "name": "Asharca",
        "url": "https://github.com/asharca/ui"
      },
      "badge": "new",
      "launchedAt": "2026-11-04"
    }
  },
  {
    "publicSlug": "ai-landing",
    "category": "blocks",
    "entry": {
      "slug": "ai-landing",
      "name": "AI Agent Landing",
      "description": "An agent-first launch site with conversational product framing, inspectable recorded run traces, capabilities, integrations, customer stories, billing comparison, FAQ and conversion navigation.",
      "file": "components/motion/ai-landing.tsx",
      "extraFiles": [
        "components/motion/landing-templates/shared.tsx"
      ],
      "examples": [
        {
          "slug": "default",
          "name": "AI Agent Landing",
          "description": "Explore incident workflows and individual tool steps, switch billing, and navigate the responsive product story. Preview runs and company content are explicitly illustrative.",
          "file": "components/motion/ai-landing.tsx",
          "previewKey": "blocks/ai-landing-default",
          "previewFile": "components/previews/blocks/ai-landing-default.preview.tsx",
          "usageFile": "components/previews/blocks/ai-landing-default.preview.tsx",
          "author": "asharca",
          "badge": "new",
          "launchedAt": "2026-11-04",
          "installSlug": "ai-landing"
        }
      ],
      "author": "asharca",
      "credit": {
        "name": "Asharca",
        "url": "https://github.com/asharca/ui"
      },
      "badge": "new",
      "launchedAt": "2026-11-04"
    }
  },
  {
    "publicSlug": "crypto-landing",
    "category": "blocks",
    "entry": {
      "slug": "crypto-landing",
      "name": "Crypto Landing",
      "description": "A trust-led crypto product site with host-driven portfolio totals, interactive historical sparklines, balance privacy, network filtering, ownership storytelling, pricing and FAQ.",
      "file": "components/motion/crypto-landing.tsx",
      "extraFiles": [
        "components/motion/landing-templates/shared.tsx"
      ],
      "examples": [
        {
          "slug": "default",
          "name": "Crypto Landing",
          "description": "Hide portfolio information, change the history window and filter assets by network. All balances and market history are explicitly illustrative, with no wallet or feed connected.",
          "file": "components/motion/crypto-landing.tsx",
          "previewKey": "blocks/crypto-landing-default",
          "previewFile": "components/previews/blocks/crypto-landing-default.preview.tsx",
          "usageFile": "components/previews/blocks/crypto-landing-default.preview.tsx",
          "author": "asharca",
          "badge": "new",
          "launchedAt": "2026-11-04",
          "installSlug": "crypto-landing"
        }
      ],
      "author": "asharca",
      "credit": {
        "name": "Asharca",
        "url": "https://github.com/asharca/ui"
      },
      "badge": "new",
      "launchedAt": "2026-11-04"
    }
  },
  {
    "publicSlug": "mobile-crypto-landing",
    "category": "blocks",
    "entry": {
      "slug": "mobile-crypto-landing",
      "name": "Mobile Crypto Landing",
      "description": "A centered phone-led wallet launch site with Home, Networks, Security and Download page views, eight-network preview, routing/review/safety explanations and configurable official destinations.",
      "file": "components/motion/mobile-crypto-landing.tsx",
      "extraFiles": [
        "components/motion/landing-templates/shared.tsx"
      ],
      "examples": [
        {
          "slug": "default",
          "name": "Mobile Crypto Landing",
          "description": "Inspect the transaction explanation, browse eight real network documentation links and switch four local page views. Host routeHrefs and controlled page support real multi-route deployment; platform download destinations are host supplied.",
          "file": "components/motion/mobile-crypto-landing.tsx",
          "previewKey": "blocks/mobile-crypto-landing-default",
          "previewFile": "components/previews/blocks/mobile-crypto-landing-default.preview.tsx",
          "usageFile": "components/previews/blocks/mobile-crypto-landing-default.preview.tsx",
          "author": "asharca",
          "badge": "new",
          "launchedAt": "2026-11-04",
          "installSlug": "mobile-crypto-landing"
        }
      ],
      "author": "asharca",
      "credit": {
        "name": "Asharca",
        "url": "https://github.com/asharca/ui"
      },
      "badge": "new",
      "launchedAt": "2026-11-04"
    }
  },
  {
    "publicSlug": "devtool-landing",
    "category": "blocks",
    "entry": {
      "slug": "devtool-landing",
      "name": "Devtool Landing",
      "description": "Dark-green developer launch site with an original animated forest-flow WebGL hero, real command copying, searchable rotating agent directory, code and recorded-trace views, integrations, journal, pricing and FAQ.",
      "file": "components/motion/devtool-landing.tsx",
      "extraFiles": [
        "components/motion/landing-templates/shared.tsx"
      ],
      "examples": [
        {
          "slug": "default",
          "name": "Devtool Landing",
          "description": "Pause directory rotation, search configurations, inspect recorded runs, and copy the exact command or configuration. Clipboard rejection is reported, not represented as success. Journal links are real project documentation.",
          "file": "components/motion/devtool-landing.tsx",
          "previewKey": "blocks/devtool-landing-default",
          "previewFile": "components/previews/blocks/devtool-landing-default.preview.tsx",
          "usageFile": "components/previews/blocks/devtool-landing-default.preview.tsx",
          "author": "asharca",
          "badge": "new",
          "launchedAt": "2026-11-04",
          "installSlug": "devtool-landing"
        }
      ],
      "author": "asharca",
      "credit": {
        "name": "Asharca",
        "url": "https://github.com/asharca/ui"
      },
      "badge": "new",
      "launchedAt": "2026-11-04"
    }
  },
  {
    "publicSlug": "analytics-landing",
    "category": "blocks",
    "entry": {
      "slug": "analytics-landing",
      "name": "Analytics Landing",
      "description": "A blueprint-inspired analytics site with coordinated period-driven funnel, visitor and revenue metrics, existing interactive Sparkline, cancellable host analysis with sources, pricing, proof and FAQ.",
      "file": "components/motion/analytics-landing.tsx",
      "extraFiles": [
        "components/motion/landing-templates/shared.tsx"
      ],
      "examples": [
        {
          "slug": "default",
          "name": "Analytics Landing",
          "description": "Change the input period and ask conversion/drop-off questions calculated from that exact sample funnel. Unsupported local-demo questions return visible errors; production analysis is injected through onAnalyze.",
          "file": "components/motion/analytics-landing.tsx",
          "previewKey": "blocks/analytics-landing-default",
          "previewFile": "components/previews/blocks/analytics-landing-default.preview.tsx",
          "usageFile": "components/previews/blocks/analytics-landing-default.preview.tsx",
          "author": "asharca",
          "badge": "new",
          "launchedAt": "2026-11-04",
          "installSlug": "analytics-landing"
        }
      ],
      "author": "asharca",
      "credit": {
        "name": "Asharca",
        "url": "https://github.com/asharca/ui"
      },
      "badge": "new",
      "launchedAt": "2026-11-04"
    }
  },
  {
    "publicSlug": "ai-workspace-landing",
    "category": "blocks",
    "entry": {
      "slug": "ai-workspace-landing",
      "name": "AI Workspace",
      "description": "AI workspace launch site with an original animated terraced-rainbow WebGL hero, rotating prompts, host-configured assistants and cancellable responses, genuine artifact destinations, warm product scenes, billing comparison and FAQ.",
      "file": "components/motion/ai-workspace-landing.tsx",
      "extraFiles": [
        "components/motion/landing-templates/shared.tsx"
      ],
      "examples": [
        {
          "slug": "default",
          "name": "AI Workspace",
          "description": "Choose an assistant, use a suggested prompt and inspect the explicit local planning controller output. Product scene selectors expose distinct host data. This product site is not the standalone workspace application.",
          "file": "components/motion/ai-workspace-landing.tsx",
          "previewKey": "blocks/ai-workspace-landing-default",
          "previewFile": "components/previews/blocks/ai-workspace-landing-default.preview.tsx",
          "usageFile": "components/previews/blocks/ai-workspace-landing-default.preview.tsx",
          "author": "asharca",
          "badge": "new",
          "launchedAt": "2026-11-04",
          "installSlug": "ai-workspace-landing"
        }
      ],
      "author": "asharca",
      "credit": {
        "name": "Asharca",
        "url": "https://github.com/asharca/ui"
      },
      "badge": "new",
      "launchedAt": "2026-11-04"
    }
  },
  {
    "publicSlug": "personal-website",
    "category": "blocks",
    "entry": {
      "slug": "personal-website",
      "name": "Personal Website",
      "description": "Monochrome editorial portfolio with circular theme reveal, expandable introduction, focus and hover link previews, scroll-snapping projects, accessible project details, host-supplied Writing articles with actual destinations, work history and contact links.",
      "file": "components/motion/personal-website.tsx",
      "extraFiles": [
        "components/motion/landing-templates/shared.tsx"
      ],
      "examples": [
        {
          "slug": "default",
          "name": "Personal Website",
          "description": "Expand the profile, preview inline links, inspect projects and follow attributed Writing articles. Portfolio data and imagery are host-replaceable; sample work and biography remain explicitly fictional.",
          "file": "components/motion/personal-website.tsx",
          "previewKey": "blocks/personal-website-default",
          "previewFile": "components/previews/blocks/personal-website-default.preview.tsx",
          "usageFile": "components/previews/blocks/personal-website-default.preview.tsx",
          "author": "asharca",
          "badge": "new",
          "launchedAt": "2026-11-04",
          "installSlug": "personal-website"
        }
      ],
      "author": "asharca",
      "credit": {
        "name": "Asharca",
        "url": "https://github.com/asharca/ui"
      },
      "badge": "new",
      "launchedAt": "2026-11-04"
    }
  },
  {
    "publicSlug": "dashboards",
    "category": "blocks",
    "entry": {
      "slug": "dashboards",
      "name": "Dashboards",
      "description": "Host-driven finance, support, team capacity and goal pages with distinct reporting structures and interactive drill-ins.",
      "file": "components/motion/operations-dashboards.tsx",
      "extraFiles": [
        "components/motion/operations-page-parts.tsx"
      ],
      "examples": [
        {
          "slug": "finance",
          "name": "Finance",
          "description": "Period-linked cash charts, ledger search and transaction details, host-controlled card freezing and spending allowances.",
          "file": "components/motion/operations-dashboards.tsx",
          "previewKey": "DashboardsFinance",
          "previewFile": "components/previews/blocks/dashboards-finance.preview.tsx",
          "usageFile": "components/previews/blocks/dashboards-finance.preview.tsx",
          "author": "asharca",
          "badge": "new",
          "launchedAt": "2026-11-04",
          "installSlug": "dashboards"
        },
        {
          "slug": "support",
          "name": "Support",
          "description": "Request volume, response-target metrics, team updates and a filterable service queue with host resolution.",
          "file": "components/motion/operations-dashboards.tsx",
          "previewKey": "DashboardsSupport",
          "previewFile": "components/previews/blocks/dashboards-support.preview.tsx",
          "usageFile": "components/previews/blocks/dashboards-support.preview.tsx",
          "author": "asharca",
          "badge": "new",
          "launchedAt": "2026-11-04",
          "installSlug": "dashboards-support"
        },
        {
          "slug": "team-capacity",
          "name": "Team capacity",
          "description": "Interactive Heat Calendar, crew focus Composition Chart, period snapshots and expandable individual allocations.",
          "file": "components/motion/operations-dashboards.tsx",
          "previewKey": "DashboardsTeamCapacity",
          "previewFile": "components/previews/blocks/dashboards-team-capacity.preview.tsx",
          "usageFile": "components/previews/blocks/dashboards-team-capacity.preview.tsx",
          "author": "asharca",
          "badge": "new",
          "launchedAt": "2026-11-04",
          "installSlug": "dashboards-team-capacity"
        },
        {
          "slug": "goals",
          "name": "Goals",
          "description": "Measured goals and independent milestone checklists with cycle and owner filtering.",
          "file": "components/motion/operations-dashboards.tsx",
          "previewKey": "DashboardsGoals",
          "previewFile": "components/previews/blocks/dashboards-goals.preview.tsx",
          "usageFile": "components/previews/blocks/dashboards-goals.preview.tsx",
          "author": "asharca",
          "badge": "new",
          "launchedAt": "2026-11-04",
          "installSlug": "dashboards-goals"
        }
      ],
      "author": "asharca",
      "credit": {
        "name": "Asharca",
        "url": "https://github.com/asharca/ui"
      },
      "badge": "new",
      "launchedAt": "2026-11-04"
    }
  },
  {
    "publicSlug": "crypto-agent",
    "category": "blocks",
    "entry": {
      "slug": "crypto-agent",
      "name": "Crypto Agent",
      "description": "Host-controlled wallet conversation with swap quotes, saved-contact sends and capped approvals, preserving signature, broadcast and confirmation boundaries.",
      "file": "components/motion/crypto-transaction-chat.tsx",
      "extraFiles": [
        "components/motion/operations-page-parts.tsx"
      ],
      "examples": [
        {
          "slug": "transaction-chat",
          "name": "Transaction chat",
          "description": "Conversation, tool states, proposal review, quote refresh, approval/rejection and explicit host-reported transaction results.",
          "file": "components/motion/crypto-transaction-chat.tsx",
          "previewKey": "CryptoAgentTransactionChat",
          "previewFile": "components/previews/blocks/crypto-agent-transaction-chat.preview.tsx",
          "usageFile": "components/previews/blocks/crypto-agent-transaction-chat.preview.tsx",
          "author": "asharca",
          "badge": "new",
          "launchedAt": "2026-11-04",
          "installSlug": "crypto-agent"
        }
      ],
      "author": "asharca",
      "credit": {
        "name": "Asharca",
        "url": "https://github.com/asharca/ui"
      },
      "badge": "new",
      "launchedAt": "2026-11-04"
    }
  },
  {
    "publicSlug": "crypto-governance",
    "category": "blocks",
    "entry": {
      "slug": "crypto-governance",
      "name": "Crypto Governance",
      "description": "Data-driven governance overview and proposal pages with search, deadline clocks, vote splits, quorum, timeline, discussion and host voting callbacks.",
      "file": "components/motion/crypto-governance-pages.tsx",
      "extraFiles": [
        "components/motion/operations-page-parts.tsx"
      ],
      "examples": [
        {
          "slug": "proposals-overview",
          "name": "Proposals overview",
          "description": "Searchable proposal directory, status filters, closing-soon countdown and live host-supplied tally/quorum.",
          "file": "components/motion/crypto-governance-pages.tsx",
          "previewKey": "CryptoGovernanceOverview",
          "previewFile": "components/previews/blocks/crypto-governance-proposals-overview.preview.tsx",
          "usageFile": "components/previews/blocks/crypto-governance-proposals-overview.preview.tsx",
          "author": "asharca",
          "badge": "new",
          "launchedAt": "2026-11-04",
          "installSlug": "crypto-governance"
        },
        {
          "slug": "proposal-page",
          "name": "Proposal page",
          "description": "Full proposal text, author, state timeline, delegate reasons, discussion and sticky voting/results panel.",
          "file": "components/motion/crypto-governance-pages.tsx",
          "previewKey": "CryptoGovernanceProposal",
          "previewFile": "components/previews/blocks/crypto-governance-proposal-page.preview.tsx",
          "usageFile": "components/previews/blocks/crypto-governance-proposal-page.preview.tsx",
          "author": "asharca",
          "badge": "new",
          "launchedAt": "2026-11-04",
          "installSlug": "crypto-governance-proposal-page"
        }
      ],
      "author": "asharca",
      "credit": {
        "name": "Asharca",
        "url": "https://github.com/asharca/ui"
      },
      "badge": "new",
      "launchedAt": "2026-11-04"
    }
  },
  {
    "publicSlug": "trading-pages",
    "category": "blocks",
    "entry": {
      "slug": "trading-pages",
      "name": "Trading Pages",
      "description": "Independent spot terminal and staged token sale flows with exact decimal input validation and host-controlled orders, balances and contribution confirmations.",
      "file": "components/motion/operations-trading-pages.tsx",
      "extraFiles": [
        "components/motion/operations-page-parts.tsx"
      ],
      "examples": [
        {
          "slug": "trading-terminal",
          "name": "Trading terminal",
          "description": "Candles, depth ladder, trade tape, market/limit ticket and account orders driven by one host market snapshot.",
          "file": "components/motion/operations-trading-pages.tsx",
          "previewKey": "TradingPagesTerminal",
          "previewFile": "components/previews/blocks/trading-pages-trading-terminal.preview.tsx",
          "usageFile": "components/previews/blocks/trading-pages-trading-terminal.preview.tsx",
          "author": "asharca",
          "badge": "new",
          "launchedAt": "2026-11-04",
          "installSlug": "trading-pages"
        },
        {
          "slug": "token-presale",
          "name": "Token presale",
          "description": "Stage deadlines and pricing, raise milestones, soft cap, bonus tiers, precision/balance/risk gates, vesting schedule and host contribution feed.",
          "file": "components/motion/operations-trading-pages.tsx",
          "previewKey": "TradingPagesPresale",
          "previewFile": "components/previews/blocks/trading-pages-token-presale.preview.tsx",
          "usageFile": "components/previews/blocks/trading-pages-token-presale.preview.tsx",
          "author": "asharca",
          "badge": "new",
          "launchedAt": "2026-11-04",
          "installSlug": "trading-pages-token-presale"
        }
      ],
      "author": "asharca",
      "credit": {
        "name": "Asharca",
        "url": "https://github.com/asharca/ui"
      },
      "badge": "new",
      "launchedAt": "2026-11-04"
    }
  },
  {
    "publicSlug": "about",
    "category": "blocks",
    "entry": {
      "slug": "about",
      "name": "About",
      "description": "Host-authored story and company journey pages with people, values, metrics and an accessible milestone timeline.",
      "file": "components/motion/about.tsx",
      "extraFiles": [
        "components/motion/text-reveal.tsx"
      ],
      "examples": [
        {
          "slug": "story-page",
          "name": "Story page",
          "description": "Centered story hero and chapter links, gradient studio collage, mission and value columns, company metrics, portrait team grid and closing call to action.",
          "file": "components/motion/about.tsx",
          "previewKey": "blocks/about-story-page",
          "previewFile": "components/previews/blocks/about-story-page.preview.tsx",
          "author": "asharca",
          "badge": "new",
          "launchedAt": "2026-11-04",
          "installSlug": "about"
        },
        {
          "slug": "journey-timeline",
          "name": "Journey timeline",
          "description": "A two-column company journey with a vertical milestone narrative, selected milestone summary, metrics band and expanding leadership portraits.",
          "file": "components/motion/about.tsx",
          "previewKey": "blocks/about-journey-timeline",
          "previewFile": "components/previews/blocks/about-journey-timeline.preview.tsx",
          "author": "asharca",
          "badge": "new",
          "launchedAt": "2026-11-04",
          "installSlug": "about-journey-timeline"
        }
      ],
      "author": "asharca",
      "credit": {
        "name": "Asharca",
        "url": "https://github.com/asharca/ui"
      },
      "badge": "new",
      "launchedAt": "2026-11-04"
    }
  },
  {
    "publicSlug": "careers",
    "category": "blocks",
    "entry": {
      "slug": "careers",
      "name": "Careers",
      "description": "A filtered expandable roles board and an independent culture page with host-owned role and application destinations.",
      "file": "components/motion/careers.tsx",
      "extraFiles": [
        "components/motion/select.tsx",
        "components/motion/text-reveal.tsx"
      ],
      "examples": [
        {
          "slug": "roles-board",
          "name": "Roles board",
          "description": "Counted department pills, existing location Select, spring-expanding responsibilities, details/application links and an empty-state reset.",
          "file": "components/motion/careers.tsx",
          "previewKey": "blocks/careers-roles-board",
          "previewFile": "components/previews/blocks/careers-roles-board.preview.tsx",
          "author": "asharca",
          "badge": "new",
          "launchedAt": "2026-11-04",
          "installSlug": "careers"
        },
        {
          "slug": "culture-page",
          "name": "Culture page",
          "description": "Editorial gradient hero, values, gapless perks bento, featured role, accessible horizontal team stories and split closing links.",
          "file": "components/motion/careers.tsx",
          "previewKey": "blocks/careers-culture-page",
          "previewFile": "components/previews/blocks/careers-culture-page.preview.tsx",
          "author": "asharca",
          "badge": "new",
          "launchedAt": "2026-11-04",
          "installSlug": "careers-culture-page"
        }
      ],
      "author": "asharca",
      "credit": {
        "name": "Asharca",
        "url": "https://github.com/asharca/ui"
      },
      "badge": "new",
      "launchedAt": "2026-11-04"
    }
  },
  {
    "publicSlug": "changelog-pages",
    "category": "blocks",
    "entry": {
      "slug": "changelog-pages",
      "name": "Changelog Pages",
      "description": "Three distinct release archives with host content, category/version intersections, UTC chronology and real body anchors.",
      "file": "components/motion/changelog-pages.tsx",
      "extraFiles": [
        "components/motion/editorial-subscription.tsx"
      ],
      "examples": [
        {
          "slug": "sidebar-updates",
          "name": "Sidebar updates",
          "description": "Gradient introduction, sticky category/version sidebar and release anchor archive.",
          "file": "components/motion/changelog-pages.tsx",
          "previewKey": "blocks/changelog-pages-sidebar-updates",
          "previewFile": "components/previews/blocks/changelog-pages-sidebar-updates.preview.tsx",
          "author": "asharca",
          "badge": "new",
          "launchedAt": "2026-11-04",
          "installSlug": "changelog-pages"
        },
        {
          "slug": "editorial-updates",
          "name": "Editorial updates",
          "description": "Spacious journal layout, version gutter, long-form highlights and optional subscription.",
          "file": "components/motion/changelog-pages.tsx",
          "previewKey": "blocks/changelog-pages-editorial-updates",
          "previewFile": "components/previews/blocks/changelog-pages-editorial-updates.preview.tsx",
          "author": "asharca",
          "badge": "new",
          "launchedAt": "2026-11-04",
          "installSlug": "changelog-pages-editorial-updates"
        },
        {
          "slug": "simple-updates",
          "name": "Simple updates",
          "description": "Warm memory illustration, latest-improvement feature and layered earlier-update history.",
          "file": "components/motion/changelog-pages.tsx",
          "previewKey": "blocks/changelog-pages-simple-updates",
          "previewFile": "components/previews/blocks/changelog-pages-simple-updates.preview.tsx",
          "author": "asharca",
          "badge": "new",
          "launchedAt": "2026-11-04",
          "installSlug": "changelog-pages-simple-updates"
        }
      ],
      "author": "asharca",
      "credit": {
        "name": "Asharca",
        "url": "https://github.com/asharca/ui"
      },
      "badge": "new",
      "launchedAt": "2026-11-04"
    }
  },
  {
    "publicSlug": "blog-pages",
    "category": "blocks",
    "entry": {
      "slug": "blog-pages",
      "name": "Blog Pages",
      "description": "Publication homes and long-form reading with host data, category/page state, contents navigation and share actions.",
      "file": "components/motion/blog-pages.tsx",
      "extraFiles": [
        "components/motion/editorial-subscription.tsx"
      ],
      "examples": [
        {
          "slug": "blog-index",
          "name": "Blog index",
          "description": "Asymmetric feature, spacious story grid, category filters, pagination and host newsletter.",
          "file": "components/motion/blog-pages.tsx",
          "previewKey": "blocks/blog-pages-blog-index",
          "previewFile": "components/previews/blocks/blog-pages-blog-index.preview.tsx",
          "author": "asharca",
          "badge": "new",
          "launchedAt": "2026-11-04",
          "installSlug": "blog-pages"
        },
        {
          "slug": "rounded-blog-index",
          "name": "Rounded blog index",
          "description": "Compact rounded photographic feature, denser bordered image cards, filters and pagination.",
          "file": "components/motion/blog-pages.tsx",
          "previewKey": "blocks/blog-pages-rounded-blog-index",
          "previewFile": "components/previews/blocks/blog-pages-rounded-blog-index.preview.tsx",
          "author": "asharca",
          "badge": "new",
          "launchedAt": "2026-11-04",
          "installSlug": "blog-pages-rounded-blog-index"
        },
        {
          "slug": "article-page",
          "name": "Article page",
          "description": "Long-form sections, responsive sticky contents, pull quote, clipboard and email sharing, adjacent/related stories.",
          "file": "components/motion/blog-pages.tsx",
          "previewKey": "blocks/blog-pages-article-page",
          "previewFile": "components/previews/blocks/blog-pages-article-page.preview.tsx",
          "author": "asharca",
          "badge": "new",
          "launchedAt": "2026-11-04",
          "installSlug": "blog-pages-article-page"
        }
      ],
      "author": "asharca",
      "credit": {
        "name": "Asharca",
        "url": "https://github.com/asharca/ui"
      },
      "badge": "new",
      "launchedAt": "2026-11-04"
    }
  },
  {
    "publicSlug": "not-found-pages",
    "category": "blocks",
    "existingEntrySlug": "not-found",
    "entry": {
      "slug": "not-found",
      "name": "404 Pages",
      "description": "Nine independently structured recovery pages with accessible tap/focus alternatives and reduced-motion behavior.",
      "file": "components/motion/not-found-pages.tsx",
      "extraFiles": [
        "components/motion/not-found-pages.tsx",
        "components/motion/not-found/shared.tsx"
      ],
      "examples": [
        {
          "slug": "not-found-pages-falling-blocks",
          "name": "Falling blocks",
          "description": "Tile-built numerals repeatedly scatter and reconstruct during interaction.",
          "file": "components/motion/not-found-pages.tsx",
          "previewKey": "blocks/not-found-pages-falling-blocks",
          "previewFile": "components/previews/blocks/not-found-pages-falling-blocks.preview.tsx",
          "author": "asharca",
          "badge": "new",
          "launchedAt": "2026-11-04",
          "installSlug": "not-found-pages-falling-blocks"
        },
        {
          "slug": "not-found-pages-flip-panels",
          "name": "Flip panels",
          "description": "Staggered three-dimensional numeral panels, spring-smoothed pointer tilt and entrance replay.",
          "file": "components/motion/not-found-pages.tsx",
          "previewKey": "blocks/not-found-pages-flip-panels",
          "previewFile": "components/previews/blocks/not-found-pages-flip-panels.preview.tsx",
          "author": "asharca",
          "badge": "new",
          "launchedAt": "2026-11-04",
          "installSlug": "not-found-pages-flip-panels"
        },
        {
          "slug": "not-found-pages-elastic-type",
          "name": "Elastic type",
          "description": "Individually compressible oversized digits with spring rebound.",
          "file": "components/motion/not-found-pages.tsx",
          "previewKey": "blocks/not-found-pages-elastic-type",
          "previewFile": "components/previews/blocks/not-found-pages-elastic-type.preview.tsx",
          "author": "asharca",
          "badge": "new",
          "launchedAt": "2026-11-04",
          "installSlug": "not-found-pages-elastic-type"
        },
        {
          "slug": "not-found-pages-echo-stack",
          "name": "Echo stack",
          "description": "Five repeated typographic echoes fan apart on hover, focus or tap.",
          "file": "components/motion/not-found-pages.tsx",
          "previewKey": "blocks/not-found-pages-echo-stack",
          "previewFile": "components/previews/blocks/not-found-pages-echo-stack.preview.tsx",
          "author": "asharca",
          "badge": "new",
          "launchedAt": "2026-11-04",
          "installSlug": "not-found-pages-echo-stack"
        },
        {
          "slug": "not-found-pages-spotlight-reveal",
          "name": "Spotlight reveal",
          "description": "Dark numeric field with a spring-smoothed cursor spotlight and reduced-motion reveal.",
          "file": "components/motion/not-found-pages.tsx",
          "previewKey": "blocks/not-found-pages-spotlight-reveal",
          "previewFile": "components/previews/blocks/not-found-pages-spotlight-reveal.preview.tsx",
          "author": "asharca",
          "badge": "new",
          "launchedAt": "2026-11-04",
          "installSlug": "not-found-pages-spotlight-reveal"
        },
        {
          "slug": "not-found-pages-sliced-type",
          "name": "Sliced type",
          "description": "Cobalt type split into six horizontally slipping animated bands.",
          "file": "components/motion/not-found-pages.tsx",
          "previewKey": "blocks/not-found-pages-sliced-type",
          "previewFile": "components/previews/blocks/not-found-pages-sliced-type.preview.tsx",
          "author": "asharca",
          "badge": "new",
          "launchedAt": "2026-11-04",
          "installSlug": "not-found-pages-sliced-type"
        },
        {
          "slug": "not-found-pages-editorial-issue",
          "name": "Editorial issue",
          "description": "Vermilion publication masthead, staggered oversized numerals and issue reprint.",
          "file": "components/motion/not-found-pages.tsx",
          "previewKey": "blocks/not-found-pages-editorial-issue",
          "previewFile": "components/previews/blocks/not-found-pages-editorial-issue.preview.tsx",
          "author": "asharca",
          "badge": "new",
          "launchedAt": "2026-11-04",
          "installSlug": "not-found-pages-editorial-issue"
        },
        {
          "slug": "not-found-pages-terminal-trace",
          "name": "Terminal trace",
          "description": "Host-provided request path and trace, scanning staged output, expandable history and command-style recovery links.",
          "file": "components/motion/not-found-pages.tsx",
          "previewKey": "blocks/not-found-pages-terminal-trace",
          "previewFile": "components/previews/blocks/not-found-pages-terminal-trace.preview.tsx",
          "author": "asharca",
          "badge": "new",
          "launchedAt": "2026-11-04",
          "installSlug": "not-found-pages-terminal-trace"
        },
        {
          "slug": "not-found-pages-wayfinder",
          "name": "Wayfinder",
          "description": "Warm original route illustration, animated waypoint and real selectable destination links.",
          "file": "components/motion/not-found-pages.tsx",
          "previewKey": "blocks/not-found-pages-wayfinder",
          "previewFile": "components/previews/blocks/not-found-pages-wayfinder.preview.tsx",
          "author": "asharca",
          "badge": "new",
          "launchedAt": "2026-11-04",
          "installSlug": "not-found-pages-wayfinder"
        }
      ]
    }
  },
  {
    "publicSlug": "audit-trail",
    "category": "blocks",
    "entry": {
      "slug": "audit-trail",
      "name": "Audit Trail",
      "description": "Searchable workspace history grouped by date, with actor and category filters and original value inspection.",
      "file": "components/motion/audit-trail.tsx",
      "examples": [
        {
          "slug": "workspace-history",
          "name": "Workspace history",
          "description": "Workspace history: Searchable workspace history grouped by date, with actor and category filters and original value inspection.",
          "file": "components/motion/audit-trail.tsx",
          "previewKey": "AuditTrailWorkspaceHistoryPreview",
          "previewFile": "components/previews/blocks/audit-trail-workspace-history.preview.tsx",
          "usageFile": "components/previews/blocks/audit-trail-workspace-history.preview.tsx",
          "author": "asharca",
          "badge": "new",
          "launchedAt": "2026-11-04",
          "installSlug": "audit-trail"
        }
      ],
      "author": "asharca",
      "credit": {
        "name": "Asharca",
        "url": "https://github.com/asharca/ui"
      },
      "badge": "new",
      "launchedAt": "2026-11-04"
    }
  },
  {
    "publicSlug": "log-explorer",
    "category": "blocks",
    "entry": {
      "slug": "log-explorer",
      "name": "Log Explorer",
      "description": "A host-fed execution log with frozen pause snapshots, counted severity filters and scroll-safe structured payload inspection.",
      "file": "components/motion/log-explorer.tsx",
      "examples": [
        {
          "slug": "execution-logs",
          "name": "Execution logs",
          "description": "Execution logs: A host-fed execution log with frozen pause snapshots, counted severity filters and scroll-safe structured payload inspection.",
          "file": "components/motion/log-explorer.tsx",
          "previewKey": "LogExplorerExecutionLogsPreview",
          "previewFile": "components/previews/blocks/log-explorer-execution-logs.preview.tsx",
          "usageFile": "components/previews/blocks/log-explorer-execution-logs.preview.tsx",
          "author": "asharca",
          "badge": "new",
          "launchedAt": "2026-11-04",
          "installSlug": "log-explorer"
        }
      ],
      "author": "asharca",
      "credit": {
        "name": "Asharca",
        "url": "https://github.com/asharca/ui"
      },
      "badge": "new",
      "launchedAt": "2026-11-04"
    }
  },
  {
    "publicSlug": "performance-report",
    "category": "blocks",
    "entry": {
      "slug": "performance-report",
      "name": "Performance Report",
      "description": "Period- and team-filtered reporting with weighted response metrics, equal-length comparisons and tied leaderboards.",
      "file": "components/motion/performance-report.tsx",
      "examples": [
        {
          "slug": "team-performance",
          "name": "Team performance",
          "description": "Team performance: Period- and team-filtered reporting with weighted response metrics, equal-length comparisons and tied leaderboards.",
          "file": "components/motion/performance-report.tsx",
          "previewKey": "TeamPerformancePreview",
          "previewFile": "components/previews/blocks/performance-report-team-performance.preview.tsx",
          "usageFile": "components/previews/blocks/performance-report-team-performance.preview.tsx",
          "author": "asharca",
          "badge": "new",
          "launchedAt": "2026-11-04",
          "installSlug": "performance-report"
        },
        {
          "slug": "period-comparison",
          "name": "Period comparison",
          "description": "Period comparison: Period- and team-filtered reporting with weighted response metrics, equal-length comparisons and tied leaderboards.",
          "file": "components/motion/performance-report.tsx",
          "previewKey": "PeriodComparisonPreview",
          "previewFile": "components/previews/blocks/performance-report-period-comparison.preview.tsx",
          "usageFile": "components/previews/blocks/performance-report-period-comparison.preview.tsx",
          "author": "asharca",
          "badge": "new",
          "launchedAt": "2026-11-04",
          "installSlug": "performance-report-period-comparison"
        },
        {
          "slug": "team-leaderboard",
          "name": "Team leaderboard",
          "description": "Team leaderboard: Period- and team-filtered reporting with weighted response metrics, equal-length comparisons and tied leaderboards.",
          "file": "components/motion/performance-report.tsx",
          "previewKey": "TeamLeaderboardPreview",
          "previewFile": "components/previews/blocks/performance-report-team-leaderboard.preview.tsx",
          "usageFile": "components/previews/blocks/performance-report-team-leaderboard.preview.tsx",
          "author": "asharca",
          "badge": "new",
          "launchedAt": "2026-11-04",
          "installSlug": "performance-report-team-leaderboard"
        }
      ],
      "author": "asharca",
      "credit": {
        "name": "Asharca",
        "url": "https://github.com/asharca/ui"
      },
      "badge": "new",
      "launchedAt": "2026-11-04"
    }
  },
  {
    "publicSlug": "kpi-overview",
    "category": "blocks",
    "entry": {
      "slug": "kpi-overview",
      "name": "KPI Overview",
      "description": "Six distinct host-driven KPI layouts: area trends, compact bars, gauges, connected support cards, summary and inset headers.",
      "file": "components/motion/kpi-overview.tsx",
      "examples": [
        {
          "slug": "trend-kpi-cards",
          "name": "Trend KPI cards",
          "description": "Trend KPI cards: Six distinct host-driven KPI layouts: area trends, compact bars, gauges, connected support cards, summary and inset headers.",
          "file": "components/motion/kpi-overview.tsx",
          "previewKey": "TrendKpiCardsPreview",
          "previewFile": "components/previews/blocks/kpi-overview-trend-kpi-cards.preview.tsx",
          "usageFile": "components/previews/blocks/kpi-overview-trend-kpi-cards.preview.tsx",
          "author": "asharca",
          "badge": "new",
          "launchedAt": "2026-11-04",
          "installSlug": "kpi-overview"
        },
        {
          "slug": "compact-kpi-cards",
          "name": "Compact KPI cards",
          "description": "Compact KPI cards: Six distinct host-driven KPI layouts: area trends, compact bars, gauges, connected support cards, summary and inset headers.",
          "file": "components/motion/kpi-overview.tsx",
          "previewKey": "CompactKpiCardsPreview",
          "previewFile": "components/previews/blocks/kpi-overview-compact-kpi-cards.preview.tsx",
          "usageFile": "components/previews/blocks/kpi-overview-compact-kpi-cards.preview.tsx",
          "author": "asharca",
          "badge": "new",
          "launchedAt": "2026-11-04",
          "installSlug": "kpi-overview-compact-kpi-cards"
        },
        {
          "slug": "gauge-kpi-cards",
          "name": "Gauge KPI cards",
          "description": "Gauge KPI cards: Six distinct host-driven KPI layouts: area trends, compact bars, gauges, connected support cards, summary and inset headers.",
          "file": "components/motion/kpi-overview.tsx",
          "previewKey": "GaugeKpiCardsPreview",
          "previewFile": "components/previews/blocks/kpi-overview-gauge-kpi-cards.preview.tsx",
          "usageFile": "components/previews/blocks/kpi-overview-gauge-kpi-cards.preview.tsx",
          "author": "asharca",
          "badge": "new",
          "launchedAt": "2026-11-04",
          "installSlug": "kpi-overview-gauge-kpi-cards"
        },
        {
          "slug": "connected-support-kpi-cards",
          "name": "Connected support KPI cards",
          "description": "Connected support KPI cards: Six distinct host-driven KPI layouts: area trends, compact bars, gauges, connected support cards, summary and inset headers.",
          "file": "components/motion/kpi-overview.tsx",
          "previewKey": "ConnectedSupportKpiCardsPreview",
          "previewFile": "components/previews/blocks/kpi-overview-connected-support-kpi-cards.preview.tsx",
          "usageFile": "components/previews/blocks/kpi-overview-connected-support-kpi-cards.preview.tsx",
          "author": "asharca",
          "badge": "new",
          "launchedAt": "2026-11-04",
          "installSlug": "kpi-overview-connected-support-kpi-cards"
        },
        {
          "slug": "summary-kpi-card",
          "name": "Summary KPI card",
          "description": "Summary KPI card: Six distinct host-driven KPI layouts: area trends, compact bars, gauges, connected support cards, summary and inset headers.",
          "file": "components/motion/kpi-overview.tsx",
          "previewKey": "SummaryKpiCardPreview",
          "previewFile": "components/previews/blocks/kpi-overview-summary-kpi-card.preview.tsx",
          "usageFile": "components/previews/blocks/kpi-overview-summary-kpi-card.preview.tsx",
          "author": "asharca",
          "badge": "new",
          "launchedAt": "2026-11-04",
          "installSlug": "kpi-overview-summary-kpi-card"
        },
        {
          "slug": "header-kpi-cards",
          "name": "Header KPI cards",
          "description": "Header KPI cards: Six distinct host-driven KPI layouts: area trends, compact bars, gauges, connected support cards, summary and inset headers.",
          "file": "components/motion/kpi-overview.tsx",
          "previewKey": "HeaderKpiCardsPreview",
          "previewFile": "components/previews/blocks/kpi-overview-header-kpi-cards.preview.tsx",
          "usageFile": "components/previews/blocks/kpi-overview-header-kpi-cards.preview.tsx",
          "author": "asharca",
          "badge": "new",
          "launchedAt": "2026-11-04",
          "installSlug": "kpi-overview-header-kpi-cards"
        }
      ],
      "author": "asharca",
      "credit": {
        "name": "Asharca",
        "url": "https://github.com/asharca/ui"
      },
      "badge": "new",
      "launchedAt": "2026-11-04"
    }
  },
  {
    "publicSlug": "credit-usage",
    "category": "blocks",
    "entry": {
      "slug": "credit-usage",
      "name": "Credit Usage",
      "description": "Date-filtered credit consumption with stacked daily trends, keyboard scrubbing, category meters and searchable exportable breakdowns.",
      "file": "components/motion/credit-usage.tsx",
      "examples": [
        {
          "slug": "daily-trend",
          "name": "Daily trend",
          "description": "Daily trend: Date-filtered credit consumption with stacked daily trends, keyboard scrubbing, category meters and searchable exportable breakdowns.",
          "file": "components/motion/credit-usage.tsx",
          "previewKey": "CreditUsageDailyTrendPreview",
          "previewFile": "components/previews/blocks/credit-usage-daily-trend.preview.tsx",
          "usageFile": "components/previews/blocks/credit-usage-daily-trend.preview.tsx",
          "author": "asharca",
          "badge": "new",
          "launchedAt": "2026-11-04",
          "installSlug": "credit-usage"
        },
        {
          "slug": "usage-breakdown",
          "name": "Usage breakdown",
          "description": "Usage breakdown: Date-filtered credit consumption with stacked daily trends, keyboard scrubbing, category meters and searchable exportable breakdowns.",
          "file": "components/motion/credit-usage.tsx",
          "previewKey": "CreditUsageBreakdownPreview",
          "previewFile": "components/previews/blocks/credit-usage-usage-breakdown.preview.tsx",
          "usageFile": "components/previews/blocks/credit-usage-usage-breakdown.preview.tsx",
          "author": "asharca",
          "badge": "new",
          "launchedAt": "2026-11-04",
          "installSlug": "credit-usage-usage-breakdown"
        }
      ],
      "author": "asharca",
      "credit": {
        "name": "Asharca",
        "url": "https://github.com/asharca/ui"
      },
      "badge": "new",
      "launchedAt": "2026-11-04"
    }
  },
  {
    "publicSlug": "usage-budget",
    "category": "blocks",
    "entry": {
      "slug": "usage-budget",
      "name": "Usage Budget",
      "description": "Resource consumption and externally supplied thresholds with an adjustable asynchronous planning budget.",
      "file": "components/motion/usage-budget.tsx",
      "examples": [
        {
          "slug": "usage-budget",
          "name": "Usage Budget",
          "description": "Usage Budget: Resource consumption and externally supplied thresholds with an adjustable asynchronous planning budget.",
          "file": "components/motion/usage-budget.tsx",
          "previewKey": "UsageBudgetPreview",
          "previewFile": "components/previews/blocks/usage-budget-usage-budget.preview.tsx",
          "usageFile": "components/previews/blocks/usage-budget-usage-budget.preview.tsx",
          "author": "asharca",
          "badge": "new",
          "launchedAt": "2026-11-04",
          "installSlug": "usage-budget"
        }
      ],
      "author": "asharca",
      "credit": {
        "name": "Asharca",
        "url": "https://github.com/asharca/ui"
      },
      "badge": "new",
      "launchedAt": "2026-11-04"
    }
  },
  {
    "publicSlug": "agent-builder",
    "category": "blocks",
    "entry": {
      "slug": "agent-builder",
      "name": "Agent Builder",
      "description": "A split configuration workspace with host-owned models, knowledge, tool permissions, saved-state tracking and abortable streaming test conversations.",
      "file": "components/agents/agent-workspace.tsx",
      "examples": [
        {
          "slug": "agent-workspace",
          "name": "Agent workspace",
          "description": "Configure and validate an agent, save through a real host callback, and test complete or streaming answers with cancellation and error recovery.",
          "file": "components/agents/agent-workspace.tsx",
          "previewKey": "AgentBuilderAgentWorkspacePreview",
          "previewFile": "components/previews/blocks/agent-builder-agent-workspace.preview.tsx",
          "usageFile": "components/previews/blocks/agent-builder-agent-workspace.preview.tsx",
          "author": "asharca",
          "badge": "new",
          "launchedAt": "2026-11-04",
          "installSlug": "agent-builder"
        }
      ],
      "author": "asharca",
      "credit": {
        "name": "Asharca",
        "url": "https://github.com/asharca/ui"
      },
      "badge": "new",
      "launchedAt": "2026-11-04"
    }
  },
  {
    "publicSlug": "knowledge-base",
    "category": "blocks",
    "entry": {
      "slug": "knowledge-base",
      "name": "Knowledge Base",
      "description": "Host-driven document context management and a distinct searchable help center with article reading dialogs.",
      "file": "components/motion/knowledge-workspace.tsx",
      "extraFiles": [
        "components/motion/searchable-help-center.tsx",
        "components/motion/knowledge-search-text.tsx"
      ],
      "examples": [
        {
          "slug": "ai-knowledge-workspace",
          "name": "AI knowledge workspace",
          "description": "Manage notes, text-document imports and reference links, filter literal source text, inspect host statuses, measure known context and confirm removals.",
          "file": "components/motion/knowledge-workspace.tsx",
          "previewKey": "KnowledgeBaseAIKnowledgeWorkspacePreview",
          "previewFile": "components/previews/blocks/knowledge-base-ai-knowledge-workspace.preview.tsx",
          "usageFile": "components/previews/blocks/knowledge-base-ai-knowledge-workspace.preview.tsx",
          "author": "asharca",
          "badge": "new",
          "launchedAt": "2026-11-04",
          "installSlug": "knowledge-base"
        },
        {
          "slug": "searchable-help-center",
          "name": "Searchable help center",
          "description": "Search supplied articles or connect host search; browse topics and read structured article dialogs with supplied reading time and optional host feedback.",
          "file": "components/motion/searchable-help-center.tsx",
          "previewKey": "KnowledgeBaseSearchableHelpCenterPreview",
          "previewFile": "components/previews/blocks/knowledge-base-searchable-help-center.preview.tsx",
          "usageFile": "components/previews/blocks/knowledge-base-searchable-help-center.preview.tsx",
          "author": "asharca",
          "badge": "new",
          "launchedAt": "2026-11-04",
          "installSlug": "knowledge-base-searchable-help-center"
        }
      ],
      "author": "asharca",
      "credit": {
        "name": "Asharca",
        "url": "https://github.com/asharca/ui"
      },
      "badge": "new",
      "launchedAt": "2026-11-04"
    }
  },
  {
    "publicSlug": "roadmap",
    "category": "blocks",
    "entry": {
      "slug": "roadmap",
      "name": "Roadmap",
      "description": "A period-grouped public release roadmap with explicit UTC ordering, undated plans, host-defined phases and statuses, progress, votes and release details.",
      "file": "components/motion/release-roadmap.tsx",
      "examples": [
        {
          "slug": "release-timeline",
          "name": "Release timeline",
          "description": "Filter release stages, read details, inspect reported progress and vote through host callbacks; never assign invented dates to unscheduled items.",
          "file": "components/motion/release-roadmap.tsx",
          "previewKey": "RoadmapReleaseTimelinePreview",
          "previewFile": "components/previews/blocks/roadmap-release-timeline.preview.tsx",
          "usageFile": "components/previews/blocks/roadmap-release-timeline.preview.tsx",
          "author": "asharca",
          "badge": "new",
          "launchedAt": "2026-11-04",
          "installSlug": "roadmap"
        }
      ],
      "author": "asharca",
      "credit": {
        "name": "Asharca",
        "url": "https://github.com/asharca/ui"
      },
      "badge": "new",
      "launchedAt": "2026-11-04"
    }
  },
  {
    "publicSlug": "blog-sections",
    "category": "blocks",
    "entry": {
      "slug": "blog-sections",
      "name": "Blog Sections",
      "description": "Host-owned editorial collections with categories and pagination.",
      "file": "components/motion/blog-sections.tsx",
      "extraFiles": [
        "components/motion/marketing-stories-shared.tsx"
      ],
      "examples": [
        {
          "slug": "image-first-cards",
          "name": "Image-first cards",
          "description": "Illustrated covers lead category, publication details and linked article headings.",
          "file": "components/motion/blog-sections.tsx",
          "previewKey": "blog-sections-image-first-cards",
          "previewFile": "components/previews/blocks/blog-sections-image-first-cards.preview.tsx",
          "usageFile": "components/previews/blocks/blog-sections-image-first-cards.preview.tsx",
          "author": "asharca",
          "badge": "new",
          "launchedAt": "2026-11-04",
          "installSlug": "blog-sections"
        },
        {
          "slug": "featured-stories",
          "name": "Featured stories",
          "description": "One large lead story sits beside compact illustrated supporting articles.",
          "file": "components/motion/blog-sections.tsx",
          "previewKey": "blog-sections-featured-stories",
          "previewFile": "components/previews/blocks/blog-sections-featured-stories.preview.tsx",
          "usageFile": "components/previews/blocks/blog-sections-featured-stories.preview.tsx",
          "author": "asharca",
          "badge": "new",
          "launchedAt": "2026-11-04",
          "installSlug": "blog-sections-featured-stories"
        },
        {
          "slug": "article-list",
          "name": "Article list",
          "description": "Compact divided article feed with category selection, reading times and pagination.",
          "file": "components/motion/blog-sections.tsx",
          "previewKey": "blog-sections-article-list",
          "previewFile": "components/previews/blocks/blog-sections-article-list.preview.tsx",
          "usageFile": "components/previews/blocks/blog-sections-article-list.preview.tsx",
          "author": "asharca",
          "badge": "new",
          "launchedAt": "2026-11-04",
          "installSlug": "blog-sections-article-list"
        },
        {
          "slug": "article-cards",
          "name": "Article cards",
          "description": "Text-led article cards place rounded covers below publication metadata.",
          "file": "components/motion/blog-sections.tsx",
          "previewKey": "blog-sections-article-cards",
          "previewFile": "components/previews/blocks/blog-sections-article-cards.preview.tsx",
          "usageFile": "components/previews/blocks/blog-sections-article-cards.preview.tsx",
          "author": "asharca",
          "badge": "new",
          "launchedAt": "2026-11-04",
          "installSlug": "blog-sections-article-cards"
        }
      ],
      "author": "asharca",
      "credit": {
        "name": "Asharca",
        "url": "https://github.com/asharca/ui"
      },
      "badge": "new",
      "launchedAt": "2026-11-04"
    }
  },
  {
    "publicSlug": "case-studies",
    "category": "blocks",
    "entry": {
      "slug": "case-studies",
      "name": "Case Studies",
      "description": "Customer spotlights and industry-filtered stories with before/after detail dialogs.",
      "file": "components/motion/case-studies.tsx",
      "extraFiles": [
        "components/motion/marketing-stories-shared.tsx"
      ],
      "examples": [
        {
          "slug": "story-spotlight",
          "name": "Story spotlight",
          "description": "Selectable rotating customer rail synchronizes media, quotation and rolling outcomes; details compare before and after.",
          "file": "components/motion/case-studies.tsx",
          "previewKey": "case-studies-story-spotlight",
          "previewFile": "components/previews/blocks/case-studies-story-spotlight.preview.tsx",
          "usageFile": "components/previews/blocks/case-studies-story-spotlight.preview.tsx",
          "author": "asharca",
          "badge": "new",
          "launchedAt": "2026-11-04",
          "installSlug": "case-studies"
        },
        {
          "slug": "story-grid",
          "name": "Story grid",
          "description": "Industry filters reflow photo-led cards with an oversized lead and customer detail dialogs.",
          "file": "components/motion/case-studies.tsx",
          "previewKey": "case-studies-story-grid",
          "previewFile": "components/previews/blocks/case-studies-story-grid.preview.tsx",
          "usageFile": "components/previews/blocks/case-studies-story-grid.preview.tsx",
          "author": "asharca",
          "badge": "new",
          "launchedAt": "2026-11-04",
          "installSlug": "case-studies-story-grid"
        }
      ],
      "author": "asharca",
      "credit": {
        "name": "Asharca",
        "url": "https://github.com/asharca/ui"
      },
      "badge": "new",
      "launchedAt": "2026-11-04"
    }
  },
  {
    "publicSlug": "social-proof",
    "category": "blocks",
    "entry": {
      "slug": "social-proof",
      "name": "Social Proof",
      "description": "Inspectable evidence and synchronized customer outcome compositions.",
      "file": "components/motion/social-proof.tsx",
      "extraFiles": [
        "components/motion/marketing-stories-shared.tsx",
        "components/motion/case-studies.tsx"
      ],
      "examples": [
        {
          "slug": "evidence-brief",
          "name": "Evidence brief",
          "description": "Research narrative and rolling benchmarks accompany a source notebook with disclosure and methodology.",
          "file": "components/motion/social-proof.tsx",
          "previewKey": "social-proof-evidence-brief",
          "previewFile": "components/previews/blocks/social-proof-evidence-brief.preview.tsx",
          "usageFile": "components/previews/blocks/social-proof-evidence-brief.preview.tsx",
          "author": "asharca",
          "badge": "new",
          "launchedAt": "2026-11-04",
          "installSlug": "social-proof"
        },
        {
          "slug": "customer-story-gallery",
          "name": "Customer story gallery",
          "description": "Featured image-led account and two supporting stories with direct destinations and promotion controls.",
          "file": "components/motion/social-proof.tsx",
          "previewKey": "social-proof-customer-story-gallery",
          "previewFile": "components/previews/blocks/social-proof-customer-story-gallery.preview.tsx",
          "usageFile": "components/previews/blocks/social-proof-customer-story-gallery.preview.tsx",
          "author": "asharca",
          "badge": "new",
          "launchedAt": "2026-11-04",
          "installSlug": "social-proof-customer-story-gallery"
        },
        {
          "slug": "customer-story-reel",
          "name": "Customer story reel",
          "description": "Company selector, directional slide navigation, outcome metrics and optional pausable rotation.",
          "file": "components/motion/social-proof.tsx",
          "previewKey": "social-proof-customer-story-reel",
          "previewFile": "components/previews/blocks/social-proof-customer-story-reel.preview.tsx",
          "usageFile": "components/previews/blocks/social-proof-customer-story-reel.preview.tsx",
          "author": "asharca",
          "badge": "new",
          "launchedAt": "2026-11-04",
          "installSlug": "social-proof-customer-story-reel"
        }
      ],
      "author": "asharca",
      "credit": {
        "name": "Asharca",
        "url": "https://github.com/asharca/ui"
      },
      "badge": "new",
      "launchedAt": "2026-11-04"
    }
  },
  {
    "publicSlug": "testimonials",
    "category": "blocks",
    "entry": {
      "slug": "testimonials",
      "name": "Testimonials",
      "description": "Editorial quote walls, accessible moving tracks and selectable customer spotlights.",
      "file": "components/motion/testimonials.tsx",
      "extraFiles": [
        "components/motion/marketing-stories-shared.tsx"
      ],
      "examples": [
        {
          "slug": "marquee-wall",
          "name": "Marquee wall",
          "description": "Two independently directed horizontal Marquee rows with inert hidden duplicate tracks and pause controls.",
          "file": "components/motion/testimonials.tsx",
          "previewKey": "testimonials-marquee-wall",
          "previewFile": "components/previews/blocks/testimonials-marquee-wall.preview.tsx",
          "usageFile": "components/previews/blocks/testimonials-marquee-wall.preview.tsx",
          "author": "asharca",
          "badge": "new",
          "launchedAt": "2026-11-04",
          "installSlug": "testimonials"
        },
        {
          "slug": "spotlight",
          "name": "Spotlight",
          "description": "Centered rotating quote, avatar selection ring, previous/next controls and explicit pause.",
          "file": "components/motion/testimonials.tsx",
          "previewKey": "testimonials-spotlight",
          "previewFile": "components/previews/blocks/testimonials-spotlight.preview.tsx",
          "usageFile": "components/previews/blocks/testimonials-spotlight.preview.tsx",
          "author": "asharca",
          "badge": "new",
          "launchedAt": "2026-11-04",
          "installSlug": "testimonials-spotlight"
        },
        {
          "slug": "masonry-grid",
          "name": "Masonry grid",
          "description": "CSS-column quote wall with a featured accent and reduced-motion-aware staggered reveal.",
          "file": "components/motion/testimonials.tsx",
          "previewKey": "testimonials-masonry-grid",
          "previewFile": "components/previews/blocks/testimonials-masonry-grid.preview.tsx",
          "usageFile": "components/previews/blocks/testimonials-masonry-grid.preview.tsx",
          "author": "asharca",
          "badge": "new",
          "launchedAt": "2026-11-04",
          "installSlug": "testimonials-masonry-grid"
        },
        {
          "slug": "archive-wall",
          "name": "Archive wall",
          "description": "Pinned index cards, portrait treatments, reference codes, monospace notes and host join destination.",
          "file": "components/motion/testimonials.tsx",
          "previewKey": "testimonials-archive-wall",
          "previewFile": "components/previews/blocks/testimonials-archive-wall.preview.tsx",
          "usageFile": "components/previews/blocks/testimonials-archive-wall.preview.tsx",
          "author": "asharca",
          "badge": "new",
          "launchedAt": "2026-11-04",
          "installSlug": "testimonials-archive-wall"
        },
        {
          "slug": "vertical-dispatch",
          "name": "Vertical dispatch",
          "description": "Three alternating vertical Marquee columns of outcome-led quotes with independent hover pause.",
          "file": "components/motion/testimonials.tsx",
          "previewKey": "testimonials-vertical-dispatch",
          "previewFile": "components/previews/blocks/testimonials-vertical-dispatch.preview.tsx",
          "usageFile": "components/previews/blocks/testimonials-vertical-dispatch.preview.tsx",
          "author": "asharca",
          "badge": "new",
          "launchedAt": "2026-11-04",
          "installSlug": "testimonials-vertical-dispatch"
        }
      ],
      "author": "asharca",
      "credit": {
        "name": "Asharca",
        "url": "https://github.com/asharca/ui"
      },
      "badge": "new",
      "launchedAt": "2026-11-04"
    }
  },
  {
    "publicSlug": "image-galleries",
    "category": "blocks",
    "entry": {
      "slug": "image-galleries",
      "name": "Image Galleries",
      "description": "Moving image walls, reshaping mosaics and expanding rails composed with ImageViewer.",
      "file": "components/motion/image-galleries.tsx",
      "extraFiles": [
        "components/motion/marketing-stories-shared.tsx"
      ],
      "examples": [
        {
          "slug": "vertical-image-gallery",
          "name": "Vertical image gallery",
          "description": "Configurable alternating continuous columns with stable crops, accessible selection and composed lightbox.",
          "file": "components/motion/image-galleries.tsx",
          "previewKey": "image-galleries-vertical-image-gallery",
          "previewFile": "components/previews/blocks/image-galleries-vertical-image-gallery.preview.tsx",
          "usageFile": "components/previews/blocks/image-galleries-vertical-image-gallery.preview.tsx",
          "author": "asharca",
          "badge": "new",
          "launchedAt": "2026-11-04",
          "installSlug": "image-galleries"
        },
        {
          "slug": "morphing-mosaic",
          "name": "Morphing mosaic",
          "description": "Active image expands into a large editorial frame as the four surrounding frames reflow.",
          "file": "components/motion/image-galleries.tsx",
          "previewKey": "image-galleries-morphing-mosaic",
          "previewFile": "components/previews/blocks/image-galleries-morphing-mosaic.preview.tsx",
          "usageFile": "components/previews/blocks/image-galleries-morphing-mosaic.preview.tsx",
          "author": "asharca",
          "badge": "new",
          "launchedAt": "2026-11-04",
          "installSlug": "image-galleries-morphing-mosaic"
        },
        {
          "slug": "expanding-focus-rail",
          "name": "Expanding focus rail",
          "description": "Selected or focused frame expands while neighboring frames contract; keyboard and lightbox navigation stay synchronized.",
          "file": "components/motion/image-galleries.tsx",
          "previewKey": "image-galleries-expanding-focus-rail",
          "previewFile": "components/previews/blocks/image-galleries-expanding-focus-rail.preview.tsx",
          "usageFile": "components/previews/blocks/image-galleries-expanding-focus-rail.preview.tsx",
          "author": "asharca",
          "badge": "new",
          "launchedAt": "2026-11-04",
          "installSlug": "image-galleries-expanding-focus-rail"
        }
      ],
      "author": "asharca",
      "credit": {
        "name": "Asharca",
        "url": "https://github.com/asharca/ui"
      },
      "badge": "new",
      "launchedAt": "2026-11-04"
    }
  },
  {
    "publicSlug": "how-it-works",
    "category": "blocks",
    "entry": {
      "slug": "how-it-works",
      "name": "How It Works",
      "description": "Five original process narratives: independent disclosures, direct scene focus, alternating editorial stories, keyboard-guided playback, and a navigable layered card row.",
      "file": "components/motion/how-it-works.tsx",
      "examples": [
        {
          "slug": "centered-process-cards",
          "name": "Centered process cards",
          "description": "Centered introduction and independent product-scene cards with native step-scope disclosures.",
          "file": "components/motion/how-it-works.tsx",
          "previewKey": "blocks/how-it-works-centered-process-cards",
          "previewFile": "components/previews/blocks/how-it-works-centered-process-cards.preview.tsx",
          "usageFile": "components/previews/blocks/how-it-works-centered-process-cards.preview.tsx",
          "installSlug": "how-it-works",
          "author": "asharca",
          "badge": "new",
          "launchedAt": "2026-11-04"
        },
        {
          "slug": "cinematic-process-grid",
          "name": "Cinematic process grid",
          "description": "All process steps remain visible while direct selection changes scene emphasis and synchronized progress.",
          "file": "components/motion/how-it-works.tsx",
          "previewKey": "blocks/how-it-works-cinematic-process-grid",
          "previewFile": "components/previews/blocks/how-it-works-cinematic-process-grid.preview.tsx",
          "usageFile": "components/previews/blocks/how-it-works-cinematic-process-grid.preview.tsx",
          "installSlug": "how-it-works-cinematic-process-grid",
          "author": "asharca",
          "badge": "new",
          "launchedAt": "2026-11-04"
        },
        {
          "slug": "editorial-story-stack",
          "name": "Editorial story stack",
          "description": "Alternating spacious story sections, large step numerals, atmospheric scene frames, and readable scroll reveals.",
          "file": "components/motion/how-it-works.tsx",
          "previewKey": "blocks/how-it-works-editorial-story-stack",
          "previewFile": "components/previews/blocks/how-it-works-editorial-story-stack.preview.tsx",
          "usageFile": "components/previews/blocks/how-it-works-editorial-story-stack.preview.tsx",
          "installSlug": "how-it-works-editorial-story-stack",
          "author": "asharca",
          "badge": "new",
          "launchedAt": "2026-11-04"
        },
        {
          "slug": "guided-walkthrough",
          "name": "Guided walkthrough",
          "description": "A shared product-scene canvas with three keyboard-selectable process stages, progress indicators and optional viewport-aware autoplay.",
          "file": "components/motion/how-it-works.tsx",
          "previewKey": "blocks/how-it-works-guided-walkthrough",
          "previewFile": "components/previews/blocks/how-it-works-guided-walkthrough.preview.tsx",
          "usageFile": "components/previews/blocks/how-it-works-guided-walkthrough.preview.tsx",
          "installSlug": "how-it-works-guided-walkthrough",
          "author": "asharca",
          "badge": "new",
          "launchedAt": "2026-11-04"
        },
        {
          "slug": "progressive-card-deck",
          "name": "Progressive card deck",
          "description": "Full-width process cards travel into a sticky layered row with previous/next and keyboard progress navigation.",
          "file": "components/motion/how-it-works.tsx",
          "previewKey": "blocks/how-it-works-progressive-card-deck",
          "previewFile": "components/previews/blocks/how-it-works-progressive-card-deck.preview.tsx",
          "usageFile": "components/previews/blocks/how-it-works-progressive-card-deck.preview.tsx",
          "installSlug": "how-it-works-progressive-card-deck",
          "author": "asharca",
          "badge": "new",
          "launchedAt": "2026-11-04"
        }
      ],
      "extraFiles": [
        "components/motion/marketing-systems-playback.ts"
      ],
      "author": "asharca",
      "credit": {
        "name": "Asharca",
        "url": "https://github.com/asharca/ui"
      },
      "badge": "new",
      "launchedAt": "2026-11-04"
    }
  },
  {
    "publicSlug": "logo-cloud",
    "category": "blocks",
    "entry": {
      "slug": "logo-cloud",
      "name": "Logo Cloud",
      "description": "Host-supplied social proof across a reusable seamless marquee, hairline grid, independent kinetic columns, and visibility-aware fixed-slot rolling carousel.",
      "file": "components/motion/logo-cloud.tsx",
      "examples": [
        {
          "slug": "logo-marquee",
          "name": "Logo marquee",
          "description": "Existing Marquee composes linked original wordmarks, explicit pause, inert hidden duplicates, and visibility-aware playback.",
          "file": "components/motion/logo-cloud.tsx",
          "previewKey": "blocks/logo-cloud-logo-marquee",
          "previewFile": "components/previews/blocks/logo-cloud-logo-marquee.preview.tsx",
          "usageFile": "components/previews/blocks/logo-cloud-logo-marquee.preview.tsx",
          "installSlug": "logo-cloud",
          "author": "asharca",
          "badge": "new",
          "launchedAt": "2026-11-04"
        },
        {
          "slug": "logo-grid",
          "name": "Logo grid",
          "description": "Responsive hairline logo wall with original marks, host links, staggered reveal, and hover-capable emphasis.",
          "file": "components/motion/logo-cloud.tsx",
          "previewKey": "blocks/logo-cloud-logo-grid",
          "previewFile": "components/previews/blocks/logo-cloud-logo-grid.preview.tsx",
          "usageFile": "components/previews/blocks/logo-cloud-logo-grid.preview.tsx",
          "installSlug": "logo-cloud-logo-grid",
          "author": "asharca",
          "badge": "new",
          "launchedAt": "2026-11-04"
        },
        {
          "slug": "kinetic-logo-columns",
          "name": "Kinetic logo columns",
          "description": "Split social-proof composition with four alternating masked logo lanes, independent hover pause, and global pause.",
          "file": "components/motion/logo-cloud.tsx",
          "previewKey": "blocks/logo-cloud-kinetic-logo-columns",
          "previewFile": "components/previews/blocks/logo-cloud-kinetic-logo-columns.preview.tsx",
          "usageFile": "components/previews/blocks/logo-cloud-kinetic-logo-columns.preview.tsx",
          "installSlug": "logo-cloud-kinetic-logo-columns",
          "author": "asharca",
          "badge": "new",
          "launchedAt": "2026-11-04"
        },
        {
          "slug": "rolling-logo-carousel",
          "name": "Rolling logo carousel",
          "description": "Fixed-slot linked wordmarks roll between groups with staggered entries, gated exits, manual controls, and pause.",
          "file": "components/motion/logo-cloud.tsx",
          "previewKey": "blocks/logo-cloud-rolling-logo-carousel",
          "previewFile": "components/previews/blocks/logo-cloud-rolling-logo-carousel.preview.tsx",
          "usageFile": "components/previews/blocks/logo-cloud-rolling-logo-carousel.preview.tsx",
          "installSlug": "logo-cloud-rolling-logo-carousel",
          "author": "asharca",
          "badge": "new",
          "launchedAt": "2026-11-04"
        }
      ],
      "extraFiles": [
        "components/motion/marketing-systems-playback.ts"
      ],
      "author": "asharca",
      "credit": {
        "name": "Asharca",
        "url": "https://github.com/asharca/ui"
      },
      "badge": "new",
      "launchedAt": "2026-11-04"
    }
  },
  {
    "publicSlug": "trust-security",
    "category": "blocks",
    "entry": {
      "slug": "trust-security",
      "name": "Trust and Security",
      "description": "Four evidence-led trust compositions with host-authored claims, scope disclosures, numeric availability, support commitments, and real evidence/contact destinations.",
      "file": "components/motion/trust-security.tsx",
      "examples": [
        {
          "slug": "enterprise-readiness",
          "name": "Enterprise readiness",
          "description": "Support and deployment evidence cards paired with an explicit security-controls panel and host contact destination.",
          "file": "components/motion/trust-security.tsx",
          "previewKey": "blocks/trust-security-enterprise-readiness",
          "previewFile": "components/previews/blocks/trust-security-enterprise-readiness.preview.tsx",
          "usageFile": "components/previews/blocks/trust-security-enterprise-readiness.preview.tsx",
          "installSlug": "trust-security",
          "author": "asharca",
          "badge": "new",
          "launchedAt": "2026-11-04"
        },
        {
          "slug": "compliance-marks",
          "name": "Compliance marks",
          "description": "Editorial policy/evidence wall with explicit illustrative status, scope disclosures, and host trust-center destination.",
          "file": "components/motion/trust-security.tsx",
          "previewKey": "blocks/trust-security-compliance-marks",
          "previewFile": "components/previews/blocks/trust-security-compliance-marks.preview.tsx",
          "usageFile": "components/previews/blocks/trust-security-compliance-marks.preview.tsx",
          "installSlug": "trust-security-compliance-marks",
          "author": "asharca",
          "badge": "new",
          "launchedAt": "2026-11-04"
        },
        {
          "slug": "security-safeguards",
          "name": "Security safeguards",
          "description": "Split protection illustration and plain-language safeguards with bounded reduced-motion-aware animation.",
          "file": "components/motion/trust-security.tsx",
          "previewKey": "blocks/trust-security-security-safeguards",
          "previewFile": "components/previews/blocks/trust-security-security-safeguards.preview.tsx",
          "usageFile": "components/previews/blocks/trust-security-security-safeguards.preview.tsx",
          "installSlug": "trust-security-security-safeguards",
          "author": "asharca",
          "badge": "new",
          "launchedAt": "2026-11-04"
        },
        {
          "slug": "reliability-and-support",
          "name": "Reliability and support",
          "description": "Existing NumberTicker availability composition with drawn host history, exact observations, and support evidence.",
          "file": "components/motion/trust-security.tsx",
          "previewKey": "blocks/trust-security-reliability-and-support",
          "previewFile": "components/previews/blocks/trust-security-reliability-and-support.preview.tsx",
          "usageFile": "components/previews/blocks/trust-security-reliability-and-support.preview.tsx",
          "installSlug": "trust-security-reliability-and-support",
          "author": "asharca",
          "badge": "new",
          "launchedAt": "2026-11-04"
        }
      ],
      "author": "asharca",
      "credit": {
        "name": "Asharca",
        "url": "https://github.com/asharca/ui"
      },
      "badge": "new",
      "launchedAt": "2026-11-04"
    }
  },
  {
    "publicSlug": "integrations",
    "category": "blocks",
    "entry": {
      "slug": "integrations",
      "name": "Integrations",
      "description": "Five connected-workspace surfaces with host-owned statuses, search/category filters, health observations, editable configuration, async actions, and accessible detail dialogs.",
      "file": "components/motion/integrations.tsx",
      "examples": [
        {
          "slug": "integration-health",
          "name": "Integration health",
          "description": "Status counts and filters, host sync sparklines, real sync/reconnect callbacks, and permissions/runs/error details.",
          "file": "components/motion/integrations.tsx",
          "previewKey": "blocks/integrations-integration-health",
          "previewFile": "components/previews/blocks/integrations-integration-health.preview.tsx",
          "usageFile": "components/previews/blocks/integrations-integration-health.preview.tsx",
          "installSlug": "integrations",
          "author": "asharca",
          "badge": "new",
          "launchedAt": "2026-11-04"
        },
        {
          "slug": "integration-directory",
          "name": "Integration directory",
          "description": "A searchable browse and installed marketplace with a shader-backed two-row icon marquee and a compact two-column directory.",
          "file": "components/motion/integrations.tsx",
          "previewKey": "blocks/integrations-integration-directory",
          "previewFile": "components/previews/blocks/integrations-integration-directory.preview.tsx",
          "usageFile": "components/previews/blocks/integrations-integration-directory.preview.tsx",
          "installSlug": "integrations-integration-directory",
          "author": "asharca",
          "badge": "new",
          "launchedAt": "2026-11-04"
        },
        {
          "slug": "editorial-integration-grid",
          "name": "Editorial integration grid",
          "description": "Inset editorial app cards with category pills, search, host-controlled connection switches, and configuration.",
          "file": "components/motion/integrations.tsx",
          "previewKey": "blocks/integrations-editorial-integration-grid",
          "previewFile": "components/previews/blocks/integrations-editorial-integration-grid.preview.tsx",
          "usageFile": "components/previews/blocks/integrations-editorial-integration-grid.preview.tsx",
          "installSlug": "integrations-editorial-integration-grid",
          "author": "asharca",
          "badge": "new",
          "launchedAt": "2026-11-04"
        },
        {
          "slug": "integration-orbit",
          "name": "Integration orbit",
          "description": "Interactive radial tool selection with focused host connection state, animated links, and accessible details.",
          "file": "components/motion/integrations.tsx",
          "previewKey": "blocks/integrations-integration-orbit",
          "previewFile": "components/previews/blocks/integrations-integration-orbit.preview.tsx",
          "usageFile": "components/previews/blocks/integrations-integration-orbit.preview.tsx",
          "installSlug": "integrations-integration-orbit",
          "author": "asharca",
          "badge": "new",
          "launchedAt": "2026-11-04"
        },
        {
          "slug": "integration-ledger",
          "name": "Integration ledger",
          "description": "Split connection spotlight and searchable/filterable/sortable connection ledger with real host actions.",
          "file": "components/motion/integrations.tsx",
          "previewKey": "blocks/integrations-integration-ledger",
          "previewFile": "components/previews/blocks/integrations-integration-ledger.preview.tsx",
          "usageFile": "components/previews/blocks/integrations-integration-ledger.preview.tsx",
          "installSlug": "integrations-integration-ledger",
          "author": "asharca",
          "badge": "new",
          "launchedAt": "2026-11-04"
        }
      ],
      "extraFiles": [
        "components/motion/marketing-systems-playback.ts"
      ],
      "author": "asharca",
      "credit": {
        "name": "Asharca",
        "url": "https://github.com/asharca/ui"
      },
      "badge": "new",
      "launchedAt": "2026-11-04"
    }
  },
  { "publicSlug": "announcement-banners", "category": "blocks", "entry": { "slug": "announcement-banners",
  "name": "Announcement Banners",
  "description": "Four configurable announcement compositions with motion-aware playback, real link actions and accessible dismissal.",
  "file": "components/motion/announcement-banners.tsx", "examples": [{
    "slug": "gradient-marquee-strip",
    "name": "Gradient Marquee Strip",
    "description": "A narrow gradient announcement strip with repeated release links, motion-aware playback and accessible dismissal.",
    "file": "components/motion/announcement-banners.tsx",
    "previewKey": "AnnouncementBannersGradientMarqueeStripPreview",
    "previewFile": "components/previews/blocks/announcement-banners-gradient-marquee-strip.preview.tsx",
    "usageFile": "components/previews/blocks/announcement-banners-gradient-marquee-strip.preview.tsx",
    "author": "asharca",
    "badge": "new",
    "launchedAt": "2026-11-04",
    "installSlug": "announcement-banners"
  }, {
    "slug": "shader-launch-modal",
    "name": "Shader Launch Modal",
    "description": "An inline shader-art launch card with dismissal and reopening, plus an optional controlled modal presentation for host triggers.",
    "file": "components/motion/announcement-banners.tsx",
    "previewKey": "AnnouncementBannersShaderLaunchModalPreview",
    "previewFile": "components/previews/blocks/announcement-banners-shader-launch-modal.preview.tsx",
    "usageFile": "components/previews/blocks/announcement-banners-shader-launch-modal.preview.tsx",
    "author": "asharca",
    "badge": "new",
    "launchedAt": "2026-11-04",
    "installSlug": "announcement-banners-shader-launch-modal"
  }, {
    "slug": "rotating-announcement-ribbon",
    "name": "Rotating Announcement Ribbon",
    "description": "A solid-brand announcement ribbon with rotating copy, real release actions, pause, next and dismiss controls.",
    "file": "components/motion/announcement-banners.tsx",
    "previewKey": "AnnouncementBannersRotatingAnnouncementRibbonPreview",
    "previewFile": "components/previews/blocks/announcement-banners-rotating-announcement-ribbon.preview.tsx",
    "usageFile": "components/previews/blocks/announcement-banners-rotating-announcement-ribbon.preview.tsx",
    "author": "asharca",
    "badge": "new",
    "launchedAt": "2026-11-04",
    "installSlug": "announcement-banners-rotating-announcement-ribbon"
  }, {
    "slug": "stacked-announcement-cards",
    "name": "Stacked Announcement Cards",
    "description": "Layered announcement cards with selectable stories, automatic cycling and real destination links.",
    "file": "components/motion/announcement-banners.tsx",
    "previewKey": "AnnouncementBannersStackedAnnouncementCardsPreview",
    "previewFile": "components/previews/blocks/announcement-banners-stacked-announcement-cards.preview.tsx",
    "usageFile": "components/previews/blocks/announcement-banners-stacked-announcement-cards.preview.tsx",
    "author": "asharca",
    "badge": "new",
    "launchedAt": "2026-11-04",
    "installSlug": "announcement-banners-stacked-announcement-cards"
  }], "author": "asharca",
  "credit": {
    "name": "Asharca",
    "url": "https://github.com/asharca/ui"
  },
  "badge": "new",
  "launchedAt": "2026-11-04" } },
  {
    "publicSlug": "navbar",
    "category": "blocks",
    "entry": {
      "slug": "navbar",
      "name": "Navbar",
      "description": "Six responsive navigation editions with active routes, nested resource panels and focus-managed mobile navigation.",
      "file": "components/motion/navbar.tsx",
      "examples": [
        {
          "slug": "pill-navigation",
          "name": "Pill Navigation",
          "description": "Pill Navigation: interactive, self-contained usage of PillNavigation.",
          "file": "components/motion/navbar.tsx",
          "previewKey": "NavbarPillNavigationPreview",
          "previewFile": "components/previews/blocks/navbar-pill-navigation.preview.tsx",
          "usageFile": "components/previews/blocks/navbar-pill-navigation.preview.tsx",
          "author": "asharca",
          "badge": "new",
          "launchedAt": "2026-11-04",
          "installSlug": "navbar"
        },
        {
          "slug": "full-width-mega-menu",
          "name": "Full Width Mega Menu",
          "description": "Full Width Mega Menu: interactive, self-contained usage of FullWidthMegaMenu.",
          "file": "components/motion/navbar.tsx",
          "previewKey": "NavbarFullWidthMegaMenuPreview",
          "previewFile": "components/previews/blocks/navbar-full-width-mega-menu.preview.tsx",
          "usageFile": "components/previews/blocks/navbar-full-width-mega-menu.preview.tsx",
          "author": "asharca",
          "badge": "new",
          "launchedAt": "2026-11-04",
          "installSlug": "navbar-full-width-mega-menu"
        },
        {
          "slug": "morphing-navbar",
          "name": "Morphing Navbar",
          "description": "Morphing Navbar: interactive, self-contained usage of MorphingNavbar.",
          "file": "components/motion/navbar.tsx",
          "previewKey": "NavbarMorphingNavbarPreview",
          "previewFile": "components/previews/blocks/navbar-morphing-navbar.preview.tsx",
          "usageFile": "components/previews/blocks/navbar-morphing-navbar.preview.tsx",
          "author": "asharca",
          "badge": "new",
          "launchedAt": "2026-11-04",
          "installSlug": "navbar-morphing-navbar"
        },
        {
          "slug": "feature-morph",
          "name": "Feature Morph",
          "description": "Feature Morph: interactive, self-contained usage of FeatureMorph.",
          "file": "components/motion/navbar.tsx",
          "previewKey": "NavbarFeatureMorphPreview",
          "previewFile": "components/previews/blocks/navbar-feature-morph.preview.tsx",
          "usageFile": "components/previews/blocks/navbar-feature-morph.preview.tsx",
          "author": "asharca",
          "badge": "new",
          "launchedAt": "2026-11-04",
          "installSlug": "navbar-feature-morph"
        },
        {
          "slug": "expanding-pill",
          "name": "Expanding Pill",
          "description": "Expanding Pill: interactive, self-contained usage of ExpandingPill.",
          "file": "components/motion/navbar.tsx",
          "previewKey": "NavbarExpandingPillPreview",
          "previewFile": "components/previews/blocks/navbar-expanding-pill.preview.tsx",
          "usageFile": "components/previews/blocks/navbar-expanding-pill.preview.tsx",
          "author": "asharca",
          "badge": "new",
          "launchedAt": "2026-11-04",
          "installSlug": "navbar-expanding-pill"
        },
        {
          "slug": "simple-header",
          "name": "Simple Header",
          "description": "Simple Header: interactive, self-contained usage of SimpleHeader.",
          "file": "components/motion/navbar.tsx",
          "previewKey": "NavbarSimpleHeaderPreview",
          "previewFile": "components/previews/blocks/navbar-simple-header.preview.tsx",
          "usageFile": "components/previews/blocks/navbar-simple-header.preview.tsx",
          "author": "asharca",
          "badge": "new",
          "launchedAt": "2026-11-04",
          "installSlug": "navbar-simple-header"
        }
      ],
      "author": "asharca",
      "credit": {
        "name": "Asharca",
        "url": "https://github.com/asharca/ui"
      },
      "badge": "new",
      "launchedAt": "2026-11-04"
    }
  },
  {
    "publicSlug": "stats",
    "category": "blocks",
    "entry": {
      "slug": "stats",
      "name": "Stats",
      "description": "Seven metric compositions covering segmented targets, editorial outcomes, impact reporting and host-supplied telemetry.",
      "file": "components/motion/stats.tsx",
      "examples": [
        {
          "slug": "segmented-progress-cards",
          "name": "Segmented Progress Cards",
          "description": "Segmented Progress Cards: interactive, self-contained usage of SegmentedProgressCards.",
          "file": "components/motion/stats.tsx",
          "previewKey": "StatsSegmentedProgressCardsPreview",
          "previewFile": "components/previews/blocks/stats-segmented-progress-cards.preview.tsx",
          "usageFile": "components/previews/blocks/stats-segmented-progress-cards.preview.tsx",
          "author": "asharca",
          "badge": "new",
          "launchedAt": "2026-11-04",
          "installSlug": "stats"
        },
        {
          "slug": "feature-outcomes",
          "name": "Feature Outcomes",
          "description": "Feature Outcomes: interactive, self-contained usage of FeatureOutcomes.",
          "file": "components/motion/stats.tsx",
          "previewKey": "StatsFeatureOutcomesPreview",
          "previewFile": "components/previews/blocks/stats-feature-outcomes.preview.tsx",
          "usageFile": "components/previews/blocks/stats-feature-outcomes.preview.tsx",
          "author": "asharca",
          "badge": "new",
          "launchedAt": "2026-11-04",
          "installSlug": "stats-feature-outcomes"
        },
        {
          "slug": "impact-dashboard",
          "name": "Impact Dashboard",
          "description": "Impact Dashboard: interactive, self-contained usage of ImpactDashboard.",
          "file": "components/motion/stats.tsx",
          "previewKey": "StatsImpactDashboardPreview",
          "previewFile": "components/previews/blocks/stats-impact-dashboard.preview.tsx",
          "usageFile": "components/previews/blocks/stats-impact-dashboard.preview.tsx",
          "author": "asharca",
          "badge": "new",
          "launchedAt": "2026-11-04",
          "installSlug": "stats-impact-dashboard"
        },
        {
          "slug": "telemetry-console",
          "name": "Telemetry Console",
          "description": "Telemetry Console: interactive, self-contained usage of TelemetryConsole.",
          "file": "components/motion/stats.tsx",
          "previewKey": "StatsTelemetryConsolePreview",
          "previewFile": "components/previews/blocks/stats-telemetry-console.preview.tsx",
          "usageFile": "components/previews/blocks/stats-telemetry-console.preview.tsx",
          "author": "asharca",
          "badge": "new",
          "launchedAt": "2026-11-04",
          "installSlug": "stats-telemetry-console"
        },
        {
          "slug": "stats-band",
          "name": "Stats Band",
          "description": "Stats Band: interactive, self-contained usage of StatsBand.",
          "file": "components/motion/stats.tsx",
          "previewKey": "StatsStatsBandPreview",
          "previewFile": "components/previews/blocks/stats-stats-band.preview.tsx",
          "usageFile": "components/previews/blocks/stats-stats-band.preview.tsx",
          "author": "asharca",
          "badge": "new",
          "launchedAt": "2026-11-04",
          "installSlug": "stats-stats-band"
        },
        {
          "slug": "stats-cards",
          "name": "Stats Cards",
          "description": "Stats Cards: interactive, self-contained usage of StatsCards.",
          "file": "components/motion/stats.tsx",
          "previewKey": "StatsStatsCardsPreview",
          "previewFile": "components/previews/blocks/stats-stats-cards.preview.tsx",
          "usageFile": "components/previews/blocks/stats-stats-cards.preview.tsx",
          "author": "asharca",
          "badge": "new",
          "launchedAt": "2026-11-04",
          "installSlug": "stats-stats-cards"
        },
        {
          "slug": "outcome-index",
          "name": "Outcome Index",
          "description": "Outcome Index: interactive, self-contained usage of OutcomeIndex.",
          "file": "components/motion/stats.tsx",
          "previewKey": "StatsOutcomeIndexPreview",
          "previewFile": "components/previews/blocks/stats-outcome-index.preview.tsx",
          "usageFile": "components/previews/blocks/stats-outcome-index.preview.tsx",
          "author": "asharca",
          "badge": "new",
          "launchedAt": "2026-11-04",
          "installSlug": "stats-outcome-index"
        }
      ],
      "author": "asharca",
      "credit": {
        "name": "Asharca",
        "url": "https://github.com/asharca/ui"
      },
      "badge": "new",
      "launchedAt": "2026-11-04"
    }
  },
  { "publicSlug": "comparison", "category": "blocks", "entry": { "slug": "comparison",
  "name": "Comparison",
  "description": "Seven image, benchmark, workflow and product comparisons with accessible selectors and explicit input-driven values.",
  "file": "components/motion/comparison.tsx", "examples": [{
    "slug": "before-and-after",
    "name": "Before And After",
    "description": "A three-scene image grading comparison with a draggable and keyboard-operable divider, live supplied metrics, tonal histogram and hold-to-compare.",
    "file": "components/motion/comparison.tsx",
    "previewKey": "ComparisonBeforeAndAfterPreview",
    "previewFile": "components/previews/blocks/comparison-before-and-after.preview.tsx",
    "usageFile": "components/previews/blocks/comparison-before-and-after.preview.tsx",
    "author": "asharca",
    "badge": "new",
    "launchedAt": "2026-11-04",
    "installSlug": "comparison-before-and-after"
  }, {
    "slug": "bar-comparison",
    "name": "Bar Comparison",
    "description": "Paired benchmark bars on a shared scale, ratio callouts and a host-rendered comparison selector.",
    "file": "components/motion/comparison.tsx",
    "previewKey": "ComparisonBarComparisonPreview",
    "previewFile": "components/previews/blocks/comparison-bar-comparison.preview.tsx",
    "usageFile": "components/previews/blocks/comparison-bar-comparison.preview.tsx",
    "author": "asharca",
    "badge": "new",
    "launchedAt": "2026-11-04",
    "installSlug": "comparison-bar-comparison"
  }, {
    "slug": "feature-comparison",
    "name": "Feature Comparison",
    "description": "A descriptive feature rail beside three product columns, with mobile product selection, included states and host-provided plan links.",
    "file": "components/motion/comparison.tsx",
    "previewKey": "ComparisonFeatureComparisonPreview",
    "previewFile": "components/previews/blocks/comparison-feature-comparison.preview.tsx",
    "usageFile": "components/previews/blocks/comparison-feature-comparison.preview.tsx",
    "author": "asharca",
    "badge": "new",
    "launchedAt": "2026-11-04",
    "installSlug": "comparison"
  }, {
    "slug": "workflow-comparison",
    "name": "Workflow Comparison",
    "description": "Two four-step workflow narratives comparing scattered handoffs with a connected workspace, with optional host-authored durations.",
    "file": "components/motion/comparison.tsx",
    "previewKey": "ComparisonWorkflowComparisonPreview",
    "previewFile": "components/previews/blocks/comparison-workflow-comparison.preview.tsx",
    "usageFile": "components/previews/blocks/comparison-workflow-comparison.preview.tsx",
    "author": "asharca",
    "badge": "new",
    "launchedAt": "2026-11-04",
    "installSlug": "comparison-workflow-comparison"
  }, {
    "slug": "head-to-head-comparison",
    "name": "Head To Head Comparison",
    "description": "A two-product selector with genuine differences-only filtering across a seven-feature illustrative dataset.",
    "file": "components/motion/comparison.tsx",
    "previewKey": "ComparisonHeadToHeadComparisonPreview",
    "previewFile": "components/previews/blocks/comparison-head-to-head-comparison.preview.tsx",
    "usageFile": "components/previews/blocks/comparison-head-to-head-comparison.preview.tsx",
    "author": "asharca",
    "badge": "new",
    "launchedAt": "2026-11-04",
    "installSlug": "comparison-head-to-head-comparison"
  }, {
    "slug": "tiled-matrix",
    "name": "Tiled Matrix",
    "description": "A five-product tiled capabilities matrix with seven feature rows and horizontal mobile comparison.",
    "file": "components/motion/comparison.tsx",
    "previewKey": "ComparisonTiledMatrixPreview",
    "previewFile": "components/previews/blocks/comparison-tiled-matrix.preview.tsx",
    "usageFile": "components/previews/blocks/comparison-tiled-matrix.preview.tsx",
    "author": "asharca",
    "badge": "new",
    "launchedAt": "2026-11-04",
    "installSlug": "comparison-tiled-matrix"
  }, {
    "slug": "spotlight-comparison",
    "name": "Spotlight Comparison",
    "description": "A four-product capabilities table emphasizing the host-featured product and counting included features.",
    "file": "components/motion/comparison.tsx",
    "previewKey": "ComparisonSpotlightComparisonPreview",
    "previewFile": "components/previews/blocks/comparison-spotlight-comparison.preview.tsx",
    "usageFile": "components/previews/blocks/comparison-spotlight-comparison.preview.tsx",
    "author": "asharca",
    "badge": "new",
    "launchedAt": "2026-11-04",
    "installSlug": "comparison-spotlight-comparison"
  }], "author": "asharca",
  "credit": {
    "name": "Asharca",
    "url": "https://github.com/asharca/ui"
  },
  "badge": "new",
  "launchedAt": "2026-11-04" } }
];

export const webCatalogDates: Record<string, { publishedAt: string; updatedAt: string }> = {
  "motion/illustration-app-preview": {
    "publishedAt": "2026-11-04",
    "updatedAt": "2026-11-06"
  },
  "motion/illustration-chat-exchange": {
    "publishedAt": "2026-11-04",
    "updatedAt": "2026-11-06"
  },
  "motion/illustration-payments": {
    "publishedAt": "2026-11-04",
    "updatedAt": "2026-11-06"
  },
  "motion/illustration-security": {
    "publishedAt": "2026-11-04",
    "updatedAt": "2026-11-06"
  },
  "motion/illustration-metrics": {
    "publishedAt": "2026-11-04",
    "updatedAt": "2026-11-06"
  },
  "motion/illustration-voice-note": {
    "publishedAt": "2026-11-04",
    "updatedAt": "2026-11-06"
  },
  "blocks/pricing": {
    "publishedAt": "2026-11-04",
    "updatedAt": "2026-11-06"
  },
  "blocks/footer-sections": {
    "publishedAt": "2026-11-04",
    "updatedAt": "2026-11-06"
  },
  "motion/ai-thinking-loader": {
    "publishedAt": "2026-11-04",
    "updatedAt": "2026-11-04"
  },
  "motion/text-animation": {
    "publishedAt": "2026-05-17",
    "updatedAt": "2026-11-06"
  },
  "motion/flip-card": {
    "publishedAt": "2026-11-04",
    "updatedAt": "2026-11-04"
  },
  "motion/morphic-tooltip": {
    "publishedAt": "2026-11-04",
    "updatedAt": "2026-11-04"
  },
  "motion/morphic-card-modal": {
    "publishedAt": "2026-11-04",
    "updatedAt": "2026-11-04"
  },
  "blocks/waitlist-pages": {
    "publishedAt": "2026-11-04",
    "updatedAt": "2026-11-04"
  },
  "blocks/status-pages": {
    "publishedAt": "2026-11-04",
    "updatedAt": "2026-11-06"
  },
  "blocks/pricing-pages": {
    "publishedAt": "2026-11-04",
    "updatedAt": "2026-11-06"
  },
  "blocks/search-pages": {
    "publishedAt": "2026-11-04",
    "updatedAt": "2026-11-04"
  },
  "blocks/docs-pages": {
    "publishedAt": "2026-11-04",
    "updatedAt": "2026-11-04"
  },
  "blocks/approval-queue": {
    "publishedAt": "2026-11-04",
    "updatedAt": "2026-11-06"
  },
  "blocks/questionnaire": {
    "publishedAt": "2026-11-04",
    "updatedAt": "2026-11-06"
  },
  "blocks/step-form": {
    "publishedAt": "2026-11-04",
    "updatedAt": "2026-11-06"
  },
  "blocks/team-invite": {
    "publishedAt": "2026-11-04",
    "updatedAt": "2026-11-06"
  },
  "blocks/api-keys": {
    "publishedAt": "2026-11-04",
    "updatedAt": "2026-11-06"
  },
  "blocks/whats-new": {
    "publishedAt": "2026-11-04",
    "updatedAt": "2026-11-06"
  },
  "blocks/empty-states": {
    "publishedAt": "2026-11-04",
    "updatedAt": "2026-11-06"
  },
  "blocks/notification-center": {
    "publishedAt": "2026-11-04",
    "updatedAt": "2026-11-06"
  },
  "motion/receipt": {
    "publishedAt": "2026-11-04",
    "updatedAt": "2026-11-04"
  },
  "motion/emoji-picker": {
    "publishedAt": "2026-11-04",
    "updatedAt": "2026-11-06"
  },
  "motion/animated-dropdown": {
    "publishedAt": "2026-11-04",
    "updatedAt": "2026-11-06"
  },
  "blocks/diff-review": {
    "publishedAt": "2026-11-04",
    "updatedAt": "2026-11-06"
  },
  "blocks/file-upload": {
    "publishedAt": "2026-06-18",
    "updatedAt": "2026-11-06"
  },
  "blocks/feature-sections": {
    "publishedAt": "2026-11-04",
    "updatedAt": "2026-11-06"
  },
  "blocks/use-cases": {
    "publishedAt": "2026-11-04",
    "updatedAt": "2026-11-04"
  },
  "blocks/app-showcase": {
    "publishedAt": "2026-11-04",
    "updatedAt": "2026-11-04"
  },
  "blocks/product-tour": {
    "publishedAt": "2026-11-04",
    "updatedAt": "2026-11-04"
  },
  "motion/illustration-search-command": {
    "publishedAt": "2026-11-04",
    "updatedAt": "2026-11-06"
  },
  "motion/illustration-live-presence": {
    "publishedAt": "2026-11-04",
    "updatedAt": "2026-11-06"
  },
  "motion/illustration-split-reveal": {
    "publishedAt": "2026-11-04",
    "updatedAt": "2026-11-06"
  },
  "motion/illustration-rolling-stack": {
    "publishedAt": "2026-11-04",
    "updatedAt": "2026-11-06"
  },
  "motion/cylinder-carousel": {
    "publishedAt": "2026-07-04",
    "updatedAt": "2026-11-06"
  },
  "motion/marquee": {
    "publishedAt": "2026-05-17",
    "updatedAt": "2026-11-06"
  },
  "motion/morphing-modal": {
    "publishedAt": "2026-05-17",
    "updatedAt": "2026-11-06"
  },
  "blocks/selector": {
    "publishedAt": "2026-09-28",
    "updatedAt": "2026-11-06"
  },
  "motion/card": {
    "publishedAt": "2026-10-10",
    "updatedAt": "2026-11-06"
  },
  "blocks/command-palette": {
    "publishedAt": "2026-05-17",
    "updatedAt": "2026-11-04"
  },
  "charts/bar-chart": {
    "publishedAt": "2026-10-27",
    "updatedAt": "2026-11-06"
  },
  "motion/table": {
    "publishedAt": "2026-07-01",
    "updatedAt": "2026-11-06"
  },
  "blocks/newsletter": {
    "publishedAt": "2026-11-04",
    "updatedAt": "2026-11-06"
  },
  "blocks/contact": {
    "publishedAt": "2026-11-04",
    "updatedAt": "2026-11-06"
  },
  "blocks/team": {
    "publishedAt": "2026-11-04",
    "updatedAt": "2026-11-06"
  },
  "blocks/faq-blocks": {
    "publishedAt": "2026-11-04",
    "updatedAt": "2026-11-06"
  },
  "blocks/cta-sections": {
    "publishedAt": "2026-11-04",
    "updatedAt": "2026-11-06"
  },
  "blocks/hero-sections": {
    "publishedAt": "2026-11-04",
    "updatedAt": "2026-11-06"
  },
  "blocks/content-sections": {
    "publishedAt": "2026-11-04",
    "updatedAt": "2026-11-06"
  },
  "blocks/what-we-offer": {
    "publishedAt": "2026-11-04",
    "updatedAt": "2026-11-06"
  },
  "agents/ai-artifacts": {
    "publishedAt": "2026-11-04",
    "updatedAt": "2026-11-06"
  },
  "agents/research-sources": {
    "publishedAt": "2026-11-04",
    "updatedAt": "2026-11-06"
  },
  "agents/agent-chat-input": {
    "publishedAt": "2026-11-04",
    "updatedAt": "2026-11-06"
  },
  "agents/voice-agent": {
    "publishedAt": "2026-11-04",
    "updatedAt": "2026-11-06"
  },
  "agents/voice-conversation": {
    "publishedAt": "2026-11-04",
    "updatedAt": "2026-11-06"
  },
  "blocks/auth": {
    "publishedAt": "2026-11-04",
    "updatedAt": "2026-11-06"
  },
  "blocks/onboarding": {
    "publishedAt": "2026-11-04",
    "updatedAt": "2026-11-06"
  },
  "blocks/checkout-pages": {
    "publishedAt": "2026-11-04",
    "updatedAt": "2026-11-06"
  },
  "blocks/settings-pages": {
    "publishedAt": "2026-11-04",
    "updatedAt": "2026-11-06"
  },
  "agents/agent-plan": {
    "publishedAt": "2026-11-04",
    "updatedAt": "2026-11-06"
  },
  "agents/background-agents": {
    "publishedAt": "2026-11-04",
    "updatedAt": "2026-11-04"
  },
  "agents/tool-approval": {
    "publishedAt": "2026-08-01",
    "updatedAt": "2026-11-04"
  },
  "agents/context-window": {
    "publishedAt": "2026-11-04",
    "updatedAt": "2026-11-04"
  },
  "agents/agent-team": {
    "publishedAt": "2026-11-04",
    "updatedAt": "2026-11-06"
  },
  "agents/agent-traces": {
    "publishedAt": "2026-11-04",
    "updatedAt": "2026-11-04"
  },
  "blocks/kanban-board": {
    "publishedAt": "2026-11-04",
    "updatedAt": "2026-11-06"
  },
  "blocks/collaboration": {
    "publishedAt": "2026-11-04",
    "updatedAt": "2026-11-04"
  },
  "blocks/messaging": {
    "publishedAt": "2026-11-04",
    "updatedAt": "2026-11-06"
  },
  "blocks/calendar": {
    "publishedAt": "2026-11-04",
    "updatedAt": "2026-11-06"
  },
  "motion/animated-sidebar": {
    "publishedAt": "2026-07-29",
    "updatedAt": "2026-11-06"
  },
  "blocks/file-manager": {
    "publishedAt": "2026-11-04",
    "updatedAt": "2026-11-06"
  },
  "blocks/conversion-funnel": {
    "publishedAt": "2026-11-04",
    "updatedAt": "2026-11-06"
  },
  "blocks/order-tracking": {
    "publishedAt": "2026-11-04",
    "updatedAt": "2026-11-06"
  },
  "blocks/data-tables": {
    "publishedAt": "2026-11-04",
    "updatedAt": "2026-11-06"
  },
  "blocks/crypto-markets": {
    "publishedAt": "2026-11-04",
    "updatedAt": "2026-11-06"
  },
  "blocks/tokenomics": {
    "publishedAt": "2026-11-04",
    "updatedAt": "2026-11-06"
  },
  "blocks/crypto-wallet": {
    "publishedAt": "2026-11-04",
    "updatedAt": "2026-11-06"
  },
  "blocks/ecommerce": {
    "publishedAt": "2026-11-04",
    "updatedAt": "2026-11-06"
  },
  "motion/illustration-isometric-scenes": {
    "publishedAt": "2026-11-04",
    "updatedAt": "2026-11-06"
  },
  "motion/illustration-document-cards": {
    "publishedAt": "2026-11-04",
    "updatedAt": "2026-11-06"
  },
  "motion/illustration-layered-cards": {
    "publishedAt": "2026-11-04",
    "updatedAt": "2026-11-06"
  },
  "motion/illustration-bar-wave": {
    "publishedAt": "2026-11-04",
    "updatedAt": "2026-11-06"
  },
  "motion/illustration-connected-hub": {
    "publishedAt": "2026-11-04",
    "updatedAt": "2026-11-06"
  },
  "motion/illustration-file-flow": {
    "publishedAt": "2026-11-04",
    "updatedAt": "2026-11-06"
  },
  "blocks/ai-landing": {
    "publishedAt": "2026-11-04",
    "updatedAt": "2026-11-06"
  },
  "blocks/crypto-landing": {
    "publishedAt": "2026-11-04",
    "updatedAt": "2026-11-06"
  },
  "blocks/mobile-crypto-landing": {
    "publishedAt": "2026-11-04",
    "updatedAt": "2026-11-06"
  },
  "blocks/devtool-landing": {
    "publishedAt": "2026-11-04",
    "updatedAt": "2026-11-06"
  },
  "blocks/analytics-landing": {
    "publishedAt": "2026-11-04",
    "updatedAt": "2026-11-06"
  },
  "blocks/ai-workspace-landing": {
    "publishedAt": "2026-11-04",
    "updatedAt": "2026-11-06"
  },
  "blocks/personal-website": {
    "publishedAt": "2026-11-04",
    "updatedAt": "2026-11-06"
  },
  "blocks/dashboards": {
    "publishedAt": "2026-11-04",
    "updatedAt": "2026-11-06"
  },
  "blocks/crypto-agent": {
    "publishedAt": "2026-11-04",
    "updatedAt": "2026-11-06"
  },
  "blocks/crypto-governance": {
    "publishedAt": "2026-11-04",
    "updatedAt": "2026-11-06"
  },
  "blocks/trading-pages": {
    "publishedAt": "2026-11-04",
    "updatedAt": "2026-11-06"
  },
  "blocks/about": {
    "publishedAt": "2026-11-04",
    "updatedAt": "2026-11-04"
  },
  "blocks/careers": {
    "publishedAt": "2026-11-04",
    "updatedAt": "2026-11-06"
  },
  "blocks/changelog-pages": {
    "publishedAt": "2026-11-04",
    "updatedAt": "2026-11-04"
  },
  "blocks/blog-pages": {
    "publishedAt": "2026-11-04",
    "updatedAt": "2026-11-04"
  },
  "blocks/not-found": {
    "publishedAt": "2026-06-21",
    "updatedAt": "2026-11-04"
  },
  "blocks/audit-trail": {
    "publishedAt": "2026-11-04",
    "updatedAt": "2026-11-06"
  },
  "blocks/log-explorer": {
    "publishedAt": "2026-11-04",
    "updatedAt": "2026-11-06"
  },
  "blocks/performance-report": {
    "publishedAt": "2026-11-04",
    "updatedAt": "2026-11-06"
  },
  "blocks/kpi-overview": {
    "publishedAt": "2026-11-04",
    "updatedAt": "2026-11-06"
  },
  "blocks/credit-usage": {
    "publishedAt": "2026-11-04",
    "updatedAt": "2026-11-06"
  },
  "blocks/usage-budget": {
    "publishedAt": "2026-11-04",
    "updatedAt": "2026-11-06"
  },
  "blocks/agent-builder": {
    "publishedAt": "2026-11-04",
    "updatedAt": "2026-11-06"
  },
  "blocks/knowledge-base": {
    "publishedAt": "2026-11-04",
    "updatedAt": "2026-11-06"
  },
  "blocks/roadmap": {
    "publishedAt": "2026-11-04",
    "updatedAt": "2026-11-06"
  },
  "blocks/blog-sections": {
    "publishedAt": "2026-11-04",
    "updatedAt": "2026-11-06"
  },
  "blocks/case-studies": {
    "publishedAt": "2026-11-04",
    "updatedAt": "2026-11-06"
  },
  "blocks/social-proof": {
    "publishedAt": "2026-11-04",
    "updatedAt": "2026-11-06"
  },
  "blocks/testimonials": {
    "publishedAt": "2026-11-04",
    "updatedAt": "2026-11-06"
  },
  "blocks/image-galleries": {
    "publishedAt": "2026-11-04",
    "updatedAt": "2026-11-06"
  },
  "blocks/how-it-works": {
    "publishedAt": "2026-11-04",
    "updatedAt": "2026-11-06"
  },
  "blocks/logo-cloud": {
    "publishedAt": "2026-11-04",
    "updatedAt": "2026-11-06"
  },
  "blocks/trust-security": {
    "publishedAt": "2026-11-04",
    "updatedAt": "2026-11-04"
  },
  "blocks/integrations": {
    "publishedAt": "2026-11-04",
    "updatedAt": "2026-11-06"
  },
  "blocks/announcement-banners": {
    "publishedAt": "2026-11-04",
    "updatedAt": "2026-11-06"
  },
  "blocks/navbar": {
    "publishedAt": "2026-11-04",
    "updatedAt": "2026-11-06"
  },
  "blocks/stats": {
    "publishedAt": "2026-11-04",
    "updatedAt": "2026-11-06"
  },
  "blocks/comparison": {
    "publishedAt": "2026-11-04",
    "updatedAt": "2026-11-06"
  }
};
