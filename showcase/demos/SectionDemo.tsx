import { useState } from "react";
import { Button, Entity, Section } from "../../src/index";
export function SectionDemo() {
  const [members, setMembers] = useState(["设计团队", "开发团队"]);
  return <Section title="团队成员" count={members.length} actions={<Button size="sm" onClick={() => setMembers([...members, `成员 ${members.length + 1}`])}>添加</Button>}><div style={{ display: "grid", gap: 16 }}>{members.map((member) => <Entity key={member} title={member} initials={member.slice(0, 2)} description="工作区成员" />)}</div></Section>;
}
