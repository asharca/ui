"use client";
import { useState } from "react";
import { SegmentedCapacityMeter } from "@/components/charts/usage-chart-compositions";
const segments=[{id:"photos",name:"Photos",value:612,color:"#0ea5e9"},{id:"video",name:"Video",value:438,color:"#f97316"},{id:"documents",name:"Documents",value:214,color:"#10b981"},{id:"backups",name:"Backups",value:161,color:"#f59e0b"}];
const files=[{name:"Photo library",category:"photos",size:612},{name:"Video exports",category:"video",size:438},{name:"Team documents",category:"documents",size:214},{name:"Weekly archive",category:"backups",size:161}];
export function SegmentedMeterPreview() {
  const [selected,setSelected]=useState<string|null>(null);
  const shown=selected?files.filter(file=>file.category===selected):[];
  return <div className="mx-auto w-full max-w-xl px-4 py-10"><SegmentedCapacityMeter segments={segments} capacity={2000} unit="GB" selectedId={selected} onSelectedChange={setSelected} />{selected&&<section aria-label="Storage files" className="mt-6 rounded-xl border border-border p-4"><h3 className="text-sm font-medium">Linked files</h3><ul className="mt-3 space-y-2 text-xs">{shown.map(file=><li key={file.name} className="flex justify-between gap-3"><span>{file.name}</span><span>{file.size} GB</span></li>)}</ul>{!shown.length&&<p className="mt-3 text-xs text-muted-foreground">No files in this category.</p>}</section>}</div>;
}
