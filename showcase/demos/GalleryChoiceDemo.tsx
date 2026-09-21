import { useId, useState } from 'react';
import { ChoiceField, ChoiceGroup } from '../../src/index';

export function GalleryChoiceDemo() {
  const name = useId();
  const [mode, setMode] = useState('personal');
  return <ChoiceGroup legend="工作空间" style={{ width: '100%', maxWidth: 240 }}><ChoiceField type="radio" variant="card" name={name} value="personal" label="个人" description="专注自己的项目" checked={mode === 'personal'} onChange={(event) => setMode(event.target.value)} /><ChoiceField type="radio" variant="card" name={name} value="team" label="团队" description="和伙伴一起构建" checked={mode === 'team'} onChange={(event) => setMode(event.target.value)} /></ChoiceGroup>;
}
