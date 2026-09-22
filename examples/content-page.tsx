import { ContentPage } from '@/components/asharca/content-page';
export default function ContentPageDemo() {
  return <ContentPage headingLevel={2} title="从源码开始" description="让组件适应项目，而不是相反。" className="max-w-sm"><p>先选择一个组件，在页面中查看真实交互，再把源码安装到自己的项目。</p><h3 className="font-medium">保留必要的内容</h3><ul><li>可阅读的实现与类型。</li><li>与预览一致的使用示例。</li><li>按需安装，不带入无关能力。</li></ul></ContentPage>;
}
