import { describe, expect, test } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";
import { PhoneFrame } from "@/components/mobile/phone-frame";
import { mobilePreviews } from "@/components/mobile/previews";
import { getCatalogSection } from "@/lib/catalog-taxonomy";
import {
  getMobileVariantSource,
  getMobileVariantUsage,
} from "@/lib/mobile-screen-source";
import {
  findMobileScreenGroup,
  MOBILE_SCREEN_GROUP_COUNT,
  MOBILE_SCREEN_GROUPS,
  MOBILE_SCREEN_VARIANT_COUNT,
  mobileScreenPath,
  mobileScreenStaticParams,
} from "@/lib/mobile-screens";

const FORBIDDEN =
  /pro\.beui\.dev|beui-pro|BEUI_PRO_TOKEN|\b(?:FreeAndPro|ProCard)\b|(?:Get|Explore|beUI) Pro|SponsorCard|sponsorship/i;

describe("mobile screens 1:1 catalog", () => {
  test("defines all 36 mobile screen groups and 67 variants without forbidden copy or em dashes", () => {
    expect(MOBILE_SCREEN_GROUP_COUNT).toBe(36);
    expect(MOBILE_SCREEN_GROUPS.length).toBe(36);
    expect(MOBILE_SCREEN_VARIANT_COUNT).toBe(67);

    const groupSlugs = new Set<string>();
    const variantKeys = new Set<string>();

    for (const group of MOBILE_SCREEN_GROUPS) {
      expect(groupSlugs.has(group.slug)).toBe(false);
      groupSlugs.add(group.slug);

      expect(group.title).not.toContain("\u2014");
      expect(group.description).not.toContain("\u2014");
      expect(FORBIDDEN.test(group.title)).toBe(false);
      expect(FORBIDDEN.test(group.description)).toBe(false);
      expect(findMobileScreenGroup(group.slug)?.slug).toBe(group.slug);

      for (const variant of group.variants) {
        const key = `${group.slug}/${variant.slug}`;
        expect(variantKeys.has(key)).toBe(false);
        variantKeys.add(key);

        expect(variant.name).not.toContain("\u2014");
        expect(variant.description).not.toContain("\u2014");
        expect(FORBIDDEN.test(variant.name)).toBe(false);
        expect(FORBIDDEN.test(variant.description)).toBe(false);
      }
    }

    expect(variantKeys.size).toBe(67);
  });

  test("resolves and renders all 67 interactive previews inside PhoneFrame", () => {
    for (const group of MOBILE_SCREEN_GROUPS) {
      for (const variant of group.variants) {
        const Preview = mobilePreviews[variant.previewKey];
        expect(Preview).toBeDefined();
        if (!Preview) continue;

        const html = renderToStaticMarkup(
          <PhoneFrame theme="dark">
            <Preview />
          </PhoneFrame>,
        );
        expect(html.length).toBeGreaterThan(80);
        expect(html).not.toContain("NaN");
      }
    }
  });

  test("generates clean React Native source and usage for all 67 variants", () => {
    for (const group of MOBILE_SCREEN_GROUPS) {
      for (const variant of group.variants) {
        const source = getMobileVariantSource(group, variant);
        const usage = getMobileVariantUsage(group, variant);

        expect(source).toContain("react-native");
        expect(source).toContain("react-native-reanimated");
        expect(source).toContain("export function ");
        expect(usage).toContain("export default function ");
        expect(FORBIDDEN.test(source)).toBe(false);
        expect(FORBIDDEN.test(usage)).toBe(false);
      }
    }
  });

  test("wires all 36 groups into catalog taxonomy and static route params", () => {
    const mobileSection = getCatalogSection("mobile");
    expect(mobileSection.items.length).toBe(36);

    const staticParams = mobileScreenStaticParams();
    expect(staticParams.length).toBe(36);

    for (const group of MOBILE_SCREEN_GROUPS) {
      const item = mobileSection.items.find((entry) => entry.slug === group.slug);
      expect(item).toBeDefined();
      expect(item?.href).toBe(mobileScreenPath(group.slug));
      expect(item?.variantCount).toBe(group.variants.length);
      expect(staticParams.some((param) => param.slug === group.slug)).toBe(true);
    }
  });
});
