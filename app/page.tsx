import { SiteFooter } from "@/components/app/chrome/site-footer";
import { BenefitsSection } from "@/components/app/landing/benefits-section";
import { FaqSection } from "@/components/app/landing/faq-section";
import { LandingHero } from "@/components/app/landing/landing-hero";
import { LaunchCta } from "@/components/app/landing/launch-cta";
import { LibraryShowcase } from "@/components/app/landing/library-showcase";
import { TemplatesShowcase } from "@/components/app/landing/templates-showcase";
import { TestimonialsSection } from "@/components/app/landing/testimonials-section";
import { MOBILE_SCREEN_VARIANT_COUNT } from "@/lib/mobile-screens";
import summary from "@/lib/native/summary.json";
import { INSTALLABLE_COUNT } from "@/lib/registry";

export default function Home() {
  const webCount = INSTALLABLE_COUNT;
  const nativeCount = summary.variants + MOBILE_SCREEN_VARIANT_COUNT;
  const totalCount = webCount + nativeCount;

  return (
    <div className="relative">
      <LandingHero totalCount={totalCount} />
      <LibraryShowcase webCount={webCount} nativeCount={nativeCount} />
      <TemplatesShowcase />
      <BenefitsSection />
      <TestimonialsSection />
      <FaqSection />
      <LaunchCta totalCount={totalCount} />
      <SiteFooter />
    </div>
  );
}
