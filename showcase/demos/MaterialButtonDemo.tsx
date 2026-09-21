import { useState } from 'react';
import { Check, ArrowUpRight } from 'lucide-react';
import { Button } from '../../src/index';

// Import @asharca/ui/themes.css to include the optional material treatment.
export function MaterialButtonDemo() {
  const [saved, setSaved] = useState(false);
  return <Button className="ui-material-button" onClick={() => setSaved((value) => !value)}><span key={String(saved)} className="ui-state-swap">{saved ? <Check size={17} /> : <ArrowUpRight size={17} />}{saved ? '已保存' : '试试这个按钮'}</span></Button>;
}
