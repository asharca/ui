"use client";

import { LegalPage, type LegalPolicy } from "@/components/motion/legal-page";

const POLICIES: LegalPolicy[] = [
  {
    id: "privacy",
    label: "Privacy",
    title: "Privacy policy",
    summary:
      "This policy explains what Fieldnote collects when you use our apps and website, why we collect it, and the choices you have.",
    version: "4",
    previousVersion: "3",
    updatedAt: "Nov 3, 2026",
    effectiveAt: "Dec 1, 2026",
    sections: [
      {
        id: "collect",
        number: "01",
        title: "What we collect",
        inShort:
          "Only your account email, workspace content you upload, and essential security diagnostics.",
        paragraphs: [
          [
            { text: "When you sign up, we collect the email address you provide and basic profile details. " },
            {
              text: "We no longer collect coarse IP geolocation for marketing segments.",
              change: "added",
            },
            {
              text: "We previously stored city-level IP coordinates for 90 days.",
              change: "removed",
            },
          ],
        ],
      },
      {
        id: "use",
        number: "02",
        title: "How we use it",
        inShort: "Strictly to deliver your workspace, prevent abuse, and ship requested support.",
        paragraphs: [
          [
            { text: "Your workspace notes and files remain private to your team. " },
            {
              text: "Automated classifiers never train on workspace files unless you opt in per workspace.",
              change: "added",
            },
          ],
        ],
      },
      {
        id: "share",
        number: "03",
        title: "Who we share it with",
        inShort: "Vetted infrastructure sub-processors under data processing agreements.",
        paragraphs: [
          [
            {
              text: "We share encrypted payloads only with compute and billing subprocessors required to run the service.",
            },
          ],
        ],
      },
      {
        id: "retain",
        number: "04",
        title: "How long we keep it",
        inShort: "Deleted accounts clear from primary storage immediately and backups within 30 days.",
        paragraphs: [
          [
            { text: "Account deletion triggers removal from active databases within seconds " },
            { text: "and encrypted rolling backups purge automatically within 30 days.", change: "added" },
            { text: "and backups expire within 60 days.", change: "removed" },
          ],
        ],
      },
      {
        id: "rights",
        number: "05",
        title: "Your choices and rights",
        inShort: "Export everything in JSON/Markdown or delete your data from workspace settings anytime.",
        paragraphs: [
          [
            {
              text: "You can download a complete archive of workspace records or permanently remove your account with one confirmation.",
            },
          ],
        ],
      },
      {
        id: "contact",
        number: "06",
        title: "Contact",
        inShort: "Email privacy@fieldnote.example with any compliance or data export question.",
        paragraphs: [
          [
            {
              text: "Our privacy team responds to all verified requests within 72 hours at privacy@fieldnote.example.",
            },
          ],
        ],
      },
    ],
  },
  {
    id: "terms",
    label: "Terms",
    title: "Terms of service",
    summary:
      "Plain rules for using Fieldnote software, workspace seats, and API endpoints reliably.",
    version: "4",
    previousVersion: "3",
    updatedAt: "Nov 3, 2026",
    effectiveAt: "Dec 1, 2026",
    sections: [
      {
        id: "ownership",
        number: "01",
        title: "Your content stays yours",
        inShort: "You retain 100% ownership and export rights over all notes, media, and code.",
        paragraphs: [
          [
            {
              text: "Fieldnote claims no intellectual property rights over content you upload or generate in your workspaces. ",
            },
            {
              text: "Export tools stay available without seat penalties during cancellation windows.",
              change: "added",
            },
          ],
        ],
      },
      {
        id: "uptime",
        number: "02",
        title: "Availability and notices",
        inShort: "We give 30 days written notice before deprecating any public API endpoint.",
        paragraphs: [
          [
            { text: "Maintenance windows are published on the status portal in advance. " },
            { text: "Breaking API changes carry a minimum 60-day migration period.", change: "added" },
          ],
        ],
      },
    ],
  },
  {
    id: "cookies",
    label: "Cookies",
    title: "Cookie notice",
    summary:
      "Details on session tokens and strictly optional preference cookies stored in your browser.",
    version: "2",
    previousVersion: "1",
    updatedAt: "Oct 12, 2026",
    effectiveAt: "Nov 1, 2026",
    sections: [
      {
        id: "essential",
        number: "01",
        title: "Essential storage",
        inShort: "CSRF protection, sign-in session state, and chosen theme preference.",
        paragraphs: [
          [
            {
              text: "First-party HTTP-only session cookies keep your authentication active without tracking across unrelated sites. ",
            },
            { text: "Zero third-party ad pixels are loaded anywhere on Fieldnote.", change: "added" },
          ],
        ],
      },
    ],
  },
];

export function LegalPagesPolicyPreview() {
  return <LegalPage policies={POLICIES} />;
}
