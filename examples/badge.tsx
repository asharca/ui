import { Badge } from '@/components/asharca/badge';
export default function BadgeDemo() {
  return <div className="flex max-w-xs flex-wrap items-center justify-center gap-3"><Badge>草稿</Badge><Badge tone="success">已发布</Badge><Badge tone="warning">等待确认</Badge><Badge tone="error">构建失败</Badge></div>;
}
