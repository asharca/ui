import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { SafeStreamdown } from '../registry/ui/safe-streamdown';
import { ChatThread } from '../registry/ui/chat-thread';

const graph = vi.hoisted(() => ({ initialize: vi.fn(), parse: vi.fn(), render: vi.fn() }));
vi.mock('mermaid', () => ({ default: graph }));
const svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 80"><text x="10" y="30">Example</text></svg>';
const text = '```mermaid\nflowchart LR\n A[开始] --> B[结束]\n```';
beforeEach(() => { vi.clearAllMocks(); graph.parse.mockResolvedValue({ diagramType: 'flowchart' }); graph.render.mockResolvedValue({ svg }); });

describe('Markdown tables and Mermaid', () => {
  it('renders a semantic scrollable table while leaving diagrams opt-in', () => {
    const { container } = render(<SafeStreamdown>{'| 模块 | 状态 |\n| --- | --- |\n| 审核 | 进行中 |\n\n' + text}</SafeStreamdown>);
    expect(screen.getByRole('table', { name: 'Markdown 表格' })).toHaveTextContent('审核');
    expect(screen.getByRole('region', { name: /Markdown 表格/ })).toHaveAttribute('tabindex', '0');
    expect(container.querySelector('code.language-mermaid')).toBeInTheDocument();
    expect(graph.render).not.toHaveBeenCalled();
  });
  it('defers a streaming diagram, then creates a static sanitized image', async () => {
    const { rerender, container } = render(<SafeStreamdown allowMermaid mode="streaming">{text}</SafeStreamdown>);
    expect(screen.getByText('图表生成中，回复结束后渲染。')).toBeVisible();
    expect(graph.parse).not.toHaveBeenCalled();
    rerender(<SafeStreamdown allowMermaid>{text}</SafeStreamdown>);
    const image = await screen.findByRole('img', { name: 'Mermaid 图表' });
    expect(image).toHaveAttribute('src', expect.stringContaining('data:image/svg+xml'));
    expect(graph.initialize).toHaveBeenCalledWith(expect.objectContaining({ securityLevel: 'strict', htmlLabels: false, startOnLoad: false }));
    // Toolbar icons are SVG; rendered Mermaid content must remain a static img.
    expect(container.querySelector('[data-slot="mermaid-canvas"] svg')).toBeNull();
    expect(document.querySelector('[data-mermaid-measure]')).toBeNull();
  });
  it('does not remount or rerender an unchanged diagram on parent updates', async () => {
    const { rerender } = render(<SafeStreamdown allowMermaid>{text}</SafeStreamdown>);
    await screen.findByRole('img');
    rerender(<SafeStreamdown allowMermaid className="custom-layout">{text}</SafeStreamdown>);
    await act(async () => { await Promise.resolve(); });
    expect(graph.render).toHaveBeenCalledTimes(1);
  });
  it('strips SVG scripts, HTML, links and external images from renderer output', async () => {
    graph.render.mockResolvedValueOnce({ svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 50" onload="alert(1)"><script>alert(1)</script><foreignObject><div>html</div></foreignObject><image href="https://example.invalid/track"/><a href="javascript:alert(1)"><text>Safe</text></a></svg>' });
    render(<SafeStreamdown allowMermaid>{text}</SafeStreamdown>);
    const source = (await screen.findByRole('img')).getAttribute('src')!;
    const decoded = decodeURIComponent(source.split(',').slice(1).join(','));
    expect(decoded).not.toMatch(/onload|<script|foreignObject|<image|href=/i);
  });
  it.each(['%%{init: {securityLevel: "loose"}}%%\nflowchart LR\n A-->B', 'flowchart LR\n A[<img src=x onerror=alert(1)>]', 'flowchart LR\n A-->B\n click A "https://example.invalid"', 'flowchart LR\n A@{ img: "https://example.invalid" }', 'flowchart LR\n A-->B\n classDef danger fill:url(https://example.invalid)'])('keeps restricted syntax as source: %s', async (code) => {
    render(<SafeStreamdown allowMermaid>{'```mermaid\n' + code + '\n```'}</SafeStreamdown>);
    expect(await screen.findByText('图表暂时无法渲染，已保留源码。')).toBeVisible();
    expect(graph.render).not.toHaveBeenCalled();
    expect(screen.getByLabelText('Mermaid 源码').textContent).toBe(code);
  });
  it('offers an honest syntax-error fallback and can retry', async () => {
    graph.parse.mockResolvedValueOnce(false);
    render(<SafeStreamdown allowMermaid>{text}</SafeStreamdown>);
    await screen.findByText('图表暂时无法渲染，已保留源码。');
    await userEvent.setup().click(screen.getByRole('button', { name: '重试' }));
    expect(await screen.findByRole('img')).toBeInTheDocument();
  });
  it('ignores late results after source changes', async () => {
    let finish!: (value: { svg: string }) => void;
    graph.render.mockImplementationOnce(() => new Promise((resolve) => { finish = resolve; }));
    const { rerender } = render(<SafeStreamdown allowMermaid>{text}</SafeStreamdown>);
    await waitFor(() => expect(graph.render).toHaveBeenCalledTimes(1));
    rerender(<SafeStreamdown allowMermaid>{text.replace('开始', '新内容')}</SafeStreamdown>);
    await act(async () => { finish({ svg: svg.replace('Example', 'Old') }); });
    const source = (await screen.findByRole('img')).getAttribute('src')!;
    expect(decodeURIComponent(source)).toContain('Example');
    expect(decodeURIComponent(source)).not.toContain('Old');
  });
  it('composes rich user and assistant messages without changing input or copy contracts', async () => {
    render(<ChatThread markdownOptions={{ allowMermaid: true }} messages={[{ id: 'u', role: 'user', content: '展示流程' }, { id: 'a', role: 'assistant', content: text }]} onSend={() => undefined} />);
    expect(screen.getByRole('article', { name: '用户消息' })).toHaveTextContent('展示流程');
    expect(await screen.findByRole('img')).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '复制消息' })).toBeInTheDocument();
  });
});
