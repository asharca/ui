"use client";

import { useState } from "react";
import {
  WebhookEndpoints,
  type WebhookEndpointItem,
} from "@/components/motion/webhook-endpoints";

const INITIAL_ENDPOINTS: WebhookEndpointItem[] = [
  {
    id: "ep1",
    url: "https://api.example.com/hooks/orders",
    eventsLabel: "4 events · last delivery 1m ago",
    active: true,
    successRate: 99.1,
    latencyMs: 142,
  },
  {
    id: "ep2",
    url: "https://billing.example.com/webhooks/invoices",
    eventsLabel: "3 events · last delivery 4m ago",
    active: true,
    successRate: 97.4,
    latencyMs: 388,
  },
  {
    id: "ep3",
    url: "https://crm.example.io/inbound/members/sync",
    eventsLabel: "3 events · last delivery 12m ago",
    active: true,
    successRate: 67.2,
    latencyMs: 1240,
  },
  {
    id: "ep4",
    url: "https://staging.example.com/hooks",
    eventsLabel: "2 events · last delivery 3h ago",
    active: false,
    successRate: 98.0,
    latencyMs: 96,
  },
];

export function WebhooksEndpointsPreview() {
  const [endpoints, setEndpoints] = useState(INITIAL_ENDPOINTS);
  const [deliveriesToday, setDeliveriesToday] = useState(1862);

  return (
    <WebhookEndpoints
      endpoints={endpoints}
      deliveriesToday={deliveriesToday}
      onAddEndpoint={(url) =>
        setEndpoints((prev) => [
          {
            id: `ep-${Date.now()}`,
            url,
            eventsLabel: "all events · just added",
            active: true,
            successRate: 100,
            latencyMs: 120,
          },
          ...prev,
        ])
      }
      onToggleEndpoint={(id, active) =>
        setEndpoints((prev) =>
          prev.map((ep) => (ep.id === id ? { ...ep, active } : ep)),
        )
      }
      onSendTest={(id) => {
        setDeliveriesToday((prev) => prev + 1);
        setEndpoints((prev) =>
          prev.map((ep) =>
            ep.id === id
              ? {
                  ...ep,
                  successRate: Math.min(100, Number((ep.successRate + 0.1).toFixed(1))),
                  lastTestStatus: "200 · 118ms",
                }
              : ep,
          ),
        );
      }}
    />
  );
}
