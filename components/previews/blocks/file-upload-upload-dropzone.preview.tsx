"use client";

import { useEffect, useRef, useState } from "react";
import { UploadDropzone, type UploadContext, type UploadDropzoneItem } from "@/components/motion/upload-dropzone";
import { Button } from "@/components/motion/button";

type DemoRequest = { file: File; context: UploadContext; bytes: number; resolve: () => void; reject: (reason: Error) => void };

function createDemoQueue(): UploadDropzoneItem[] {
  const art = new File(['<svg xmlns="http://www.w3.org/2000/svg" width="320" height="240"><rect width="320" height="240" fill="#e8dfd0"/><rect x="24" y="32" width="110" height="120" fill="#a9c8c9"/><path d="M24 92h110M79 32v120" stroke="white" stroke-width="6"/><rect x="145" y="128" width="150" height="70" rx="12" fill="#b87957"/><rect x="158" y="115" width="56" height="46" rx="8" fill="#d3ae8c"/><rect x="95" y="183" width="94" height="12" rx="6" fill="#806a50"/></svg>'], "living-room-final.svg", { type: "image/svg+xml" });
  const stream = "BT /F1 16 Tf 40 140 Td (Northstar project brief - local demo fixture) Tj ET";
  const objects = ["<< /Type /Catalog /Pages 2 0 R >>", "<< /Type /Pages /Kids [3 0 R] /Count 1 >>", "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 320 240] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>", "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>", `<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`];
  let pdf = "%PDF-1.4\n";
  const offsets = [0];
  for (const [index, object] of objects.entries()) { offsets.push(pdf.length); pdf += `${index + 1} 0 obj\n${object}\nendobj\n`; }
  const xref = pdf.length;
  pdf += `xref\n0 ${offsets.length}\n0000000000 65535 f \n${offsets.slice(1).map(offset => `${offset.toString().padStart(10, "0")} 00000 n \n`).join("")}trailer\n<< /Size ${offsets.length} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF\n`;
  const brief = new File([pdf], "spring-campaign-brief.pdf", { type: "application/pdf" });
  const forecast = new File(["month,forecast,actual\nJuly,12000,11850\nAugust,13500,13200\nSeptember,14600,\n"], "q3-forecast.csv", { type: "text/csv" });
  return [{ id: "demo-completed-art", file: art, name: art.name, type: art.type, size: art.size, status: "success", progress: 100, uploadedBytes: art.size }, { id: "demo-paused-brief", file: brief, name: brief.name, type: brief.type, size: brief.size, status: "queued", paused: true, progress: 42, uploadedBytes: Math.floor(brief.size * .42) }, { id: "demo-failed-forecast", file: forecast, name: forecast.name, type: forecast.type, size: forecast.size, status: "error", error: "Connection dropped · demo fixture", progress: 63, uploadedBytes: Math.floor(forecast.size * .63) }];
}

/** Manual, explicitly labelled transport simulation. No timed or pretend network success. */
export function FileUploadUploadDropzonePreview() {
  const [items, setItems] = useState<UploadDropzoneItem[]>([]);
  const [requests, setRequests] = useState<string[]>([]);
  const [log, setLog] = useState("Initial rows are local demo fixtures with genuine file content and actual byte sizes. Uploaded means a completed demo fixture, not a remote upload. No files leave your browser.");
  const active = useRef(new Map<string, DemoRequest>());
  useEffect(() => { setItems(createDemoQueue()); }, []);
  useEffect(() => () => { for (const request of active.current.values()) request.reject(new Error("Demo closed")); active.current.clear(); }, []);
  const upload = (file: File, context: UploadContext) => {
    const { promise, resolve, reject } = Promise.withResolvers<void>();
    const key = crypto.randomUUID();
    const finish = () => { active.current.delete(key); setRequests([...active.current.keys()]); };
    const request: DemoRequest = { file, context, bytes: context.offset, resolve: () => { finish(); resolve(); }, reject: (reason) => { finish(); reject(reason); } };
    active.current.set(key, request); setRequests([...active.current.keys()]);
    context.signal.addEventListener("abort", () => request.reject(new Error("Request paused by user")), { once: true });
    setLog(`Demo request started for ${file.name} at byte ${context.offset}.`);
    return promise;
  };
  return <div className="w-full space-y-3">
    <UploadDropzone value={items} onValueChange={setItems} upload={upload} accept="image/*,.pdf,.doc,.docx,.csv,.zip" maxFiles={8} maxFileSize={25 * 1024 * 1024} onRemove={(item) => { setLog(`Removed ${item.name} from this local demo queue.`); }} onReject={(rejections) => { if (rejections.length) setLog(`${rejections.length} file(s) rejected by shared type, size, or queue validation.`); }} />
    <details className="mx-4 text-xs text-muted-foreground"><summary className="cursor-pointer">Manual demo transport — no files leave your browser</summary>
    <div className="rounded-xl border border-border bg-muted/40 p-3"><p className="text-sm font-medium">Manual demo transport — no files leave your browser</p><p className="mt-1 text-xs text-muted-foreground">Progress advances only when you send a chunk. The upload resolves after the final chunk; pause aborts it and resume uses the recorded offset.</p><div className="mt-3 flex flex-wrap gap-2"><Button size="sm" variant="outline" onClick={() => { const file = new File(['<svg xmlns="http://www.w3.org/2000/svg" width="160" height="100"><rect width="160" height="100" fill="#e0f2fe"/><circle cx="80" cy="50" r="30" fill="#0284c7"/></svg>'], "sample-art.svg", { type: "image/svg+xml" }); setItems((current) => [...current, { id: crypto.randomUUID(), file, name: file.name, type: file.type, size: file.size, status: "queued", progress: 0 }]); }}>Add sample image</Button><Button size="sm" disabled={!requests.length} onClick={() => { for (const request of [...active.current.values()]) { request.bytes = Math.min(request.file.size, request.bytes + Math.max(1, Math.ceil(request.file.size / 4))); request.context.onProgress({ uploadedBytes: request.bytes }); if (request.bytes === request.file.size) request.resolve(); } setLog("Sent one chunk to each active demo request."); }}>Send next chunk (demo)</Button><Button size="sm" variant="ghost" disabled={!requests.length} onClick={() => { for (const request of [...active.current.values()]) request.reject(new Error("Demo connection interrupted. Retry preserves confirmed bytes.")); setLog("Active demo requests failed. Use Retry on a file to continue."); }}>Fail active requests (demo)</Button></div></div>
    </details>
    <p role="status" className="sr-only">{log}</p>
  </div>;
}
