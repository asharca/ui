import { Avatar, AvatarImage, AvatarFallback } from '@/components/asharca/avatar';
export default function AvatarDemo() {
  return <div className="flex items-center gap-4"><Avatar className="size-7" aria-label="设计组"><AvatarFallback>设</AvatarFallback></Avatar><Avatar aria-label="开发组"><AvatarImage src="data:image/png;base64,invalid" alt="开发组头像" /><AvatarFallback>开</AvatarFallback></Avatar><Avatar className="size-12" aria-label="Asharca"><AvatarFallback>AS</AvatarFallback></Avatar><Avatar className="size-14 rounded-2xl" aria-label="工作区"><AvatarFallback>UI</AvatarFallback></Avatar></div>;
}
