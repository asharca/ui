import { useId, useState } from "react";
import { RotateCcw, Save } from "lucide-react";
import {
  Button,
  ChoiceField,
  ChoiceGroup,
  Field,
  FieldDescription,
  FieldLabel,
  Input,
  Select,
} from "../../src/index";

const defaults = {
  name: "设计协作空间",
  email: "team@example.com",
  language: "zh-CN",
  notifications: true,
  delivery: "digest",
};

export function SettingsExample() {
  const id = useId();
  const [saved, setSaved] = useState(defaults);
  const [draft, setDraft] = useState(defaults);
  const [notice, setNotice] = useState("");
  const dirty = Object.keys(defaults).some(
    (key) =>
      draft[key as keyof typeof defaults] !==
      saved[key as keyof typeof defaults],
  );
  return (
    <div className="example-content example-settings">
      <header className="example-heading">
        <div>
          <p className="example-eyebrow">WORKSPACE / PREFERENCES</p>
          <h1>工作区偏好</h1>
          <p>设计协作空间</p>
        </div>
        <span className="example-demo-label">本地演示</span>
      </header>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          setSaved(draft);
          setNotice("演示设置已保存。");
        }}
        onChange={() => setNotice("")}
      >
        <section className="example-settings-section">
          <div>
            <h2>基本信息</h2>
            <p>工作区标识与联系信息</p>
          </div>
          <div className="example-fields">
            <Field>
              <FieldLabel htmlFor={`${id}-name`}>工作区名称</FieldLabel>
              <Input
                id={`${id}-name`}
                required
                maxLength={60}
                value={draft.name}
                onChange={(event) =>
                  setDraft({ ...draft, name: event.target.value })
                }
                aria-describedby={`${id}-help`}
              />
              <FieldDescription id={`${id}-help`}>
                显示在团队成员的工作区列表中。
              </FieldDescription>
            </Field>
            <Field>
              <FieldLabel htmlFor={`${id}-email`}>联系邮箱</FieldLabel>
              <Input
                id={`${id}-email`}
                type="email"
                required
                value={draft.email}
                onChange={(event) =>
                  setDraft({ ...draft, email: event.target.value })
                }
              />
            </Field>
            <Field>
              <FieldLabel htmlFor={`${id}-language`}>通知语言</FieldLabel>
              <Select
                id={`${id}-language`}
                value={draft.language}
                onChange={(event) =>
                  setDraft({ ...draft, language: event.target.value })
                }
              >
                <option value="zh-CN">简体中文</option>
                <option value="en">English</option>
                <option value="ja">日本語</option>
              </Select>
            </Field>
          </div>
        </section>
        <section className="example-settings-section">
          <div>
            <h2>通知偏好</h2>
            <p>重要更新与运行状态</p>
          </div>
          <div className="example-fields">
            <ChoiceField
              label="接收工作区通知"
              description="通过邮件接收项目更新和成员动态。"
              checked={draft.notifications}
              onChange={(event) =>
                setDraft({ ...draft, notifications: event.target.checked })
              }
            />
            <ChoiceGroup legend="通知频率" disabled={!draft.notifications}>
              <ChoiceField
                type="radio"
                name={`${id}-delivery`}
                value="digest"
                label="每日摘要"
                description="每天汇总一次，减少打扰。"
                checked={draft.delivery === "digest"}
                onChange={(event) =>
                  setDraft({ ...draft, delivery: event.target.value })
                }
              />
              <ChoiceField
                type="radio"
                name={`${id}-delivery`}
                value="instant"
                label="及时通知"
                description="重要状态变化时立即通知。"
                checked={draft.delivery === "instant"}
                onChange={(event) =>
                  setDraft({ ...draft, delivery: event.target.value })
                }
              />
            </ChoiceGroup>
          </div>
        </section>
        <footer className="example-form-footer">
          <p role="status">
            {notice || (dirty ? "有未保存的更改" : "所有更改已保存")}
          </p>
          <div className="example-actions">
            <Button
              variant="ghost"
              disabled={!dirty}
              onClick={() => {
                setDraft(saved);
                setNotice("已撤销未保存的更改");
              }}
            >
              <RotateCcw size={15} />
              撤销更改
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={!draft.name.trim()}
            >
              <Save size={15} />
              保存偏好
            </Button>
          </div>
        </footer>
      </form>
    </div>
  );
}
