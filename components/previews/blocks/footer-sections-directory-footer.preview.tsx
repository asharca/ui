"use client";

import { DirectoryFooter, type FooterSectionsProps } from "@/components/motion/footer-sections";
import { GithubIcon } from "@/components/app/icons";
import { BookOpen } from "lucide-react";

const footer: FooterSectionsProps = {
  brand: "Northline", brandHref: "/", statement: "Independent components and patterns for the things you're building, ready to make your own.",
  groups: [
    {"title":"Explore","links":[{"label":"Components","href":"/docs"},{"label":"UI blocks","href":"/components/blocks"},{"label":"Templates","href":"/templates"},{"label":"Workspace","href":"/workspace"}]},
    {"title":"Resources","links":[{"label":"Guides","href":"/guides"},{"label":"Source code","href":"https://github.com/asharca/ui"},{"label":"Contributing","href":"https://github.com/asharca/ui/blob/main/CONTRIBUTING.md"},{"label":"Release notes","href":"https://github.com/asharca/ui/releases"}]},
  ],
  socialLinks: [{ label: "GitHub", href: "https://github.com/asharca/ui", icon: <GithubIcon className="size-4" /> }, { label: "Documentation", href: "/docs", icon: <BookOpen className="size-4" /> }],
  legalLinks: [{"label":"License","href":"https://github.com/asharca/ui/blob/main/LICENSE"},{"label":"Contributing","href":"https://github.com/asharca/ui/blob/main/CONTRIBUTING.md"}],
  copyright: "© 2026 Northline. Original demonstration content.",
};

/** Copyable composition; all navigation and brand content belong to the host. */
export function DirectoryFooterPreview() {
  return <DirectoryFooter {...footer}  />;
}
