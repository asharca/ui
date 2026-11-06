"use client";

import { WordmarkFooter, type FooterSectionsProps } from "@/components/motion/footer-sections";
import { ArrowUpRight } from "lucide-react";

const footer: FooterSectionsProps = {
  brand: "Northline", brandHref: "/", statement: "Independent tools.\nMore time to make.",
  groups: [
    {"title":"Project","links":[{"label":"Components","href":"/docs"},{"label":"Changelog","href":"/changelog"},{"label":"Source code","href":"https://github.com/asharca/ui"}]},
    {"title":"Connect","links":[{"label":"Discussions","href":"https://github.com/asharca/ui/discussions"},{"label":"Report an issue","href":"https://github.com/asharca/ui/issues"},{"label":"Contribute","href":"https://github.com/asharca/ui/blob/main/CONTRIBUTING.md"}]},
    {"title":"Legal","links":[{"label":"License","href":"https://github.com/asharca/ui/blob/main/LICENSE"},{"label":"Contributing","href":"https://github.com/asharca/ui/blob/main/CONTRIBUTING.md"}]},
  ],
  socialLinks: [{ label: "Explore the library", href: "/docs", icon: <ArrowUpRight className="size-4" /> }],
  legalLinks: [],
  closingNote: "Made with care, for thoughtful work.",
  copyright: "© 2026 Northline. Original demonstration content.",
};

/** Copyable composition; all navigation and brand content belong to the host. */
export function WordmarkFooterPreview() {
  return <WordmarkFooter {...footer}  />;
}
