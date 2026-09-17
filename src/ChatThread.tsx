'use client';

import { createContext, lazy, Suspense, useContext, useMemo, useRef, useState, type ComponentType, type ReactNode } from 'react';
import {
  ActionBarPrimitive, AssistantRuntimeProvider, AttachmentPrimitive, ChainOfThoughtPrimitive,
  ComposerPrimitive, MessagePrimitive, ThreadPrimitive, useAuiState, useMessagePartText,
  type AssistantRuntime, type Attachment, type CompleteAttachment, type FileMessagePartProps,
  type ReasoningMessagePartProps, type TextMessagePartProps, type ToolCallMessagePartProps,
} from '@assistant-ui/react';
import { StreamdownTextPrimitive } from '@assistant-ui/react-streamdown';
import { code } from '@streamdown/code';
import { Popover } from 'radix-ui';
import remarkBreaks from 'remark-breaks';
import { defaultRemarkPlugins } from 'streamdown';
import { ArrowUp, Bot, Brain, Check, CheckCircle2, ChevronDown, ChevronLeft, ChevronRight, CircleAlert, CirclePause, Copy, Loader2, Maximize2, Minimize2, Paperclip, Pencil, Plus, RefreshCw, Split, UserRound, X } from 'lucide-react';
import { IconButton } from './Controls.js';
import { hasMermaidFence } from './chat-markdown.js';
import { ToolCallCard, type ToolCallState, type ToolPresentation } from './ToolCallCard.js';
export { ToolCallCard, inferToolKind, previewToolValue, toolCallCardDefaultLabels } from './ToolCallCard.js';
export type { ToolCallCardProps, ToolCallCardLabels, ToolCallState, ToolKind, ToolPresentation } from './ToolCallCard.js';

