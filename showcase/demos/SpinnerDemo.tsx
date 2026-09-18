import { Spinner, Button } from "../../src/index";
export function SpinnerDemo() {
  return <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 20 }}><Spinner label="正在加载项目" /><span style={{ display: "inline-flex", gap: 8 }}><Spinner /> 正在连接</span><Button loading loadingLabel="保存中…">保存</Button></div>;
}
