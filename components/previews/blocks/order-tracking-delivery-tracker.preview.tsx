"use client";

import { useEffect, useState } from "react";
import { DeliveryTracker, type DeliveryOrder } from "@/components/motion/order-tracking";
import { Button } from "@/components/motion/button";

export function DeliveryTrackerPreview() {
  const [state, setState] = useState("On route"); const [snapshot, setSnapshot] = useState(0); const [playing, setPlaying] = useState(true);
  useEffect(() => { if (!playing || state !== "On route") return; const timer = window.setInterval(() => setSnapshot(value => Math.min(4, value + 1)), 8000); return () => window.clearInterval(timer); }, [playing, state]);
  const complete = state === "Delivered" || snapshot === 4;
  const order: DeliveryOrder = {
    id: "HP-20481", courier: "Northline Courier", courierImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&crop=faces&w=96&h=96&q=80", courierVehicle: "Electric van · KL 4027", courierRating: 4.9,
    address: "48 Harbor Street, Apt 3", items: "Studio headphones and 2 more", arrivalMinutes: complete ? 0 : Math.max(2, 18 - snapshot * 4),
    route: [{ x: 70, y: 240 }, { x: 70, y: 150 }, { x: 180, y: 150 }, { x: 180, y: 60 }, { x: 300, y: 60 }, { x: 300, y: 150 }, { x: 360, y: 150 }, { x: 360, y: 214 }], progress: complete ? 1 : snapshot * .23,
    detailsHref: "#demo-order-details", supportHref: "mailto:delivery@example.com",
    stages: [
      { id: "placed", label: "Ordered", date: "2026-10-18T16:12:00Z", status: "complete", detail: "Your order is confirmed." },
      { id: "packed", label: "Packed", date: "2026-10-19T08:05:00Z", status: "complete", detail: "Three items packed with care." },
      { id: "warehouse", label: "Left the warehouse", date: "2026-10-19T09:30:00Z", status: "complete", detail: "Your parcel has left the warehouse." },
      { id: "route", label: "Out for delivery", date: "2026-10-19T11:24:00Z", status: complete ? "complete" : state === "Exception" ? "exception" : "current", detail: state === "Exception" ? "Courier reported an access issue. Please contact delivery support." : "Your courier is following the route to your door." },
      { id: "delivered", label: "Delivered", date: "2026-10-19T11:42:00Z", status: complete ? "complete" : "upcoming", detail: "Parcel left at the front door." },
    ],
    updates: [
      ...(complete ? [{ id: "delivered", time: "2026-10-19T11:42:00Z", text: "Delivered to your front door" }] : []),
      ...(snapshot >= 3 ? [{ id: "street", time: "2026-10-19T11:39:00Z", text: "Your courier is on your street" }] : []),
      ...(snapshot >= 2 ? [{ id: "next", time: "2026-10-19T11:34:00Z", text: "One more stop, then you" }] : []),
      ...(snapshot >= 1 ? [{ id: "nearby", time: "2026-10-19T11:29:00Z", text: "Dropping off a parcel nearby · 2 stops away" }] : []),
      { id: "picked", time: "2026-10-19T11:24:00Z", text: "Your courier picked up your parcel at the depot" },
    ], proof: complete ? { description: "Left at your front door at 11:42 AM" } : undefined,
  };
  return <div className="w-full"><DeliveryTracker order={order} /><details className="mt-4 text-xs text-muted-foreground"><summary className="cursor-pointer">Local tracking simulation controls</summary><div className="mt-3 flex flex-wrap gap-2">{["On route", "Exception", "Delivered"].map(value => <Button key={value} variant="outline" size="sm" className="rounded-full" onClick={() => { setState(value); setSnapshot(0); }}>{value}</Button>)}<Button size="sm" variant="outline" className="rounded-full" onClick={() => setPlaying(!playing)}>{playing ? "Pause simulation" : "Play simulation"}</Button><Button size="sm" variant="outline" className="rounded-full" onClick={() => { setState("On route"); setSnapshot(0); }}>Track again</Button></div><section id="demo-order-details" className="mt-3">Three sample studio essentials, tracked by Northline Courier. No real shipment.</section></details></div>;
}
