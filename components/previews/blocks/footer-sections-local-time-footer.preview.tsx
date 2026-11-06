"use client";

import { LocalTimeFooter, type FooterSectionsProps } from "@/components/motion/footer-sections";

const footer: FooterSectionsProps = {
  brand: "Northline", brandHref: "/", statement: "Independent tools for people who make thoughtful things.",
  groups: [
    { title: "Explore", links: [{ label: "Components", href: "/docs" }, { label: "Guides", href: "/guides" }, { label: "Changelog", href: "/changelog" }] },
    { title: "Connect", links: [{ label: "GitHub", href: "https://github.com/asharca/ui" }, { label: "Discussions", href: "https://github.com/asharca/ui/discussions" }, { label: "Report an issue", href: "https://github.com/asharca/ui/issues" }] },
  ],
  socialLinks: [],
  legalLinks: [{"label":"License","href":"https://github.com/asharca/ui/blob/main/LICENSE"},{"label":"Contributing","href":"https://github.com/asharca/ui/blob/main/CONTRIBUTING.md"}],
  copyright: "© 2026 Northline. Original demonstration content.",
};

/** Copyable composition; all navigation and brand content belong to the host. */
export function LocalTimeFooterPreview() {
  return <LocalTimeFooter {...footer} city="London" timeZone="Europe/London" locale="en-GB" />;
}
