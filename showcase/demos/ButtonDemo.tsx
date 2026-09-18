import { useId, useState } from "react";
import {
  Button,
  Checkbox,
  Field,
  FieldLabel,
  Select,
  type ButtonVariant,
  type ControlSize,
} from "../../src/index";

const variants: ButtonVariant[] = ["primary", "secondary", "outline", "ghost", "danger", "danger-secondary"];
const sizes: ControlSize[] = ["sm", "md", "lg"];

export function ButtonDemo() {
  const id = useId();
  const [variant, setVariant] = useState<ButtonVariant>("primary");
  const [size, setSize] = useState<ControlSize>("md");
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [message, setMessage] = useState("点击按钮体验交互，或调整下方属性。");

  return (
    <div style={{ display: "grid", gap: 24, width: "100%" }}>
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: 80 }}>
        <Button
          variant={variant}
          size={size}
          loading={loading}
          loadingLabel="正在保存…"
          disabled={disabled}
          onClick={() => setMessage("已保存。这个本地演示没有调用业务接口。")}
        >
          保存更改
        </Button>
      </div>
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap", alignItems: "end" }}>
        <Field>
          <FieldLabel htmlFor={`${id}-variant`}>按钮变体</FieldLabel>
          <Select id={`${id}-variant`} value={variant} onChange={(event) => setVariant(event.target.value as ButtonVariant)}>
            {variants.map((value) => <option key={value} value={value}>{value}</option>)}
          </Select>
        </Field>
        <Field>
          <FieldLabel htmlFor={`${id}-size`}>按钮尺寸</FieldLabel>
          <Select id={`${id}-size`} value={size} onChange={(event) => setSize(event.target.value as ControlSize)}>
            {sizes.map((value) => <option key={value} value={value}>{value}</option>)}
          </Select>
        </Field>
        <label style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
          <Checkbox checked={loading} onChange={(event) => setLoading(event.target.checked)} />
          加载状态
        </label>
        <label style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
          <Checkbox checked={disabled} onChange={(event) => setDisabled(event.target.checked)} />
          禁用状态
        </label>
        <Button variant="ghost" size="sm" onClick={() => {
          setVariant("primary");
          setSize("md");
          setLoading(false);
          setDisabled(false);
          setMessage("已重置示例。");
        }}>重置</Button>
      </div>
      <p role="status" style={{ margin: 0, fontSize: 13 }}>{message}</p>
      <div style={{ display: "grid", gap: 12 }}>
        <strong style={{ fontSize: 13 }}>全部变体</strong>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {variants.map((value) => (
            <Button key={value} variant={value} size="sm" onClick={() => setVariant(value)}>{value}</Button>
          ))}
        </div>
      </div>
    </div>
  );
}
