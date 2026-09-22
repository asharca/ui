'use client';
import { useState } from 'react';
import { Heart, Plus, Settings } from 'lucide-react';
import { IconButton } from '@/components/asharca/icon-button';
export default function IconButtonDemo() {
  const [liked, setLiked] = useState(false);
  return <div className="flex items-center gap-3"><IconButton label={liked ? '取消收藏' : '收藏'} aria-pressed={liked} icon={<Heart className={liked ? 'fill-current' : ''} />} onClick={() => setLiked(!liked)} /><IconButton label="正在添加" icon={<Plus />} loading /><IconButton label="设置不可用" icon={<Settings />} disabled /></div>;
}
