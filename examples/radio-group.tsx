import { RadioGroup } from '@/components/asharca/radio-group';
export default function RadioGroupDemo() {
  return <RadioGroup className="w-full max-w-xs" name="environment" label="部署环境" defaultValue="preview" options={[
    { value: 'preview', label: '预览环境', description: '验证更改，不影响现有用户。' },
    { value: 'production', label: '生产环境', description: '通过检查后再正式发布。' },
    { value: 'restricted', label: '受限环境', disabled: true },
  ]} />;
}
