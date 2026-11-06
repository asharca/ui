"use client";

import { StudioFooter, type FooterSectionsProps } from "@/components/motion/footer-sections";
import { GithubIcon } from "@/components/app/icons";
import { Compass, MessageCircle, Mail } from "lucide-react";

const footer: FooterSectionsProps = {
  brand: "Northline", brandHref: "/", statement: "Good work starts with a conversation.",
  // Unsplash landscape replacement; consumers may supply their own licensed artwork.
  artworkSrc: "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1600&q=85",
  groups: [
    {"title":"Project","links":[{"label":"Components","href":"/docs"},{"label":"UI blocks","href":"/components/blocks"},{"label":"Templates","href":"/templates"}]},
  ],
  socialLinks: [{ label: "GitHub", href: "https://github.com/asharca/ui", icon: <GithubIcon className="size-4" /> }, { label: "Discussions", href: "https://github.com/asharca/ui/discussions", icon: <MessageCircle className="size-4" /> }, { label: "Report an issue", href: "https://github.com/asharca/ui/issues", icon: <Mail className="size-4" /> }],
  legalLinks: [{"label":"License","href":"https://github.com/asharca/ui/blob/main/LICENSE"},{"label":"Contributing","href":"https://github.com/asharca/ui/blob/main/CONTRIBUTING.md"}],
  copyright: "© 2026 Northline",
};

/** Copyable composition; all navigation and brand content belong to the host. */
export function StudioFooterPreview() {
  return <StudioFooter {...footer} brandIcon={<Compass className="size-7" />} email="hello@example.com" availability="Open for new collaborations" navigation={[{label:"Components",href:"/docs"},{label:"Guides",href:"/guides"},{label:"Source code",href:"https://github.com/asharca/ui"}]} location="Built in the open. Used everywhere." locationDescription="An independent component library." />;
}
