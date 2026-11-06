"use client";

import { useState } from "react";
import { AppointmentBooking, type AppointmentSlot } from "@/components/motion/calendar-workspaces";

const hours = [9,9.5,10,10.5,11,11.5,12.5,13,13.5,14,14.5,15,16.5];
const initialSlots: AppointmentSlot[] = [12,13,15,16,19,20,21,23,26,27,28,29,30].flatMap((day,index) => [15,30,60].flatMap(duration => hours.slice(0,index === 0 ? 13 : index % 3 === 0 ? 9 : 7).map(hour => ({ id: `${day}-${duration}-${hour}`,start: `2026-10-${day}T${String(Math.floor(hour) + 4).padStart(2,"0")}:${hour % 1 ? "30" : "00"}:00Z`,durationMinutes: duration,available: true }))));

export function CalendarAppointmentBookingPreview() {
  const [slots,setSlots] = useState(initialSlots);
  const [fail,setFail] = useState(false);
  return <div className="w-full px-4 py-10 sm:px-6"><AppointmentBooking slots={slots} durations={[15,30,60]} defaultTimeZone="America/New_York" meeting={{ title: "Workspace walkthrough",description: "A guided tour of your new workspace, tailored to how your team ships.",hostName: "Maren Kessler",hostRole: "Onboarding lead · beUI",avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=160&q=80",location: "Video call",locationDescription: "Link arrives with the invite" }} onBook={async (slot,details) => { if (fail) throw new Error("The local booking adapter rejected this request. Your details have been retained."); setSlots(current => current.map(item => item.id === slot.id ? { ...item,available: false } : item)); return { id: slot.id,title: `Workspace walkthrough with ${details.name}`,start: slot.start,end: new Date(new Date(slot.start).getTime() + slot.durationMinutes * 60000).toISOString() }; }} onReschedule={async receipt => { if (fail) throw new Error("The local booking adapter rejected rescheduling."); setSlots(current => current.map(slot => slot.id === receipt.id ? { ...slot,available: true } : slot)); }}/><details className="mx-auto mt-4 max-w-5xl text-xs text-muted-foreground"><summary className="cursor-pointer">Local booking adapter</summary><p className="my-2">No invite is sent. The local adapter returns a receipt and reserves the selected slot in this preview only.</p><label><input type="checkbox" checked={fail} onChange={event => setFail(event.target.checked)}/> Reject booking callback</label></details></div>;
}
