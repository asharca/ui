const entry = (slug, name, group, description, dependencies = [], needs = [], examples = [slug], wide = false) => ({ slug, name, group, description, dependencies, needs: ['utils', ...needs], examples, wide });

/** One catalog drives the site, dependency closures and the single llms.txt. */
export const catalog = [
  entry('button', 'Button', '基础组件', '有清楚的层级，也有轻盈的按压反馈。', ['motion', 'lucide-react'], [], ['button', 'button-states']),
  entry('icon-button', 'Icon Button', '基础组件', '图标操作，保留明确的名称和加载反馈。', [], ['button']),
  entry('input', 'Input', '基础组件', '标签、说明与错误提示，始终对齐。'),
  entry('textarea', 'Textarea', '基础组件', '多行输入、说明与错误，沿用原生表单能力。'),
  entry('search-input', 'Search Input', '基础组件', '搜索与清空，保留输入焦点和只读边界。', ['lucide-react']),
  entry('checkbox', 'Checkbox', '基础组件', '支持长文本、禁用与不确定状态。', ['lucide-react']),
  entry('radio', 'Radio', '基础组件', '可以自由组合的原生单选选项。'),
  entry('radio-group', 'Radio Group', '基础组件', '原生表单语义，明确的单选状态。'),
  entry('choice-field', 'Choice Field', '基础组件', '普通选项与卡片选项，支持分组和错误说明。', [], ['checkbox', 'radio']),
  entry('switch', 'Switch', '基础组件', '轻轻切换，一个明确的状态变化。', ['radix-ui', 'motion']),
  entry('select', 'Select', '基础组件', '有标签的选择器，完整的键盘操作。', ['radix-ui', 'lucide-react']),
  entry('slider', 'Slider', '基础组件', '单值范围选择，同时呈现数值与单位。'),
  entry('tabs', 'Tabs', '基础组件', '在同一个空间里，自然切换内容。', ['radix-ui', 'motion']),
  entry('accordion', 'Accordion', '基础组件', '把补充信息收好，需要时再展开。', ['radix-ui', 'lucide-react']),
  entry('field', 'Field', '表单与反馈', '可组合的标签、描述和错误信息。'),
  entry('submit-button', 'Submit Button', '表单与反馈', '提交、等待、成功，和真实表单状态保持一致。', ['lucide-react'], ['button']),
  entry('confirm-submit-button', 'Confirm Submit Button', '表单与反馈', '提交前确认，失败后保留重试入口。', [], ['button', 'dialog']),
  entry('copy-button', 'Copy Button', '表单与反馈', '复制成功和权限失败都有明确反馈。', ['lucide-react'], ['button']),
  entry('badge', 'Badge', '表单与反馈', '克制地表达状态，不抢走内容的注意力。'),
  entry('status-badge', 'Status Badge', '表单与反馈', '状态点与文字，也可以使用无底色模式。', [], ['badge']),
  entry('alert', 'Alert', '表单与反馈', '信息、成功、警告和错误的语义提示。', ['lucide-react']),
  entry('progress', 'Progress', '表单与反馈', '有进度时呈现数值，未知进度时保持诚实。'),
  entry('skeleton', 'Skeleton', '表单与反馈', '与真实内容尺寸一致的加载占位。'),
  entry('spinner', 'Spinner', '表单与反馈', '轻量加载提示，尊重减少动态效果设置。', ['lucide-react']),
  entry('card', 'Card', '数据与布局', '容器、标题、正文和页脚自由组合。'),
  entry('page', 'Page', '数据与布局', '带有标题与操作区的响应式页面容器。'),
  entry('section', 'Section', '数据与布局', '内容分区、数量和操作保持一致的层级。'),
  entry('panel', 'Panel', '数据与布局', '设置与危险操作，拥有清楚的视觉边界。'),
  entry('toolbar', 'Toolbar', '数据与布局', '搜索、筛选和操作在窄屏自然换行。'),
  entry('empty-state', 'Empty State', '数据与布局', '清楚说明当前状态，并提供下一步。'),
  entry('entity', 'Entity', '数据与布局', '头像、名称与辅助信息组成紧凑的实体行。', [], ['avatar']),
  entry('avatar', 'Avatar', '数据与布局', '图片、失败回退与不同尺寸的身份展示。', ['radix-ui']),
  entry('data-table', 'Data Table', '数据与布局', '排序、搜索、分页与基于稳定 ID 的跨页选择。', ['@tanstack/react-table@8.21.3', 'lucide-react'], ['checkbox', 'search-input', 'pagination', 'button'], ['data-table'], true),
  entry('chart-container', 'Chart Container', '数据与布局', '组合 Recharts 图表、提示与图例，沿用项目主题。', ['recharts@3.10.1', 'react-is@19.2.4'], [], ['chart-container'], true),
  entry('content-page', 'Content Page', '数据与布局', '说明文档的标题、摘要与正文层级。'),
  entry('rotating-headline', 'Rotating Headline', '数据与布局', '安静轮换文字，减少动态效果时保持静止。', ['motion']),
  entry('navigation-tabs', 'Navigation Tabs', '浮层组件', '使用真实链接进行页面级导航。'),
  entry('chip', 'Chip', '浮层组件', '带有明确选中状态的筛选标签。'),
  entry('breadcrumbs', 'Breadcrumbs', '浮层组件', '位置层级和当前页面，简单可读。', ['lucide-react']),
  entry('pagination', 'Pagination', '浮层组件', '页码摘要与有边界的上一页、下一页。', ['lucide-react'], ['button']),
  entry('dialog', 'Dialog', '浮层组件', '聚焦当前任务，关闭后回到原来的位置。', ['radix-ui', 'motion', 'lucide-react'], ['button']),
  entry('dropdown-menu', 'Dropdown Menu', '浮层组件', '动作、单选和多选菜单，支持键盘与子菜单。', ['radix-ui', 'lucide-react']),
  entry('context-menu', 'Context Menu', '浮层组件', '右键、长按与键盘呼出的上下文操作。', ['radix-ui', 'lucide-react']),
  entry('hover-card', 'Hover Card', '浮层组件', '为可访问的链接提供补充预览内容。', ['radix-ui']),
  entry('popover', 'Popover', '浮层组件', '把轻量操作放在触发位置附近。', ['radix-ui'], ['button']),
  entry('tooltip', 'Tooltip', '浮层组件', '悬停或键盘聚焦时，给出恰当的说明。', ['radix-ui'], ['button']),
  entry('prompt-input', 'Prompt Input', 'AI 组件', '自动增高、中文输入、发送与停止。', ['lucide-react'], ['button']),
  entry('message', 'Message', 'AI 组件', '安静地呈现对话，支持内容与操作组合。', ['lucide-react'], ['button']),
  entry('tool-result', 'Tool Result', 'AI 组件', '运行、成功与错误，收在一个执行记录中。', ['lucide-react'], ['badge']),
  entry('approval-card', 'Approval Card', 'AI 组件', '操作之前，让用户明确允许或拒绝。', ['lucide-react'], ['button']),
  entry('chat-panel', 'Chat Panel', 'AI 组件', '由消息与输入框组成，不绑定模型服务。', [], ['message', 'prompt-input'], ['chat-panel'], true),
  entry('safe-streamdown', 'Safe Streamdown', 'AI 组件', '安全呈现 Markdown 与逐步更新的回复；图片按需启用。', ['react-markdown@10.1.0', 'remark-gfm@4.0.1']),
  entry('tool-call-card', 'Tool Call Card', 'AI 组件', '完整工具状态、延迟读取结果和可重试审批。', ['lucide-react'], ['badge', 'button', 'approval-card']),
  entry('chat-composer-toolbar', 'Chat Composer Toolbar', 'AI 组件', '分组工具、固定快捷操作与异步失败反馈。', ['lucide-react'], ['button', 'icon-button', 'popover']),
  entry('conversation-sidebar', 'Conversation Sidebar', 'AI 组件', '会话搜索、分组、重命名、删除和完整顺序调整。', ['lucide-react'], ['button', 'icon-button', 'input', 'search-input', 'dialog', 'dropdown-menu']),
  entry('chat-shell', 'Chat Shell', 'AI 组件', '桌面侧栏与移动面板，组合自己的聊天工作区。', ['lucide-react'], ['icon-button'], ['chat-shell'], true),
  entry('chat-thread', 'Chat Thread', 'AI 组件', '恢复工具、思考、附件、编辑、重新生成与消息分支。', ['lucide-react'], ['chat-panel', 'button', 'textarea', 'safe-streamdown', 'tool-call-card', 'chat-composer-toolbar'], ['chat-thread'], true),
  entry('workspace-tab-bar', 'Workspace Tab Bar', '工作区', '固定、关闭、拖动或用键盘调整标签顺序。', ['lucide-react'], ['dropdown-menu', 'icon-button'], ['workspace-tab-bar'], true),
  entry('workspace-sidebar', 'Workspace Sidebar', '工作区', '折叠导航、状态徽标和焦点受控的手机抽屉。', ['radix-ui', 'lucide-react'], ['icon-button'], ['workspace-sidebar'], true),
  entry('sidebar-action-rail', 'Sidebar Action Rail', '工作区', '鼠标与键盘都能操作的条目快捷动作。', [], ['icon-button']),
  entry('tool-plane-logo', 'ToolPlane Logo', '工作区', '保留 ToolPlane 标识，使用当前的中性色与圆角。', ['lucide-react']),
];
export const groups = ['基础组件', '表单与反馈', '数据与布局', '浮层组件', 'AI 组件', '工作区'];
export const utilities = { slug: 'utils', name: 'Utilities', group: '内部', description: 'Class composition and shared motion settings.', dependencies: ['clsx', 'tailwind-merge'], needs: [], examples: [], wide: false };
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
