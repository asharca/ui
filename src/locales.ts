import type { ChatThreadLabels } from './ChatThread.js';
import type { ConversationSidebarLabels } from './ConversationSidebar.js';
import type { ChatComposerToolbarLabels } from './ChatComposerToolbar.js';
import type { ToolCallCardLabels } from './ToolCallCard.js';

/** Optional copy preset. Hosts can keep using their existing translation system. */
export const zhCN = {
  chatThread: {
    addAttachment: '添加附件', allowTool: '允许', attachment: '附件', attachmentsUnavailable: '当前运行时不支持附件。',
    cancel: '取消', composerTools: '输入工具', conversationBranch: '会话分支', copy: '复制', edit: '编辑',
    expandComposer: '展开输入框', generatingReply: '正在生成回复', messagePlaceholder: '输入消息…', next: '下一条',
    openComposerTools: '添加工具', preparingReply: '准备中', previous: '上一条', processFailed: '处理失败',
    processed: '处理完成', processing: '处理中', regenerate: '重新生成', rejectTool: '拒绝',
    removeAttachment: (name: string) => `移除附件 ${name}`, restoreComposer: '收起输入框', save: '保存',
    scrollToLatestMessage: '滚动到最新消息', send: '发送', startBranch: '创建新分支', startConversation: '开始一段新对话',
    stop: '停止生成', thinking: '思考中', thought: '思考过程', toolApprovalDescription: '此工具需要你批准后才能执行。',
    toolAwaitingApproval: '等待审批', toolCompleted: '已完成', toolFailed: '执行失败', toolInput: '输入参数',
    toolKindMcp: 'MCP', toolKindSandbox: '沙箱', toolKindSkill: '技能', toolKindSubagent: '子智能体', toolKindTool: '工具', toolKindWeb: '联网',
    toolOutput: '执行结果', toolRunning: '执行中', user: '你', usingTool: (name: string) => `正在使用 ${name}`,
    toolRejected: '已拒绝', toolCancelled: '已取消', toolApprovalFailed: '审批提交失败，请重试。', toolApprovalSubmitted: '审批已提交',
    showToolResult: '显示完整结果', collapseToolResult: '显示摘要', actionFailed: '操作失败，请重试。',
  } satisfies ChatThreadLabels,
  conversationSidebar: {
    groups: '助手与会话', searchPlaceholder: '搜索助手和会话', clearSearch: '清空搜索', newGroup: '新建助手',
    newConversation: '新建会话', untitledConversation: '新会话', noGroups: '暂无助手', noConversations: '暂无会话',
    noResults: '没有匹配的助手或会话', renameConversation: '重命名会话', deleteConversation: '删除会话',
    showConversations: '展开会话', hideConversations: '收起会话', moveUp: '上移', moveDown: '下移',
  } satisfies ConversationSidebarLabels,
  composerToolbar: {
    open: '添加工具', customize: '自定义工具栏', close: '关闭', reset: '重置工具栏',
    moveUp: (name: string) => `上移 ${name}`, moveDown: (name: string) => `下移 ${name}`, actionFailed: '工具操作失败，请重试。',
  } satisfies ChatComposerToolbarLabels,
  toolCall: {
    pending: '准备中', running: '执行中', awaitingApproval: '等待审批', completed: '已完成', failed: '执行失败', rejected: '已拒绝', cancelled: '已取消',
    input: '输入参数', output: '执行结果', allow: '允许', reject: '拒绝', approvalDescription: '此工具需要你批准后才能执行。',
    approvalFailed: '审批提交失败，请重试。', approvalSubmitted: '审批已提交', showMore: '显示完整结果', showLess: '显示摘要', copy: '复制当前显示内容',
  } satisfies ToolCallCardLabels,
} as const;
