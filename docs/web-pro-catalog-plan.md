# Web Pro 公开目录独立实现清单

核对与实现日期：2026-11-04。本文记录固定范围、公共接口和交付边界。只参考公开目录、Markdown 产品说明和公开预览；不获取授权 Registry、付费源码、专有图片或品牌资产。

## 视觉与交互还原标准

2026-11-04 起按用户确认的「组件视觉与交互 1:1」验收：以 Pro 公开可操作演示为参照，对齐组件布局、尺寸、字体、颜色、间距、响应式、交互状态和动效。保留本仓库品牌；专有图片只使用具有使用权限的素材，替换素材造成的差异须明确记录，不将整页称为像素完全一致。不得获取锁定的付费源码或绕过访问限制。

下方既有交付记录及各项「已实现」仅表示功能、DOM 和发布链路的历史验收，**不表示通过视觉与交互 1:1 验收**。视觉验收须在相同组件容器宽度、视口、主题、数据形态和交互阶段比较公开演示与本地页面；站点文档侧栏不属于组件还原范围。未经逐项实际比较的变体保持未验收。

2026-11-05 用户明确批准保留移动端菜单的边界避让，不复刻公开演示的越界：390px 视口、356px 组件画布下，Studio 模型子菜单同为 256px 宽，公开演示右边界实测 575.2px，本地限制在 382px。公开预览重新挂载后仍可复现；这一处按可操作性修正验收，不计为定位 1:1，也不豁免其他视觉差异。

### 本轮源码重做与新增接口

以下记录源码接口与验收边界，不将源码已就绪等同于视觉通过。安装 slug、Preview key 与四个独立应用的分发路径保持不变。

- `ProfessionalProfileCard` 的职位文字字段为 `jobTitle`，不再使用容易与 HTML 可访问性角色混淆的 `role`。仓库内 Usage/Preview 已迁移；不保留旧字段别名。

- Agent 输入框分别提供输出类型、分辨率、比例、模型、推理/速度、附件、搜索意图和队列等真实状态；选项随提交传给宿主。审批队列保留精确规则授权、拒绝备注和失败重试；计划工具及多版本 diff 使用已有浮层下拉组件，版本选择仅在宿主提供多个版本时显示。
- Voice hero 的 `recording` / `onRecordingChange` 区分呈现状态与真实录音适配器。没有适配器时明确标记麦克风未开启；拒绝不得推进录音状态。DeFi hero 的 `onWalletRequest` 在用户审阅后接收请求，仅显示宿主返回消息，不擅自修改余额。Marketplace 的 `HeroMatchContext` 传递本地 `File` 与 `webSearch` 意图，不声称已上传或已搜索。
- `PersonalWebsiteArticle` 与可选 `writing` 数据提供标题、摘要、真实链接及可选缩略图，Writing 位于 Projects 与 Work 之间。公开文章保留实际作者归属，不包装为虚构人物的作品。开发者和 AI Workspace 落地页分别采用原创低频绿色流场与阶梯彩色 WebGL 背景；效果自身仍须对照验收，不能当作素材替换而豁免。
- `PricingPlan.includedSeats`、`additionalSeatMonthlyPrice`、`additionalSeatAnnualPrice` 表示基础订阅、包含席位及额外席位费用；报价中的总额仍按实际账期计算。未提供包含席位时保留按席位计价。`NewsletterIssue.topic` 过滤实际提供的文章；无标签文章仍可展示，不用重复虚构记录补数量。
- `StudioFooterProps.navigation`、`location`、`locationDescription` 提供导航与地点文字；时钟使用实际 IANA 时区。`AboutPageProps.collagePeople` 可独立提供拼贴头像，缺省使用团队成员。购物车 `checkoutNotice` 显示宿主或预览的真实状态。
- 插画播放与业务结果分离：`DocumentCards.presentationPlaying` 控制文档呈现；`CheckoutScene.demonstration.receipt`、`RevenueStream.demonstration` 的帧/格式化器/间隔、`ThreatScanScene.demonstration`、`VerificationScene.demonstration.code` 均是明确提供的样例画面。实际点击转入宿主回调；未接入支付、扫描或验证服务的预览明确报错，不制造业务成功。
- 定价卡组的 `PlanStackItem.yearlyPriceBasis` 区分年总价与年付折算月价；`badge` 和 `yearlySavingsLabel` 由调用者提供，不从无关样例推导折扣。插画 helper、浮层、图表与主题切换依赖由 Registry 源码闭包收集；四个独立应用通过同步脚本复制其实际依赖。
- 四个应用仍为真实浏览器本地工作流，而非托管模型、OAuth、支付或链上服务。新工作区的示例记录与已有持久化数据分开处理；不得为了匹配公开截图覆盖用户保存的数据或虚构活动统计。
- `TextReveal.spaceWidth` 可选设置固定宽度的空格盒，用于已实测的公开标题排版；省略时保留原有空白、字符分组和默认行高。审批队列的 `emptyDescription` 与 `onReplay` 由宿主提供，空队列不声称后台任务已执行。
- `Sparkline` 新增 `curve="flat"`（采样点处零斜率的三次曲线）、`activeIndex`／`defaultActiveIndex`／`onActiveIndexChange` 与逐边 `padding`。默认仍为原有曲线、3px 留白和末点静止读数；主动指定检查点时，圆点与读数来自同一真实样本，数据缩短会清除失效的非受控索引。区域填充仍闭合到 SVG 底部，不通过缩放曲线伪造布局。
- `InlineSlider.appearance="plain"` 隐去轨道内标签／读数／刻度，使用实心手柄与宿主 `step`；外置标签和读数由调用者组合。默认 `"inline"` 保留原有十档停靠和标签避让。纯轨道模式不为每个数值步长分配停靠数组。
- `CenterMorphModalContent.initialFocus="panel"` 可选择先聚焦面板；默认仍聚焦第一个控件。`radius` 同时作用于边框与展开裁切，默认 30px；`shadow={false}` 可关闭面板阴影，默认仍显示。面板初始聚焦支持正反向 Tab 包含，退出时继续保留 PresenceGate 的交互门控。
- `AnimatedDropdown.radius` 与 `contentClassName` 配置根面板；默认圆角仍为 12px。`initialFocus="selected"` 在指针、Enter、Space 打开时聚焦当前可用的选中项，无可用选中项时回退首行；显式 ArrowUp／ArrowDown 保留末行／首行行为。默认仍聚焦首行，不改变既有调用者。
- `OnboardingPage.onContinueSetup` 将清单继续操作交给宿主，不把继续误报为任务全部完成。清单预览成功后仅关闭对话框，保留原来的 1/4 进度与 URL；失败则保持打开并显示真实错误，不额外跳转到分步流程。
- `MorphPopoverContent.collisionPadding` 与 `AnimatedDropdown.collisionPadding` 可显式设置根面板的视口留白并限制宽度；默认仍为 8px。嵌套 MorphPopover 通过已有上下文登记子门户，Escape 只关闭最内层，子菜单点击不误关闭父弹层；Dropdown 根面板仅暴露一个 menu 地标。

### 本轮验收状态

- 已完成源码汇合与四个应用的最新依赖复制。`bun run check` 通过主站 TypeScript、Biome、233 项 Registry 组件校验及四个独立应用类型检查；Biome 仍有 187 条非阻断 warning、12 条 info。清理临时路由后的完整单元套件 755 项通过、0 失败（97 个文件）；公共 MCP 类型检查通过。新增回归覆盖菜单根聚焦后的键盘导航、验证码验证／重发的单一错误播报、空通知分类的键盘回切，以及支付方法撤销／pending 不生成收据的状态边界。嵌套独立应用的 `.next` 产物不参与 lint，源码仍在检查范围内。
- 干净预览已实际挂载审批队列，拒绝操作能展开备注框并获得焦点；这不是全目录视觉验收。
- 既有公开/本地诊断截图用于定位差异，不作为后续修改的通过证据。最终截图、移动端、深浅主题、普通/减少动态效果和交互状态必须在代码停止修改后重新观察；未完成的条目保持未验收。
- 2026-11-05：实际浏览器验证 MorphPopover 的普通／减少动画模式下指针打开搜索聚焦、Escape 返回触发器，以及退出尚未结束时快速重新打开的焦点恢复。修复等待子节点继承的 visibility 过渡后再调用宿主 autofocus；相关 7 项回归测试通过。此记录仅覆盖该共享问题，不代表全目录最终通过。
- 2026-11-05：浏览器确认研究来源与帮助中心的浅色选中标签恢复前景色，来源类型筛选有效。团队容量页使用局部 160px 图表与三列图例，桌面组件高度公开／本地为 1343／1342px；移动布局及统计口径差异尚未验收。
- 定价已逐档操作公开用量滑块并修正九档样例；AI 20× 报价实测月付 $100、年付 $960，5× 年付 $384。`proUsagePrices[].description` 可提供档位专属说明；滚动金额保留宿主货币格式中的分组符。1000 席实测月付 $1,290、年付 $14,190；Ledger 12 席实测月付 $74、年付 $708。上述均为本地报价回调，不提交付款。
- 定价十一种桌面／浅色／减少动画组合已有原生视口截图及离线完整裁切；后续修改涉及的截图需重拍。相同尺寸不等于视觉或交互通过；其他组合、动态背景及剩余状态保持未验收。
- Registry 依赖闭包已改为 TypeScript 语法树识别，避免将 diff/code 示例字符串中的 `import` 当作真实文件依赖。实际全目录闭包扫描通过；5 项源码解析/路径测试通过，覆盖真实静态、动态及模板字面量导入、展示文本排除和真实缺失依赖报错。
- 团队可用工时改为逐人非负剩余工时之和，避免过载成员抵消其他人的空闲时间；浏览器实测全部成员 44h、Operations 组 10h。预算预览移除重复移动横向内边距，在 390px 视口、356px 画布上卡片实测 356px；这两处通过不代表其他运营页面通过。
- 团队容量移动页补齐指标图标，热力日历保持 16px 可见单元格／20px 点击区域并在面板内横向滚动；390px 视口实测文档宽度仍为 390px。公开页面实测窗口为 26／12 周，汇总为 4,824／2,238 项，最近一周完成 165 项、专注 94h；预览已对齐这些汇总，逐日分配仍为独立生成的示例数据。浏览器遍历两个窗口与四种团队筛选，八组日历计数之和均等于对应汇总，单格不超过 48，未来日期不计入；Product 十二周首日选择显示 14 项，Clear 正常清除。其他仪表盘及最终多主题对照仍待验收。
- 2026-11-05 集中收尾：浏览器原生 Enter／Space 均能打开上传文件选择器；实际 CSV 进入显式本地传输队列，暂停／继续有效，390px 页面无横向溢出且按钮内无嵌套交互控件。代理测试输入通过 Shift+Enter 输入九行后为 160px，清空恢复 56px。Forecast 搜索由共享模态框聚焦，Escape 返回搜索触发器；市场结果、时间范围和信息筛选改为原生 fieldset，布局选择器同步迁移，实际切换 1M／Positions 有效。
- 四个应用依赖源码再次同步；资产关注列表的 Add assets 弹层已实际打开并显示资产徽标，补齐缺失的 AssetBadge 导入。工作流实际执行返回大写输出，390px trace 可切换查看且无横向溢出；助手中止后保留消息，本地额度保持 100。交易取消失败在切换市场后不串到其他市场，恢复后显示宿主确认的取消结果。
- 共享模态框与图表的 16 项定向回归通过，覆盖面板初始聚焦、Tab 包含、关闭返回触发器、退出期禁用交互，以及受控 Sparkline 与过期检查点清除。原生滑块键盘默认行为由真实浏览器验证，不由 Happy DOM 的单独 keydown 冒充。
- 审批队列复用现有 Tabs，原生 ArrowRight／End／Home 分别显示已审 2 项／全部 6 项／待审 4 项；空结果面板保持稳定。公开／本地桌面审核弹层均为 576×659.75px，并实际核对内部排版、16px 圆角、无阴影和 15% 前景色遮罩。拒绝的宿主回调保留 4 项待审与输入备注，恢复后确认变为 3 项；关闭返回原行，预览重置同时清除筛选与备注。头像替代和真实附件目标仍明确保留。
- 细指针补验使用 Chromium 原生设备配置，逐页确认 `hover:hover`／`pointer:fine`，不替换 `matchMedia`。截图同时校验 PNG 实际尺寸与视口；公开页面的原生滚动条会改变可用画布宽度，本地按实测画布配对，不将相同窗口宽度误当作相同组件宽度。这不等于物理鼠标或触摸设备验证。
- 主控最终原生复验：Revenue 显式选择 30D 后 Home／ArrowRight 读出 `Sep 22: $1,170`，90D 后 End 读出 `Oct 18: $23,400`，并观察了滚动数字稳定后的真实画面；不将不同数据窗口的样本混为一谈。
- File Flow 最终复验发现演示按钮覆盖阶段按钮，以及装饰动画卡片截获 Convert 点击；已将演示控制放到顶部、动画卡片设为不接收指针事件，并保留原有动画曲线。原生点击实测 Inputs → Convert、错误 → 重置 → 两次推进 → `Ready to use`；这是明确的本地叙事，不是上传或文件转换服务。
- Select 打开时显式恢复 `visibility: visible`；若继承的 visibility 过渡仍使第一次聚焦失效，useListbox 在实际过渡结束／取消后重试，并在用户已移走焦点时停止。原生指针打开聚焦所选 option，End／Enter 选择后返回触发器；390×844、深色、减少动态效果下，Workspace 的 Preferences → Fail requests → Time zone → End／Enter → 保存拒绝仍保留 UTC。保留已有 roving-option 键盘模型，不为模仿公开演示改为容器焦点。
- 2026-11-06：主控在 390px 视口／341px 画布实际打开 Team Invite 的邀请链接角色菜单，Member 同时获得焦点与选中态；最终配置下门户根面板为 256×170px、16px 圆角、左边界 12px，只有一个 menu 地标且未超出视口。回归覆盖受控选择更新后重开、禁用选中项回退及 ArrowUp 的显式末行优先级。
- 2026-11-06：主控实际验证清单 Continue 的退出动画结束后对话框卸载，触发器仍显示 1/4、25%，URL 不变；启用 Fail saves 后重开并继续，显示拒绝原因，清单与进度保留。公开预览外层画廊边框不是组件自身样式，不复制进 SDK。
- 2026-11-06：主控实际验证通知下拉的单一 menu、子菜单 Escape 返回原行且保留父弹层；390px 视口下根面板左边界 16px、宽 358px、底部约 828px。菜单操作被拒绝时保留父弹层、错误与 4 条未读；恢复重试后错误清除、未读变为 3。18 项共享 popup/dropdown 回归通过。
- Checkout 在 Payment 阶段允许点击 Pay 触发字段校验：空值时四项字段显示错误，但不会调用下单；清除 CVC 立即撤销方法，恢复有效字段后才能提交。拒绝与 pending 保留字段且不生成收据。主控在 390px 实测空值／撤销方法都无收据，明确 paid 后显示宿主返回的 DEMO-1042、商户、确认时间、支付方法与到货日期，页面无横向溢出；Continue shopping 清空联系信息并回到不可支付的首步。未提供 onPrint 时不显示打印操作。原始卡号/CVC 不进入 CheckoutOrder，商户示例、固定配送日期和账单地址开关均明确属于本地演示。
- WebGL 可用时，ConversionShader 的减少动态效果使用已有 ShaderBackground 的冻结帧，而不是换成另一幅 CSS 图；不支持 WebGL 时仍保留 CSS 回退。Newsletter 的 mesh distortion／swirl 可由调用者配置，不修改静态 CTA 默认值。既有 Paper shader 依赖采用 PolyForm Shield 而非 MIT；未复制禁止再分发的 ReactBits Grainient，实现与许可差异必须保留，不能宣称精确算法一致或商业许可已确认。
- 原创 Newsletter preferences WebGL 背景随实际 Registry 安装包分发。主控通过真实 `WEBGL_lose_context` 扩展验证丢失上下文后显示回退、恢复后重新绘制；上下文会话显式驱动资源重建，没有压制依赖检查。移动表格实测 8 行 → 展开 9 行 → 无匹配 0 行 → 清空筛选恢复 8 行；团队区域可用原生 ArrowRight 横向滚动，扩大到 1022px 可用宽度后自动移除多余 Tab 停靠点。
- 按实际源码闭包解析的 126 个受影响目录页均已更新至 2026-11-06（含共享 StatefulButton 修正新增影响的 29 页）；未将站点维护误记为所有组件更新。最后的语义修正包括真实时间文本、装饰 SVG 隐藏、稳定的重复词／轴标签身份，以及门户菜单的单一 menu 语义，未改动插画的动画曲线。
- 最终 HTTP 发布检查按 `allShadcnTargets()` 的安装清单验证 511 个端点，均返回正确安装标识与完整源码，合计 6227 个分发文件、0 失败；仅供 raw source 的 8 个目录聚合根不属于安装端点。
- Footer／Newsletter／Contact／Team／FAQ 的 24 个版本完成 192 组公开／本地默认状态对照，覆盖桌面与移动宽度、深浅主题、普通与减少动态效果；最终清单中的 49 个源码哈希与当前文件一致。表单拒绝／重试、菜单／FAQ 键盘路径、团队选择及暂停操作已逐项记录；合法替换素材、宿主文案／外链、真实时钟和不同步动画相位不属于无条件像素一致声明。
- 插画组原有 40 个版本、320 组默认对照记录之外，主控对集成后源码发生变化的 Chat／Revenue／Funnel／FileFlow 重新取得并审阅 32 组公开参考／当前源码图像：独立原生视口、DPR 1、真实主题切换、八种模式、完整离线裁剪，截图前后记录实际媒体与指针状态。重跑了聊天输出、Paid 868 读数及 FileFlow 错误恢复；真实参考数据、合法图像替代和独立动画时钟的差异仍保留，不用旧源码指纹冒充最终证据。
- Auth／Onboarding／Checkout／Settings 的 13 个版本完成 104 组默认状态对照，另有八组展开付款状态和八组完成收据对照；31 个最终源码哈希与交付清单一致。桌面／移动端实测工作区保存到达真正的拒绝回调，保留草稿，恢复仅发生在显式允许成功之后。错误验证码及等待真实 30 秒冷却后的重发拒绝均只显示／播报一次错误，保留六位输入且不进入已登录状态；对应两项单元回归也已通过。
- StatefulButton 的文字测量补充 ResizeObserver，响应断点与字体造成的固有宽度变化；真实 390→1440→390 视口切换下按钮为 40→83→40px，保留字母级布局、弹簧与减少动态效果。公开参考在同一切换中保留旧宽度 83px；这是明确记录的参考缺陷，不将其复制进本地实现。
- 决策组件组 16 个版本完成 128 组默认状态对照及 72 组配对工作流记录；38 个最终源码哈希与交付清单一致。通知菜单采用真实 MailOpen／Mail 图标、可选菜单根聚焦与 4px 间距；原生指针打开时不高亮，ArrowDown 进入首个启用项，子菜单 Escape 保留父弹层，最终关闭返回铃铛。共享 Dropdown 默认行为不变，并保留覆盖禁用首项和 ArrowUp 优先级的回归。
- API 密钥复制只有宿主回调成功才显示 Secret copied，拒绝保留错误，成功反馈约两秒后复位；浏览器实际核对了剪贴板内容。轮换仍遵守已有 `onRotate -> { secret }` 契约并一次性展示真实返回的密钥；公开演示仅更新掩码、不展示密钥，这是明确保留的功能差异。移动通知弹层按实际视口限高，公开／本地分别为 560.5／560px；不为追求固定高度修改页面或伪造坐标。临时 fidelity-smoke 路由已移除，实际请求返回 404。
- 以上是逐项功能与局部布局证据，不是全目录逐像素一致声明；各组的原始图片／插画差异、动态效果及未覆盖状态仍按各自验收记录保留。没有接入真实模型、支付、链上或远程执行服务，也未提交、推送或部署本轮变更。



