import { useState } from 'react';
import { Avatar, AvatarFallback } from '../../src/index';

const members = [{ name: 'Alex', initials: 'AL', color: '#e8e0f6' }, { name: 'Sam', initials: 'SA', color: '#d4e6ec' }, { name: 'Robin', initials: 'RO', color: '#f3ddce' }, { name: 'Jules', initials: 'JU', color: '#dce8d8' }];
// Import @asharca/ui/themes.css for the keyboard-accessible lift interaction.
export function GalleryAvatarDemo() {
  const [selected, setSelected] = useState('');
  return <div style={{ display: 'grid', justifyItems: 'center', gap: 20 }}><div className="ui-avatar-stack" role="group" aria-label="团队成员">{members.map((member) => <button key={member.name} type="button" aria-label={member.name} aria-pressed={selected === member.name} onClick={() => setSelected(member.name)}><Avatar style={{ width: 48, height: 48, border: '3px solid hsl(var(--card))', boxShadow: '0 2px 5px hsl(var(--foreground) / .1)' }}><AvatarFallback style={{ background: member.color, color: '#303238', fontSize: 13, fontWeight: 600 }}>{member.initials}</AvatarFallback></Avatar><span className="ui-avatar-stack-label" aria-hidden="true">{member.name}</span></button>)}</div><span role="status" style={{ height: 18, fontSize: 12, color: 'hsl(var(--muted-foreground))' }}>{selected ? `${selected} · 已选择` : '4 位成员'}</span></div>;
}