const MermaidAssistantText = lazy(() => import('./MermaidAssistantText.js'));
export type ChatBranchNavigation = { messageId: string; position: number; total: number; previousMessageId: string; nextMessageId: string };
export type ChatThreadLabels = {
  addAttachment: string; allowTool: string; attachment: string; attachmentsUnavailable: string;
  cancel: string; composerTools: string; conversationBranch: string; copy: string; edit: string;
  expandComposer: string; generatingReply: string; messagePlaceholder: string; next: string;
  openComposerTools: string; preparingReply: string; previous: string; processFailed: string;
  processed: string; processing: string; regenerate: string; rejectTool: string;
  removeAttachment: (name: string) => string; restoreComposer: string; save: string;
  scrollToLatestMessage: string; send: string; startBranch: string; startConversation: string;
  stop: string; thinking: string; thought: string; toolApprovalDescription: string;
  toolAwaitingApproval: string; toolCompleted: string; toolFailed: string; toolInput: string;
  toolKindMcp: string; toolKindSandbox: string; toolKindSkill: string; toolKindSubagent: string;
  toolKindTool: string; toolKindWeb: string; toolOutput: string; toolRunning: string;
  user: string; usingTool: (toolName: string) => string;
  toolRejected?: string; toolCancelled?: string; toolApprovalFailed?: string;
  toolApprovalSubmitted?: string; showToolResult?: string; collapseToolResult?: string;
  actionFailed?: string;
};
export const chatThreadDefaultLabels: ChatThreadLabels = {
  addAttachment: 'Add attachment', allowTool: 'Allow', attachment: 'Attachment', attachmentsUnavailable: 'Attachments are not available.',
  cancel: 'Cancel', composerTools: 'Composer tools', conversationBranch: 'Conversation branch', copy: 'Copy', edit: 'Edit',
  expandComposer: 'Expand composer', generatingReply: 'Generating reply', messagePlaceholder: 'Type a message', next: 'Next',
  openComposerTools: 'Open tools', preparingReply: 'Preparing', previous: 'Previous', processFailed: 'Process failed',
  processed: 'Processed', processing: 'Processing', regenerate: 'Regenerate', rejectTool: 'Reject',
  removeAttachment: (name) => `Remove ${name}`, restoreComposer: 'Restore composer', save: 'Save',
  scrollToLatestMessage: 'Scroll to latest message', send: 'Send', startBranch: 'Start a new branch', startConversation: 'Start a conversation',
  stop: 'Stop', thinking: 'Thinking', thought: 'Thought', toolApprovalDescription: 'This tool needs your approval before it can run.',
  toolAwaitingApproval: 'Awaiting approval', toolCompleted: 'Completed', toolFailed: 'Failed', toolInput: 'Input',
  toolKindMcp: 'MCP', toolKindSandbox: 'Sandbox', toolKindSkill: 'Skill', toolKindSubagent: 'Sub-agent', toolKindTool: 'Tool', toolKindWeb: 'Web',
  toolOutput: 'Output', toolRunning: 'Running', user: 'You', usingTool: (name) => `Using ${name}`,
  toolRejected: 'Rejected', toolCancelled: 'Cancelled', toolApprovalFailed: 'Approval failed. Please retry.',
  toolApprovalSubmitted: 'Approval submitted', showToolResult: 'Show full result', collapseToolResult: 'Show preview', actionFailed: 'The action failed. Please retry.',
};
export type ChatThreadComponents = {
  AssistantText?: ComponentType<TextMessagePartProps>;
  AssistantMessageBefore?: ComponentType<{ messageId: string }>;
  AssistantMessageAfter?: ComponentType<{ messageId: string }>;
  AssistantActions?: ComponentType<{ messageId: string }>;
  SentAttachment?: ComponentType<{ attachment: CompleteAttachment }>;
  ToolCall?: ComponentType<ToolCallMessagePartProps>;
  Reasoning?: ComponentType<ReasoningMessagePartProps>;
};
export type ChatThreadProps = {
  runtime: AssistantRuntime; assistantName: string;
  allowAttachments?: boolean; allowEdit?: boolean; allowRegenerate?: boolean;
  branchNavigation?: readonly ChatBranchNavigation[]; busy?: boolean; className?: string;
  components?: ChatThreadComponents; composerEnd?: ReactNode; composerStatus?: ReactNode;
  composerTools?: ReactNode; showAttachmentPicker?: boolean; disabled?: boolean;
  emptyState?: ReactNode; error?: ReactNode; labels?: Partial<ChatThreadLabels>;
  onBranchSelect?: (messageId: string) => void | Promise<void>;
  onBranchStart?: (messageId: string) => void | Promise<void>;
  onRegenerateMessage?: (messageId: string) => void | Promise<void>;
  transformUserText?: (text: string) => string;
  getToolPresentation?: (toolName: string) => ToolPresentation | undefined;
  toolResultPreviewChars?: number;
  onActionError?: (error: unknown) => void;
};
const LabelsContext = createContext(chatThreadDefaultLabels);
const UserTextTransformContext = createContext<(text: string) => string>((text) => text);
const PartsContext = createContext<Pick<ChatThreadProps, 'components' | 'getToolPresentation' | 'toolResultPreviewChars'>>({});
const ActionErrorContext = createContext<(error: unknown) => void>(() => {});
const markdownPlugins = { code };
const markdownRemarkPlugins = [...Object.values(defaultRemarkPlugins), remarkBreaks];
const cx = (...classes: Array<string | false | null | undefined>) => classes.filter(Boolean).join(' ');
const useLabels = () => useContext(LabelsContext);

