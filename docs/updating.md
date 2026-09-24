# 更新组件

保留你的定制，按差异引入上游改进。Asharca UI 分发的是项目里的组件源码；官网更新不会自动改写已经安装的文件。

**默认流程：保存现场 → 检查全部关联文件 → 选择性合并 → 验证 → 提交。** 不要把重新初始化、切换预设或强制覆盖当作常规更新。

## 更新对象与当前边界 <!-- model -->

| 更新对象 | 正确的处理方式 |
| --- | --- |
| 组件源码，包括外观、布局和写在源码中的动画 | 从原 Registry 查看差异，再决定覆盖还是合并。 |
| Motion、Radix 等 npm 依赖 | 审查版本要求后，用业务项目的包管理器升级并测试；不会自动带入组件源码的修改。 |
| shadcn CLI | 命令中的 `shadcn@latest` 选择 CLI 版本，不是 Asharca 组件版本。 |

当前提供的是随站点部署更新的 HTTP Registry，不发布组件 npm 包，也没有提供不可变的版本化 Registry 快照或自动三方合并器。GitHub 合并完成不等于公开安装源已经部署。安装在本地的源码、项目 Git 历史及锁文件才是你的可回退基线。

旧 `@asharca/ui` npm 包的 API 迁移与当前源码更新是两件事。本指南针对已安装的源码版，不承诺旧包直接兼容。

## 1. 保存现场，确认项目 <!-- prepare -->

在**使用组件的业务项目目录**执行，而不是 UI 库仓库。确认这里有现有的 `components.json`、`package.json` 和锁文件；Monorepo 应进入配置所在的应用或共享 UI 包，按实际别名定位文件。

```bash
git status --short
```

先提交或另行备份现有工作；不要把其他人的未提交修改混入更新。工作区确认干净后，再建立更新分支并记录当前提交 SHA：

```bash
git switch -c chore/update-asharca-ui
git rev-parse HEAD
```

已有配置不需要再次运行 `shadcn init`。不要为了更新组件重置主题、切换预设或迁移 Radix / Base UI。以下示例使用当前选择的包管理器；使用 Yarn 时，`yarn dlx` 需要现代 Yarn，Yarn Classic 可用 `npx` 运行 CLI。

## 2. 检查来源、文件和依赖 <!-- inspect -->

先检查本次安装条目会影响哪些文件，再逐一看差异和待安装内容。`--dry-run`、`--diff`、`--view` 不写入项目文件；仍需要访问 Registry，运行 CLI 时也可能下载工具或写入工具缓存。

```bash
{{RUNNER}} add {{BUTTON_URL}} --dry-run
{{RUNNER}} add {{BUTTON_URL}} --diff button.tsx
{{RUNNER}} add {{BUTTON_URL}} --diff utils.ts
{{RUNNER}} add {{BUTTON_URL}} --view button.tsx
```

文件名以 `--dry-run` 的实际输出为准；遇到重名文件时，使用输出中的完整路径。`--diff button.tsx` 只是限定查看差异的文件，**不是把后续安装限制为只更新 Button**。

每个 Asharca 条目包含完整的本地依赖闭包：Button 会带上 `utils.ts`；WorkspaceShell 还包含侧栏、标签栏及其关联组件。公共文件的修改会影响所有引用它的组件。必须审查全部受影响文件，以及 `package.json`、锁文件中的依赖变化，不能只检查入口组件。

安装位置由 `components.json` 的 `aliases.components` 解析，源码放在其下的 `asharca` 目录。不要将 `@components/` 当作字面目录，也不要照搬别人项目的 `@/` 别名。使用 CLI 转换后的路径与源码进行比较，不直接拿 GitHub 原始文件覆盖本地文件。

### 已配置命名空间时

完整 URL 不要求配置命名空间。需要简写时，只把下面字段合并到已有 `components.json`，保留其他字段和已有 Registry：

```json
{
  "registries": {
    "@asharca": "{{REGISTRY_PATTERN}}"
  }
}
```

配置后可以使用：

