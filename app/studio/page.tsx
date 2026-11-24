import type { Metadata } from "next";
import { BackgroundStudio } from "@/components/app/studio/background-studio";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Background Studio",
  description:
    "Interactive WebGL shader background studio built on beUI ShaderBackground.",
  alternates: { canonical: "/studio" },
};

export default function StudioPage() {
  return <BackgroundStudio />;
}
