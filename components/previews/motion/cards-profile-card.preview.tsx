"use client";
import { ProfessionalProfileCard } from "@/components/motion/purposeful-cards";
export function ProfileCardPreview() {
  return <div className="flex w-full justify-center px-4 py-10 sm:px-8 sm:py-16"><ProfessionalProfileCard name="Mira Sol" jobTitle="Design engineer" available avatar={<img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=320&q=85" alt="Profile portrait" className="size-full object-cover" loading="lazy" />} email="mira@example.com" contactHref="mailto:mira@example.com?subject=Project%20enquiry" note="@ Northstar Studio" /></div>;
}
