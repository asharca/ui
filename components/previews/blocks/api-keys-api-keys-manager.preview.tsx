"use client";

import { useRef, useState } from "react";
import { ApiKeys, type ManagedApiKey } from "@/components/motion/business-decisions/api-keys";
import { Checkbox } from "@/components/motion/checkbox";

// Demo samples reproduce the public totals and normalized graph; they are not production request data.
const initialKeys: ManagedApiKey[] = [
  { id: "ingest", name: "Ingest worker", prefix: "be_live_", suffix: "3f9a", environment: "live", scopes: ["notes:read", "notes:write", "projects:read"], status: "active", createdAt: "Jul 17, 2026", lastUsed: "4m ago", requests: [4584, 4607, 4570, 4636, 4663, 4651, 4689] },
  { id: "sync", name: "Mobile sync", prefix: "be_live_", suffix: "b27c", environment: "live", scopes: ["notes:read", "projects:read"], status: "active", createdAt: "Mar 22, 2026", lastUsed: "2h ago", expiresAt: "2026-11-10", expiresSoon: true, rotatedAt: "Sep 8, 2026", requests: [1686, 1644, 1708, 1658, 1629, 1608, 1567] },
  { id: "exports", name: "Nightly exports", prefix: "be_live_", suffix: "08e1", environment: "live", scopes: ["exports:read", "exports:write"], status: "active", createdAt: "Aug 24, 2026", lastUsed: "11h ago", requests: [84, 158, 71, 207, 139, 177, 220] },
  { id: "webhook", name: "Webhook relay", prefix: "be_live_", suffix: "d41e", environment: "live", scopes: ["webhooks:read", "webhooks:write"], status: "active", createdAt: "Jun 11, 2026", lastUsed: "3d ago", requests: [464, 452, 469, 432, 372, 322, 299] },
  { id: "legacy", name: "Legacy importer", prefix: "be_live_", suffix: "7a5d", environment: "live", scopes: ["notes:write"], status: "revoked", revokedAt: "Sep 21, 2026", createdAt: "Nov 3, 2025", lastUsed: "19d ago", requests: [0, 0, 0, 0, 0, 0, 0] },
];
const scopeGroups = ["Notes", "Projects", "Exports", "Webhooks"].map((label, index) => ({ label, description: ["Field notes, photos, and transcripts", "Sites, surveys, and collaborators", "CSV, GeoJSON, and PDF exports", "Endpoints and delivery logs"][index], scopes: ["read", "write"].map(permission => ({ value: `${label.toLowerCase()}:${permission}`, label: permission === "read" ? "Read" : "Write" })) }));
export function ApiKeysApiKeysManagerPreview() {
  const [fail, setFail] = useState(false);
  const nextId = useRef(1);
  const [keys, setKeys] = useState(initialKeys);
  return <div className="relative w-full"><ApiKeys keys={keys} scopeGroups={scopeGroups} onCreate={async input => {
    if (fail) throw new Error("Demo rejection");
    const id = `demo-${nextId.current++}`;
    const secret = `demo_not_real_${crypto.randomUUID().replaceAll("-", "")}`;
    setKeys(previous => [{ id, name: input.name, prefix: `be_${input.environment}_`, suffix: secret.slice(-4), environment: input.environment, scopes: input.scopes, status: "active", createdAt: "Just now", expiresAt: new Date(Date.now() + input.expiresInDays * 86400000).toISOString().slice(0, 10), requests: [0, 0], lastUsed: "Never" }, ...previous]);
    return { secret };
  }} onRename={async (id, name) => { if (fail) throw new Error("Demo rejection"); setKeys(previous => previous.map(key => key.id === id ? { ...key, name } : key)); }} onRotate={async id => { if (fail) throw new Error("Demo rejection"); const secret = `demo_not_real_${crypto.randomUUID().replaceAll("-", "")}`; setKeys(previous => previous.map(key => key.id === id ? { ...key, suffix: secret.slice(-4), rotatedAt: "just now" } : key)); return { secret }; }} onRevoke={async id => { if (fail) throw new Error("Demo rejection"); setKeys(previous => previous.map(key => key.id === id ? { ...key, status: "revoked", revokedAt: "Just now" } : key)); }} onCopy={async secret => { await navigator.clipboard.writeText(secret); }} /><details className="absolute left-8 top-full z-10 text-xs text-muted-foreground"><summary>Demo controls</summary><p className="my-2">Local demo credentials only. Copy uses your clipboard; no credential reaches a server.</p><Checkbox label="Simulate action failure" checked={fail} onCheckedChange={setFail} /></details></div>;
}