```bash
{{RUNNER}} add @asharca/button --dry-run
{{RUNNER}} add @asharca/button --diff button.tsx
```

不要省略来源写成 `add button`，那不等于更新 Asharca 的 Button。也不要将 `--all` 理解为只更新你已经安装的 Asharca 组件。

## 3. 没有本地修改：确认后覆盖 <!-- unchanged -->

只有确认**整个安装条目的受影响文件都没有需要保留的修改**，才适合覆盖。可通过安装时的 Git 提交核对本地历史；仅凭当前差异无法可靠区分哪些变化来自上游、哪些来自自己的定制。

下面的命令会覆盖条目中的已有文件，不是选择性合并。确认影响范围且明确同意覆盖后才执行：

```bash
{{RUNNER}} add {{BUTTON_URL}} --overwrite
```

不要在默认更新脚本里加入 `--overwrite`，也不要将对一个文件的许可扩大为对整个依赖闭包的覆盖许可。公共工具或任何关联组件有定制时，改走下一节的合并流程。

## 4. 有本地定制：逐文件合并 <!-- customized -->

保持现有文件，结合 `--diff`、`--view` 和项目历史，把上游需要的修复移入本地。保留业务属性、事件回调、受控状态、主题变量、无障碍关联以及项目自己的布局。

| 文件情况 | 处理方式 |
| --- | --- |
| 内容一致 | 不写入。 |
| 本地未改，上游有变化 | 审查后更新该文件；仍需检查关联依赖。 |
| 本地已改 | 选择性合并，不能整文件覆盖。 |
| 新增关联文件或依赖 | 核对来源、目标路径和版本后添加，检查所有导入。 |
| 无法判定冲突或没有安装基线 | 列出不确定点，请项目维护者确认，不猜测、不静默丢弃代码。 |

合并不是只复制几行样式：上游修改可能依赖新的辅助函数、类型或依赖版本。跳过某个公共文件后，仍须验证其余组件是否兼容。手动处理依赖时，使用项目原有包管理器并同步锁文件，不要顺便升级全部依赖。

如果决定继续使用旧实现，应记录跳过了什么、原因和后续需要关注的修复。普通 `--diff` 不提供可信的原始安装基线，因此本流程不承诺自动三方合并或无冲突升级。

## 5. 让 AI 协助，保留人工审查 <!-- agent -->

