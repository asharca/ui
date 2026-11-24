"use client";

import { useState } from "react";
import {
  WebhookDeliveries,
  type WebhookDeliveryItem,
} from "@/components/motion/webhook-deliveries";

const INITIAL_DELIVERIES: WebhookDeliveryItem[] = [
  {
    id: "dlv_4bcc3",
    event: "order.shipped",
    status: 500,
    latency: "1.5 s",
    age: "12s ago",
    attempts: [
      { id: "a1", label: "Attempt 1", status: 503, duration: "1.5 s", timestamp: "09:26:43" },
      { id: "a2", label: "Retry 1", status: 503, duration: "1.5 s", timestamp: "09:27:04" },
      { id: "a3", label: "Retry 2", status: 500, duration: "1.5 s", timestamp: "09:27:42" },
    ],
    payload: '{\n  "id": "ord_9184",\n  "carrier": "DHL Express",\n  "tracking": "1Z999AA101"\n}',
  },
  {
    id: "dlv_4bcc2",
    event: "order.paid",
    status: 200,
    latency: "170 ms",
    age: "now",
    attempts: [
      { id: "a1", label: "Attempt 1", status: 200, duration: "170 ms", timestamp: "09:26:12" },
    ],
    payload: '{\n  "id": "ord_9183",\n  "amount": 12400,\n  "currency": "usd"\n}',
  },
  {
    id: "dlv_4bcc1",
    event: "order.created",
    status: 200,
    latency: "194 ms",
    age: "1m ago",
    attempts: [
      { id: "a1", label: "Attempt 1", status: 200, duration: "194 ms", timestamp: "09:25:10" },
    ],
    payload: '{\n  "id": "ord_9182",\n  "items": 3,\n  "status": "pending"\n}',
  },
  {
    id: "dlv_4bcc0",
    event: "invoice.finalized",
    status: 502,
    latency: "2.1 s",
    age: "4m ago",
    attempts: [
      { id: "a1", label: "Attempt 1", status: 502, duration: "2.1 s", timestamp: "09:22:08" },
      { id: "a2", label: "Retry 1", status: 502, duration: "2.0 s", timestamp: "09:22:39" },
    ],
    payload: '{\n  "id": "inv_0142",\n  "total": 486000,\n  "status": "open"\n}',
  },
  {
    id: "dlv_4bcb9",
    event: "customer.updated",
    status: 200,
    latency: "132 ms",
    age: "9m ago",
    attempts: [
      { id: "a1", label: "Attempt 1", status: 200, duration: "132 ms", timestamp: "09:17:44" },
    ],
    payload: '{\n  "id": "cus_2019",\n  "plan": "team_annual"\n}',
  },
  {
    id: "dlv_4bcb8",
    event: "payout.paid",
    status: 201,
    latency: "212 ms",
    age: "14m ago",
    attempts: [
      { id: "a1", label: "Attempt 1", status: 201, duration: "212 ms", timestamp: "09:12:03" },
    ],
    payload: '{\n  "id": "po_7721",\n  "amount": 92000\n}',
  },
  {
    id: "dlv_4bcb7",
    event: "charge.succeeded",
    status: 200,
    latency: "148 ms",
    age: "21m ago",
    attempts: [
      { id: "a1", label: "Attempt 1", status: 200, duration: "148 ms", timestamp: "09:05:19" },
    ],
    payload: '{\n  "id": "ch_3049",\n  "captured": true\n}',
  },
  {
    id: "dlv_4bcb6",
    event: "member.invited",
    status: 200,
    latency: "118 ms",
    age: "33m ago",
    attempts: [
      { id: "a1", label: "Attempt 1", status: 200, duration: "118 ms", timestamp: "08:53:40" },
    ],
    payload: '{\n  "id": "mem_8831",\n  "role": "editor"\n}',
  },
];

const INITIAL_BARS = Array.from(
  { length: 40 },
  (_, i) => i !== 2 && i !== 18 && i !== 33 && i !== 37,
);

export function WebhooksDeliveryLogPreview() {
  const [deliveries, setDeliveries] = useState(INITIAL_DELIVERIES);
  const [bars, setBars] = useState(INITIAL_BARS);
  const [total, setTotal] = useState(12488);
  const [failed, setFailed] = useState(195);

  const retryDelivery = (id: string) => {
    setDeliveries((prev) =>
      prev.map((d) =>
        d.id === id
          ? {
              ...d,
              status: 200,
              latency: "148 ms",
              age: "just now",
              attempts: [
                ...d.attempts,
                {
                  id: `retry-${Date.now()}`,
                  label: `Retry ${d.attempts.length}`,
                  status: 200,
                  duration: "148 ms",
                  timestamp: "09:28:04",
                },
              ],
            }
          : d,
      ),
    );
    setBars((prev) => [...prev.slice(1), true]);
    setTotal((prev) => prev + 1);
    setFailed((prev) => Math.max(0, prev - 1));
  };

  return (
    <WebhookDeliveries
      endpointUrl="https://api.example.com/hooks/orders"
      serviceLabel="Order service, production"
      eventsCount={5}
      signingSecret="whsec_7e9f2c8b01d4a91f"
      apiVersion="2026-10-01"
      deliveries24h={total}
      successRate={Number((((total - failed) / total) * 100).toFixed(2))}
      failedCount24h={failed}
      avgLatencyMs={184}
      outcomeBars={bars}
      latencySeries={[210, 195, 224, 180, 174, 198, 165, 184, 172, 188, 160, 184]}
      deliveries={deliveries}
      onRetryDelivery={retryDelivery}
    />
  );
}
