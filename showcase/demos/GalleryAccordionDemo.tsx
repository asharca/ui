import { useId, useState } from 'react';
import { Bell, Palette } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger, Switch, ChoiceField, ChoiceGroup } from '../../src/index';

export function GalleryAccordionDemo() {
  const id = useId();
  const [appearance, setAppearance] = useState('system');
  const [notify, setNotify] = useState(true);
  return <Accordion type="single" collapsible defaultValue="appearance" style={{ width: '100%', maxWidth: 246, background: 'hsl(var(--card))', padding: '4px 16px', borderRadius: 16, border: '1px solid hsl(var(--border) / .6)' }}>
    <AccordionItem value="appearance"><AccordionTrigger><span style={{ display: 'flex', gap: 9, alignItems: 'center' }}><Palette size={15} />外观</span></AccordionTrigger><AccordionContent><ChoiceGroup legend="配色" style={{ paddingBottom: 12 }}><div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 8 }}>{[['light', '浅色'], ['dark', '深色'], ['system', '系统']].map(([value, label]) => <ChoiceField key={value} type="radio" name={id} value={value} label={label} checked={appearance === value} onChange={() => setAppearance(value)} />)}</div></ChoiceGroup></AccordionContent></AccordionItem>
    <AccordionItem value="notifications"><AccordionTrigger><span style={{ display: 'flex', gap: 9, alignItems: 'center' }}><Bell size={15} />通知</span></AccordionTrigger><AccordionContent><div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 14 }}><label htmlFor={`${id}-notify`}>桌面通知</label><Switch id={`${id}-notify`} checked={notify} onCheckedChange={setNotify} /></div></AccordionContent></AccordionItem>
  </Accordion>;
}
