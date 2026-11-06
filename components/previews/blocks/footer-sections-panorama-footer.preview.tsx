"use client";

import { PanoramaFooter, type FooterSectionsProps } from "@/components/motion/footer-sections";
import { GithubIcon } from "@/components/app/icons";
import { MessageCircle } from "lucide-react";

const footer: FooterSectionsProps = {
  brand: "Northline", brandHref: "/", statement: "Independent tools for people who make thoughtful things.",
  // Unsplash landscape replacement; not the reference's proprietary coastal painting.
  artworkSrc: "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1600&q=85",
  groups: [
    {"title":"Explore","links":[{"label":"Components","href":"/docs"},{"label":"Guides","href":"/guides"},{"label":"Discussions","href":"https://github.com/asharca/ui/discussions"}]},
  ],
  socialLinks: [{ label: "GitHub", href: "https://github.com/asharca/ui", icon: <GithubIcon className="size-4" /> }, { label: "Discussions", href: "https://github.com/asharca/ui/discussions", icon: <MessageCircle className="size-4" /> }],
  legalLinks: [{"label":"License","href":"https://github.com/asharca/ui/blob/main/LICENSE"},{"label":"Contributing","href":"https://github.com/asharca/ui/blob/main/CONTRIBUTING.md"}],
  copyright: "© 2026 Northline. Original demonstration content.",
};

/** Copyable composition; all navigation and brand content belong to the host. */
export function PanoramaFooterPreview() {
  return <PanoramaFooter {...footer} closingMessage="Good work starts with" closingEmphasis="a clear horizon." actions={[{ label: "Explore the library", href: "/docs" }, { label: "Read the guides", href: "/guides" }]} />;
}
