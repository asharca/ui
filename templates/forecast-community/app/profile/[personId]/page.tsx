import { notFound } from "next/navigation";
import { ProfilePage } from "@/features/forecast/account";
import { people } from "@/features/forecast/data";
export const dynamicParams = false;
export function generateStaticParams() { return ["me", ...people.map(person => person.id)].map(personId => ({ personId })); }
export async function generateMetadata({ params }: { params: Promise<{ personId: string }> }) { const { personId } = await params; return { title: personId === "me" ? "Your local profile" : people.find(person => person.id === personId)?.name ?? "Profile not found" }; }
export default async function Page({ params }: { params: Promise<{ personId: string }> }) { const { personId } = await params; if (personId !== "me" && !people.some(person => person.id === personId)) notFound(); return <ProfilePage key={personId} personId={personId}/>; }
