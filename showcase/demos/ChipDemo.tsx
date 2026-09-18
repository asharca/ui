import { useState } from "react";
import { Chip } from "../../src/index";
export function ChipDemo() {
  const [selected, setSelected] = useState("全部");
  return <div style={{ display: "grid", gap: 16 }}><div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>{["全部", "MCP", "Skills", "Agents"].map((name) => <Chip key={name} asChild active={name === selected}><button type="button" aria-pressed={name === selected} onClick={() => setSelected(name)}>{name}</button></Chip>)}</div><p role="status">筛选：{selected}</p></div>;
}
