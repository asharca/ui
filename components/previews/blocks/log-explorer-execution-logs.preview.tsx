"use client";

import { useState } from "react";
import { RotateCcw } from "lucide-react";
import { LogExplorer, type ExecutionLog } from "@/components/motion/log-explorer";

const initialEntries: ExecutionLog[] = [
  { id: "source", timestamp: "09:18:10", level: "info", message: "Source connected", context: "source=events", payload: { source: "events", transport: "https", connected: true } },
  { id: "batch", timestamp: "09:18:11", level: "info", message: "Batch received", context: "batch=bt_420 size=32", payload: { batchId: "bt_420", records: 32, queue: "ingestion" } },
  { id: "schema", timestamp: "09:18:11", level: "info", message: "Schema validated", context: "version=3 duration=42ms", payload: { schema: "workspace.event", version: 3, valid: true, durationMs: 42 } },
  { id: "delay", timestamp: "09:18:12", level: "warn", message: "Delivery delayed", context: "destination=warehouse retry=1", payload: { destination: "warehouse", attempt: 1, retryAfterMs: 2000 } },
  { id: "recovered", timestamp: "09:18:14", level: "info", message: "Delivery recovered", context: "attempt=2 duration=184ms", payload: { attempt: 2, delivered: true, durationMs: 184 } },
  { id: "indexed", timestamp: "09:18:15", level: "info", message: "Batch indexed", context: "records=32 partition=2026-10", payload: { records: 32, partition: "2026-10" } },
  { id: "record", timestamp: "09:18:16", level: "error", message: "Record rejected", context: "record=ev_912 missing=workspaceId", payload: { recordId: "ev_912", status: 422, error: { code: "MISSING_FIELD", field: "workspaceId" } } },
  { id: "checkpoint", timestamp: "09:18:17", level: "info", message: "Checkpoint saved", context: "offset=14820", payload: { offset: 14820, persisted: true } },
  { id: "buffer", timestamp: "09:18:18", level: "warn", message: "Buffer nearing capacity", context: "used=76% limit=500", payload: { used: 380, limit: 500, utilization: 0.76 } },
  { id: "drained", timestamp: "09:18:19", level: "info", message: "Buffer drained", context: "remaining=24", payload: { processed: 356, remaining: 24 } },
  { id: "destination", timestamp: "09:18:20", level: "error", message: "Destination unavailable", context: "sink=archive status=503", payload: { destination: "archive", status: 503, retryable: true } },
  { id: "health", timestamp: "09:18:21", level: "info", message: "Health check passed", context: "worker=ingest-02 latency=28ms", payload: { worker: "ingest-02", healthy: true, latencyMs: 28 } },
];

export function LogExplorerExecutionLogsPreview() {
  const [entries, setEntries] = useState(initialEntries);
  const [paused, setPaused] = useState(false);
  return <div className="w-full p-3 sm:p-6"><LogExplorer entries={entries} service="event-pipeline" environment="staging" paused={paused} onPausedChange={setPaused} headerActions={<button type="button" aria-label="Reset demo" className="grid size-9 cursor-pointer place-items-center rounded-full text-muted-foreground hover:bg-background focus-visible:outline-2 focus-visible:outline-ring" onClick={() => { setEntries(initialEntries); setPaused(false); }}><RotateCcw className="size-3.5"/></button>}/><details className="mx-auto mt-3 max-w-5xl text-xs text-muted-foreground"><summary className="cursor-pointer">Local stream simulation</summary><p className="my-2">No service is connected. Append entries to inspect paused snapshots and following behavior.</p><button type="button" className="rounded-full border border-border px-3 py-2" onClick={() => setEntries(current => [...current, { id: `append-${current.length}`, timestamp: `09:19:${String(current.length % 60).padStart(2,"0")}`, level: "info", message: "Checkpoint saved", payload: { offset: current.length, source: "local demo" } }])}>Append log entry</button></details></div>;
}