可以让能读取和修改项目的 Agent 使用官方 shadcn 更新工作流；[官方 Skill](https://ui.shadcn.com/docs/skills)是可选辅助，不是安装或更新的前提。Asharca 的组件 API 以本 Registry 的源码为准，不能套用 shadcn 官方同名组件的属性定义。

下面的提示词以 Button 为例，更新其他组件时替换条目地址。它不会自动执行任何命令：

```text
请在当前业务项目中更新 Asharca UI 的 Button，来源为 {{BUTTON_URL}}。
先检查工作区状态、components.json、包管理器、实际别名和已有组件。
若有未保存的修改，先说明情况，不擅自提交、暂存、覆盖或丢弃它们。
使用 {{RUNNER}} add {{BUTTON_URL}} --dry-run 列出全部受影响文件。
对每个文件用同一来源的 --diff 和 --view 检查 CLI 转换后的内容，并读取本地文件及 Git 历史。
保留我的业务 API、回调、状态、主题和布局；不要替换成 shadcn 官方同名组件。
同时检查 utils.ts、关联组件、package.json 和锁文件；只调整本次需要的依赖。
不要直接复制 GitHub 原始文件，不运行 init 或切换预设。
没有对完整影响范围的明确许可，不使用 --overwrite；不使用 --all 批量覆盖。
遇到无法确定的冲突先说明，不猜测；不要上传项目源码到外部服务。
完成后运行项目已有的相关检查，报告修改、保留、跳过和未验证的内容，以及回退方式。
```

Agent 生成的合并仍需要审查。它读取差异并编辑代码，不代表 CLI 已经提供了保证保留任意定制的自动合并算法。

## 6. 验证并提交 <!-- validate -->

```bash
git diff --check
git diff --stat
git diff
git status --short
```

`git diff` 不显示未跟踪新文件的内容，暂存后的修改也需单独查看 `git diff --cached`。逐个检查新增文件，确认源码、依赖和锁文件一起进入审查。

查看业务项目 `package.json`，运行其中实际存在的类型检查、lint、相关测试和构建脚本；不要照搬 UI 库自己的 `pnpm check`。未配置自动测试时，应明确记录并手动检查受影响页面。

重点检查明暗主题、窄屏、键盘和焦点、禁用状态、表单提交与重置、受控组件、中文输入，以及减少动态效果设置。更新公共工具文件时，回归所有引用它的组件，而不只看当前示例。

只暂存本次审查过的文件，保留一份独立更新提交。记录组件来源、更新日期、实际 CLI 版本、保留的定制及验证结果；没有执行的检查写明未验证。

## 7. 回退和复现 <!-- rollback -->

**还没有提交：**使用更新前记录的 SHA，逐个恢复本次改动的已跟踪文件。操作前确认不会覆盖更新后新写的业务内容。恢复范围同时考虑组件源码、`package.json` 和锁文件；新建的未跟踪文件不会自动消失，只删除已确认属于本次更新的文件。

**已经提交：**优先撤销那份独立的更新提交，而不是重置整个分支。把下例中的 `UPDATE_COMMIT_SHA` 替换为本次更新提交的真实 SHA；发生冲突时人工处理，不强推共享分支：

```bash
git revert UPDATE_COMMIT_SHA
```

恢复依赖清单与锁文件后，按项目原有方式重新安装依赖并重新验证。不推荐使用清空工作区或强制重置整个仓库的方法回退组件。

公开 HTTP 地址提供当前部署内容，不保证之后下载到同一份源码。要复现，保存安装后的源码、锁文件和更新记录；需要冻结来源时，可归档当时获取的完整 Registry JSON 供审查。归档 JSON 中的依赖版本范围不能代替锁文件。

不要给现有 HTTP 地址随意追加 `#v1.0.0` 并当作版本固定。shadcn 官方的 [GitHub Registry](https://ui.shadcn.com/docs/registry/github)有自己的配置要求；本仓库当前没有因此自动获得按 Tag 安装的入口。

## 常见问题 <!-- troubleshooting -->

### 合并了代码，为什么没有新效果？

先确认站点部署成功，再检查 `--view` 的内容；最后确认业务项目已经同步源码且导入的是本地 `asharca` 目录。升级 Motion 或 Radix 不会替你更新本地样式。

### Registry 返回 404、网络失败或简写找不到？

停止写入，检查实际部署地址及 `components.json` 中的命名空间。简写失败时可以用同一来源的完整 URL 检查；不要改用官方同名组件，也不要把失败当作“没有变化”。

### CLI 不认识 --dry-run 或 --diff？

用当前包管理器的 runner 检查 `shadcn@latest add --help`。公司代理、离线缓存或固定版本可能影响实际运行版本。无法使用这些选项时，先解决工具版本或访问问题，不直接改用覆盖安装。

### 能否一次更新所有组件？

先列出项目确实安装过的 Asharca 条目，再按条目审查依赖闭包。同一个 `utils.ts` 可能多次出现，应统一审查并验证；不能默认把整个 Registry 安装到项目。

### 手动安装的源码能更新吗？

可以。配置和路径一致时仍可通过 CLI 预览；否则先在隔离的临时项目里按相同配置检查，再手动合并文件与依赖。临时配置必须匹配宿主的别名和底层组件库，不能用默认配置推测差异。

## 官方参考 <!-- references -->

[shadcn 源码与无样式核心架构](https://ui.shadcn.com/docs)、[CLI 参数](https://ui.shadcn.com/docs/cli)、[官方 Skills 文档](https://ui.shadcn.com/docs/skills)、[官方更新工作流](https://github.com/shadcn-ui/ui/blob/main/skills/shadcn/SKILL.md#updating-components)。

本页说明的是这些工具在 Asharca HTTP Registry 中的用法，不承诺自动保留全部定制，也不代替业务项目的代码审查。
