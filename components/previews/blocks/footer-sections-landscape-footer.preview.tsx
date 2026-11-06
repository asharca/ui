"use client";

import { LandscapeFooter, type FooterSectionsProps } from "@/components/motion/footer-sections";
import { Mail } from "lucide-react";

const footer: FooterSectionsProps = {
  brand: "Northline", brandHref: "/", statement: "Independent tools for people who make thoughtful things.",
  // Unsplash landscape replacement; consumers may supply their own licensed artwork.
  artworkSrc: "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1600&q=85",
  groups: [
    {"title":"Components","links":[{"label":"Components","href":"/docs"},{"label":"AI components","href":"/components/ai"},{"label":"Motion components","href":"/components/all"},{"label":"Charts","href":"/components/charts"}]},
    {"title":"Blocks","links":[{"label":"Components","href":"/docs"},{"label":"UI blocks","href":"/components/blocks"},{"label":"Templates","href":"/templates"},{"label":"Workspace","href":"/workspace"},{"label":"Changelog","href":"/changelog"}]},
    {"title":"Resources","links":[{"label":"Guides","href":"/guides"},{"label":"Source code","href":"https://github.com/asharca/ui"},{"label":"Contributing","href":"https://github.com/asharca/ui/blob/main/CONTRIBUTING.md"}]},
    {"title":"Community","links":[{"label":"Discussions","href":"https://github.com/asharca/ui/discussions"},{"label":"Report an issue","href":"https://github.com/asharca/ui/issues"},{"label":"Contribute","href":"https://github.com/asharca/ui/blob/main/CONTRIBUTING.md"}]},
    {"title":"Project","links":[{"label":"Workspace","href":"/workspace"},{"label":"Release notes","href":"https://github.com/asharca/ui/releases"},{"label":"Guides","href":"/guides"},{"label":"Changelog","href":"/changelog"},{"label":"License","href":"https://github.com/asharca/ui/blob/main/LICENSE"},{"label":"Source code","href":"https://github.com/asharca/ui"}]},
  ],
  socialLinks: [{ label: "Report an issue", href: "https://github.com/asharca/ui/issues", icon: <Mail className="size-4" /> }],
  legalLinks: [],
  credit: "Created by Asharca",
  copyright: "",
};

/** Copyable composition; all navigation and brand content belong to the host. */
export function LandscapeFooterPreview() {
  return <LandscapeFooter {...footer}  />;
}
