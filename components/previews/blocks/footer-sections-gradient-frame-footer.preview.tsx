"use client";

import { GradientFrameFooter, type FooterSectionsProps } from "@/components/motion/footer-sections";
import { GithubIcon } from "@/components/app/icons";

const footer: FooterSectionsProps = {
  brand: "Northline", brandHref: "/", statement: "Independent tools for people who make thoughtful things.",
  groups: [
    {"title":"Product","links":[{"label":"Components","href":"/docs"},{"label":"UI blocks","href":"/components/blocks"},{"label":"Templates","href":"/templates"},{"label":"Workspace","href":"/workspace"}]},
    {"title":"Project","links":[{"label":"Guides","href":"/guides"},{"label":"Source code","href":"https://github.com/asharca/ui"},{"label":"Contributing","href":"https://github.com/asharca/ui/blob/main/CONTRIBUTING.md"},{"label":"Release notes","href":"https://github.com/asharca/ui/releases"},{"label":"Changelog","href":"/changelog"}]},
    {"title":"Support","links":[{"label":"Discussions","href":"https://github.com/asharca/ui/discussions"},{"label":"Report an issue","href":"https://github.com/asharca/ui/issues"},{"label":"Contribute","href":"https://github.com/asharca/ui/blob/main/CONTRIBUTING.md"},{"label":"Releases","href":"https://github.com/asharca/ui/releases"}]},
  ],
  socialLinks: [{ label: "GitHub", href: "https://github.com/asharca/ui", icon: <GithubIcon className="size-4" /> }],
  legalLinks: [{"label":"License","href":"https://github.com/asharca/ui/blob/main/LICENSE"},{"label":"Contributing","href":"https://github.com/asharca/ui/blob/main/CONTRIBUTING.md"},{"label":"Readme","href":"https://github.com/asharca/ui/blob/main/README.md"}],
  closingNote: "Built for thoughtful, focused work.",
  copyright: "© 2026 Northline. Original demonstration content.",
};

/** Copyable composition; all navigation and brand content belong to the host. */
export function GradientFrameFooterPreview() {
  return <GradientFrameFooter {...footer}  />;
}
