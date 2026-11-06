import { AgentsPage } from "@/features/agents";
import { Suspense } from "react";
export default function Page() { return <Suspense fallback={<p className="page">Opening agents…</p>}><AgentsPage/></Suspense>; }
