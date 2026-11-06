"use client";

import type { TableColumn } from "@/components/motion/table";
import { AnimatedBadge } from "@/components/motion/animated-badge";
import { Pause } from "lucide-react";

export interface AccountDemoRow { id: string; name: string; email: string; status: string; plan: string; seats: number; mrr: number; renewal: string; channel: string }
export const accountDemoRows: AccountDemoRow[] = [
  {id:"plume",name:"Plume AI",email:"lena@plume.ai",status:"Active",plan:"Enterprise",seats:105,mrr:15800,renewal:"Nov 19",channel:"Direct"},
  {id:"arc",name:"Arc Studio",email:"maya@arc.studio",status:"Active",plan:"Enterprise",seats:84,mrr:12400,renewal:"Sep 24",channel:"Direct"},
  {id:"orbit",name:"Orbit Finance",email:"noah@orbit.finance",status:"Trial",plan:"Enterprise",seats:61,mrr:9100,renewal:"Nov 08",channel:"Partner"},
  {id:"kin",name:"Kin Systems",email:"nora@kin.systems",status:"Active",plan:"Scale",seats:46,mrr:7200,renewal:"Oct 11",channel:"Product-led"},
  {id:"signal",name:"Signal House",email:"sara@signal.house",status:"Active",plan:"Scale",seats:38,mrr:5900,renewal:"Dec 12",channel:"Partner"},
  {id:"northstar",name:"Northstar Labs",email:"jon@northstar.dev",status:"Trial",plan:"Scale",seats:32,mrr:4800,renewal:"Oct 02",channel:"Partner"},
  {id:"field",name:"Field Notes",email:"ava@fieldnotes.co",status:"Active",plan:"Scale",seats:29,mrr:3650,renewal:"Nov 01",channel:"Product-led"},
  {id:"form",name:"Form & Co.",email:"milo@form.co",status:"Paused",plan:"Starter",seats:12,mrr:1200,renewal:"Dec 03",channel:"Product-led"},
  {id:"mono",name:"Mono Works",email:"eli@mono.works",status:"Paused",plan:"Starter",seats:8,mrr:890,renewal:"Oct 18",channel:"Direct"},
];
export function DemoStatus({status}:{status:string}) { return <AnimatedBadge size="sm" status={status === "Active" ? "success" : status === "Trial" ? "info" : "warning"} icon={status === "Paused" ? <Pause className="size-3" /> : undefined} className={status === "Active" ? "border-success/30 bg-success/15 text-foreground dark:text-foreground" : status === "Trial" ? "border-accent/30 bg-accent/15 text-foreground" : "border-warning/30 bg-warning/15 text-foreground dark:text-foreground"}>{status}</AnimatedBadge>; }
export const accountDemoColumns: TableColumn<AccountDemoRow>[] = [
  {key:"name",header:"Account",sortable:true,width:"30%",cell:row=><div className="flex min-w-0 items-center gap-3"><span aria-hidden className="grid size-9 shrink-0 place-items-center rounded-full bg-primary text-xs font-medium text-primary-foreground">{row.name.split(" ").map(word=>word[0]).join("").slice(0, 2)}</span><div className="min-w-0"><p className="truncate text-sm font-medium">{row.name}</p><p className="truncate text-xs text-muted-foreground">{row.email}</p></div></div>},
  {key:"status",header:"Status",sortable:true,width:"110px",cell:row=><DemoStatus status={row.status} />},
  {key:"plan",header:"Plan",sortable:true,width:"120px"},
  {key:"seats",header:"Seats",sortable:true,width:"90px"},
  {key:"mrr",header:"MRR",sortable:true,width:"120px",align:"right",cell:row=>`$${row.mrr.toLocaleString()}`},
  {key:"renewal",header:"Renewal",sortable:true,width:"110px",align:"right"},
];
export interface CustomerDemoRow { id:string; name:string; email:string; plan:string; status:string; seats:number; spend:number }
const names=["Milo Thompson","Noah Bell","Eli Carter","Jon Williams","Ava Robinson","Nora Kim","Maya Bennett","Lena Ortiz"];
export function createCustomerDemoRows(count:number): CustomerDemoRow[] { return Array.from({length:count},(_,index)=>({id:`customer-${index+1}`,name:names[index%names.length],email:`${names[index%names.length].toLowerCase().replace(" ",".")}${index+1}@example.com`,plan:["Starter","Pro","Business"][index%3],status:["Active","Paused","Trial"][index%3],seats:1+(index*3)%24,spend:29+(index*47)%1970})); }
export function customerDemoColumns(amountLabel:string): TableColumn<CustomerDemoRow>[] { return [{key:"name",header:"Customer",width:"34%",sortable:true,cell:row=><div className="min-w-0"><p className="truncate text-sm font-medium">{row.name}</p><p className="truncate text-xs text-muted-foreground">{row.email}</p></div>},{key:"plan",header:"Plan",width:"17%",sortable:true,align:"center"},{key:"status",header:"Status",width:"18%",sortable:true,align:"center",cell:row=><span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${row.status === "Active" ? "bg-primary text-primary-foreground" : row.status === "Trial" ? "bg-muted text-foreground" : "text-muted-foreground"}`}>{row.status}</span>},{key:"seats",header:"Seats",width:"13%",sortable:true,align:"center"},{key:"spend",header:amountLabel,width:"18%",sortable:true,align:"right",cell:row=>`$${row.spend.toLocaleString()}`}]; }
