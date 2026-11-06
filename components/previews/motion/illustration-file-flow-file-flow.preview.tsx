"use client";

import { useState } from "react";
import { Button } from "@/components/motion/button";
import { FileFlow, type FileFlowStage } from "@/components/motion/illustration-file-flow";

export function FileFlowPreview() {
  const [stage, setStage] = useState<FileFlowStage>("output");
  const [result, setResult] = useState<"ready" | "pending" | "error">("ready");
  const advance = () => {
    if (stage === "queued") { setStage("processing"); setResult("pending"); }
    else if (stage === "processing") { setStage("output"); setResult("ready"); }
    else { setStage("queued"); setResult("pending"); }
  };
  return <div className="group relative flex w-full max-w-xl flex-col items-center">
    <FileFlow value={stage} onValueChange={setStage} presentationPlaying processorLabel="Convert" processorDetail="Illustration: normalize the supplied sample files." sources={[
      { id: "pdf", name: "Source document", format: "PDF" },
      { id: "xls", name: "Source spreadsheet", format: "XLS" },
      { id: "jpg", name: "Source image", format: "JPG" },
    ]} output={{ name: "brief.md", format: "Markdown", status: result, detail: result === "error" ? "Preview error: an input field needs review." : result === "ready" ? "Ready to use" : "Awaiting input" }} />
    <div className="absolute inset-x-2 top-1 flex flex-wrap justify-center gap-2 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100"><Button type="button" size="sm" onClick={advance}>{stage === "output" ? "Reset flow preview" : "Advance flow preview"}</Button><Button type="button" size="sm" variant="outline" onClick={() => { setResult("error"); setStage("output"); }}>Show error preview</Button></div>
    <p className="sr-only">Local narrative only. No files are uploaded or converted.</p>
  </div>;
}