## 范围

| 类型 | 家族数 | 独立变体或模板数 |
| --- | ---: | ---: |
| 基础组件 | 14 | 33 |
| 业务与营销区块 | 70 | 226 |
| 整页 | 18 | 48 |
| 完整模板 | 11 | 11 |
| Web 插画 | 19 | 40 |

Web 插画目录本身不重复计为一个组件。十一项模板中，Weave、Hunch、Folio、Pair 是多页面应用，不是单张营销页。React Native、付费鉴权/销售系统和真实后端服务不在 Web UI 的独立实现范围内；宿主集成接口必须可接入，不能用假成功替代。

公开目录是持续更新的，本清单固定本次核对结果。公开说明仅给出插画编号时，编号仍是对照身份；本地目录使用内容描述标签帮助检索，不将这些标签当作公开原名或新增变体。

## 首轮功能交付记录（视觉还原重做前）

- 132 个家族、358 项变体或模板：其中 128 个家族、354 项变体通过现有组件目录、Preview、Usage 和 Registry 分发；4 个完整应用通过 `/templates` 及 `templates/` 下的独立 Next.js 工程分发。
- 实际映射见 [`lib/web-catalog-data.ts`](../lib/web-catalog-data.ts) 与 [`lib/standalone-templates.ts`](../lib/standalone-templates.ts)，既有公共安装 slug 保留。七个营销模板不是四个完整应用的替代品。
- 四个应用分别为 Workflow Studio、Forecast Community、Asset Workspace、Assistant Workspace；各自包含运行配置、主题、组件依赖源码、MIT 许可和接入说明。根目录 `bun run check:templates` 校验全部独立工程。
- 已运行 30 组 DOM 工作流验证，覆盖真实输入、宿主回调、拒绝与恢复、路由状态和本地持久化；另验证原生音视频的真实字幕轨道更新、无字幕时保留播放控件，以及公告关闭和发布说明键盘操作。浏览器视觉、布局、真实触控、WebGL、媒体设备、链上交易及远端服务没有因此获得验收；默认不启动服务器、不构建、不使用浏览器。
- 发布验证已实际调用 511 个安装端点，保留 157 个原有安装入口；5 个模板目录/详情页完成服务端渲染，4 个独立应用的源码导入闭包完整。临时验收脚本在运行后删除。
- 首轮代码验收通过 `bun run check`（主站类型、Biome、Registry 与四个独立工程类型）、`NODE_OPTIONS=--experimental-strip-types bun test`（730 项通过）和公共 MCP 类型检查。当时 Biome 有 106 条非阻断 warning；日志页面的服务端渲染及 RSS 响应也验证了同周条目合并后保留新旧发布内容。这些结果不代表后续视觉重做代码已通过新一轮验收。


## 已有能力的处理

下面的“复用候选”是范围核对时从本地 `lib/registry.ts` 建立的快照，不代表仅复用同名组件便满足变体。当前实现与独立安装映射以顶部交付记录中的两个清单为准。

- 不按同名认定等价，也不为目录覆盖率复制已有组件。
- 先验收现有组件的行为；满足时增加公开用法或构图，不建立第二套底层状态逻辑。
- 保留现有公共安装端点和调用契约，不因新增页面改名或删除既有 slug。
- 只覆盖部分能力时记录剩余差异，不用“已有 Table/ChatApp”代表业务表格或完整应用已完成。

## 公共接口与发布约束

1. 沿用现有具名导出、`className`/`cn()`、主题 token、motion token 和 reduced-motion 规则。新增复杂状态支持受控/非受控；复用已有组件时保留其现有 prop 名称。
2. 业务数据由宿主提供；项目、文件、行、任务和图节点使用稳定 ID。金额、日期、时区、单位与格式化契约必须明确。
3. 提交、删除、支付、授权、发送、上传、签名等动作通过可接入宿主的回调完成。错误不得转换为成功；展示演示数据的预览必须明确标注。
4. 组件源码、独立预览、可复制 Usage 与 Registry 条目同批交付；每个有不同安装内容的变体使用独立 installSlug。沿用现有分类体系，完整应用的交付形态单独决策。
5. 每个新项记录 ship date；修改公共行为时只更新实际 bundle 受影响的 component dates。新增共享依赖必须确认其许可证和完整打包路径。
6. 新弹层复用现有焦点、presence gate、portal、滚动锁定和固定层绘制规则。不能以透明全屏常驻层代替卸载。

## 每个变体的完成门槛

- 清单中的每个名称都是独立验收单元；同一组件可承载多个变体，但其布局、交互与状态差异必须真实存在。改标题、颜色或 CSS 类不构成不同设计。
- 先对照公开演示确认结构、动作、状态与视觉细节，再依家族契约逐项验证；保留本仓库品牌与合法素材替换，不以功能近似替代视觉与交互还原。
- 验收真实输入、选择、提交与状态变化；适用时涵盖空数据、禁用、失败、返回、取消和内容更新。不是每个组件都额外增加这些功能。
- 触屏与键盘均可完成核心动作；焦点与读屏语义正确；浅色/深色和窄屏不溢出；减少动态效果不丢信息。
- Registry 打包实际源码及依赖，Usage 不引用 demo-only helpers。运行具体行为 smoke；集中运行项目 check、unit tests 与 MCP typecheck。
- 页面和应用不能只交付壳或截图。跨屏工作流、路由与本地持久化须按各自公开产品说明可用；真实服务接入边界明确。
- 本次还原请求已明确要求浏览器视觉与实际交互验收；在相同视口和主题对照官方公开演示与本地实现。静态检查、HTTP 200 和 DOM 测试均不能代替视觉与动效验证。

## 集成顺序与文件所有权

1. 主控维护清单、接口、Registry/preview 总索引和共享依赖。
2. 先处理基础缺失能力及现有组件差异，再处理 AI/业务组合、营销区块与整页。只把真正有共享前提的工作串行化。
3. 前端实现按家族分配非重叠源文件与预览；不在子任务中运行构建、lint、测试或格式化。需要真实后端时先确定契约，再交由 backend 负责。
4. 十一个完整模板单独验收；四个应用以 `templates/` 下独立工程交付，其余七个营销模板作为 Registry 中的完整页面交付，不能互相替代。
5. 主控统一集成、执行检查、运行行为 smoke，并记录已观察到的结果；未观察到的视觉或服务端行为不宣称通过。

## 逐项清单

### 基础组件

#### Animated Modal · `animated-modal`

