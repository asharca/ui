"use client";

import { useState } from "react";
import { PeopleDirectory, type PersonRow } from "@/components/motion/commerce-data-tables";
import { CommerceDialog, commerceInput } from "@/components/motion/commerce-ui";
import { Button } from "@/components/motion/button";

export function PeopleDirectoryPreview() {
  const [person, setPerson] = useState<PersonRow | null>(null); const [inviting, setInviting] = useState(false); const [email, setEmail] = useState("");
  const [people, setPeople] = useState<PersonRow[]>(() => Array.from({ length: 1200 }, (_, i) => ({ id: `person-${i}`, name: ["Amara Bennett", "Avery Lane", "Robin Chen", "Morgan Reed", "Sam Kim"][i % 5], email: `person${i + 1}@example.com`, team: ["Design", "Engineering", "Data", "Product", "Success"][i % 5], role: ["Product designer", "Software engineer", "Data scientist", "Product manager", "Customer success"][i % 5], presence: (["online", "away", "offline"] as const)[i % 3], location: ["Tokyo", "London", "New York", "Berlin", "Toronto"][i % 5], joined: `2022-${String(i % 12 + 1).padStart(2, "0")}-01T00:00:00Z` })));
  return <div className="w-full"><PeopleDirectory people={people} onContact={setPerson} onInvite={() => setInviting(true)} />{person && <p role="status" className="text-center text-xs text-muted-foreground">Contact {person.name}: <a className="underline" href={`mailto:${person.email}`}>{person.email}</a></p>}<CommerceDialog open={inviting} onOpenChange={setInviting} label="Invite sample person"><form onSubmit={event => { event.preventDefault(); setPeople(rows => [{ id: `local-${rows.length}`, name: email.split("@")[0], email, team: "Design", role: "Invited collaborator", presence: "offline", location: "Not provided", joined: new Date().toISOString() }, ...rows]); setInviting(false); setEmail(""); }}><h3 className="text-xl font-medium">Add preview collaborator</h3><p className="my-4 text-xs text-muted-foreground">Adds a local directory entry. No invitation email is sent.</p><label className="grid gap-2 text-sm">Email<input className={commerceInput} type="email" value={email} onChange={event => setEmail(event.target.value)} required /></label><Button type="submit" className="mt-5 w-full rounded-full">Add collaborator</Button></form></CommerceDialog></div>;
}
