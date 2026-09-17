import { Select } from '../src/Controls';
import { designStyles, normalizeStyle, type DesignStyle } from './design-settings';

export function DesignControls({ style, onStyleChange }: { style: DesignStyle; onStyleChange: (style: DesignStyle) => void }) {
  return <div className="design-style-control"><Select aria-label="视觉风格" controlSize="sm" value={style} onChange={(event) => onStyleChange(normalizeStyle(event.target.value))}>{designStyles.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</Select></div>;
}
