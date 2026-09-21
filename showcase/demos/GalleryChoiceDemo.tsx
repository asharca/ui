import { useId, useState } from 'react';
import { ChoiceField, ChoiceGroup } from '../../src/index';

export function GalleryChoiceDemo() {
  const name = useId();
  const [mode, setMode] = useState('review');
  return <ChoiceGroup legend="选择你的工作方式" description="每一种选择，都有清晰的边界。"><ChoiceField type="radio" variant="card" name={name} value="review" label="逐次确认" description="运行前，先查看参数与预期结果。" checked={mode === 'review'} onChange={(event) => setMode(event.target.value)} /><ChoiceField type="radio" variant="card" name={name} value="readonly" label="只读预览" description="只了解信息，不修改任何内容。" checked={mode === 'readonly'} onChange={(event) => setMode(event.target.value)} /></ChoiceGroup>;
}
