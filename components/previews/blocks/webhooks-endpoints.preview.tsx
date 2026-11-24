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
    eventsLabel: "order.paid, order.shipped",
    active: true,
    successRate: 99.4,
    latencyMs: 142,
  },
  {
    id: "ep2",
    url: "https://billing.example.com/webhooks/stripe",
    eventsLabel: "invoice.finalized, payout.paid",
    active: true,
    successRate: 98.1,
    latencyMs: 196,
  },
  {
    id: "ep3",
    url: "https://analytics.example.com/ingest",
    eventsLabel: "customer.created",
    active: false,
    successRate: 97.4,
    latencyMs: 240,
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
            eventsLabel: "all events",
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
