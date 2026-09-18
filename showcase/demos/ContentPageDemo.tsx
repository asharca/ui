import { ContentPage } from "../../src/index";
export function ContentPageDemo() {
  return <ContentPage title="项目说明"><p>这是一个由标题和正文组成的内容页。</p><h2>组件职责</h2><p>组件提供展示与交互；路由、权限和持久化由宿主应用负责。</p></ContentPage>;
}
