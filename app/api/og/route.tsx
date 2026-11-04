import { ImageResponse } from "next/og";
import { getOgAssets } from "@/lib/og-assets";
import { getOgFonts } from "@/lib/og-fonts";
import { allComponents, findCategory } from "@/lib/registry";
import { OG_SIZE, ogImage } from "@/lib/og";
import { clampText } from "@/lib/seo";
import { findNativeComponent } from "@/lib/native";
import { findSeoPage } from "@/lib/seo-pages";

// The card art has room for roughly this much body text before it overflows.
const OG_DESCRIPTION_LIMIT = 120;

const PAGE_CARDS = {
  openui: {
    title: "OpenUI + beUI",
    description:
      "Register animated React components, generate OpenUI Lang, and render an interactive UI stream.",
    label: "Integration guide",
    command: "beui.dev/docs/openui",
  },
  "native-setup": {
    title: "beUI Native setup",
    description: "Install Reanimated, Gesture Handler and Uniwind, add the theme tokens, then copy in any component.",
    label: "React Native",
    command: "beui.dev/docs/native-setup",
  },
  "react-native": {
    title: "Animated React Native components",
    description: "Built for touch with Reanimated, Gesture Handler and Uniwind. Copy the source into any Expo or React Native app.",
    label: "React Native",
    command: "npx beui-native add ...",
  },
} as const;

export const runtime = "nodejs";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const { searchParams } = requestUrl;
  const componentSlug = searchParams.get("component");
  const categorySlug = searchParams.get("category");
  const pageSlug = searchParams.get("page");
  const nativeComponent = findNativeComponent(searchParams.get("native") ?? "");
  const guide = findSeoPage("guides", searchParams.get("guide") ?? "");
  const alternative = findSeoPage("alternatives", searchParams.get("alternative") ?? "");
  const landing = guide ?? alternative;
  const component = componentSlug
    ? allComponents().find((item) => item.slug === componentSlug)
    : undefined;
  const category =
    component?.category ?? (categorySlug ? findCategory(categorySlug) : undefined);
  const page =
    pageSlug && Object.hasOwn(PAGE_CARDS, pageSlug)
      ? PAGE_CARDS[pageSlug as keyof typeof PAGE_CARDS]
      : landing
        ? {
            title: landing.heading,
            description: landing.description,
            label: guide ? "Guide" : "Comparison",
            command: guide ? `beui.dev/guides/${landing.slug}` : `beui.dev/alternatives/${landing.slug}`,
          }
        : undefined;
  const title =
    nativeComponent?.title ??
    component?.name ??
    category?.name ??
    page?.title ??
    "Animated components for React, Next.js and React Native";
  const description = clampText(
    nativeComponent?.description ??
    component?.description ??
      category?.description ??
      page?.description ??
      "Free, open-source components for React and React Native.",
    OG_DESCRIPTION_LIMIT,
  );
  const label = nativeComponent ? "React Native" : component
    ? "Component"
    : category
      ? category.name
      : page?.label ?? "Motion components";
  const command = nativeComponent
    ? `npx beui-native add ${nativeComponent.slug}`
    : component
    ? `npx shadcn add @beui/${component.slug}`
    : page?.command ?? "npx shadcn add @beui/...";
  const origin = requestUrl.origin;
  const [fonts, assets] = await Promise.all([
    getOgFonts(origin),
    getOgAssets(origin),
  ]);

  return new ImageResponse(
    ogImage({ title, description, label, command, ...assets }),
    { ...OG_SIZE, fonts },
  );
}
