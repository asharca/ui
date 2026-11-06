import { WorkflowEditorPage } from "@/features/editor";
import { Suspense } from "react";
export default function Page() { return <Suspense fallback={<p className="page">Opening workflow…</p>}><WorkflowEditorPage/></Suspense>; }
