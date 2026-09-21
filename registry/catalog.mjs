const entry = (slug, name, group, description, dependencies = [], needs = [], examples = [slug]) => ({ slug, name, group, description, dependencies, needs: ['utils', ...needs], examples });

/** The only catalog: site, installation payloads and llms.txt are derived from it. */
export const catalog = [
  entry('button', 'Button', '基础组件', '有清楚的层级，也有轻盈的按压反馈。', ['motion', 'lucide-react'], [], ['button', 'button-states']),
  entry('input', 'Input', '基础组件', '标签、说明与错误提示，始终对齐。'),
  entry('checkbox', 'Checkbox', '基础组件', '支持长文本、禁用与不确定状态。', ['lucide-react']),
  entry('radio-group', 'Radio Group', '基础组件', '原生表单语义，明确的单选状态。'),
  entry('switch', 'Switch', '基础组件', '轻轻切换，一个明确的状态变化。', ['radix-ui', 'motion']),
  entry('select', 'Select', '基础组件', '有标签的选择器，完整的键盘操作。', ['radix-ui', 'lucide-react']),
  entry('tabs', 'Tabs', '基础组件', '在同一个空间里，自然切换内容。', ['radix-ui', 'motion']),
  entry('accordion', 'Accordion', '基础组件', '把补充信息收好，需要时再展开。', ['radix-ui', 'lucide-react']),
  entry('badge', 'Badge', '基础组件', '克制地表达状态，不抢走内容的注意力。'),
  entry('dialog', 'Dialog', '浮层组件', '聚焦当前任务，关闭后回到原来的位置。', ['radix-ui', 'motion', 'lucide-react'], ['button']),
  entry('popover', 'Popover', '浮层组件', '把轻量操作放在触发位置附近。', ['radix-ui'], ['button']),
  entry('tooltip', 'Tooltip', '浮层组件', '悬停或键盘聚焦时，给出恰当的说明。', ['radix-ui'], ['button']),
  entry('prompt-input', 'Prompt Input', 'AI 组件', '自动增高、中文输入、发送与停止。', ['lucide-react'], ['button']),
  entry('message', 'Message', 'AI 组件', '安静地呈现对话，支持内容与操作组合。', ['lucide-react'], ['button']),
  entry('tool-result', 'Tool Result', 'AI 组件', '运行、成功与错误，收在一个执行记录中。', ['lucide-react'], ['badge']),
  entry('approval-card', 'Approval Card', 'AI 组件', '操作之前，让用户明确允许或拒绝。', ['lucide-react'], ['button']),
  entry('chat-panel', 'Chat Panel', 'AI 组件', '由消息与输入框组成，不绑定模型服务。', [], ['message', 'prompt-input']),
];
export const groups = ['基础组件', '浮层组件', 'AI 组件'];
export const utilities = { slug: 'utils', name: 'Utilities', group: '内部', description: 'Class composition and shared motion settings.', dependencies: ['clsx', 'tailwind-merge'], needs: [], examples: [] };
export const allEntries = [utilities, ...catalog];

export function resolveFiles(slug) {
  const ordered = [];
  const visiting = new Set();
  const visited = new Set();
  function visit(name) {
    if (visiting.has(name)) throw new Error(`Circular component dependency: ${name}`);
    if (visited.has(name)) return;
    const item = allEntries.find((candidate) => candidate.slug === name);
    if (!item) throw new Error(`Unknown component: ${name}`);
    visiting.add(name);
    item.needs.forEach(visit);
    visiting.delete(name);
    visited.add(name);
    ordered.push(item);
  }
  visit(slug);
  return ordered;
}
