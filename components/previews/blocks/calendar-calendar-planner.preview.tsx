"use client";

import { useState } from "react";
import { CalendarPlanner, type PlannerEvent } from "@/components/motion/calendar-workspaces";

const fixture: [number,string,string,string][] = [
  [2,"Planning kickoff","09:00","Meetings"],[3,"Research block","10:30","Focus"],[4,"Team standup","09:30","Meetings"],[7,"Design review","11:00","Deadlines"],[8,"Deep work","09:00","Focus"],[8,"Product sync","13:30","Meetings"],[9,"Dentist","15:00","Personal"],[10,"Launch copy due","16:00","Deadlines"],[11,"Client call","10:00","Meetings"],[12,"Lunch with Zahir","12:30","Personal"],[15,"Content planning","09:30","Focus"],[17,"Hiring loop","11:00","Meetings"],[18,"Design critique","09:00","Focus"],[18,"Invoices due","15:30","Deadlines"],[19,"Prototype review","10:00","Meetings"],[20,"Team lunch","12:00","Personal"],[21,"Quarterly review","10:00","Meetings"],[22,"Release checklist","09:30","Deadlines"],[23,"Strategy notes","09:00","Focus"],[24,"Roadmap lock","14:00","Deadlines"],[28,"Studio retro","10:00","Personal"],[29,"Writing session","13:00","Focus"],[30,"Month close","16:00","Deadlines"],
];
const initial: PlannerEvent[] = fixture.map(([day,title,time,category],index) => { const start = `2026-08-${String(day).padStart(2,"0")}T${time}:00Z`; return { id: `event-${index}`,title,start,end: new Date(new Date(start).getTime() + 3600000).toISOString(),category }; });

export function CalendarPlannerPreview() {
  const [events,setEvents] = useState(initial);
  const [zone,setZone] = useState("UTC");
  const [reject,setReject] = useState(false);
  return <div className="w-full"><CalendarPlanner events={events} categories={["Meetings","Focus","Personal","Deadlines"]} timeZone={zone} initialDate="2026-08-18" onSave={async event => { if (reject) throw new Error("The local adapter rejected this event. Your draft is retained."); setEvents(current => current.some(item => item.id === event.id) ? current.map(item => item.id === event.id ? event : item) : [...current,event]); }} onDelete={async id => { if (reject) throw new Error("The local adapter rejected deletion."); setEvents(current => current.filter(item => item.id !== id)); }}/><details className="px-6 pb-5 text-xs text-muted-foreground"><summary className="cursor-pointer">Local calendar adapter</summary><p className="my-2">Events remain in this preview. Editor dates use UTC; change the display time zone independently.</p><div className="flex flex-wrap items-center gap-3"><label>Display time zone <select className="rounded-full border border-border bg-background p-2" value={zone} onChange={event => setZone(event.target.value)}>{["UTC","America/New_York","Asia/Tokyo"].map(item => <option key={item}>{item}</option>)}</select></label><label><input type="checkbox" checked={reject} onChange={event => setReject(event.target.checked)}/> Reject event mutations</label></div></details></div>;
}
