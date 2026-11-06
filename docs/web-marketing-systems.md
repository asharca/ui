# Marketing systems compositions

This slice adds eighteen original marketing blocks across four families. These are host-data-driven compositions, not reproductions of paid source. The public specification bodies determine the layouts and interactions.

## Process narratives

Import `CenteredProcessCards`, `CinematicProcessGrid`, `EditorialStoryStack`, `GuidedWalkthrough`, or `ProgressiveCardDeck` from `@/components/motion/how-it-works`.

Supply stable `steps` with `id`, `title`, `description`, optional `detail`, and optional product `scene`. Interactive variants accept controlled `value` / `onValueChange` or uncontrolled `defaultValue`. The walkthrough composes the existing Tabs primitive, including its arrow/Home/End keyboard behavior. Optional autoplay stops offscreen, while the page is hidden, on hover/focus, on explicit pause, and under reduced motion. The card deck retains every card in the document; previous/next and arrow keys on the row move its focus state without removing the narrative. Centered cards use native details; editorial copy never depends on an opacity reveal to become readable.

## Social proof

Import `LogoMarquee`, `LogoGrid`, `KineticLogoColumns`, or `RollingLogoCarousel` from `@/components/motion/logo-cloud`. Supply `logos` with stable `id`, `name`, optional original `mark`, and optional `href`. Host links are rendered as actual anchors, and omitted links render noninteractive marks.

Marquee and kinetic lanes compose the existing Marquee primitive, retaining hidden, inert duplicate tracks. All moving compositions offer explicit pause and respect reduced motion; carousel playback additionally stops offscreen and in hidden tabs. Kinetic lanes pause independently on hover. The rolling carousel accepts controlled `page` / `onPageChange` or `defaultPage`, configurable `slots`, and `interval`; manual controls remain available without autoplay. Exiting groups become inert and aria-hidden immediately.

## Trust statements

Import `EnterpriseReadiness`, `ComplianceMarks`, `SecuritySafeguards`, or `ReliabilityAndSupport` from `@/components/motion/trust-security`. All claims, evidence destinations, status labels, availability observations, support scope, contact destinations, and disclosures come from the host. These components do not infer certification, uptime, or support guarantees.

Use `disclosure` to make the context explicit, and `detail` for practical scope. The reliability variant includes an exact-values disclosure as the accessible alternative to its availability curve. The four self-contained preview files prominently identify every statement and dataset as illustrative, not a project certification or SLA.

## Integrations

Import `IntegrationHealth`, `IntegrationDirectory`, `EditorialIntegrationGrid`, `IntegrationOrbit`, or `IntegrationLedger` from `@/components/motion/integrations`. Supply `tools` with stable IDs, descriptions, categories, and an explicit `status`. Optional permissions, recorded runs, errors, sync observations, last-sync labels, documentation destinations, and configuration fields are never fabricated by the component.

Selection can be controlled with `value` / `onValueChange` or initialized with `defaultValue`. Actions use `onConnect(id)`, `onDisconnect(id)`, `onSync(id)`, and `onConfigure(id, values)`; synchronous and asynchronous callbacks are supported. Only supplied actions are rendered. Pending actions disable competing action controls. Rejections surface their host error, and successful callback resolution reports only that the request completed: connection status changes **only** when the host updates `tools`. Configuration is a draft until the supplied save callback accepts it. Shared detail dialogs compose MorphingModal for portal rendering, focus trapping, Escape, and focus restoration.

The previews deliberately implement local in-memory demo controllers and say so. Their failure checkbox exercises error handling without inventing an external authorization. Each preview is self-contained and can be copied as complete usage; replace its local callbacks and fictional tools with your actual host data/actions.

## Distribution and verification

The four family files and `components/motion/marketing-systems-playback.ts` ship through the regular Registry, alongside eighteen self-contained previews and copyable public compositions. Shared catalog integration is included.

Central DOM interaction verification exercises all eighteen variants and their reused primitives. It covers host callback rejection/retry, selection, keyboard navigation, pause/resume and disclosure state. The repository acceptance commands are `bun run check`, `bun test`, and the public MCP typecheck.

DOM verification does not prove marquee seam continuity, physical hover, viewport/background playback, responsive orbit/stack geometry, scene reveals or rolling entry/exit appearance. Those remain real-browser verification boundaries. No new npm dependencies are introduced.
