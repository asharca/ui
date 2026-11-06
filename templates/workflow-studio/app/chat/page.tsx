import { ChatPage } from "@/features/agents";
import { Suspense } from "react";
export default function Page() { return <Suspense fallback={<div className="page"><p role="status">Opening your conversation…</p></div>}><ChatPage/></Suspense>; }
