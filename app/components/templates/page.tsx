import type { Metadata } from "next";
import TemplatesPage from "@/app/templates/page";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Templates",
  description:
    "Complete Next.js landing-page templates and independent application workspaces with editable source.",
  alternates: { canonical: "/components/templates" },
};

export default function ComponentTemplatesPage() {
  return <TemplatesPage />;
}
