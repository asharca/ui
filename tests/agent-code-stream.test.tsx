import { render } from '@testing-library/react';
import { expect, it } from 'vitest';
import { AgentCodeLine } from '../registry/ui/agent-internal-components-agents-agent-code';

it('shows the complete streamed line while older highlighted tokens are still pending', () => {
  const { container } = render(<AgentCodeLine code="const n = 12;" tokens={[{ content: 'const n = 1', offset: 0, light: '#111' }]} />);
  expect(container.textContent).toBe('const n = 12;');
});

it('retains highlighting when token text exactly matches the current source', () => {
  const { container } = render(<AgentCodeLine code="const n = 12;" tokens={[{ content: 'const n = 12;', offset: 0, light: '#111' }]} />);
  expect(container.textContent).toBe('const n = 12;');
  expect(container.querySelector('span[style]')).not.toBeNull();
});
