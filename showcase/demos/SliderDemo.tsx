import { useId, useState } from "react";
import { Slider } from "../../src/index";
export function SliderDemo() {
  const id = useId(); const [volume, setVolume] = useState(45);
  return <div style={{ display: "grid", gap: 16, width: "100%", maxWidth: 360 }}><label htmlFor={id}>音量：{volume}%</label><Slider id={id} value={volume} onChange={(event) => setVolume(Number(event.target.value))} min={0} max={100} step={5} aria-valuetext={`${volume}%`} /><Slider aria-label="不可用的滑块" value={25} disabled /></div>;
}
