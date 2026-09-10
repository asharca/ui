import { useState } from "react";
import * as UI from "../../src/index";

export function SearchDemo() {
  const [value, setValue] = useState("");
  return (
    <UI.SearchInput
      label="搜索"
      placeholder="搜索组件…"
      value={value}
      onChange={(event) => setValue(event.target.value)}
      onClear={() => setValue("")}
    />
  );
}

