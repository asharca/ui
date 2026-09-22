import { Slider } from '@/components/asharca/slider';
export default function SliderDemo() {
  return <form className="grid w-full max-w-xs gap-5"><Slider label="预览缩放" name="zoom" defaultValue={60} min={0} max={100} step={5} formatValue={(value) => `${value}%`} /><button type="reset" className="justify-self-start rounded text-xs text-muted-foreground underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-ring">恢复默认值</button></form>;
}