- 公开规范：[产品页](https://pro.beui.dev/components/animated-modal) · [Markdown](https://pro.beui.dev/components/animated-modal.md)
- 状态：已实现；代码/DOM 验收范围与未验收边界见顶部交付记录。
- 独立验收项：1. Animated dialog。
- 家族专属验收：开关受控/非受控；标题与说明关联；焦点锁定、Escape 关闭与返回触发点；嵌套弹层不得抢错焦点。
- 复用候选：[`center-morph-modal`](../components/motion/center-morph-modal.tsx)、[`morphing-modal`](../components/motion/morphing-modal.tsx)。

#### Receipt · `receipt`

- 公开规范：[产品页](https://pro.beui.dev/components/receipt) · [Markdown](https://pro.beui.dev/components/receipt.md)
- 状态：已实现；代码/DOM 验收范围与未验收边界见顶部交付记录。
- 独立验收项：1. Printed receipt。
- 家族专属验收：明细、折扣/税费与总额来自输入数据；金额舍入策略明确；付款信息、条码与状态独立；printKey 重播且减少动态效果时稳定显示。
- 复用候选：[`number`](../components/motion/animated-number.tsx)。

#### Emoji Picker · `emoji-picker`

- 公开规范：[产品页](https://pro.beui.dev/components/emoji-picker) · [Markdown](https://pro.beui.dev/components/emoji-picker.md)
- 状态：已实现；代码/DOM 验收范围与未验收边界见顶部交付记录。
- 独立验收项：1. Message reactions；2. Picker panel。
- 家族专属验收：搜索、分类、肤色和最近使用可操作；键盘选中与焦点恢复；Reaction Bar 真实增删选择；没有结果时可恢复。
- 复用候选：[`popover`](../components/motion/popover.tsx)、[`tabs`](../components/motion/tabs.tsx)。

#### Model Picker · `model-picker`

- 公开规范：[产品页](https://pro.beui.dev/components/model-picker) · [Markdown](https://pro.beui.dev/components/model-picker.md)
- 状态：已实现；代码/DOM 验收范围与未验收边界见顶部交付记录。
- 独立验收项：1. Provider catalog；2. Provider rail。
- 家族专属验收：提供商分组/目录与侧轨两种导航；搜索、禁用、选中详情与切换由模型数据驱动；保持现有 Selector 公共接口。
- 复用候选：[`selector`](../components/motion/selector.tsx)。

#### AI Thinking Loaders · `ai-thinking-loader`

- 公开规范：[产品页](https://pro.beui.dev/components/ai-thinking-loader) · [Markdown](https://pro.beui.dev/components/ai-thinking-loader.md)
- 状态：已实现；代码/DOM 验收范围与未验收边界见顶部交付记录。
- 独立验收项：1. Pixel orbit；2. Grid scan；3. Diagonal wave；4. Assembling tiles；5. Diamond loop；6. Connected nodes。
- 家族专属验收：六种图案有不同的运动结构与完成/停止状态；同一语义状态不重复播报；减少动态效果时停止位移与无限循环。
- 复用候选：[`loader`](../components/motion/loader.tsx)、[`loading-states`](../components/agents/loading-states/index.ts)。

#### Animated Dropdown · `animated-dropdown`

- 公开规范：[产品页](https://pro.beui.dev/components/animated-dropdown) · [Markdown](https://pro.beui.dev/components/animated-dropdown.md)
- 状态：已实现；代码/DOM 验收范围与未验收边界见顶部交付记录。
- 独立验收项：1. Animated dropdown。
- 家族专属验收：点击触发，受控打开状态；嵌套菜单、禁用项、键盘导航与 typeahead；碰撞定位、退出期交互门控和焦点恢复。
- `side="top" | "bottom"` 指定根菜单的首选方向，空间不足时仍可翻转；`shadow={false}` 同时关闭根菜单和子菜单阴影。默认方向与阴影保持原有行为。指针打开子菜单后焦点留在父项，ArrowRight 进入子菜单；移动到同级项时关闭原子菜单，Escape 逐级恢复焦点。活动背景限制在各自面板内，减少动态效果时不使用共享布局投影。
- 复用候选：[`context-menu`](../components/motion/context-menu.tsx)、[`bloom-menu`](../components/motion/bloom-menu.tsx)、[`popover`](../components/motion/popover.tsx)。

#### Animated Text · `animated-text`

- 公开规范：[产品页](https://pro.beui.dev/components/animated-text) · [Markdown](https://pro.beui.dev/components/animated-text.md)
- 状态：已实现；代码/DOM 验收范围与未验收边界见顶部交付记录。
- 独立验收项：1. Alternating text swap；2. Blur highlight；3. Progressive blur highlight。
- 家族专属验收：交替字母标签、短语模糊高亮与渐进高亮分别实现；循环可停；读屏读取稳定文字；减少动态效果保持最终可读值。
- 复用候选：[`text-animation`](../components/motion/text-reveal.tsx)、[`action-swap`](../components/motion/action-swap.tsx)。

#### Flip Card · `flip-card`

- 公开规范：[产品页](https://pro.beui.dev/components/flip-card) · [Markdown](https://pro.beui.dev/components/flip-card.md)
- 状态：已实现；代码/DOM 验收范围与未验收边界见顶部交付记录。
- 独立验收项：1. Image flip cards；2. Modal flip card。
- 家族专属验收：正反面内容由宿主提供；翻转后隐藏面的控件不可聚焦；键盘翻转；模态变体保持展开与关闭的空间连续性和焦点返回。
- 复用候选：[`tilt-card`](../components/motion/tilt-card.tsx)、[`center-morph-modal`](../components/motion/center-morph-modal.tsx)。

#### Cards · `cards`

- 公开规范：[产品页](https://pro.beui.dev/components/cards) · [Markdown](https://pro.beui.dev/components/cards.md)
- 状态：已实现；代码/DOM 验收范围与未验收边界见顶部交付记录。
- 独立验收项：1. Balance card；2. Compact card；3. Invite card；4. Folder card；5. Story card；6. Profile card。
- 家族专属验收：余额、紧凑信息、邀请、文件夹、故事、资料卡分别有对应数据与真实操作；不可用一个壳加 variant 名称冒充六种设计。
- 复用候选：[`card`](../components/motion/card.tsx)、[`wallet-card`](../components/motion/wallet-card/index.tsx)、[`card-folder`](../components/motion/card-folder.tsx)、[`project-folder`](../components/motion/project-folder.tsx)。

#### Morphic Tooltip · `morphic-tooltip`

- 公开规范：[产品页](https://pro.beui.dev/components/morphic-tooltip) · [Markdown](https://pro.beui.dev/components/morphic-tooltip.md)
- 状态：已实现；代码/DOM 验收范围与未验收边界见顶部交付记录。
- 独立验收项：1. Morphic Tooltip。
- 家族专属验收：同一浮层在多个触发点之间连续移动/变形；hover 与 focus 均可触发；延迟、退出、边界定位与可访问关联正确。
- 复用候选：[`tooltip`](../components/motion/tooltip.tsx)。

#### Command Palette · `command-palette`

- 公开规范：[产品页](https://pro.beui.dev/components/command-palette) · [Markdown](https://pro.beui.dev/components/command-palette.md)
- 状态：已实现；代码/DOM 验收范围与未验收边界见顶部交付记录。
- 独立验收项：1. Morphic command palette。
- 家族专属验收：触发器到面板的 morph 与命令搜索都要验收；快捷键、过滤、分组、禁用、执行和焦点恢复可用。
- 复用候选：[`command-palette`](../components/motion/command-palette.tsx)、[`morphing-search`](../components/motion/morphing-search.tsx)。

#### Morphic Card Modal · `morphic-card-modal`

- 公开规范：[产品页](https://pro.beui.dev/components/morphic-card-modal) · [Markdown](https://pro.beui.dev/components/morphic-card-modal.md)
- 状态：已实现；代码/DOM 验收范围与未验收边界见顶部交付记录。
- 独立验收项：1. Morphic Card Modal。
- 家族专属验收：点击卡片后共享布局展开成完整对话框；关闭回到原卡片；背景滚动锁定、焦点和中途关闭/重新打开均正确。
- 复用候选：[`project-folder`](../components/motion/project-folder.tsx)、[`image-viewer`](../components/motion/morphing-lightbox.tsx)、[`center-morph-modal`](../components/motion/center-morph-modal.tsx)。

#### Charts · `charts`

- 公开规范：[产品页](https://pro.beui.dev/components/charts) · [Markdown](https://pro.beui.dev/components/charts.md)
- 状态：已实现；代码/DOM 验收范围与未验收边界见顶部交付记录。
- 独立验收项：1. Stacked bar chart；2. Segmented meter；3. Sparkline。
- 家族专属验收：堆叠柱、分段计量与迷你趋势使用真实数据；总量/单位一致；键盘或表格提供非视觉读数。
- 复用候选：[`bar-chart`](../components/charts/bar-chart.tsx)、[`composition-chart`](../components/charts/composition-chart.tsx)、[`sparkline`](../components/charts/sparkline.tsx)、[`status-bar`](../components/charts/status-bar.tsx)。

#### Data Table · `data-table`

- 公开规范：[产品页](https://pro.beui.dev/components/data-table) · [Markdown](https://pro.beui.dev/components/data-table.md)
- 状态：已实现；代码/DOM 验收范围与未验收边界见顶部交付记录。
- 独立验收项：1. Responsive data table；2. Data table；3. Paginated data table。
- 家族专属验收：响应式、普通与分页三种用法；排序、过滤、选择、分页真实改变行集；行 ID 稳定且空页可恢复。
- 复用候选：[`table`](../components/motion/table/index.tsx)。


### 业务与营销区块

#### Audit Trail · `audit-trail`

- 公开规范：[产品页](https://pro.beui.dev/components/audit-trail) · [Markdown](https://pro.beui.dev/components/audit-trail.md)
- 状态：已实现；代码/DOM 验收范围与未验收边界见顶部交付记录。
- 独立验收项：1. Workspace history。
- 家族专属验收：按日期分组检索事件；actor 筛选；展开真实 before/after 与事件详情；空结果与筛选复位可用。
- 复用候选：[`timeline`](../components/motion/timeline.tsx)、[`table`](../components/motion/table/index.tsx)。

#### Approval Queue · `approval-queue`

- 公开规范：[产品页](https://pro.beui.dev/components/approval-queue) · [Markdown](https://pro.beui.dev/components/approval-queue.md)
- 状态：已实现；代码/DOM 验收范围与未验收边界见顶部交付记录。
- 独立验收项：1. Review queue。
- 家族专属验收：检索待审条目；详情含附件与上下文；批准/拒绝交由宿主处理；异步提交与失败不得误报成功。
- 复用候选：[`approval-card`](../components/agents/approval-card/index.tsx)、[`file-upload`](../components/motion/file-upload.tsx)。

#### Kanban Board · `kanban-board`

- 公开规范：[产品页](https://pro.beui.dev/components/kanban-board) · [Markdown](https://pro.beui.dev/components/kanban-board.md)
- 状态：已实现；代码/DOM 验收范围与未验收边界见顶部交付记录。
- 独立验收项：1. Project board。
- 家族专属验收：真实列与卡片数据；新建、编辑、移动与筛选；键盘替代拖拽；卡片详情与外部状态同步。
- 复用候选：[`sortable-stack`](../components/motion/sortable-list.tsx)、[`center-morph-modal`](../components/motion/center-morph-modal.tsx)。

#### Log Explorer · `log-explorer`

- 公开规范：[产品页](https://pro.beui.dev/components/log-explorer) · [Markdown](https://pro.beui.dev/components/log-explorer.md)
- 状态：已实现；代码/DOM 验收范围与未验收边界见顶部交付记录。
- 独立验收项：1. Execution logs。
- 家族专属验收：日志级别与文本过滤；暂停/恢复；仅在读者处于尾部时跟随；payload 详情可展开并正确保留滚动。
- 复用候选：[`tool-result`](../components/agents/tool-result.tsx)、[`code-block`](../components/agents/code-block.tsx)。

#### Notification Center · `notification-center`

- 公开规范：[产品页](https://pro.beui.dev/components/notification-center) · [Markdown](https://pro.beui.dev/components/notification-center.md)
- 状态：已实现；代码/DOM 验收范围与未验收边界见顶部交付记录。
- 独立验收项：1. Notification dropdown；2. Notification panel。
- 家族专属验收：按未读/类型过滤、已读标记与清空回调；Dropdown 与 Panel 独立组合；宿主更新后计数一致，动作失败不丢通知。
- 复用候选：[`notification-stack`](../components/motion/notification-stack.tsx)。

#### KPI Overview · `kpi-overview`

- 公开规范：[产品页](https://pro.beui.dev/components/kpi-overview) · [Markdown](https://pro.beui.dev/components/kpi-overview.md)
- 状态：已实现；代码/DOM 验收范围与未验收边界见顶部交付记录。
- 独立验收项：1. Trend KPI cards；2. Compact KPI cards；3. Gauge KPI cards；4. Connected support KPI cards；5. Summary KPI card；6. Header KPI cards。
- 家族专属验收：六种指标组合分别呈现趋势、紧凑读数、仪表、关联支持、汇总和标题栏；单位、变化方向和历史序列由宿主传入。
- 复用候选：[`number`](../components/motion/animated-number.tsx)、[`sparkline`](../components/charts/sparkline.tsx)、[`status-bar`](../components/charts/status-bar.tsx)。

#### Performance Report · `performance-report`

- 公开规范：[产品页](https://pro.beui.dev/components/performance-report) · [Markdown](https://pro.beui.dev/components/performance-report.md)
- 状态：已实现；代码/DOM 验收范围与未验收边界见顶部交付记录。
- 独立验收项：1. Team performance；2. Period comparison；3. Team leaderboard。
- 家族专属验收：期间选择与团队筛选驱动指标、对比和排名；处理缺失比较基期、零分母、并列与空数据。
- 复用候选：[`table`](../components/motion/table/index.tsx)、[`bar-chart`](../components/charts/bar-chart.tsx)。

#### Voice Agent · `voice-agent`

- 公开规范：[产品页](https://pro.beui.dev/components/voice-agent) · [Markdown](https://pro.beui.dev/components/voice-agent.md)
- 状态：已实现；代码/DOM 验收范围与未验收边界见顶部交付记录。
- 独立验收项：1. Orb session；2. Voice dock。
- 家族专属验收：会话状态、静音、结束和设备操作可由宿主控制；Orb 与 Dock 有独立布局；不得假装已连接麦克风或远端会话。
- 复用候选：[`prompt-input`](../components/agents/prompt-input.tsx)、[`animated-badge`](../components/motion/animated-badge.tsx)。

#### Voice Conversation · `voice-conversation`

- 公开规范：[产品页](https://pro.beui.dev/components/voice-conversation) · [Markdown](https://pro.beui.dev/components/voice-conversation.md)
- 状态：已实现；代码/DOM 验收范围与未验收边界见顶部交付记录。
- 独立验收项：1. Voice conversation。
- 家族专属验收：说话人、转写、输入/输出音频与会话阶段由数据驱动；播放、静音与结束回调可连接宿主音频实现。
- 复用候选：[`message`](../components/agents/message.tsx)、[`message-scroller`](../components/agents/message-scroller.tsx)。

#### Questionnaire · `questionnaire`

- 公开规范：[产品页](https://pro.beui.dev/components/questionnaire) · [Markdown](https://pro.beui.dev/components/questionnaire.md)
- 状态：已实现；代码/DOM 验收范围与未验收边界见顶部交付记录。
- 独立验收项：1. Guided questions；2. Selection list。
- 家族专属验收：问题、必填规则与回答外置；单选/多选与步进真实更新；返回保留答案；提交只返回有效回答。
- 复用候选：[`approval-card`](../components/agents/approval-card/index.tsx)。

#### API Keys · `api-keys`

- 公开规范：[产品页](https://pro.beui.dev/components/api-keys) · [Markdown](https://pro.beui.dev/components/api-keys.md)
- 状态：已实现；代码/DOM 验收范围与未验收边界见顶部交付记录。
- 独立验收项：1. API keys manager。
- 家族专属验收：创建、复制、命名与撤销密钥交由宿主；默认遮蔽秘密；撤销需确认；处理提交失败且不在日志泄露密钥。
- 复用候选：[`table`](../components/motion/table/index.tsx)、[`approval-card`](../components/agents/approval-card/index.tsx)。

#### Team Invites · `team-invite`

- 公开规范：[产品页](https://pro.beui.dev/components/team-invite) · [Markdown](https://pro.beui.dev/components/team-invite.md)
- 状态：已实现；代码/DOM 验收范围与未验收边界见顶部交付记录。
- 独立验收项：1. Invite teammates。
- 家族专属验收：校验多个邮箱、角色与重复邀请；待处理/已加入状态明确；发送、重发、撤销均有回调与失败反馈。
- 复用候选：[`input`](../components/motion/input.tsx)、[`selector`](../components/motion/selector.tsx)。

#### File Upload · `file-upload`

- 公开规范：[产品页](https://pro.beui.dev/components/file-upload) · [Markdown](https://pro.beui.dev/components/file-upload.md)
- 状态：已实现；代码/DOM 验收范围与未验收边界见顶部交付记录。
- 独立验收项：1. Upload dropzone。
- 家族专属验收：文件选择和拖放共用校验；队列、进度、失败重试和删除可接真实上传；不把计时器进度当上传完成。
- 复用候选：[`file-upload`](../components/motion/file-upload.tsx)。

#### What's New · `whats-new`

- 公开规范：[产品页](https://pro.beui.dev/components/whats-new) · [Markdown](https://pro.beui.dev/components/whats-new.md)
- 状态：已实现；代码/DOM 验收范围与未验收边界见顶部交付记录。
- 独立验收项：1. Release spotlight。
- 家族专属验收：按发布数据切换内容；媒体、链接与关闭操作有效；读过/未读与版本由宿主或显式本地存储策略控制。
- 复用候选：[`image-viewer`](../components/motion/morphing-lightbox.tsx)。

#### Credit Usage · `credit-usage`

- 公开规范：[产品页](https://pro.beui.dev/components/credit-usage) · [Markdown](https://pro.beui.dev/components/credit-usage.md)
- 状态：已实现；代码/DOM 验收范围与未验收边界见顶部交付记录。
- 独立验收项：1. Daily trend；2. Usage breakdown。
- 家族专属验收：日期范围驱动趋势与分类明细；消耗、剩余与计量单位一致；无数据、零额度和超额清晰呈现。
- 复用候选：[`line-chart`](../components/charts/line-chart.tsx)、[`bar-chart`](../components/charts/bar-chart.tsx)。

#### Usage Budget · `usage-budget`

- 公开规范：[产品页](https://pro.beui.dev/components/usage-budget) · [Markdown](https://pro.beui.dev/components/usage-budget.md)
- 状态：已实现；代码/DOM 验收范围与未验收边界见顶部交付记录。
- 独立验收项：1. Usage Budget。
- 家族专属验收：额度、用量、阈值和周期外置；修改预算可提交/取消；超额状态与单位准确，不代替服务端限额。
- 复用候选：[`range-slider`](../components/motion/range-slider.tsx)、[`composition-chart`](../components/charts/composition-chart.tsx)。

#### Research Sources · `research-sources`

- 公开规范：[产品页](https://pro.beui.dev/components/research-sources) · [Markdown](https://pro.beui.dev/components/research-sources.md)
- 状态：已实现；代码/DOM 验收范围与未验收边界见顶部交付记录。
- 独立验收项：1. Research Sources。
- 家族专属验收：来源 URL、标题、摘要与类型由数据传入；过滤、展开和跳转可用；不伪造检索结果或引用。
- 复用候选：[`citations`](../components/agents/citations.tsx)、[`agent-activity`](../components/agents/agent-activity/index.tsx)。

#### Conversion Funnel · `conversion-funnel`

- 公开规范：[产品页](https://pro.beui.dev/components/conversion-funnel) · [Markdown](https://pro.beui.dev/components/conversion-funnel.md)
- 状态：已实现；代码/DOM 验收范围与未验收边界见顶部交付记录。
- 独立验收项：1. Conversion Funnel。
- 家族专属验收：各阶段数量、转换与流失计算一致；阶段选择显示对应明细；正确处理零分母与缺失值。
- 复用候选：[`funnel-chart`](../components/charts/funnel-chart.tsx)。

#### Live Collaboration · `collaboration`

- 公开规范：[产品页](https://pro.beui.dev/components/collaboration) · [Markdown](https://pro.beui.dev/components/collaboration.md)
- 状态：已实现；代码/DOM 验收范围与未验收边界见顶部交付记录。
- 独立验收项：1. Live document。
- 家族专属验收：文档值、协作者和选区由宿主驱动；本地编辑产生变化事件；持久化与网络同步显式接入，不能宣称自带多人同步。
- 复用候选：[`avatar-group`](../components/motion/avatar-group.tsx)、[`input`](../components/motion/input.tsx)。

#### Messaging · `messaging`

- 公开规范：[产品页](https://pro.beui.dev/components/messaging) · [Markdown](https://pro.beui.dev/components/messaging.md)
- 状态：已实现；代码/DOM 验收范围与未验收边界见顶部交付记录。
- 独立验收项：1. Messaging app。
- 家族专属验收：会话选择、消息发送、附件与已读状态可接宿主；滚动跟随尊重读者位置；错误与发送中状态独立。
- 复用候选：[`chat-app`](../components/agents/chat-app.tsx)、[`message`](../components/agents/message.tsx)、[`message-scroller`](../components/agents/message-scroller.tsx)、[`prompt-input`](../components/agents/prompt-input.tsx)。

#### Order Tracking · `order-tracking`

- 公开规范：[产品页](https://pro.beui.dev/components/order-tracking) · [Markdown](https://pro.beui.dev/components/order-tracking.md)
- 状态：已实现；代码/DOM 验收范围与未验收边界见顶部交付记录。
- 独立验收项：1. Delivery tracker。
- 家族专属验收：订单时间线、运输阶段与明细由数据驱动；当前、已完成、异常阶段不同；查看详情与支持链接有效。
- 复用候选：[`timeline`](../components/motion/timeline.tsx)。

#### AI Artifacts · `ai-artifacts`

- 公开规范：[产品页](https://pro.beui.dev/components/ai-artifacts) · [Markdown](https://pro.beui.dev/components/ai-artifacts.md)
- 状态：已实现；代码/DOM 验收范围与未验收边界见顶部交付记录。
- 独立验收项：1. Code artifact；2. Document artifact。
- 家族专属验收：代码与文档两种产物分别处理展示、版本、复制及下载；下载内容与当前版本一致；预览不得执行不可信代码。
- 复用候选：[`code-block`](../components/agents/code-block.tsx)、[`streaming-response`](../components/agents/streaming-response.tsx)。

#### What We Offer · `what-we-offer`

- 公开规范：[产品页](https://pro.beui.dev/components/what-we-offer) · [Markdown](https://pro.beui.dev/components/what-we-offer.md)
- 状态：已实现；代码/DOM 验收范围与未验收边界见顶部交付记录。
- 独立验收项：1. Offer bento；2. Layered control stack；3. Connected workflow。
- 家族专属验收：Bento、控制栈与连接流程各有独立内容结构和响应式布局；步骤/节点交互对应实际内容，非装饰按钮。
- 复用候选：[`card`](../components/motion/card.tsx)、[`sortable-stack`](../components/motion/sortable-list.tsx)。

#### Step Form · `step-form`

- 公开规范：[产品页](https://pro.beui.dev/components/step-form) · [Markdown](https://pro.beui.dev/components/step-form.md)
- 状态：已实现；代码/DOM 验收范围与未验收边界见顶部交付记录。
- 独立验收项：1. Focused step form；2. Card stack；3. Inline prompt；4. Onboarding form。
- 家族专属验收：四种表单呈现共用回答数据而非重复状态；步骤校验、返回、分支与异步提交可操作；失败保留输入。
- 复用候选：[`approval-card`](../components/agents/approval-card/index.tsx)、[`signup-form`](../components/motion/signup-form.tsx)。

#### Empty States · `empty-states`

- 公开规范：[产品页](https://pro.beui.dev/components/empty-states) · [Markdown](https://pro.beui.dev/components/empty-states.md)
- 状态：已实现；代码/DOM 验收范围与未验收边界见顶部交付记录。
- 独立验收项：1. Archive drawer；2. Search lens；3. Inbox zero；4. Blank board。
- 家族专属验收：归档、搜索、收件箱与空看板分别表达相应状态；主要恢复动作来自宿主；动效不遮住说明和按钮。
- 复用候选：[`card`](../components/motion/card.tsx)。

#### Agent Chat Input · `agent-chat-input`

- 公开规范：[产品页](https://pro.beui.dev/components/agent-chat-input) · [Markdown](https://pro.beui.dev/components/agent-chat-input.md)
- 状态：已实现；代码/DOM 验收范围与未验收边界见顶部交付记录。
- 独立验收项：1. Creative composer；2. Pill composer；3. Studio composer；4. Credits composer。
- 家族专属验收：四种 Composer 布局区分；文本、附件、模型/工具选取与发送/停止可接宿主；处理 IME、空内容、发送中和失败。
- 复用候选：[`prompt-input`](../components/agents/prompt-input.tsx)、[`selector`](../components/motion/selector.tsx)。

#### Hero Sections · `hero-sections`

- 公开规范：[产品页](https://pro.beui.dev/components/hero-sections) · [Markdown](https://pro.beui.dev/components/hero-sections.md)
- 状态：已实现；代码/DOM 验收范围与未验收边界见顶部交付记录。
- 独立验收项：1. Analytics flow；2. AI teammates；3. Voice mobile；4. Workflow aurora；5. DeFi routing；6. AI marketplace；7. Signal aurora；8. Workflow split；9. Agent centered；10. Code demo；11. Centered demo；12. Centered marquee。
- 家族专属验收：十二种 Hero 各有独立构图与内容槽；CTA、演示切换和导航有效；装饰动效在移动端、减少动态效果与无图片时仍可读。
- 复用候选：未建立专用映射；实现前按功能对照现有 catalog。

#### Pricing · `pricing`

- 公开规范：[产品页](https://pro.beui.dev/components/pricing) · [Markdown](https://pro.beui.dev/components/pricing.md)
- 状态：已实现；代码/DOM 验收范围与未验收边界见顶部交付记录。
- 独立验收项：1. AI pricing；2. Shared benefits；3. Team calculator；4. Aurora duo；5. Aurora flow；6. Visual plans；7. Pricing command deck；8. Upgrade panel；9. Usage slider；10. Plans grid；11. Pricing ledger。
- 家族专属验收：十一种布局保留各自交互；账期切换、人数/用量计算与套餐选择使用真实价格输入；货币、周期与舍入规则一致。
- 复用候选：[`range-slider`](../components/motion/range-slider.tsx)、[`switch`](../components/motion/switch.tsx)、[`card`](../components/motion/card.tsx)。

#### Footer Sections · `footer-sections`

- 公开规范：[产品页](https://pro.beui.dev/components/footer-sections) · [Markdown](https://pro.beui.dev/components/footer-sections.md)
- 状态：已实现；代码/DOM 验收范围与未验收边界见顶部交付记录。
- 独立验收项：1. Panorama footer；2. Wordmark footer；3. Landscape footer；4. Studio footer；5. Local time footer；6. Gradient frame footer；7. Spotlight footer；8. Mega footer；9. Directory footer。
- 家族专属验收：九种布局独立实现；链接、分组与社交项外置；本地时间变体真实更新且时区明确；窄屏不溢出。
- 复用候选：未建立专用映射；实现前按功能对照现有 catalog。

#### Feature Sections · `feature-sections`

- 公开规范：[产品页](https://pro.beui.dev/components/feature-sections) · [Markdown](https://pro.beui.dev/components/feature-sections.md)
- 状态：已实现；代码/DOM 验收范围与未验收边界见顶部交付记录。
- 独立验收项：1. Visual benefits；2. Alternating feature rows；3. Product hotspots；4. Feature showcase；5. Benefits triptych；6. Signal grid；7. Control deck；8. Voice AI；9. Feature list；10. Feature steps；11. Feature bento；12. Feature tabs；13. Feature stage tabs。
- 家族专属验收：十三种特性组合保留热点、步骤、标签页与舞台切换的区别；当前选择与内容同步，所有交互提供键盘路径。
- 复用候选：[`tabs`](../components/motion/tabs.tsx)。

#### Content Sections · `content-sections`

- 公开规范：[产品页](https://pro.beui.dev/components/content-sections) · [Markdown](https://pro.beui.dev/components/content-sections.md)
- 状态：已实现；代码/DOM 验收范围与未验收边界见顶部交付记录。
- 独立验收项：1. Platform overview；2. Isometric metrics gallery；3. Capability showcase；4. Value grid；5. Engagement sequence。
- 家族专属验收：五种内容系统各有独立布局；指标、能力、价值与参与步骤数据外置；图文、交互与选中内容一致。
- 复用候选：[`card`](../components/motion/card.tsx)。

#### Blog Sections · `blog-sections`

- 公开规范：[产品页](https://pro.beui.dev/components/blog-sections) · [Markdown](https://pro.beui.dev/components/blog-sections.md)
- 状态：已实现；代码/DOM 验收范围与未验收边界见顶部交付记录。
- 独立验收项：1. Image-first cards；2. Featured stories；3. Article list；4. Article cards。
- 家族专属验收：四种文章组合使用真实文章模型；分类、分页/展开和链接保持正确；空列表与缺图有明确布局。
- 复用候选：未建立专用映射；实现前按功能对照现有 catalog。

#### Trust and Security · `trust-security`

- 公开规范：[产品页](https://pro.beui.dev/components/trust-security) · [Markdown](https://pro.beui.dev/components/trust-security.md)
- 状态：已实现；代码/DOM 验收范围与未验收边界见顶部交付记录。
- 独立验收项：1. Enterprise readiness；2. Compliance marks；3. Security safeguards；4. Reliability and support。
- 家族专属验收：四种安全/可靠性组合接受宿主声明与证据链接；不能把示例徽章当作本项目已获认证或 SLA 保证。
- 复用候选：未建立专用映射；实现前按功能对照现有 catalog。

#### Announcement Banners · `announcement-banners`

- 公开规范：[产品页](https://pro.beui.dev/components/announcement-banners) · [Markdown](https://pro.beui.dev/components/announcement-banners.md)
- 状态：已实现；代码/DOM 验收范围与未验收边界见顶部交付记录。
- 独立验收项：1. Gradient marquee strip；2. Shader launch modal；3. Rotating announcement ribbon；4. Stacked announcement cards。
- 家族专属验收：四种公告结构区分；轮播可停、关闭不吞焦点；模态版本遵守弹层规则；CTA 与公告数据可配置。
- 复用候选：未建立专用映射；实现前按功能对照现有 catalog。

#### Use Cases · `use-cases`

- 公开规范：[产品页](https://pro.beui.dev/components/use-cases) · [Markdown](https://pro.beui.dev/components/use-cases.md)
- 状态：已实现；代码/DOM 验收范围与未验收边界见顶部交付记录。
- 独立验收项：1. Animated story collage；2. Role stories；3. Outcome stories；4. Everyday scenario rail；5. Cinematic shader spotlight。
- 家族专属验收：五种使用场景独立构图；角色、成果、场景与聚焦内容切换一致；轮播有键盘控制与暂停机制。
- 复用候选：[`tabs`](../components/motion/tabs.tsx)、[`cylinder-carousel`](../components/motion/cylinder-carousel.tsx)。

#### App Showcase · `app-showcase`

- 公开规范：[产品页](https://pro.beui.dev/components/app-showcase) · [Markdown](https://pro.beui.dev/components/app-showcase.md)
- 状态：已实现；代码/DOM 验收范围与未验收边界见顶部交付记录。
- 独立验收项：1. Phone tour。
- 家族专属验收：手机展示与步骤/页面选中同步；点击和键盘均可切换；媒体有替代描述，移动端展示比例合理。
- 复用候选：[`tabs`](../components/motion/tabs.tsx)。

#### Roadmap · `roadmap`

- 公开规范：[产品页](https://pro.beui.dev/components/roadmap) · [Markdown](https://pro.beui.dev/components/roadmap.md)
- 状态：已实现；代码/DOM 验收范围与未验收边界见顶部交付记录。
- 独立验收项：1. Release timeline。
- 家族专属验收：阶段、版本和状态由数据传入；过滤与选中详情有效；日期排序明确，未定日期不得伪造。
- 复用候选：[`timeline`](../components/motion/timeline.tsx)。

#### Agent Traces · `agent-traces`

- 公开规范：[产品页](https://pro.beui.dev/components/agent-traces) · [Markdown](https://pro.beui.dev/components/agent-traces.md)
- 状态：已实现；代码/DOM 验收范围与未验收边界见顶部交付记录。
- 独立验收项：1. Trace waterfall；2. Runs list。
- 家族专属验收：Runs 列表与 Waterfall 共享真实 trace 数据；父子关系、持续时间、错误、token 和 I/O 可查看；大/空 trace 可用。
- 复用候选：[`agent-activity`](../components/agents/agent-activity/index.tsx)、[`tool-result`](../components/agents/tool-result.tsx)。

#### Agent Plan · `agent-plan`

- 公开规范：[产品页](https://pro.beui.dev/components/agent-plan) · [Markdown](https://pro.beui.dev/components/agent-plan.md)
- 状态：已实现；代码/DOM 验收范围与未验收边界见顶部交付记录。
- 独立验收项：1. Plan runner；2. Plan pill。
- 家族专属验收：Runner 与 Pill 对同一任务状态建模；步骤进度、暂停/取消/重试回调与展开收起有效；完成计数无重复。
- 复用候选：[`todo-list`](../components/agents/todo-list.tsx)。

#### Tool Approval · `tool-approval`

- 公开规范：[产品页](https://pro.beui.dev/components/tool-approval) · [Markdown](https://pro.beui.dev/components/tool-approval.md)
- 状态：已实现；代码/DOM 验收范围与未验收边界见顶部交付记录。
- 独立验收项：1. Approval queue。
- 家族专属验收：待审批队列可逐项审查参数与风险；允许一次/总是允许/拒绝等决定明确；提交中防重复、失败可恢复。
- 复用候选：[`tool-approval`](../components/agents/tool-approval.tsx)、[`approval-card`](../components/agents/approval-card/index.tsx)。

#### Background Agents · `background-agents`

- 公开规范：[产品页](https://pro.beui.dev/components/background-agents) · [Markdown](https://pro.beui.dev/components/background-agents.md)
- 状态：已实现；代码/DOM 验收范围与未验收边界见顶部交付记录。
- 独立验收项：1. Agent list。
- 家族专属验收：任务列表呈现独立运行状态、进度和结果；取消、打开与重试交给宿主；多个并发任务不串状态。
- 复用候选：[`agent-activity`](../components/agents/agent-activity/index.tsx)、[`tool-result`](../components/agents/tool-result.tsx)。

#### Context Window · `context-window`

- 公开规范：[产品页](https://pro.beui.dev/components/context-window) · [Markdown](https://pro.beui.dev/components/context-window.md)
- 状态：已实现；代码/DOM 验收范围与未验收边界见顶部交付记录。
- 独立验收项：1. Context meter。
- 家族专属验收：总容量与分类占用数据驱动；展开来源/明细；接近上限与超限正确；token 与百分比不混用。
- 复用候选：[`composition-chart`](../components/charts/composition-chart.tsx)、[`popover`](../components/motion/popover.tsx)。

#### Diff Review · `diff-review`

- 公开规范：[产品页](https://pro.beui.dev/components/diff-review) · [Markdown](https://pro.beui.dev/components/diff-review.md)
- 状态：已实现；代码/DOM 验收范围与未验收边界见顶部交付记录。
- 独立验收项：1. File review。
- 家族专属验收：多文件切换与逐文件/区块审阅；评论和接受/拒绝回调可接宿主；行号、增删计数与所选版本一致。
- 复用候选：[`file-diff`](../components/agents/file-diff.tsx)、[`code-block`](../components/agents/code-block.tsx)。

#### Agent Team · `agent-team`

- 公开规范：[产品页](https://pro.beui.dev/components/agent-team) · [Markdown](https://pro.beui.dev/components/agent-team.md)
- 状态：已实现；代码/DOM 验收范围与未验收边界见顶部交付记录。
- 独立验收项：1. Subagent tree。
- 家族专属验收：层级任务与代理关系由数据传入；展开节点查看状态/结果；取消/重试按节点 ID 操作，不影响兄弟节点。
- 复用候选：[`agent-activity`](../components/agents/agent-activity/index.tsx)、[`todo-list`](../components/agents/todo-list.tsx)。

#### Case Studies · `case-studies`

- 公开规范：[产品页](https://pro.beui.dev/components/case-studies) · [Markdown](https://pro.beui.dev/components/case-studies.md)
- 状态：已实现；代码/DOM 验收范围与未验收边界见顶部交付记录。
- 独立验收项：1. Story spotlight；2. Story grid。
- 家族专属验收：聚焦故事与故事网格两种组合；客户、成果与链接外置；切换同步媒体、引文与元数据。
- 复用候选：未建立专用映射；实现前按功能对照现有 catalog。

#### Product Tour · `product-tour`

- 公开规范：[产品页](https://pro.beui.dev/components/product-tour) · [Markdown](https://pro.beui.dev/components/product-tour.md)
- 状态：已实现；代码/DOM 验收范围与未验收边界见顶部交付记录。
- 独立验收项：1. Pinned story。
- 家族专属验收：固定叙事与当前步骤同步；滚动与直接选择均可驱动；窄屏转为自然流，减少动态效果不丢内容。
- 复用候选：[`scroll-animation`](../components/motion/smooth-scroll.tsx)。

#### How It Works · `how-it-works`

- 公开规范：[产品页](https://pro.beui.dev/components/how-it-works) · [Markdown](https://pro.beui.dev/components/how-it-works.md)
- 状态：已实现；代码/DOM 验收范围与未验收边界见顶部交付记录。
- 独立验收项：1. Centered process cards；2. Cinematic process grid；3. Editorial story stack；4. Guided walkthrough；5. Progressive card deck。
- 家族专属验收：五种过程叙事保留各自导航与展开形式；步骤标题、内容与进度同步；无 JS 动画时仍能读完流程。
- 复用候选：[`tabs`](../components/motion/tabs.tsx)、[`card-dealer`](../components/motion/card-dealer.tsx)。

#### Logo Cloud · `logo-cloud`

- 公开规范：[产品页](https://pro.beui.dev/components/logo-cloud) · [Markdown](https://pro.beui.dev/components/logo-cloud.md)
- 状态：已实现；代码/DOM 验收范围与未验收边界见顶部交付记录。
- 独立验收项：1. Logo marquee；2. Logo grid；3. Kinetic logo columns；4. Rolling logo carousel。
- 家族专属验收：跑马灯、网格、动列与轮播分别实现；Logo/链接外置；可暂停，复制装饰项不重复暴露给读屏。
- 复用候选：[`marquee`](../components/motion/marquee.tsx)。

#### Calendar · `calendar`

- 公开规范：[产品页](https://pro.beui.dev/components/calendar) · [Markdown](https://pro.beui.dev/components/calendar.md)
- 状态：已实现；代码/DOM 验收范围与未验收边界见顶部交付记录。
- 独立验收项：1. Appointment booking；2. Calendar planner。
- 家族专属验收：预约选择与日历规划是两套行为；日期/时区、可预约时段、事件编辑与冲突由明确数据契约控制。
- 复用候选：[`date-time-picker`](../components/motion/date-time-picker.tsx)、[`date-range-picker`](../components/motion/date-range-picker.tsx)、[`availability-scheduler`](../components/motion/availability-scheduler/index.tsx)。

#### Sidebar · `sidebar`

- 公开规范：[产品页](https://pro.beui.dev/components/sidebar) · [Markdown](https://pro.beui.dev/components/sidebar.md)
- 状态：已实现；代码/DOM 验收范围与未验收边界见顶部交付记录。
- 独立验收项：1. Rail sidebar；2. Workspace sidebar；3. Off-canvas sidebar。
- 家族专属验收：Rail、Workspace、Off-canvas 分别验收；折叠、嵌套菜单、路由选中与移动端焦点管理可接宿主。
- 复用候选：[`animated-sidebar`](../components/motion/animated-sidebar.tsx)、[`ai-sidebar`](../components/agents/ai-sidebar.tsx)、[`workspace-shell`](../components/workspace/workspace-shell.tsx)。

#### Data Tables · `data-tables`

- 公开规范：[产品页](https://pro.beui.dev/components/data-tables) · [Markdown](https://pro.beui.dev/components/data-tables.md)
- 状态：已实现；代码/DOM 验收范围与未验收边界见顶部交付记录。
- 独立验收项：1. Orders table；2. People directory；3. Portfolio table；4. SLA monitoring table。
- 家族专属验收：订单、人员、投资组合与 SLA 使用不同列模型、筛选器与行操作；复用 Table，但不是仅替换列标题。
- 复用候选：[`table`](../components/motion/table/index.tsx)。

#### Social Proof · `social-proof`

- 公开规范：[产品页](https://pro.beui.dev/components/social-proof) · [Markdown](https://pro.beui.dev/components/social-proof.md)
- 状态：已实现；代码/DOM 验收范围与未验收边界见顶部交付记录。
- 独立验收项：1. Evidence brief；2. Customer story gallery；3. Customer story reel。
- 家族专属验收：证据简报、故事画廊与故事 Reel 各有独立组合；数据和来源外置；自动播放可停，选中项与详情同步。
- 复用候选：未建立专用映射；实现前按功能对照现有 catalog。

#### Stats · `stats`

- 公开规范：[产品页](https://pro.beui.dev/components/stats) · [Markdown](https://pro.beui.dev/components/stats.md)
- 状态：已实现；代码/DOM 验收范围与未验收边界见顶部交付记录。
- 独立验收项：1. Segmented progress cards；2. Feature outcomes；3. Impact dashboard；4. Telemetry console；5. Stats band；6. Stats cards；7. Outcome index。
- 家族专属验收：七种统计结构独立实现；分段、成果、遥测与摘要均由输入数据计算；单位、时间范围、空值与变化方向明确。
- 复用候选：[`number`](../components/motion/animated-number.tsx)、[`composition-chart`](../components/charts/composition-chart.tsx)。

#### Testimonials · `testimonials`

- 公开规范：[产品页](https://pro.beui.dev/components/testimonials) · [Markdown](https://pro.beui.dev/components/testimonials.md)
- 状态：已实现；代码/DOM 验收范围与未验收边界见顶部交付记录。
- 独立验收项：1. Marquee wall；2. Spotlight；3. Masonry grid；4. Archive wall；5. Vertical dispatch。
- 家族专属验收：五种推荐语布局；内容、头像、署名和链接外置；轮播可停；重复副本不造成重复读屏内容。
- 复用候选：[`marquee`](../components/motion/marquee.tsx)、[`infinite-masonry`](../components/motion/infinite-masonry.tsx)。

#### Image Galleries · `image-galleries`

- 公开规范：[产品页](https://pro.beui.dev/components/image-galleries) · [Markdown](https://pro.beui.dev/components/image-galleries.md)
- 状态：已实现；代码/DOM 验收范围与未验收边界见顶部交付记录。
- 独立验收项：1. Vertical image gallery；2. Morphing mosaic；3. Expanding focus rail。
- 家族专属验收：垂直、Mosaic 与 Focus Rail 各自布局；选择、聚焦与媒体描述一致；图片加载失败不阻断导航。
- 复用候选：[`image-viewer`](../components/motion/morphing-lightbox.tsx)、[`cylinder-carousel`](../components/motion/cylinder-carousel.tsx)、[`infinite-masonry`](../components/motion/infinite-masonry.tsx)。

#### Navbar · `navbar`

- 公开规范：[产品页](https://pro.beui.dev/components/navbar) · [Markdown](https://pro.beui.dev/components/navbar.md)
- 状态：已实现；代码/DOM 验收范围与未验收边界见顶部交付记录。
- 独立验收项：1. Pill navigation；2. Full-width mega menu；3. Morphing navbar；4. Feature morph；5. Expanding pill；6. Simple header。
- 家族专属验收：六种导航布局；活动链接、嵌套菜单、移动端切换与焦点管理完整；不能用 hover-only 菜单代替触屏交互。
- 复用候选：未建立专用映射；实现前按功能对照现有 catalog。

#### Newsletter · `newsletter`

- 公开规范：[产品页](https://pro.beui.dev/components/newsletter) · [Markdown](https://pro.beui.dev/components/newsletter.md)
- 状态：已实现；代码/DOM 验收范围与未验收边界见顶部交付记录。
- 独立验收项：1. Issue preview；2. Inline signup；3. Preferences card。
- 家族专属验收：三种订阅布局；邮箱/偏好校验与异步提交；成功、失败与再次提交真实关联回调结果，不伪造订阅。
- 复用候选：[`signup-form`](../components/motion/signup-form.tsx)、[`input`](../components/motion/input.tsx)。

#### Contact · `contact`

- 公开规范：[产品页](https://pro.beui.dev/components/contact) · [Markdown](https://pro.beui.dev/components/contact.md)
- 状态：已实现；代码/DOM 验收范围与未验收边界见顶部交付记录。
- 独立验收项：1. Routing desk；2. Office split；3. Method cards。
- 家族专属验收：Routing、Office 与 Method 三种联系流程；字段校验与宿主提交；真实地址/渠道可配置，不伪造发送成功。
- 复用候选：[`input`](../components/motion/input.tsx)、[`select`](../components/motion/select.tsx)。

#### Integrations · `integrations`

- 公开规范：[产品页](https://pro.beui.dev/components/integrations) · [Markdown](https://pro.beui.dev/components/integrations.md)
- 状态：已实现；代码/DOM 验收范围与未验收边界见顶部交付记录。
- 独立验收项：1. Integration health；2. Integration directory；3. Editorial integration grid；4. Integration orbit；5. Integration ledger。
- 家族专属验收：五种布局支持相应目录/状态数据；搜索、分类、授权/断开动作可接宿主；示例连接不被描述为真实授权。
- 复用候选：未建立专用映射；实现前按功能对照现有 catalog。

#### Crypto Markets · `crypto-markets`

- 公开规范：[产品页](https://pro.beui.dev/components/crypto-markets) · [Markdown](https://pro.beui.dev/components/crypto-markets.md)
- 状态：已实现；代码/DOM 验收范围与未验收边界见顶部交付记录。
- 独立验收项：1. Live price table；2. Order book；3. Perps positions。
- 家族专属验收：价格表、订单簿和永续仓位使用宿主市场快照；交易对/方向/精度与排序正确；不伪造实时行情。
- 复用候选：[`order-book`](../components/charts/order-book.tsx)、[`table`](../components/motion/table/index.tsx)、[`line-chart`](../components/charts/line-chart.tsx)。

#### Tokenomics · `tokenomics`

- 公开规范：[产品页](https://pro.beui.dev/components/tokenomics) · [Markdown](https://pro.beui.dev/components/tokenomics.md)
- 状态：已实现；代码/DOM 验收范围与未验收边界见顶部交付记录。
- 独立验收项：1. Distribution and unlocks。
- 家族专属验收：分配与解锁来自明确定义的 token 数量和时间；比例、累计解锁与时间线一致；单位、精度和时区可配置。
- 复用候选：[`composition-chart`](../components/charts/composition-chart.tsx)、[`timeline`](../components/motion/timeline.tsx)。

#### Crypto Wallet · `crypto-wallet`

- 公开规范：[产品页](https://pro.beui.dev/components/crypto-wallet) · [Markdown](https://pro.beui.dev/components/crypto-wallet.md)
- 状态：已实现；代码/DOM 验收范围与未验收边界见顶部交付记录。
- 独立验收项：1. Swap, send, and buy；2. Cross-chain bridge；3. Portfolio overview；4. Staking vaults；5. Asset detail；6. Transaction activity。
- 家族专属验收：六种钱包组合分别涵盖换币/发送/买入、跨链、资产、质押、详情与流水；金额、余额和链一致；真实钱包调用由宿主注入。
- 复用候选：[`swap`](../components/motion/swap.tsx)、[`wallet-card`](../components/motion/wallet-card/index.tsx)、[`table`](../components/motion/table/index.tsx)。

#### File Manager · `file-manager`

- 公开规范：[产品页](https://pro.beui.dev/components/file-manager) · [Markdown](https://pro.beui.dev/components/file-manager.md)
- 状态：已实现；代码/DOM 验收范围与未验收边界见顶部交付记录。
- 独立验收项：1. File workspace。
- 家族专属验收：目录/文件切换、搜索、排序、选择与预览；重命名、移动、上传和删除有回调与失败恢复；稳定 ID 不因排序变化。
- 复用候选：[`file-tree`](../components/motion/file-tree.tsx)、[`file-upload`](../components/motion/file-upload.tsx)。

#### Ecommerce · `ecommerce`

- 公开规范：[产品页](https://pro.beui.dev/components/ecommerce) · [Markdown](https://pro.beui.dev/components/ecommerce.md)
- 状态：已实现；代码/DOM 验收范围与未验收边界见顶部交付记录。
- 独立验收项：1. Product grid；2. Product detail；3. Shopping cart。
- 家族专属验收：商品网格、详情和购物车共享商品/库存/规格模型；数量与总价计算正确；购买/结算接宿主，不伪造支付。
- 复用候选：[`card`](../components/motion/card.tsx)、[`range-slider`](../components/motion/range-slider.tsx)。

#### Comparison · `comparison`

- 公开规范：[产品页](https://pro.beui.dev/components/comparison) · [Markdown](https://pro.beui.dev/components/comparison.md)
- 状态：已实现；代码/DOM 验收范围与未验收边界见顶部交付记录。
- 独立验收项：1. Before and after；2. Bar comparison；3. Feature comparison；4. Workflow comparison；5. Head-to-head comparison；6. Tiled matrix；7. Spotlight comparison。
- 家族专属验收：七种对比结构分别支持相应矩阵、条形、流程或焦点内容；数据、列与选中项对应；左右语义与无障碍读序明确。
- 复用候选：[`table`](../components/motion/table/index.tsx)。

#### Agent Builder · `agent-builder`

- 公开规范：[产品页](https://pro.beui.dev/components/agent-builder) · [Markdown](https://pro.beui.dev/components/agent-builder.md)
- 状态：已实现；代码/DOM 验收范围与未验收边界见顶部交付记录。
- 独立验收项：1. Agent workspace。
- 家族专属验收：代理配置、工具/知识/模型选择与试聊真实修改宿主状态；保存、验证、运行与错误流程完整，不假装已部署代理。
- 复用候选：[`selector`](../components/motion/selector.tsx)、[`prompt-input`](../components/agents/prompt-input.tsx)、[`chat-app`](../components/agents/chat-app.tsx)。

#### Knowledge Base · `knowledge-base`

- 公开规范：[产品页](https://pro.beui.dev/components/knowledge-base) · [Markdown](https://pro.beui.dev/components/knowledge-base.md)
- 状态：已实现；代码/DOM 验收范围与未验收边界见顶部交付记录。
- 独立验收项：1. AI knowledge workspace；2. Searchable help center。
- 家族专属验收：AI 知识工作区与 Help Center 分别处理文档管理和问题检索；状态、来源与结果由宿主提供；不把静态过滤当向量检索。
- 复用候选：[`file-tree`](../components/motion/file-tree.tsx)、[`citations`](../components/agents/citations.tsx)、[`table`](../components/motion/table/index.tsx)。

#### Team · `team`

- 公开规范：[产品页](https://pro.beui.dev/components/team) · [Markdown](https://pro.beui.dev/components/team.md)
- 状态：已实现；代码/DOM 验收范围与未验收边界见顶部交付记录。
- 独立验收项：1. Expanding panels；2. Spotlight；3. Team grid；4. Team marquee。
- 家族专属验收：展开面板、Spotlight、网格与 Marquee 各有独立结构；成员选择、简介和社交链接同步；hover 以外提供焦点/触摸路径。
- 复用候选：[`avatar-group`](../components/motion/avatar-group.tsx)、[`marquee`](../components/motion/marquee.tsx)。

#### FAQ Blocks · `faq-blocks`

- 公开规范：[产品页](https://pro.beui.dev/components/faq-blocks) · [Markdown](https://pro.beui.dev/components/faq-blocks.md)
- 状态：已实现；代码/DOM 验收范围与未验收边界见顶部交付记录。
- 独立验收项：1. Numbered FAQ；2. AI workspace FAQ；3. Stacked FAQ；4. Split FAQ；5. Searchable FAQ。
- 家族专属验收：编号、AI、堆叠、分栏与可搜索五种 FAQ；展开/收起、搜索空结果与定位有效；问题内容可配置。
- 复用候选：[`bouncy-accordion`](../components/motion/bouncy-accordion.tsx)、[`input`](../components/motion/input.tsx)。

#### CTA Sections · `cta-sections`

- 公开规范：[产品页](https://pro.beui.dev/components/cta-sections) · [Markdown](https://pro.beui.dev/components/cta-sections.md)
- 状态：已实现；代码/DOM 验收范围与未验收边界见顶部交付记录。
- 独立验收项：1. Sunflower CTA；2. Floating gallery CTA；3. Portrait frame CTA；4. Product window CTA；5. Proof orbit CTA；6. Shade panel CTA；7. Liquid CTA；8. Terminal CTA；9. FAQ CTA；10. Split CTA。
- 家族专属验收：十种 CTA 分别实现公开叙述的独立结构；链接、终端动作、FAQ 或媒体切换接宿主；无空点击按钮。
- 复用候选：未建立专用映射；实现前按功能对照现有 catalog。


### 整页

#### Dashboards · `dashboards`

- 公开规范：[产品页](https://pro.beui.dev/components/dashboards) · [Markdown](https://pro.beui.dev/components/dashboards.md)
- 状态：已实现；代码/DOM 验收范围与未验收边界见顶部交付记录。
- 独立验收项：1. Finance；2. Support；3. Team capacity；4. Goals。
- 家族专属验收：Finance、Support、Team capacity、Goals 使用各自的数据结构与布局；图表、期间切换与钻取响应数据，不能是同一套卡片换标题。
- 复用候选：[`workspace-shell`](../components/workspace/workspace-shell.tsx)、[`line-chart`](../components/charts/line-chart.tsx)、[`bar-chart`](../components/charts/bar-chart.tsx)、[`table`](../components/motion/table/index.tsx)。

#### Crypto Agent · `crypto-agent`

- 公开规范：[产品页](https://pro.beui.dev/components/crypto-agent) · [Markdown](https://pro.beui.dev/components/crypto-agent.md)
- 状态：已实现；代码/DOM 验收范围与未验收边界见顶部交付记录。
- 独立验收项：1. Transaction chat。
- 家族专属验收：交易对话可展示提案、参数、审批、执行和结果；真正签名/广播由宿主负责；未完成交易绝不显示链上成功。
- 复用候选：[`chat-app`](../components/agents/chat-app.tsx)、[`tool-approval`](../components/agents/tool-approval.tsx)、[`swap`](../components/motion/swap.tsx)。

#### Crypto Governance · `crypto-governance`

- 公开规范：[产品页](https://pro.beui.dev/components/crypto-governance) · [Markdown](https://pro.beui.dev/components/crypto-governance.md)
- 状态：已实现；代码/DOM 验收范围与未验收边界见顶部交付记录。
- 独立验收项：1. Proposals overview；2. Proposal page。
- 家族专属验收：提案概览与详情支持筛选、讨论与投票回调；状态/截止时间与票数由数据决定；不伪造链上签名或投票。
- 复用候选：[`table`](../components/motion/table/index.tsx)、[`prediction-market`](../components/motion/prediction-market.tsx)。

#### Auth · `auth`

- 公开规范：[产品页](https://pro.beui.dev/components/auth) · [Markdown](https://pro.beui.dev/components/auth.md)
- 状态：已实现；代码/DOM 验收范围与未验收边界见顶部交付记录。
- 独立验收项：1. Landscape card；2. Split showcase；3. Centered card；4. Magic code；5. Atlas centered；6. Atlas split。
- 家族专属验收：六种认证布局分别实现；密码/OTP/魔法链接交给宿主；字段与服务错误可见；不在本地假造认证通过。
- 复用候选：[`signup-form`](../components/motion/signup-form.tsx)、[`otp-input`](../components/motion/otp-input.tsx)。

#### Waitlist Pages · `waitlist-pages`

- 公开规范：[产品页](https://pro.beui.dev/components/waitlist-pages) · [Markdown](https://pro.beui.dev/components/waitlist-pages.md)
- 状态：已实现；代码/DOM 验收范围与未验收边界见顶部交付记录。
- 独立验收项：1. Early access；2. Blueprint launch。
- 家族专属验收：两种完整候补页；订阅/邀请动作可接宿主；邮箱校验与成功/失败流程完整；保留独立内容和构图。
- 复用候选：未建立专用映射；实现前按功能对照现有 catalog。

#### Settings Pages · `settings-pages`

- 公开规范：[产品页](https://pro.beui.dev/components/settings-pages) · [Markdown](https://pro.beui.dev/components/settings-pages.md)
- 状态：已实现；代码/DOM 验收范围与未验收边界见顶部交付记录。
- 独立验收项：1. Organization settings；2. Workspace settings；3. Billing settings。
- 家族专属验收：组织、工作区与账单三种页面各有对应表单；脏数据、保存/取消、异步失败和离开保护一致；支付与成员权限由宿主决定。
- 复用候选：[`tabs`](../components/motion/tabs.tsx)、[`input`](../components/motion/input.tsx)、[`switch`](../components/motion/switch.tsx)。

#### Checkout Pages · `checkout-pages`

- 公开规范：[产品页](https://pro.beui.dev/components/checkout-pages) · [Markdown](https://pro.beui.dev/components/checkout-pages.md)
- 状态：已实现；代码/DOM 验收范围与未验收边界见顶部交付记录。
- 独立验收项：1. Checkout flow。
- 家族专属验收：商品、联系方式、配送和支付步骤可用；总价/税费/折扣来自显式规则；确认订单只基于宿主支付结果。
- 复用候选：[`signup-form`](../components/motion/signup-form.tsx)、[`approval-card`](../components/agents/approval-card/index.tsx)。

#### Trading Pages · `trading-pages`

- 公开规范：[产品页](https://pro.beui.dev/components/trading-pages) · [Markdown](https://pro.beui.dev/components/trading-pages.md)
- 状态：已实现；代码/DOM 验收范围与未验收边界见顶部交付记录。
- 独立验收项：1. Trading terminal；2. Token presale。
- 家族专属验收：交易终端与预售是独立流程；行情、订单、余额与状态由宿主控制；风险、金额精度与未成交状态明确。
- 复用候选：[`order-book`](../components/charts/order-book.tsx)、[`line-chart`](../components/charts/line-chart.tsx)、[`swap`](../components/motion/swap.tsx)。

#### Status Pages · `status-pages`

- 公开规范：[产品页](https://pro.beui.dev/components/status-pages) · [Markdown](https://pro.beui.dev/components/status-pages.md)
- 状态：已实现；代码/DOM 验收范围与未验收边界见顶部交付记录。
- 独立验收项：1. Status overview；2. Incident response。
- 家族专属验收：总览与事故响应页使用服务、事件和时间线数据；时间/时区明确；订阅、历史与详情可操作，不宣称虚构运行状态。
- 复用候选：[`timeline`](../components/motion/timeline.tsx)、[`animated-badge`](../components/motion/animated-badge.tsx)。

#### Onboarding · `onboarding`

- 公开规范：[产品页](https://pro.beui.dev/components/onboarding) · [Markdown](https://pro.beui.dev/components/onboarding.md)
- 状态：已实现；代码/DOM 验收范围与未验收边界见顶部交付记录。
- 独立验收项：1. Stepped onboarding；2. Split screen；3. Checklist dialog。
- 家族专属验收：步骤式、分屏与清单对话框三种导航；校验、返回、跳过与完成可配置；失败保留输入，不把关闭当完成。
- 复用候选：[`approval-card`](../components/agents/approval-card/index.tsx)。

#### About · `about`

- 公开规范：[产品页](https://pro.beui.dev/components/about) · [Markdown](https://pro.beui.dev/components/about.md)
- 状态：已实现；代码/DOM 验收范围与未验收边界见顶部交付记录。
- 独立验收项：1. Story page；2. Journey timeline。
- 家族专属验收：故事页包含居中标题、章节导航、工作室渐变拼贴、使命与价值观、指标和肖像团队网格；旅程页使用双栏纵向里程碑叙事、选中摘要及悬停/键盘焦点展开的领导团队肖像。章节、团队与里程碑外置，选中保持受控/非受控，移动端读序不改变含义。
- 实现依赖：[`text-reveal`](../components/motion/text-reveal.tsx)；旅程页不再使用通用 Timeline。

#### Careers · `careers`

- 公开规范：[产品页](https://pro.beui.dev/components/careers) · [Markdown](https://pro.beui.dev/components/careers.md)
- 状态：已实现；代码/DOM 验收范围与未验收边界见顶部交付记录。
- 独立验收项：1. Roles board；2. Culture page。
- 家族专属验收：岗位列表支持部门/位置筛选与详情跳转；文化页保留独立叙事；投递交给宿主，不伪造申请成功。
- 复用候选：[`table`](../components/motion/table/index.tsx)、[`select`](../components/motion/select.tsx)。

#### Search Pages · `search-pages`

- 公开规范：[产品页](https://pro.beui.dev/components/search-pages) · [Markdown](https://pro.beui.dev/components/search-pages.md)
- 状态：已实现；代码/DOM 验收范围与未验收边界见顶部交付记录。
- 独立验收项：1. Search results。
- 家族专属验收：查询、过滤、结果分类与分页真实改变结果；加载/无结果/错误可表示；URL 同步策略明确且键盘可用。
- 复用候选：[`morphing-search`](../components/motion/morphing-search.tsx)、[`table`](../components/motion/table/index.tsx)。

#### Docs Pages · `docs-pages`

- 公开规范：[产品页](https://pro.beui.dev/components/docs-pages) · [Markdown](https://pro.beui.dev/components/docs-pages.md)
- 状态：已实现；代码/DOM 验收范围与未验收边界见顶部交付记录。
- 独立验收项：1. Docs article。
- 家族专属验收：文档目录、文章、锚点与代码示例可配置；当前章节和导航一致；复制内容准确；移动端目录可进入和退出。
- 复用候选：[`code-block`](../components/agents/code-block.tsx)。

#### Pricing Pages · `pricing-pages`

- 公开规范：[产品页](https://pro.beui.dev/components/pricing-pages) · [Markdown](https://pro.beui.dev/components/pricing-pages.md)
- 状态：已实现；代码/DOM 验收范围与未验收边界见顶部交付记录。
- 独立验收项：1. Plan explorer。
- 家族专属验收：完整套餐页有账期、计划详情、比较和选择流程；价格数据一致；CTA 接宿主购买，不伪造升级。
- 复用候选：[`range-slider`](../components/motion/range-slider.tsx)、[`switch`](../components/motion/switch.tsx)。

#### Changelog Pages · `changelog-pages`

- 公开规范：[产品页](https://pro.beui.dev/components/changelog-pages) · [Markdown](https://pro.beui.dev/components/changelog-pages.md)
- 状态：已实现；代码/DOM 验收范围与未验收边界见顶部交付记录。
- 独立验收项：1. Sidebar updates；2. Editorial updates；3. Simple updates。
- 家族专属验收：侧栏、编辑式与简洁版三种版本列表；版本/标签筛选、锚点和正文导航有效；日期与排序明确。
- 复用候选：未建立专用映射；实现前按功能对照现有 catalog。

#### Blog Pages · `blog-pages`

- 公开规范：[产品页](https://pro.beui.dev/components/blog-pages) · [Markdown](https://pro.beui.dev/components/blog-pages.md)
- 状态：已实现；代码/DOM 验收范围与未验收边界见顶部交付记录。
- 独立验收项：1. Blog index；2. Rounded blog index；3. Article page。
- 家族专属验收：普通与圆角索引、文章详情分别实现；分类/分页、文章导航、目录与分享链接有效；内容来自宿主数据。
- 复用候选：未建立专用映射；实现前按功能对照现有 catalog。

#### 404 Pages · `not-found-pages`

- 公开规范：[产品页](https://pro.beui.dev/components/not-found-pages) · [Markdown](https://pro.beui.dev/components/not-found-pages.md)
- 状态：已实现；代码/DOM 验收范围与未验收边界见顶部交付记录。
- 独立验收项：1. Falling blocks；2. Flip panels；3. Elastic type；4. Echo stack；5. Spotlight reveal；6. Sliced type；7. Editorial issue；8. Terminal trace；9. Wayfinder。
- 家族专属验收：九种错误页分别实现各自视觉/交互结构；恢复链接有效；与现有五种 404 不因名称相近直接合并。
- 复用候选：[`not-found`](../components/motion/not-found/index.tsx)。


### 完整模板

#### Weave Workflow Builder · `weave-workflow-builder`

- 公开规范：[产品页](https://pro.beui.dev/components/weave-workflow-builder) · [Markdown](https://pro.beui.dev/components/weave-workflow-builder.md)
- 状态：已实现；代码/DOM 验收范围与未验收边界见顶部交付记录。
- 独立验收项：1. Weave Workflow Builder。
- 家族专属验收：完整浏览器本地工作流应用：画布、步骤检查器、撤销重做/布局、测试运行、代理配置与多会话聊天、知识库/分块、连接、运行 trace 和设置；本地演示与真实服务边界清楚。
- 完整模板公开功能分区：Workflow canvas；Agent builder and chat；Knowledge bases；Runs and traces；Complete app shell；Standalone source。
- 复用候选：[`workspace-shell`](../components/workspace/workspace-shell.tsx)、[`chat-app`](../components/agents/chat-app.tsx)、[`file-tree`](../components/motion/file-tree.tsx)、[`tool-result`](../components/agents/tool-result.tsx)。

#### Hunch Prediction Markets · `hunch-social-prediction`

- 公开规范：[产品页](https://pro.beui.dev/components/hunch-social-prediction) · [Markdown](https://pro.beui.dev/components/hunch-social-prediction.md)
- 状态：已实现；代码/DOM 验收范围与未验收边界见顶部交付记录。
- 独立验收项：1. Hunch Prediction Markets。
- 家族专属验收：完整预测市场应用：二元/多结果市场、主题/搜索/关注、概率图/结算规则、买卖票据/移动交易栏、奖励搜索、周/总榜、钱包资料/回复、持仓/余额/流水/草稿跨路由刷新持久化；认证与资金均明确为本地演示。
- 完整模板公开功能分区：Discover and predict；Rewards and rankings；Your calls in one place；Standalone source。
- 复用候选：[`prediction-market`](../components/motion/prediction-market.tsx)、[`table`](../components/motion/table/index.tsx)、[`line-chart`](../components/charts/line-chart.tsx)。

#### AI Agent Landing · `ai-landing`

- 公开规范：[产品页](https://pro.beui.dev/components/ai-landing) · [Markdown](https://pro.beui.dev/components/ai-landing.md)
- 状态：已实现；代码/DOM 验收范围与未验收边界见顶部交付记录。
- 独立验收项：1. AI Agent Landing。
- 家族专属验收：独立 AI Agent 落地页，完整导航、产品叙事、能力、社会证明、价格/CTA 与页脚；交互与移动端均可用。
- 完整模板公开功能分区：Agent-first hero；Live run trace；Capability storytelling；Complete conversion path；Responsive motion；Ready to customize。
- 复用候选：未建立专用映射；实现前按功能对照现有 catalog。

#### Crypto Landing · `crypto-landing`

- 公开规范：[产品页](https://pro.beui.dev/components/crypto-landing) · [Markdown](https://pro.beui.dev/components/crypto-landing.md)
- 状态：已实现；代码/DOM 验收范围与未验收边界见顶部交付记录。
- 独立验收项：1. Crypto Landing。
- 家族专属验收：独立加密产品落地页；产品/市场叙事、能力、信任、价格/CTA 与导航齐全；示例行情明确标注。
- 完整模板公开功能分区：Portfolio hero；Chain-ready proof；Trust-led structure；Full buying journey；Theme-safe design；Production stack。
- 复用候选：未建立专用映射；实现前按功能对照现有 catalog。

#### Mobile Crypto Landing · `mobile-crypto-landing`

- 公开规范：[产品页](https://pro.beui.dev/components/mobile-crypto-landing) · [Markdown](https://pro.beui.dev/components/mobile-crypto-landing.md)
- 状态：已实现；代码/DOM 验收范围与未验收边界见顶部交付记录。
- 独立验收项：1. Mobile Crypto Landing。
- 家族专属验收：移动钱包产品落地页保持手机展示与独立版式；下载/介绍/FAQ/CTA 真实可配置；不等于普通 Crypto 页缩窄。
- 完整模板公开功能分区：Product-led phone hero；Complete multi-page system；Authentic network support；Purpose-built motion；Trust-first storytelling；Production-ready foundation。
- 复用候选：未建立专用映射；实现前按功能对照现有 catalog。

#### Devtool Landing · `devtool-landing`

- 公开规范：[产品页](https://pro.beui.dev/components/devtool-landing) · [Markdown](https://pro.beui.dev/components/devtool-landing.md)
- 状态：已实现；代码/DOM 验收范围与未验收边界见顶部交付记录。
- 独立验收项：1. Devtool Landing。
- 家族专属验收：开发工具落地页含产品演示、代码/命令、能力、接入说明和 CTA；复制、导航和演示切换真实可用。
- 完整模板公开功能分区：Flow-field hero；Agent directory demo；Durable run trace；Content-ready pages；Responsive interactions；Modern foundation。
- 复用候选：未建立专用映射；实现前按功能对照现有 catalog。

#### Analytics Landing · `analytics-landing`

- 公开规范：[产品页](https://pro.beui.dev/components/analytics-landing) · [Markdown](https://pro.beui.dev/components/analytics-landing.md)
- 状态：已实现；代码/DOM 验收范围与未验收边界见顶部交付记录。
- 独立验收项：1. Analytics Landing。
- 家族专属验收：分析产品落地页有独立仪表预览、指标故事、能力/信任与 CTA；图表由输入数据驱动。
- 完整模板公开功能分区：Funnel dashboard hero；Natural-language analysis；Data-focused system；Complete product site；Light and dark；Production-ready stack。
- 复用候选：未建立专用映射；实现前按功能对照现有 catalog。

#### Folio Crypto Portfolio · `folio-finance-dashboard`

- 公开规范：[产品页](https://pro.beui.dev/components/folio-finance-dashboard) · [Markdown](https://pro.beui.dev/components/folio-finance-dashboard.md)
- 状态：已实现；代码/DOM 验收范围与未验收边界见顶部交付记录。
- 独立验收项：1. Folio Crypto Portfolio。
- 家族专属验收：完整资产应用：演示登录、总览、资产/详情、钱包、流水、质押、关注、自选模型流式助手和设置都有 URL；地址跟踪、模拟换币/质押/领奖、搜索/链筛选、JSON 导出与确认重置可用且持久化；服务接入边界明确。
- 完整模板公开功能分区：A complete workspace；Connected demo workflows；Your data, locally；A reusable design system；Ready to make your own。
- 复用候选：[`workspace-shell`](../components/workspace/workspace-shell.tsx)、[`swap`](../components/motion/swap.tsx)、[`wallet-card`](../components/motion/wallet-card/index.tsx)、[`line-chart`](../components/charts/line-chart.tsx)。

#### Pair AI Workspace · `pair-ai-workspace`

- 公开规范：[产品页](https://pro.beui.dev/components/pair-ai-workspace) · [Markdown](https://pro.beui.dev/components/pair-ai-workspace.md)
- 状态：已实现；代码/DOM 验收范围与未验收边界见顶部交付记录。
- 独立验收项：1. Pair AI Workspace。
- 家族专属验收：完整多会话 AI 前端：会话 URL、Composer、项目、重命名/归档/恢复、知识/附件预览、集成、设置、命令与帮助；浏览器本地演示清楚标注。
- 完整模板公开功能分区：Conversation workspace；Projects and archives；Knowledge and context；Complete app screens；Responsive and themeable；Modular source and deployment。
- 复用候选：[`workspace-shell`](../components/workspace/workspace-shell.tsx)、[`chat-app`](../components/agents/chat-app.tsx)、[`selector`](../components/motion/selector.tsx)。

#### AI Workspace · `ai-workspace-landing`

- 公开规范：[产品页](https://pro.beui.dev/components/ai-workspace-landing) · [Markdown](https://pro.beui.dev/components/ai-workspace-landing.md)
- 状态：已实现；代码/DOM 验收范围与未验收边界见顶部交付记录。
- 独立验收项：1. AI Workspace。
- 家族专属验收：AI 工作区产品站，独立故事节奏、工作区演示、能力/协作/CTA；与 Pair 完整应用不互相替代。
- 完整模板公开功能分区：Conversational hero；Motion-rich illustrations；Human product story；Complete site system；Responsive and accessible；Easy to own。
- 复用候选：未建立专用映射；实现前按功能对照现有 catalog。

#### Personal Website · `personal-website`

- 公开规范：[产品页](https://pro.beui.dev/components/personal-website) · [Markdown](https://pro.beui.dev/components/personal-website.md)
- 状态：已实现；代码/DOM 验收范围与未验收边界见顶部交付记录。
- 独立验收项：1. Personal Website。
- 家族专属验收：个人站含介绍、项目、经历/服务与联系入口；项目导航与链接可用；内容/资产/社交由宿主替换。
- 完整模板公开功能分区：Focused profile introduction；Morphing link previews；Original character artwork；Visual project highlights；Quiet entrance motion；Responsive by design；Easy to personalize。
- 复用候选：未建立专用映射；实现前按功能对照现有 catalog。


### Web 插画

#### App Preview · `illustration-app-preview`

- 公开规范：[产品页](https://pro.beui.dev/illustrations/app-preview) · [Markdown](https://pro.beui.dev/illustrations/app-preview.md)
- 状态：已实现；代码/DOM 验收范围与未验收边界见顶部交付记录。
- 独立验收项：1. Illustration 1；2. Illustration 2；3. Illustration 3。
- 家族专属验收：三套独立手机场景分别承载资产、助手与社交内容；数据和主题可替换，不把同一个屏幕换标签当三个变体。
- 复用候选：未建立专用映射；实现前按功能对照现有 catalog。

#### Isometric Scenes · `illustration-isometric-scenes`

- 公开规范：[产品页](https://pro.beui.dev/illustrations/isometric-scenes) · [Markdown](https://pro.beui.dev/illustrations/isometric-scenes.md)
- 状态：已实现；代码/DOM 验收范围与未验收边界见顶部交付记录。
- 独立验收项：1. Illustration 1；2. Illustration 2；3. Illustration 3；4. Illustration 4；5. Illustration 5。
- 家族专属验收：五个视角场景分别表达系统层次与处理/连接关系；场景图形与动作可辨识，透视不是唯一差异。
- 复用候选：未建立专用映射；实现前按功能对照现有 catalog。

#### AI & Chat · `illustration-chat-exchange`

- 公开规范：[产品页](https://pro.beui.dev/illustrations/chat-exchange) · [Markdown](https://pro.beui.dev/illustrations/chat-exchange.md)
- 状态：已实现；代码/DOM 验收范围与未验收边界见顶部交付记录。
- 独立验收项：1. Illustration 1；2. Illustration 2；3. Illustration 3。
- 家族专属验收：三个聊天/研究/生成场景有各自输入、处理中与结果叙事；装饰文本可替换，不宣称真实 AI 回复。
- 复用候选：未建立专用映射；实现前按功能对照现有 catalog。

#### Payments & Checkout · `illustration-payments`

- 公开规范：[产品页](https://pro.beui.dev/illustrations/payments) · [Markdown](https://pro.beui.dev/illustrations/payments.md)
- 状态：已实现；代码/DOM 验收范围与未验收边界见顶部交付记录。
- 独立验收项：1. Illustration 1；2. Illustration 2。
- 家族专属验收：单次结账与收入流分别表现；金额/状态可配；装饰性付款完成不被当作真实支付回执。
- 复用候选：未建立专用映射；实现前按功能对照现有 catalog。

#### Security & Auth · `illustration-security`

- 公开规范：[产品页](https://pro.beui.dev/illustrations/security) · [Markdown](https://pro.beui.dev/illustrations/security.md)
- 状态：已实现；代码/DOM 验收范围与未验收边界见顶部交付记录。
- 独立验收项：1. Illustration 1；2. Illustration 2。
- 家族专属验收：威胁扫描/阻断与验证解锁各自有独立阶段；明确仅为安全概念插画，不声称提供检测或认证。
- 复用候选：未建立专用映射；实现前按功能对照现有 catalog。

#### Metrics & Growth · `illustration-metrics`

- 公开规范：[产品页](https://pro.beui.dev/illustrations/metrics) · [Markdown](https://pro.beui.dev/illustrations/metrics.md)
- 状态：已实现；代码/DOM 验收范围与未验收边界见顶部交付记录。
- 独立验收项：1. Illustration 1；2. Illustration 2。
- 家族专属验收：趋势图与转化流程分别使用可配置读数；区间切换/游标如公开预览可交互；不能仅画随机线条。
- 复用候选：未建立专用映射；实现前按功能对照现有 catalog。

#### Voice Note · `illustration-voice-note`

- 公开规范：[产品页](https://pro.beui.dev/illustrations/voice-note) · [Markdown](https://pro.beui.dev/illustrations/voice-note.md)
- 状态：已实现；代码/DOM 验收范围与未验收边界见顶部交付记录。
- 独立验收项：1. Voice Note。
- 家族专属验收：备忘录栈、波形、转写状态与播放控件对应同一输入；真实音频和装饰演示明确区分。
- 复用候选：未建立专用映射；实现前按功能对照现有 catalog。

#### Document Cards · `illustration-document-cards`

- 公开规范：[产品页](https://pro.beui.dev/illustrations/document-cards) · [Markdown](https://pro.beui.dev/illustrations/document-cards.md)
- 状态：已实现；代码/DOM 验收范围与未验收边界见顶部交付记录。
- 独立验收项：1. Illustration 1；2. Illustration 2；3. Illustration 3。
- 家族专属验收：三种文件/签署/审批叙事各自可区分；文件名、状态和阶段可配置；不声称已完成电子签名。
- 复用候选：未建立专用映射；实现前按功能对照现有 catalog。

#### Card Stack · `illustration-layered-cards`

- 公开规范：[产品页](https://pro.beui.dev/illustrations/layered-cards) · [Markdown](https://pro.beui.dev/illustrations/layered-cards.md)
- 状态：已实现；代码/DOM 验收范围与未验收边界见顶部交付记录。
- 独立验收项：1. Illustration 1；2. Illustration 2；3. Illustration 3。
- 家族专属验收：钱包、支付卡与套餐三种栈各自承载对应信息；焦点轮换与账期切换准确；减少动态效果保留读数。
- 复用候选：未建立专用映射；实现前按功能对照现有 catalog。

#### Bar Wave · `illustration-bar-wave`

- 公开规范：[产品页](https://pro.beui.dev/illustrations/bar-wave) · [Markdown](https://pro.beui.dev/illustrations/bar-wave.md)
- 状态：已实现；代码/DOM 验收范围与未验收边界见顶部交付记录。
- 独立验收项：1. Bar Wave。
- 家族专属验收：条形透视栈有传播波与可选指针响应；触屏不残留悬停状态；减少动态效果去掉循环。
- 复用候选：未建立专用映射；实现前按功能对照现有 catalog。

#### Connected Hub · `illustration-connected-hub`

- 公开规范：[产品页](https://pro.beui.dev/illustrations/connected-hub) · [Markdown](https://pro.beui.dev/illustrations/connected-hub.md)
- 状态：已实现；代码/DOM 验收范围与未验收边界见顶部交付记录。
- 独立验收项：1. Illustration 1；2. Illustration 2；3. Illustration 3；4. Illustration 4。
- 家族专属验收：四种服务连接图分别实现节点/通路组织；图标、标签与高亮路径可配置；不是同一个布局换配色。
- 复用候选：未建立专用映射；实现前按功能对照现有 catalog。

#### Search & Command · `illustration-search-command`

- 公开规范：[产品页](https://pro.beui.dev/illustrations/search-command) · [Markdown](https://pro.beui.dev/illustrations/search-command.md)
- 状态：已实现；代码/DOM 验收范围与未验收边界见顶部交付记录。
- 独立验收项：1. Search & Command。
- 家族专属验收：查询、结果过滤与活动行推进形成可读的检索叙事；真实输入模式与自动演示模式明确区分。
- 复用候选：未建立专用映射；实现前按功能对照现有 catalog。

#### File Flow · `illustration-file-flow`

- 公开规范：[产品页](https://pro.beui.dev/illustrations/file-flow) · [Markdown](https://pro.beui.dev/illustrations/file-flow.md)
- 状态：已实现；代码/DOM 验收范围与未验收边界见顶部交付记录。
- 独立验收项：1. File Flow。
- 家族专属验收：源文件、处理关口与输出阶段连贯；名称、格式和结果可替换；不把插画当实际文件转换器。
- 复用候选：未建立专用映射；实现前按功能对照现有 catalog。

#### Live Presence · `illustration-live-presence`

- 公开规范：[产品页](https://pro.beui.dev/illustrations/live-presence) · [Markdown](https://pro.beui.dev/illustrations/live-presence.md)
- 状态：已实现；代码/DOM 验收范围与未验收边界见顶部交付记录。
- 独立验收项：1. Illustration 1；2. Illustration 2。
- 家族专属验收：两种协作场景的头像、光标、选区与评论对应；仅演示存在感，不虚构跨客户端同步。
- 复用候选：未建立专用映射；实现前按功能对照现有 catalog。

#### Split Reveal · `illustration-split-reveal`

- 公开规范：[产品页](https://pro.beui.dev/illustrations/split-reveal) · [Markdown](https://pro.beui.dev/illustrations/split-reveal.md)
- 状态：已实现；代码/DOM 验收范围与未验收边界见顶部交付记录。
- 独立验收项：1. Split Reveal。
- 家族专属验收：同一位置的前后状态可比较；分界/清晰度变化不遮住关键内容；可固定到任一状态。
- 复用候选：未建立专用映射；实现前按功能对照现有 catalog。

#### Rolling Stack · `illustration-rolling-stack`

- 公开规范：[产品页](https://pro.beui.dev/illustrations/rolling-stack) · [Markdown](https://pro.beui.dev/illustrations/rolling-stack.md)
- 状态：已实现；代码/DOM 验收范围与未验收边界见顶部交付记录。
- 独立验收项：1. Illustration 1；2. Illustration 2。
- 家族专属验收：两种纵向滚动栈均保持稳定项目 ID、焦点与顺序；内容与循环可控制；减少动态效果停在可读项。
- 复用候选：未建立专用映射；实现前按功能对照现有 catalog。

#### Horizontal Stack · `illustration-horizontal-stack`

- 公开规范：[产品页](https://pro.beui.dev/illustrations/horizontal-stack) · [Markdown](https://pro.beui.dev/illustrations/horizontal-stack.md)
- 状态：已实现；代码/DOM 验收范围与未验收边界见顶部交付记录。
- 独立验收项：1. Horizontal Stack。
- 家族专属验收：横向图标栈的焦点与顺序一致；项目可配置，减少动态效果停止轮换。
- 复用候选：未建立专用映射；实现前按功能对照现有 catalog。

#### Icon Marquee · `illustration-icon-marquee`

- 公开规范：[产品页](https://pro.beui.dev/illustrations/icon-marquee) · [Markdown](https://pro.beui.dev/illustrations/icon-marquee.md)
- 状态：已实现；代码/DOM 验收范围与未验收边界见顶部交付记录。
- 独立验收项：1. Icon Marquee。
- 家族专属验收：双行反向图标带无接缝循环；可暂停且响应减少动态效果；复制项不重复暴露无障碍语义。
- 复用候选：未建立专用映射；实现前按功能对照现有 catalog。

#### Arc Stack · `illustration-arc-stack`

- 公开规范：[产品页](https://pro.beui.dev/illustrations/arc-stack) · [Markdown](https://pro.beui.dev/illustrations/arc-stack.md)
- 状态：已实现；代码/DOM 验收范围与未验收边界见顶部交付记录。
- 独立验收项：1. Illustration 1；2. Illustration 2。
- 家族专属验收：图片与连接器两种弧形栈的焦点、邻项与循环各自成立；资源/标签外置；减少动态效果保持静态可读构图。
- 复用候选：未建立专用映射；实现前按功能对照现有 catalog。

