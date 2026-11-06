"use client";

import { useRef, useState } from "react";
import { EditorialIntegrationGrid, type IntegrationTool } from "@/components/motion/integrations";

const initialTools: IntegrationTool[] = [
  {
    "id": "paperwell",
    "name": "Paperwell",
    "description": "Route reviewed briefs into a shared notebook.",
    "category": "Knowledge",
    "mark": "⌁",
    "status": "connected",
    "lastSync": "3 min ago",
    "syncVolume": [
      32,
      41,
      38,
      52,
      47,
      61,
      58,
      66
    ],
    "permissions": [
      "Read selected notebooks",
      "Create draft pages"
    ],
    "configuration": [
      {
        "key": "destination",
        "label": "Notebook destination",
        "value": "Team briefs",
        "required": true
      }
    ],
    "runs": [
      {
        "id": "run-1",
        "label": "Brief import",
        "timestamp": "Demo session",
        "status": "Sample completed run"
      }
    ]
  },
  {
    "id": "morrow",
    "name": "Morrow",
    "description": "Bring a scheduled report into the workspace.",
    "category": "Data",
    "mark": "◒",
    "status": "disconnected",
    "lastSync": "3 h ago",
    "syncVolume": [
      74,
      70,
      72,
      68,
      41,
      12,
      0,
      0
    ],
    "permissions": [
      "Read selected reports"
    ],
    "configuration": [
      {
        "key": "destination",
        "label": "Report collection",
        "value": "Team report"
      }
    ]
  },
  {
    "id": "fieldwork",
    "name": "Fieldwork",
    "description": "Keep project tasks aligned with the latest plan.",
    "category": "Projects",
    "mark": "✳",
    "status": "connected",
    "lastSync": "12 min ago",
    "syncVolume": [
      18,
      22,
      19,
      27,
      24,
      30,
      29,
      34
    ],
    "permissions": [
      "Read assigned projects",
      "Update linked tasks"
    ],
    "configuration": [
      {
        "key": "destination",
        "label": "Project",
        "value": "Launch plan"
      }
    ]
  },
  {
    "id": "arcstead",
    "name": "Arcstead",
    "description": "Deploy and observe the services behind your workflow.",
    "category": "Developer",
    "mark": "⌘",
    "status": "disconnected",
    "lastSync": "2 h ago",
    "syncVolume": [
      44,
      46,
      40,
      38,
      31,
      33,
      29,
      27
    ],
    "permissions": [
      "Read deployment activity"
    ],
    "configuration": [
      {
        "key": "destination",
        "label": "Deployment",
        "value": "Workspace"
      }
    ]
  },
  {
    "id": "northline",
    "name": "Northline",
    "description": "Share team milestones in a focused conversation.",
    "category": "Communication",
    "mark": "◈",
    "status": "connected",
    "lastSync": "1 min ago",
    "syncVolume": [
      12,
      16,
      14,
      21,
      26,
      22,
      31,
      36
    ],
    "permissions": [
      "Post to a selected channel"
    ],
    "configuration": [
      {
        "key": "destination",
        "label": "Channel",
        "value": "Updates",
        "required": true
      }
    ]
  },
  {
    "id": "daybreak",
    "name": "Daybreak",
    "description": "Keep billing events attached to the customer journey.",
    "category": "Payments",
    "mark": "◬",
    "status": "disconnected",
    "lastSync": "52 min ago",
    "syncVolume": [
      58,
      61,
      64,
      60,
      63,
      22,
      4,
      0
    ],
    "permissions": [
      "Read selected billing events"
    ],
    "configuration": [
      {
        "key": "destination",
        "label": "Event destination",
        "value": "Customer activity"
      }
    ]
  },
  {
    "id": "stillform",
    "name": "Stillform",
    "description": "Connect design decisions, comments, and component metadata.",
    "category": "Design",
    "mark": "▱",
    "status": "disconnected",
    "lastSync": "2 d ago",
    "syncVolume": [
      26,
      24,
      25,
      19,
      14,
      9,
      6,
      5
    ],
    "permissions": [
      "Read selected design files"
    ],
    "configuration": [
      {
        "key": "destination",
        "label": "Design file",
        "value": "Design system"
      }
    ]
  }
];

export function EditorialIntegrationGridPreview() {
  const [tools, setTools] = useState(initialTools);
  const [events, setEvents] = useState<{ id: number; message: string }[]>([]);
  const eventId = useRef(0);
  const [rejectNext, setRejectNext] = useState(false);
  const record = (message: string) => { const event = { id: eventId.current++, message }; setEvents(current => [event, ...current].slice(0, 4)); };
  const allow = () => { if (rejectNext) { setRejectNext(false); throw new Error("The explicit demo failure was requested. No connection state changed."); } };
  return <div className="w-full min-w-0"><EditorialIntegrationGrid tools={tools} title="Connect the tools behind your work." description="Browse integrations, find the right fit, and manage every connection in one place."
    onConnect={async id => { allow(); setTools(current => current.map(tool => tool.id === id ? { ...tool, status: "connected", error: undefined } : tool)); record(`Demo connected: ${id}`); }}
    onDisconnect={async id => { allow(); setTools(current => current.map(tool => tool.id === id ? { ...tool, status: "disconnected", error: undefined } : tool)); record(`Demo disconnected: ${id}`); }}
    onSync={async id => { allow(); setTools(current => current.map(tool => tool.id === id ? { ...tool, lastSync: "Synced in this demo session", runs: [{ id: `demo-${eventId.current}`, label: "Local demo sync", timestamp: "This session", status: "Recorded by preview" }, ...(tool.runs ?? [])] } : tool)); record(`Demo sync recorded: ${id}`); }}
    onConfigure={async (id, values) => { allow(); setTools(current => current.map(tool => tool.id === id ? { ...tool, configuration: tool.configuration?.map(field => ({ ...field, value: values[field.key] ?? field.value })) } : tool)); record(`Demo configuration saved: ${id}`); }}
  /><details className="mx-6 mb-6 text-xs text-muted-foreground"><summary className="cursor-pointer">Local demo controls and activity</summary><p className="mt-4 leading-6">Original fictional tools. No external service is authorized; connections, configuration, and sync actions update only this preview’s in-memory state.</p><label className="mt-4 flex items-center gap-2"><input type="checkbox" checked={rejectNext} onChange={event => setRejectNext(event.target.checked)} />Fail the next demo action</label><h3 className="mt-5 font-medium text-foreground">Local demo activity</h3><ul className="mt-2 space-y-1">{events.length ? events.map(event => <li key={event.id}>{event.message}</li>) : <li>No local actions yet. Explore a connection to begin.</li>}</ul></details></div>;
}
