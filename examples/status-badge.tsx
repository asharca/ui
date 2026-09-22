import { StatusBadge } from '@/components/asharca/status-badge';
export default function StatusBadgeDemo() {
  return <div className="flex max-w-xs flex-wrap justify-center gap-4"><StatusBadge label="准备就绪" tone="success" /><StatusBadge label="等待检查" tone="warning" /><StatusBadge label="连接失败" tone="error" /><StatusBadge label="本地工作区" appearance="plain" /></div>;
}
