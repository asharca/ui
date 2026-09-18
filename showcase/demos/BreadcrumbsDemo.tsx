import { BreadcrumbItem, Breadcrumbs } from "../../src/index";
export function BreadcrumbsDemo() {
  return <Breadcrumbs aria-label="当前位置"><BreadcrumbItem><a href="#/installation">文档</a></BreadcrumbItem><BreadcrumbItem separator="/"><a href="#/components/button">组件</a></BreadcrumbItem><BreadcrumbItem current separator="/">导航示例</BreadcrumbItem></Breadcrumbs>;
}