function UserText({ text }: TextMessagePartProps) {
  const transform = useContext(UserTextTransformContext);
  return <span className="block whitespace-pre-wrap [&:not(:last-child)]:mb-2">{transform(text)}</span>;
}
function PlainAssistantText() {
  return <StreamdownTextPrimitive plugins={markdownPlugins} remarkPlugins={markdownRemarkPlugins}
    linkSafety={{ enabled: true }} security={{ allowedProtocols: ['http', 'https', 'mailto'], allowDataImages: false }}
    className="ui-chat-prose space-y-2 [&_li]:my-0.5 [&_ol]:my-1 [&_ol]:list-decimal [&_ol]:pl-5 [&_p]:my-1 [&_pre]:my-2 [&_ul]:my-1 [&_ul]:list-disc [&_ul]:pl-5" />;
}
function AssistantText() {
  const { text } = useMessagePartText();
  return hasMermaidFence(text) ? <Suspense fallback={<PlainAssistantText />}><MermaidAssistantText /></Suspense> : <PlainAssistantText />;
}
function ReasoningPart({ text, status }: ReasoningMessagePartProps) {
  const labels = useLabels();
  const [manualOpen, setManualOpen] = useState<boolean | undefined>();
  if (!text.trim()) return null;
  const running = status.type === 'running';
  const open = manualOpen ?? running;
  return <details open={open} className="group/reasoning rounded-md" onToggle={(event) => { if (event.currentTarget.open !== open) setManualOpen(event.currentTarget.open); }}>
    <summary className="flex min-h-8 cursor-pointer list-none items-center gap-2 rounded-md px-1 text-muted-foreground marker:content-none hover:bg-muted/50">
      {running ? <Loader2 aria-hidden="true" className="size-3.5 animate-spin" /> : <CheckCircle2 aria-hidden="true" className="size-3.5" />}
      <Brain aria-hidden="true" className="size-3.5" /><span>{running ? labels.thinking : labels.thought}</span><ChevronRight aria-hidden="true" className="ml-auto size-3.5 group-open/reasoning:rotate-90" />
    </summary>
    {open && <pre className="ml-5 max-h-48 overflow-auto whitespace-pre-wrap break-words rounded-md bg-muted/30 p-2 text-xs leading-relaxed text-muted-foreground">{text}</pre>}
  </details>;
}
function FilePart({ data, filename }: FileMessagePartProps) {
  const labels = useLabels();
  return <a href={data} download={filename} className="my-1 inline-flex max-w-full items-center gap-2 rounded-md border border-current/20 px-2 py-1 text-xs underline-offset-2 hover:underline"><Paperclip aria-hidden="true" className="size-3.5 shrink-0" /><span className="truncate">{filename || labels.attachment}</span></a>;
}
export function resolveToolCallState({ status, isError, approval }: Pick<ToolCallMessagePartProps, 'status' | 'isError' | 'approval'>): ToolCallState {
  if (approval && approval.approved === undefined && !approval.resolution) return 'awaiting-approval';
  if (approval?.approved === false) return 'rejected';
  if (isError) return 'failed';
  const reason = (status as { type: string; reason?: string }).reason;
  if (reason === 'cancelled' || reason === 'canceled') return 'cancelled';
  if (reason === 'error') return 'failed';
  if (status.type === 'running') return 'running';
  return status.type === 'complete' ? 'completed' : 'pending';
}
function ToolPart(props: ToolCallMessagePartProps) {
  const labels = useLabels();
  const { getToolPresentation, toolResultPreviewChars } = useContext(PartsContext);
  const alias = /^(?:mcp__)?tp_\d+_[A-Za-z0-9_-]+__(.+)$/.exec(props.toolName)?.[1];
  const presentation = getToolPresentation?.(props.toolName);
  return <ToolCallCard name={props.toolName} state={resolveToolCallState(props)} input={props.argsText?.trim() || props.args}
    output={props.result} presentation={{ label: alias ?? props.toolName, ...presentation }} previewChars={toolResultPreviewChars}
    onApprove={(approved) => props.respondToApproval({ approved })}
    labels={{ pending: labels.preparingReply, running: labels.toolRunning, awaitingApproval: labels.toolAwaitingApproval,
      completed: labels.toolCompleted, failed: labels.toolFailed, rejected: labels.toolRejected ?? 'Rejected', cancelled: labels.toolCancelled ?? 'Cancelled',
      input: labels.toolInput, output: labels.toolOutput, allow: labels.allowTool, reject: labels.rejectTool,
      approvalDescription: labels.toolApprovalDescription, approvalFailed: labels.toolApprovalFailed ?? 'Approval failed. Please retry.',
      approvalSubmitted: labels.toolApprovalSubmitted ?? 'Approval submitted', showMore: labels.showToolResult ?? 'Show full result', showLess: labels.collapseToolResult ?? 'Show preview', copy: labels.copy }} />;
}
function AssistantProcess() {
  const labels = useLabels();
  const { components } = useContext(PartsContext);
  const running = useAuiState((state) => state.chainOfThought.status.type === 'running');
  const hasContent = useAuiState((state) => state.chainOfThought.parts.some((part) => part.type === 'tool-call' || (part.type === 'reasoning' && Boolean(part.text.trim()))));
  const failed = useAuiState((state) => state.chainOfThought.parts.some((part) => part.type === 'tool-call' && part.isError));
  const awaiting = useAuiState((state) => state.chainOfThought.parts.some((part) => {
    if (part.type !== 'tool-call' || !('approval' in part)) return false;
    const approval = part.approval as { approved?: boolean; resolution?: unknown } | undefined;
    return Boolean(approval && approval.approved === undefined && !approval.resolution);
  }));
  const [manualOpen, setManualOpen] = useState<boolean | undefined>();
  if (!hasContent) return null;
  const open = manualOpen ?? (running || failed || awaiting);
  return <ChainOfThoughtPrimitive.Root asChild>
    <details open={open} data-ui="assistant-process" className="group/process my-1.5 text-xs" onToggle={(event) => { if (event.currentTarget.open !== open) setManualOpen(event.currentTarget.open); }}>
      <summary className="flex min-h-8 cursor-pointer list-none items-center gap-2 rounded-md px-1 text-muted-foreground marker:content-none hover:bg-muted/50">
        <ChevronRight aria-hidden="true" className="size-3.5 group-open/process:rotate-90" />
        {running ? <Loader2 aria-hidden="true" className="size-3.5 animate-spin" /> : failed ? <CircleAlert aria-hidden="true" className="size-3.5 text-destructive-text" /> : <CheckCircle2 aria-hidden="true" className="size-3.5" />}
        <span className="font-medium text-foreground">{awaiting ? labels.toolAwaitingApproval : running ? labels.processing : failed ? labels.processFailed : labels.processed}</span>
      </summary>
      <div className="py-1"><ChainOfThoughtPrimitive.Parts components={{ Reasoning: components?.Reasoning ?? ReasoningPart, tools: { Fallback: components?.ToolCall ?? ToolPart } }} /></div>
    </details>
  </ChainOfThoughtPrimitive.Root>;
}
function AssistantPendingPart() {
  const running = useAuiState((state) => state.message.status?.type === 'running');
  const labels = useLabels();
  return running ? <div role="status" aria-label={labels.generatingReply} data-ui="conversation-pending" className="flex items-center gap-2 py-1 text-sm text-muted-foreground"><Loader2 aria-hidden="true" className="size-3.5 animate-spin" /><span>{labels.generatingReply}</span></div> : null;
}
function attachmentUrl(attachment: Attachment) {
  const part = attachment.content?.find((item) => item.type === 'file' || item.type === 'image');
  return part?.type === 'file' ? part.data : part?.type === 'image' ? part.image : null;
}
function SentAttachment({ attachment }: { attachment: CompleteAttachment }) {
  const url = attachmentUrl(attachment);
  return <AttachmentPrimitive.Root className="my-1 inline-flex h-8 max-w-full items-center gap-2 rounded-md border border-current/20 px-2 text-xs">
    <Paperclip aria-hidden="true" className="size-3.5 shrink-0" />{url ? <a href={url} download={attachment.name} className="min-w-0 truncate underline-offset-2 hover:underline"><AttachmentPrimitive.Name /></a> : <span className="min-w-0 truncate"><AttachmentPrimitive.Name /></span>}
  </AttachmentPrimitive.Root>;
}
function ComposerAttachment({ attachment }: { attachment: Attachment }) {
  const labels = useLabels();
  return <AttachmentPrimitive.Root className="my-0.5 inline-flex min-h-7 max-w-full items-center gap-1 overflow-hidden rounded-md border border-border bg-muted/50 px-1.5 text-xs text-foreground">
    <AttachmentPrimitive.unstable_Thumb className="flex size-5 shrink-0 items-center justify-center rounded bg-background text-[10px] uppercase text-muted-foreground" />
    <span className="max-w-48 truncate"><AttachmentPrimitive.Name /></span>
    {attachment.status.type === 'running' && <span className="text-muted-foreground">{Math.max(0, Math.min(100, Math.round(attachment.status.progress * 100)))}%</span>}
    <AttachmentPrimitive.Remove aria-label={labels.removeAttachment(attachment.name)} title={labels.removeAttachment(attachment.name)} className="flex size-6 shrink-0 items-center justify-center rounded text-muted-foreground hover:bg-muted hover:text-foreground"><X aria-hidden="true" className="size-3.5" /></AttachmentPrimitive.Remove>
  </AttachmentPrimitive.Root>;
}
function AttachmentPicker({ disabled, enabled }: { disabled: boolean; enabled: boolean }) {
  const labels = useLabels();
  return <Popover.Root><Popover.Trigger asChild><IconButton icon={<Plus className="size-[18px]" />} label={labels.openComposerTools} size="sm" variant="ghost" disabled={disabled} className="size-[30px] min-h-[30px] shrink-0 rounded-full" /></Popover.Trigger>
    <Popover.Portal><Popover.Content side="top" align="start" sideOffset={8} collisionPadding={12} aria-label={labels.composerTools} data-toolplane-ui="popover-content" className="z-50 w-64 rounded-xl border border-border bg-popover p-1 text-popover-foreground shadow-xl">
      <Popover.Close asChild><ComposerPrimitive.AddAttachment multiple disabled={!enabled || disabled} className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-sm hover:bg-muted disabled:cursor-not-allowed disabled:opacity-60">
        <Paperclip aria-hidden="true" className="size-4 shrink-0" /><span className="min-w-0"><span className="block">{labels.addAttachment}</span>{!enabled && <span className="mt-0.5 block text-xs text-muted-foreground">{labels.attachmentsUnavailable}</span>}</span>
      </ComposerPrimitive.AddAttachment></Popover.Close>
    </Popover.Content></Popover.Portal>
  </Popover.Root>;
}
function useMessageAction() {
  const onError = useContext(ActionErrorContext);
  return (action: (() => void | Promise<void>) | undefined) => { if (action) void Promise.resolve().then(action).catch(onError); };
}
function BranchNavigator({ branch, disabled, onSelect }: { branch?: ChatBranchNavigation; disabled: boolean; onSelect?: ChatThreadProps['onBranchSelect'] }) {
  const labels = useLabels();
  const run = useMessageAction();
  if (!branch || !onSelect) return null;
  return <div role="group" aria-label={labels.conversationBranch} className="inline-flex h-8 items-center gap-0.5 text-xs tabular-nums text-muted-foreground">
    <IconButton icon={<ChevronLeft className="size-3" />} label={labels.previous} size="sm" variant="ghost" disabled={disabled || branch.total < 2 || !branch.previousMessageId} onClick={() => run(() => onSelect(branch.previousMessageId))} />
    <span className="min-w-8 text-center font-mono">{branch.position}/{branch.total}</span>
    <IconButton icon={<ChevronRight className="size-3" />} label={labels.next} size="sm" variant="ghost" disabled={disabled || branch.total < 2 || !branch.nextMessageId} onClick={() => run(() => onSelect(branch.nextMessageId))} />
  </div>;
}
const actionClass = 'flex size-[26px] items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground disabled:opacity-40';
type MessageOptions = { messageId: string; branch?: ChatBranchNavigation; busy: boolean; components?: ChatThreadComponents; onBranchSelect?: ChatThreadProps['onBranchSelect'] };
function UserMessage({ allowEdit, branch, busy, components, messageId, onBranchSelect }: MessageOptions & { allowEdit: boolean }) {
  const labels = useLabels();
  const SentAttachmentComponent = components?.SentAttachment ?? SentAttachment;
  return <MessagePrimitive.Root asChild><article id={`chat-message-${messageId}`} className="flex flex-col items-end rounded-lg pt-3">
    <ComposerPrimitive.If editing={false}>
      <div className="flex max-w-full items-start justify-end gap-2.5">
        <div className="min-w-0 max-w-[calc(100%_-_2.5rem)] break-words rounded-xl bg-muted px-4 py-2.5 text-sm leading-relaxed text-foreground">
          <MessagePrimitive.Parts components={{ Text: UserText }} /><MessagePrimitive.Attachments>{({ attachment }) => <SentAttachmentComponent attachment={attachment} />}</MessagePrimitive.Attachments>
        </div>
        <div aria-label={labels.user} className="flex size-[30px] shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground"><UserRound aria-hidden="true" className="size-4" /></div>
      </div>
      <div className="mr-10 flex min-h-[26px] items-center justify-end gap-1">
        <BranchNavigator branch={branch} disabled={busy} onSelect={onBranchSelect} />
        <ActionBarPrimitive.Root autohide="always" className="flex h-[26px] items-center gap-0.5">
          {allowEdit && <ActionBarPrimitive.Edit disabled={busy} aria-label={labels.edit} title={labels.edit} className={actionClass}><Pencil aria-hidden="true" className="size-3.5" /></ActionBarPrimitive.Edit>}
          <ActionBarPrimitive.Copy aria-label={labels.copy} title={labels.copy} className={actionClass}><Copy aria-hidden="true" className="size-3.5" /></ActionBarPrimitive.Copy>
        </ActionBarPrimitive.Root>
      </div>
    </ComposerPrimitive.If>
    <ComposerPrimitive.If editing><ComposerPrimitive.Root className="mr-10 w-[min(36rem,calc(100%_-_2.5rem))] rounded-xl bg-muted p-2">
      <ComposerPrimitive.Input aria-label={labels.messagePlaceholder} autoFocus rows={2} submitMode="enter" disabled={busy} className="max-h-48 min-h-14 w-full resize-none bg-transparent px-2 py-1 text-sm leading-6 outline-none" />
      <div className="mt-1 flex justify-end gap-1"><ComposerPrimitive.Cancel aria-label={labels.cancel} title={labels.cancel} className={actionClass}><X aria-hidden="true" className="size-4" /></ComposerPrimitive.Cancel><ComposerPrimitive.Send disabled={busy} aria-label={labels.save} title={labels.save} className={actionClass}><Check aria-hidden="true" className="size-4" /></ComposerPrimitive.Send></div>
    </ComposerPrimitive.Root></ComposerPrimitive.If>
  </article></MessagePrimitive.Root>;
}
function AssistantMessage({ assistantName, allowRegenerate, branch, busy, components, messageId, onBranchSelect, onBranchStart, onRegenerateMessage }: MessageOptions & { assistantName: string; allowRegenerate: boolean; onBranchStart?: ChatThreadProps['onBranchStart']; onRegenerateMessage?: ChatThreadProps['onRegenerateMessage'] }) {
  const labels = useLabels();
  const run = useMessageAction();
  const Text = components?.AssistantText ?? AssistantText;
  const Before = components?.AssistantMessageBefore; const After = components?.AssistantMessageAfter; const Actions = components?.AssistantActions;
  return <MessagePrimitive.Root asChild><article id={`chat-message-${messageId}`} data-ui="assistant-reply" className="group/message flex items-start gap-2.5 rounded-lg pt-3">
    <div className="flex size-[30px] shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground"><Bot aria-hidden="true" className="size-4" /></div>
    <div className="min-w-0 max-w-[calc(100%_-_2.5rem)] flex-1">
      <div className="text-sm font-semibold leading-5 text-foreground">{assistantName}</div>
      <div className="ui-chat-prose mt-2 min-w-0 break-words text-sm leading-relaxed text-foreground">
        {Before && <Before messageId={messageId} />}<MessagePrimitive.Parts components={{ Text, File: FilePart, ChainOfThought: AssistantProcess, Empty: AssistantPendingPart }} />{After && <After messageId={messageId} />}
      </div>
      <div className="mt-1 flex min-h-[26px] items-center gap-1">
        <BranchNavigator branch={branch} disabled={busy} onSelect={onBranchSelect} />
        <ActionBarPrimitive.Root hideWhenRunning autohide="not-last" className="flex h-[26px] items-center gap-0.5">
          {onBranchStart && <button type="button" disabled={busy} aria-label={labels.startBranch} title={labels.startBranch} onClick={() => run(() => onBranchStart(messageId))} className={actionClass}><Split aria-hidden="true" className="size-3.5" /></button>}
          <ActionBarPrimitive.Copy aria-label={labels.copy} title={labels.copy} className={actionClass}><Copy aria-hidden="true" className="size-3.5" /></ActionBarPrimitive.Copy>
          {Actions && <Actions messageId={messageId} />}
          {allowRegenerate && (onRegenerateMessage ? <button type="button" disabled={busy} aria-label={labels.regenerate} title={labels.regenerate} onClick={() => run(() => onRegenerateMessage(messageId))} className={actionClass}><RefreshCw aria-hidden="true" className="size-3.5" /></button> : <ActionBarPrimitive.Reload disabled={busy} aria-label={labels.regenerate} title={labels.regenerate} className={actionClass}><RefreshCw aria-hidden="true" className="size-3.5" /></ActionBarPrimitive.Reload>)}
        </ActionBarPrimitive.Root>
      </div>
    </div>
  </article></MessagePrimitive.Root>;
}
function ChatThreadContent({ assistantName, allowAttachments = false, allowEdit = false, allowRegenerate = true, branchNavigation = [], busy = false, disabled = false, className, composerEnd, composerStatus, composerTools, showAttachmentPicker = true, components, emptyState, error, onBranchSelect, onBranchStart, onRegenerateMessage }: Omit<ChatThreadProps, 'runtime' | 'labels'>) {
  const labels = useLabels();
  const [composerRows, setComposerRows] = useState(2);
  const input = useRef<HTMLTextAreaElement>(null);
  const uploading = useAuiState((state) => state.composer.attachments.some((attachment) => attachment.status.type === 'running'));
  const branchById = useMemo(() => new Map(branchNavigation.map((branch) => [branch.messageId, branch])), [branchNavigation]);
  const expanded = composerRows > 2;
  const blocked = disabled || busy;
  function toggleComposer() {
    setComposerRows(expanded ? 2 : Math.ceil((Math.max(220, window.innerHeight * .5) - 6) / (14 * 1.4)));
    input.current?.focus();
  }
  return <ThreadPrimitive.Root data-chat-ui="chat-thread" className={cx('flex min-h-0 flex-1 flex-col', className)}>
    <ThreadPrimitive.Viewport className="relative flex min-h-0 flex-1 flex-col overflow-y-auto bg-background">
      <div className="flex-1 py-1.5">
        <ThreadPrimitive.Empty><div className="flex min-h-full items-center justify-center px-6 pb-24">{emptyState ?? <div className="max-w-md text-center"><div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground"><Bot aria-hidden="true" className="size-6" /></div><h3 className="text-lg font-medium text-foreground">{labels.startConversation}</h3></div>}</div></ThreadPrimitive.Empty>
        <div className="ui-chat-content-width flex flex-col gap-0"><ThreadPrimitive.Messages>{({ message }) => message.role === 'user'
          ? <UserMessage messageId={message.id} branch={branchById.get(message.id)} busy={blocked} components={components} onBranchSelect={onBranchSelect} allowEdit={allowEdit} />
          : <AssistantMessage messageId={message.id} branch={branchById.get(message.id)} busy={blocked} components={components} onBranchSelect={onBranchSelect} assistantName={assistantName} allowRegenerate={allowRegenerate} onBranchStart={onBranchStart} onRegenerateMessage={onRegenerateMessage} />}</ThreadPrimitive.Messages></div>
      </div>
      <ThreadPrimitive.ScrollToBottom aria-label={labels.scrollToLatestMessage} title={labels.scrollToLatestMessage} className="sticky bottom-3 z-10 mx-auto mb-3 flex size-9 shrink-0 items-center justify-center rounded-full border border-border bg-card text-muted-foreground hover:text-foreground disabled:invisible"><ChevronDown aria-hidden="true" className="size-4" /></ThreadPrimitive.ScrollToBottom>
    </ThreadPrimitive.Viewport>
    <div className="shrink-0 bg-background pb-3"><div className="ui-chat-content-width">
      {error && <div role="alert" className="mb-2 rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive-text">{error}</div>}
      <ComposerPrimitive.Root data-ui="chat.composer" className="group/composer relative rounded-[20px] border border-border bg-card pt-2 shadow-sm transition-colors hover:border-foreground/25 focus-within:border-foreground/25">
        <ComposerPrimitive.AttachmentDropzone asChild><div className="contents">
          <button type="button" disabled={disabled} onClick={toggleComposer} aria-label={expanded ? labels.restoreComposer : labels.expandComposer} title={expanded ? labels.restoreComposer : labels.expandComposer} aria-pressed={expanded} className="absolute right-2 top-2 flex size-7 items-center justify-center rounded-full text-muted-foreground hover:bg-muted">{expanded ? <Minimize2 aria-hidden="true" className="size-3.5" /> : <Maximize2 aria-hidden="true" className="size-3.5" />}</button>
          <div className="flex flex-wrap gap-1.5 px-[15px] empty:hidden"><ComposerPrimitive.Attachments>{({ attachment }) => <ComposerAttachment attachment={attachment} />}</ComposerPrimitive.Attachments></div>
          <ComposerPrimitive.Input ref={input} aria-label={labels.messagePlaceholder} placeholder={labels.messagePlaceholder} disabled={blocked} rows={2} minRows={composerRows} submitMode="enter"
            className={cx('block min-h-[46px] w-full resize-none overflow-y-auto bg-transparent pb-0 pl-[15px] pr-11 pt-1.5 text-sm leading-[1.4] text-foreground outline-none placeholder:text-muted-foreground disabled:opacity-60', expanded ? 'max-h-[max(220px,50vh)]' : 'max-h-[max(220px,40vh)]')} />
          <div className="ui-chat-composer-footer"><div className="ui-chat-composer-tools">{showAttachmentPicker && <AttachmentPicker disabled={blocked} enabled={allowAttachments} />}{composerTools}{composerStatus && <div className="min-w-0 text-xs text-muted-foreground">{composerStatus}</div>}</div>
            <div className="ui-chat-composer-actions">{composerEnd}
              <ThreadPrimitive.If running={false}><ComposerPrimitive.Send disabled={blocked || uploading} aria-label={labels.send} title={uploading ? labels.processing : labels.send} className="flex size-[30px] shrink-0 items-center justify-center rounded-full bg-brand text-brand-foreground hover:bg-brand/85 disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground/50"><ArrowUp aria-hidden="true" className="size-[17px]" strokeWidth={2.5} /></ComposerPrimitive.Send></ThreadPrimitive.If>
              <ThreadPrimitive.If running><ComposerPrimitive.Cancel aria-label={labels.stop} title={labels.stop} className="flex size-[30px] shrink-0 items-center justify-center rounded-full text-destructive-text hover:bg-muted"><CirclePause aria-hidden="true" className="size-5" /></ComposerPrimitive.Cancel></ThreadPrimitive.If>
            </div>
          </div>
        </div></ComposerPrimitive.AttachmentDropzone>
      </ComposerPrimitive.Root>
    </div></div>
  </ThreadPrimitive.Root>;
}
const identity = (text: string) => text;
export function ChatThread({ runtime, labels: overrides, transformUserText = identity, components, getToolPresentation, toolResultPreviewChars = 6000, onActionError, error, ...props }: ChatThreadProps) {
  const labels = useMemo(() => ({ ...chatThreadDefaultLabels, ...overrides }), [overrides]);
  const parts = useMemo(() => ({ components, getToolPresentation, toolResultPreviewChars }), [components, getToolPresentation, toolResultPreviewChars]);
  const [actionFailed, setActionFailed] = useState(false);
  const reportError = (cause: unknown) => { setActionFailed(true); onActionError?.(cause); };
  return <LabelsContext.Provider value={labels}><UserTextTransformContext.Provider value={transformUserText}><PartsContext.Provider value={parts}><ActionErrorContext.Provider value={reportError}>
    <AssistantRuntimeProvider runtime={runtime}><ChatThreadContent {...props} components={components} error={error ?? (actionFailed ? labels.actionFailed : null)} /></AssistantRuntimeProvider>
  </ActionErrorContext.Provider></PartsContext.Provider></UserTextTransformContext.Provider></LabelsContext.Provider>;
}
