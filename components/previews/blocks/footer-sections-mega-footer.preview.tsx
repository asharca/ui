"use client";

import { useState } from "react";
import { MegaFooter, type FooterSectionsProps } from "@/components/motion/footer-sections";
import { GithubIcon } from "@/components/app/icons";
import { MessageCircle, GitPullRequest, Tag } from "lucide-react";

const footer: FooterSectionsProps = {
  brand: "Northline", brandHref: "/", statement: "Independent tools for people who make thoughtful things.",
  groups: [
    {"title":"Product","links":[{"label":"Components","href":"/docs"},{"label":"UI blocks","href":"/components/blocks"},{"label":"Templates","href":"/templates"},{"label":"Workspace","href":"/workspace"},{"label":"Changelog","href":"/changelog"}]},
    {"title":"Developers","links":[{"label":"Guides","href":"/guides"},{"label":"Source code","href":"https://github.com/asharca/ui"},{"label":"Contributing","href":"https://github.com/asharca/ui/blob/main/CONTRIBUTING.md"},{"label":"Release notes","href":"https://github.com/asharca/ui/releases"}]},
    {"title":"Community","links":[{"label":"Discussions","href":"https://github.com/asharca/ui/discussions"},{"label":"Report an issue","href":"https://github.com/asharca/ui/issues"},{"label":"Contribute","href":"https://github.com/asharca/ui/blob/main/CONTRIBUTING.md"},{"label":"Releases","href":"https://github.com/asharca/ui/releases"}]},
  ],
  socialLinks: [{ label: "GitHub", href: "https://github.com/asharca/ui", icon: <GithubIcon className="size-4" /> }, { label: "Discussions", href: "https://github.com/asharca/ui/discussions", icon: <MessageCircle className="size-4" /> }, { label: "Contribute", href: "https://github.com/asharca/ui/blob/main/CONTRIBUTING.md", icon: <GitPullRequest className="size-4" /> }, { label: "Releases", href: "https://github.com/asharca/ui/releases", icon: <Tag className="size-4" /> }],
  legalLinks: [],
  copyright: "© 2026 Northline. Original demonstration content.",
};

/** Copyable composition; all navigation and brand content belong to the host. */
export function MegaFooterPreview() {
  const [subscribed, setSubscribed] = useState("");
  return <div className="w-full space-y-4"><MegaFooter {...footer} status={{ label: "View project activity", href: "https://github.com/asharca/ui/commits/main/" }} newsletterTitle="Notes from the workshop" newsletterDescription="Local form demonstration: no email is sent or stored remotely." subscriptionSuccessMessage="Your address was recorded in this local demo." onSubscribe={async (email) => {
    const { promise, resolve } = Promise.withResolvers<void>();
    setTimeout(resolve, 450);
    await promise;
    if (email.toLowerCase() === "fail@example.com") throw new Error("Demo subscription rejected. Edit the address and retry.");
    setSubscribed(email);
  }} /><p className="text-xs text-muted-foreground">Local demo only. Use fail@example.com to demonstrate rejection, then edit the address to retry.</p>{subscribed && <output className="block text-sm text-muted-foreground">Local demo address: {subscribed}</output>}</div>;
}
