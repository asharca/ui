"use client";

import { SpotlightFooter, type FooterSectionsProps } from "@/components/motion/footer-sections";

const footer: FooterSectionsProps = {
  brand: "Northline", brandHref: "/", statement: "Independent tools for people who make thoughtful things.",
  groups: [
    {"title":"Product","links":[{"label":"Components","href":"/docs"},{"label":"UI blocks","href":"/components/blocks"},{"label":"Templates","href":"/templates"},{"label":"Workspace","href":"/workspace"},{"label":"Changelog","href":"/changelog"}]},
    {"title":"Developers","links":[{"label":"Guides","href":"/guides"},{"label":"Source code","href":"https://github.com/asharca/ui"},{"label":"Contributing","href":"https://github.com/asharca/ui/blob/main/CONTRIBUTING.md"},{"label":"Release notes","href":"https://github.com/asharca/ui/releases"}]},
    {"title":"Community","links":[{"label":"Discussions","href":"https://github.com/asharca/ui/discussions"},{"label":"Report an issue","href":"https://github.com/asharca/ui/issues"},{"label":"Contribute","href":"https://github.com/asharca/ui/blob/main/CONTRIBUTING.md"},{"label":"Releases","href":"https://github.com/asharca/ui/releases"}]},
  ],
  socialLinks: [],
  legalLinks: [],
  closingNote: "Openly built. Ready for your next idea.",
  copyright: "© 2026 Northline. Original demonstration content.",
};

/** Copyable composition; all navigation and brand content belong to the host. */
export function SpotlightFooterPreview() {
  return <SpotlightFooter {...footer}  />;
}
