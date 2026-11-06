"use client";

import { Bell, BookOpen, CheckCheck, Clock, CreditCard, HelpCircle, Trash2, User } from "lucide-react";
import { useState } from "react";
import { AnimatedDropdown } from "@/components/motion/animated-dropdown";

export function AnimatedDropdownPreview() {
  const [status, setStatus] = useState("Draft");
  const [notifications, setNotifications] = useState(true);
  const [email, setEmail] = useState(true);
  const [digest, setDigest] = useState(false);
  const [result, setResult] = useState("");
  const [deleted, setDeleted] = useState(false);
  return <div className="flex min-h-[480px] w-full flex-col items-center justify-center gap-5 p-6"><div className="flex flex-wrap items-center justify-center gap-3">
    <AnimatedDropdown ariaLabel="Workspace actions" trigger="Acme workspace" triggerClassName="h-10 min-w-52 justify-between rounded-full px-3.5" menuLabel="Workspace" menuWidth={288} items={[
      {id:"profile",label:"Profile",textValue:"Profile",description:"Personal details and preferences",icon:<User className="size-4" />,shortcut:"⌘P",onSelect:()=>setResult("Profile preferences opened in this preview")},
      {id:"billing",label:"Billing",textValue:"Billing",description:"Plan, invoices, and payment methods",icon:<CreditCard className="size-4" />,onSelect:()=>setResult("Billing details selected")},
      {id:"separator-1",kind:"separator"},
      {id:"notifications",kind:"checkbox",label:"Activity notifications",textValue:"Activity notifications",checked:notifications,onCheckedChange:setNotifications,icon:<Bell className="size-4" />},
      {id:"recent",kind:"submenu",label:"Open recent",textValue:"Open recent",icon:<Clock className="size-4" />,items:[{id:"overview",label:"Workspace overview",textValue:"Workspace overview",onSelect:()=>setResult("Workspace overview selected")},{id:"preferences",kind:"submenu",label:"Notification preferences",textValue:"Notification preferences",items:[{id:"email",kind:"checkbox",label:"Email",textValue:"Email",checked:email,onCheckedChange:setEmail},{id:"digest",kind:"checkbox",label:"Daily digest",textValue:"Daily digest",checked:digest,onCheckedChange:setDigest}]}]},
      {id:"help",label:"Help center",textValue:"Help center",icon:<HelpCircle className="size-4" />,shortcut:"?",onSelect:()=>window.open("/docs","_blank","noopener,noreferrer")},
      {id:"enterprise",label:"Enterprise controls",textValue:"Enterprise controls",description:"Available on Enterprise",disabled:true,onSelect:()=>{}},
      {id:"separator-2",kind:"separator"},
      {id:"reviewed",label:"Mark all as reviewed",textValue:"Mark all as reviewed",icon:<CheckCheck className="size-4" />,onSelect:()=>setResult("All local activity marked as reviewed")},
      {id:"delete",label:deleted?"Restore workspace":"Delete workspace",textValue:deleted?"Restore workspace":"Delete workspace",destructive:true,icon:<Trash2 className="size-4" />,onSelect:()=>{setDeleted(value=>!value);setResult(deleted?"Local workspace restored":"Local workspace removed from this preview");}},
    ]} />
    <AnimatedDropdown ariaLabel="Document status" trigger={<><span aria-hidden className="size-2 rounded-full bg-muted-foreground" />{status}</>} triggerClassName="h-10 rounded-full px-4" menuWidth={192} menuLabel="Status" value={status} onValueChange={setStatus} items={["Draft","In review","Published"].map(label=>({id:label,kind:"option" as const,value:label,label,textValue:label}))} />
    <AnimatedDropdown ariaLabel="Resources" trigger="Resources" triggerClassName="h-10 rounded-full border-0 bg-transparent px-3" menuWidth={192} items={[{id:"docs",label:"Documentation",textValue:"Documentation",icon:<BookOpen className="size-4" />,onSelect:()=>window.open("/docs","_blank","noopener,noreferrer")},{id:"changelog",label:"Changelog",textValue:"Changelog",onSelect:()=>window.open("/changelog","_blank","noopener,noreferrer")},{id:"support",label:"Support",textValue:"Support",onSelect:()=>setResult("Support selected; this local preview does not send a message.")}]} />
  </div>{result && <p role="status" className="max-w-sm text-center text-xs text-muted-foreground">{result}</p>}</div>;
}
