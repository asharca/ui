import { Select } from '@/components/asharca/select';
export default function SelectDemo() {
  return <div className="w-full max-w-xs"><Select label="项目框架" name="framework" defaultValue="react" items={[
    { value: 'react', label: 'React + Vite' },
    { value: 'next', label: 'Next.js' },
    { value: 'other', label: '其他 React 项目' },
    { value: 'unavailable', label: '暂不可用', disabled: true },
  ]} /></div>;
}
