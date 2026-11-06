"use client";

import { motion, useReducedMotion } from "motion/react";
import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { Button, ButtonLink } from "@/components/motion/button";
import { BouncyAccordion, type BouncyAccordionItem } from "@/components/motion/bouncy-accordion";
import { EASE_OUT } from "@/lib/ease";
import { useHoverCapable } from "@/lib/hooks/use-hover-capable";
import { cn } from "@/lib/utils";

export interface LandingAction { label: string; href: string }
export interface LandingPlan { id: string; name: string; monthly: number; annualMonthly: number; currency?: string; features: string[]; action: LandingAction }
export interface LandingProof { quote: string; person: string; role: string }
export interface LandingSiteProps { brand: string; action: LandingAction; signIn?: LandingAction; plans: LandingPlan[]; proof: LandingProof[]; faqs: BouncyAccordionItem[]; className?: string }

/** Common product-site chrome only; each product owns its layout and demo. */
export function LandingFrame({ brand, links, groups = [], action, signIn, appearance = "agent", className, children }: { brand: string; links: LandingAction[]; groups?: { label: string; links: (LandingAction & { description?: string })[] }[]; action: LandingAction; signIn?: LandingAction; appearance?: "agent" | "crypto" | "developer" | "analytics" | "workspace"; className?: string; children: ReactNode }) {
  const [menu, setMenu] = useState(false);
  const menuId = useId();
  const toggle = useRef<HTMLButtonElement>(null);
  const [dropdown, setDropdown] = useState<string | null>(null);
  const navigation = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const hover = useHoverCapable();
  useEffect(() => {
    if (dropdown === null) return;
    const dismiss = (event: PointerEvent) => { if (!navigation.current?.contains(event.target as Node)) setDropdown(null); };
    document.addEventListener("pointerdown", dismiss);
    return () => document.removeEventListener("pointerdown", dismiss);
  }, [dropdown]);
  return <div className={cn("landing-site", `landing-${appearance}`, "w-full min-w-0 bg-background text-foreground [&_a]:cursor-pointer [&_button:not(:disabled)]:cursor-pointer [&_a:focus-visible]:outline [&_a:focus-visible]:outline-2 [&_a:focus-visible]:outline-offset-4 [&_button:focus-visible]:outline [&_button:focus-visible]:outline-2 [&_button:focus-visible]:outline-offset-4", className)}>
    <LandingStyles family={appearance} />
    <header className="landing-header relative z-10 bg-background/95 px-5 py-4 sm:px-8">
      <div className="landing-header-inner mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4">
        <span className="landing-brand inline-flex items-center gap-2 text-sm font-semibold tracking-tight"><span aria-hidden="true" className="landing-mark flex h-7 w-7 items-center justify-center rounded-lg bg-foreground text-background">✳</span>{brand}</span>
        <nav ref={navigation} aria-label={`${brand} navigation`} className="hidden items-center gap-6 text-xs md:flex" onMouseLeave={() => { if (hover) setDropdown(null); }}>{groups.map((group, index) => <fieldset key={group.label} aria-label={group.label} className="relative m-0 min-w-0 border-0 p-0" onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setDropdown(null); }} onKeyDown={event => { if (event.key === "Escape") { setDropdown(null); event.currentTarget.querySelector("button")?.focus(); } }}><button type="button" className="flex items-center gap-1.5 py-2 text-muted-foreground" aria-expanded={dropdown === group.label} aria-controls={`${menuId}-group-${index}`} onMouseEnter={() => { if (hover) setDropdown(group.label); }} onClick={() => setDropdown(current => current === group.label ? null : group.label)}>{group.label}<span aria-hidden="true" className="text-[9px]">⌄</span></button>{dropdown === group.label && <motion.div id={`${menuId}-group-${index}`} initial={reduce ? false : { opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: reduce ? 0 : 0.18, ease: EASE_OUT }} className="landing-nav-dropdown absolute left-1/2 top-full z-20 w-72 -translate-x-1/2 rounded-2xl border border-border bg-background p-2 text-foreground shadow-xl">{group.links.map(link => <a key={`${link.href}-${link.label}`} href={link.href} className="block rounded-xl p-3 hover:bg-muted focus-visible:bg-muted" onClick={() => setDropdown(null)}><span className="text-xs font-medium">{link.label} <span aria-hidden="true" className="float-right">↗</span></span>{link.description && <span className="mt-1 block text-[10px] leading-5 text-muted-foreground">{link.description}</span>}</a>)}</motion.div>}</fieldset>)}{links.map(link => <a key={link.href} href={link.href}>{link.label}</a>)}</nav>
        <div className="flex items-center gap-2">{signIn && <ButtonLink href={signIn.href} variant="ghost" size="sm" className="hidden sm:inline-flex">{signIn.label}</ButtonLink>}<ButtonLink href={action.href} size="sm">{action.label}</ButtonLink><Button ref={toggle} variant="ghost" size="sm" className="md:hidden" aria-label={menu ? "Close navigation" : "Open navigation"} aria-expanded={menu} aria-controls={menuId} onKeyDown={event => { if (event.key === "Escape") setMenu(false); }} onClick={() => setMenu(!menu)}>{menu ? "×" : "☰"}</Button></div>
        <nav id={menuId} hidden={!menu} aria-label={`${brand} mobile navigation`} className="w-full space-y-3 border-t border-border pt-4 text-sm md:hidden" onKeyDown={event => { if (event.key === "Escape") { setMenu(false); toggle.current?.focus(); } }}>{groups.map(group => <div key={group.label}><p className="mb-2 text-[10px] uppercase tracking-widest text-muted-foreground">{group.label}</p>{group.links.map(link => <a className="block py-2 text-sm" key={`${link.href}-${link.label}`} href={link.href} onClick={() => setMenu(false)}>{link.label}</a>)}</div>)}{links.map(link => <a className="block py-2" key={link.href} href={link.href} onClick={() => setMenu(false)}>{link.label}</a>)}{signIn && <a className="block py-2" href={signIn.href}>{signIn.label}</a>}</nav>
      </div>
    </header>
    {children}
  </div>;
}

export function LandingReveal({ children, className }: { children: ReactNode; className?: string }) {
  const reduce = useReducedMotion();
  return <motion.div initial={reduce ? false : { opacity: 0, y: 16, filter: "blur(5px)" }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} transition={{ duration: reduce ? 0 : 0.65, ease: EASE_OUT }} className={className}>{children}</motion.div>;
}

export function LandingSection({ id, eyebrow, title, children, className }: { id?: string; eyebrow?: string; title: string; children: ReactNode; className?: string }) {
  return <section id={id} className={cn("landing-section mx-auto max-w-6xl scroll-mt-6 px-5 py-16 sm:px-8 sm:py-24", className)}>{eyebrow && <p className="mb-3 font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">{eyebrow}</p>}<h2 className="mb-8 max-w-3xl text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h2>{children}</section>;
}

export function LandingFeatures({ items }: { items: { title: string; description: string; detail?: ReactNode }[] }) {
  return <div className="grid gap-5 sm:grid-cols-3">{items.map((item, index) => <article key={item.title} className="rounded-2xl border border-border bg-card p-6"><span className="font-mono text-xs text-muted-foreground">0{index + 1}</span><h3 className="mt-6 text-lg font-medium">{item.title}</h3><p className="mt-3 text-sm leading-7 text-muted-foreground">{item.description}</p>{item.detail}</article>)}</div>;
}

export function LandingConversion({ id, brand, action, plans, proof, faqs }: LandingSiteProps & { id: string }) {
  const [annual, setAnnual] = useState(false);
  return <>
    <LandingSection title="Good work speaks for itself" eyebrow="From the people using it">{proof.length ? <div className="grid gap-5 sm:grid-cols-2">{proof.map(item => <figure key={`${item.person}-${item.quote}`} className="rounded-2xl bg-muted/50 p-7"><blockquote className="text-lg leading-8">“{item.quote}”</blockquote><figcaption className="mt-5 text-sm">{item.person}<span className="block text-muted-foreground">{item.role}</span></figcaption></figure>)}</div> : <p className="text-muted-foreground">Customer stories will be published here.</p>}</LandingSection>
    <LandingSection id={`${id}-pricing`} title="A clear price for a clearer day" eyebrow="Plans"><div className="mb-7 flex items-center gap-3"><Button variant={annual ? "outline" : "primary"} size="sm" aria-pressed={!annual} onClick={() => setAnnual(false)}>Monthly</Button><Button variant={annual ? "primary" : "outline"} size="sm" aria-pressed={annual} onClick={() => setAnnual(true)}>Annual</Button><span className="text-xs text-muted-foreground">Annual prices shown per month, billed yearly</span></div><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{plans.map(plan => <article key={plan.id} className="flex flex-col rounded-2xl border border-border bg-card p-6"><h3 className="font-medium">{plan.name}</h3><p className="my-5"><strong className="text-4xl tabular-nums">{new Intl.NumberFormat("en", { style: "currency", currency: plan.currency ?? "USD", maximumFractionDigits: 0 }).format(annual ? plan.annualMonthly : plan.monthly)}</strong><span className="text-sm text-muted-foreground"> / month</span></p>{annual && <p className="mb-4 text-xs text-muted-foreground">{new Intl.NumberFormat("en", { style: "currency", currency: plan.currency ?? "USD", maximumFractionDigits: 0 }).format(plan.annualMonthly * 12)} billed yearly</p>}<ul className="mb-8 space-y-3 text-sm text-muted-foreground">{plan.features.map(feature => <li key={feature}>✓ {feature}</li>)}</ul><ButtonLink className="mt-auto" variant="outline" href={plan.action.href}>{plan.action.label}</ButtonLink></article>)}</div>{plans.length === 0 && <p>Contact the team for current pricing.</p>}</LandingSection>
    <LandingSection id={`${id}-faq`} title="A few things worth knowing"><BouncyAccordion items={faqs} /></LandingSection>
    <section className="border-y border-border bg-muted/40 px-5 py-16 text-center"><h2 className="mb-6 text-3xl font-semibold">Make room for what comes next.</h2><ButtonLink href={action.href} size="lg">{action.label} ↗</ButtonLink></section>
    <footer className="mx-auto flex max-w-6xl flex-wrap justify-between gap-5 px-5 py-8 text-sm text-muted-foreground"><p>{brand} · Built with intention.</p><nav aria-label={`${brand} footer`} className="flex gap-5"><a href={`#${id}-pricing`}>Pricing</a><a href={`#${id}-faq`}>FAQ</a><a href={action.href}>Get in touch</a></nav></footer>
  </>;
}

const ATMOSPHERE_VERTEX = `
attribute vec2 a_position;
void main() { gl_Position = vec4(a_position, 0.0, 1.0); }
`;

const ATMOSPHERE_FRAGMENT = `
precision highp float;
uniform vec2 u_resolution;
uniform float u_time;
uniform float u_spectrum;
float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}
float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
             mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y);
}
float cloud(vec2 p) {
  float value = 0.0, amplitude = 0.57;
  mat2 turn = mat2(0.8, -0.6, 0.6, 0.8);
  for (int octave = 0; octave < 3; octave++) {
    value += amplitude * noise(p);
    p = turn * p * 2.03 + 7.1;
    amplitude *= 0.48;
  }
  return value;
}
vec3 forest(vec2 uv) {
  vec2 p = uv * vec2(2.4 * u_resolution.x / u_resolution.y, 2.8);
  float t = u_time * 0.035;
  vec2 drift = vec2(cloud(p * 0.74 + vec2(t, -t * 0.4)),
                    cloud(p * 0.69 + vec2(5.3 - t * 0.35, t * 0.6)));
  float density = cloud(p + drift * 1.25 + vec2(t * 0.25, -t * 0.45));
  float light = smoothstep(0.27, 0.73, density);
  vec3 color = mix(vec3(0.002, 0.025, 0.019), vec3(0.035, 0.265, 0.195), pow(light, 1.45));
  color *= 0.8 + 0.2 * smoothstep(0.0, 1.0, uv.x + 0.4 * (1.0 - uv.y));
  return color;
}
vec3 spectrum(vec2 uv) {
  float mirrored = min(uv.x, 1.0 - uv.x);
  float breathe = 0.006 * sin(u_time * 0.24);
  float crest = 0.28;
  crest += 0.075 * smoothstep(0.025 + breathe, 0.065 + breathe, mirrored);
  crest += 0.075 * smoothstep(0.15 - breathe, 0.19 - breathe, mirrored);
  crest += 0.075 * smoothstep(0.28 + breathe, 0.32 + breathe, mirrored);
  crest += 0.004 * sin(uv.x * 7.0 + u_time * 0.18);
  float band = (crest - uv.y) / 0.34;
  vec3 color = mix(vec3(0.59, 0.008, 0.57), vec3(0.94, 0.025, 0.12), smoothstep(0.04, 0.23, band));
  color = mix(color, vec3(0.96, 0.71, 0.055), smoothstep(0.23, 0.40, band));
  color = mix(color, vec3(0.67, 0.80, 0.86), smoothstep(0.40, 0.58, band));
  color = mix(color, vec3(0.015, 0.25, 0.91), smoothstep(0.58, 0.77, band));
  color = mix(color, vec3(0.006, 0.045, 0.28), smoothstep(0.77, 1.02, band));
  float coverage = smoothstep(-0.13, 0.035, band) * (1.0 - smoothstep(0.94, 1.25, band));
  return mix(vec3(0.024, 0.031, 0.082), color, coverage);
}
void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution;
  vec3 color = u_spectrum > 0.5 ? spectrum(uv) : forest(uv);
  color += (hash(gl_FragCoord.xy) - 0.5) * 0.006;
  gl_FragColor = vec4(color, 1.0);
}
`;

/** Original low-frequency flow and terraced spectral fields reconstructed from public rendered references. */
export function LandingAtmosphere({ variant, className }: { variant: "forest" | "spectrum"; className: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl", { alpha: false, antialias: false, depth: false, stencil: false });
    if (!gl) return;
    const vertex = gl.createShader(gl.VERTEX_SHADER);
    const fragment = gl.createShader(gl.FRAGMENT_SHADER);
    const program = gl.createProgram();
    const buffer = gl.createBuffer();
    const dispose = () => {
      if (buffer) gl.deleteBuffer(buffer);
      if (program) gl.deleteProgram(program);
      if (vertex) gl.deleteShader(vertex);
      if (fragment) gl.deleteShader(fragment);
    };
    if (!vertex || !fragment || !program || !buffer) { dispose(); return; }
    gl.shaderSource(vertex, ATMOSPHERE_VERTEX);
    gl.shaderSource(fragment, ATMOSPHERE_FRAGMENT);
    gl.compileShader(vertex);
    gl.compileShader(fragment);
    if (!gl.getShaderParameter(vertex, gl.COMPILE_STATUS) || !gl.getShaderParameter(fragment, gl.COMPILE_STATUS)) {
      const message = gl.getShaderInfoLog(vertex) || gl.getShaderInfoLog(fragment) || "Unknown shader compilation error";
      dispose();
      throw new Error(`Landing atmosphere: ${message}`);
    }
    gl.attachShader(program, vertex);
    gl.attachShader(program, fragment);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      const message = gl.getProgramInfoLog(program) || "Unknown shader link error";
      dispose();
      throw new Error(`Landing atmosphere: ${message}`);
    }
    // Invoke the WebGL API with its context; this is not a React hook.
    gl.useProgram.call(gl, program);
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const position = gl.getAttribLocation(program, "a_position");
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
    const resolution = gl.getUniformLocation(program, "u_resolution");
    const time = gl.getUniformLocation(program, "u_time");
    gl.uniform1f(gl.getUniformLocation(program, "u_spectrum"), variant === "spectrum" ? 1 : 0);
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const started = performance.now();
    let frame: number | null = null;
    let visible = true;
    let width = 0;
    let height = 0;
    let lastDraw = -Infinity;
    const draw = (timestamp: number) => {
      frame = null;
      if (timestamp - lastDraw >= 1000 / 30 || preference.matches) {
        gl.uniform1f(time, preference.matches ? 0 : (timestamp - started) / 1000);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
        lastDraw = timestamp;
      }
      if (!preference.matches && visible && !document.hidden) frame = requestAnimationFrame(draw);
    };
    const sync = () => {
      if (frame !== null) cancelAnimationFrame(frame);
      frame = null;
      if (!width || !height || document.hidden || !visible) return;
      lastDraw = -Infinity;
      draw(performance.now());
    };
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const nextWidth = Math.round(rect.width);
      const nextHeight = Math.round(rect.height);
      if (nextWidth === width && nextHeight === height) return;
      width = nextWidth;
      height = nextHeight;
      canvas.width = Math.max(1, width);
      canvas.height = Math.max(1, height);
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(resolution, canvas.width, canvas.height);
      sync();
    };
    const resizeObserver = new ResizeObserver(resize);
    const intersectionObserver = new IntersectionObserver(entries => { visible = entries[0]?.isIntersecting ?? false; sync(); });
    resizeObserver.observe(canvas);
    intersectionObserver.observe(canvas);
    preference.addEventListener("change", sync);
    document.addEventListener("visibilitychange", sync);
    resize();
    return () => {
      if (frame !== null) cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      preference.removeEventListener("change", sync);
      document.removeEventListener("visibilitychange", sync);
      dispose();
    };
  }, [variant]);
  return <div aria-hidden="true" className={className}><canvas ref={canvasRef} className="block h-full w-full"/></div>;
}

const LANDING_FONT_QUERIES = {
  agent: "Fraunces:opsz,wght@9..144,400&family=Plus+Jakarta+Sans:wght@400;500;600",
  crypto: "Fraunces:opsz,wght@9..144,400&family=Plus+Jakarta+Sans:wght@400;500;600",
  developer: "Inter+Tight:wght@400;500;600",
  analytics: "Inter+Tight:wght@400;500;600",
  workspace: "Instrument+Sans:wght@400;500;600",
  mobile: "Manrope:wght@400;500;600",
  personal: "Caveat:wght@500&family=Inter:wght@400;500;600",
};

/** Family-scoped styles and openly licensed Google Fonts travel with registry exports. */
export function LandingStyles({ family = "agent" }: { family?: keyof typeof LANDING_FONT_QUERIES }) {
  return <style>{`
    @import url("https://fonts.googleapis.com/css2?family=${LANDING_FONT_QUERIES[family]}&display=swap");
    .landing-site{container-type:inline-size;container-name:landing;overflow:clip;font-size:14px;line-height:1.5}
    .landing-site h1,.landing-site h2,.landing-site h3{white-space:normal}
    .landing-agent,.landing-crypto{font-family:"Plus Jakarta Sans",sans-serif}
    .landing-developer,.landing-analytics{font-family:"Inter Tight",sans-serif}
    .landing-workspace{font-family:"Instrument Sans",sans-serif}
    .landing-mobile{font-family:Manrope,sans-serif}
    .landing-personal{font-family:Inter,sans-serif}
    .landing-site .landing-header{height:64px;padding:14px 24px;border-bottom:1px solid var(--color-border)}
    .landing-site .landing-header-inner{height:100%;max-width:1200px;gap:16px}
    .landing-site .landing-header a,.landing-site .landing-header button{font-size:12px}
    .landing-site .landing-header a:hover{text-decoration:underline;text-underline-offset:4px}
    .landing-site .landing-header nav[id]{position:absolute;top:100%;left:0;right:0;padding:20px;border:1px solid var(--color-border);border-radius:0 0 16px 16px;background:var(--color-background);color:var(--color-foreground);box-shadow:0 20px 30px #0001}
    .landing-agent .landing-section>h2{font-family:Fraunces,Georgia,serif;font-weight:400}
    .landing-agent,.landing-crypto{padding-top:24px}
    .landing-agent .landing-header,.landing-crypto .landing-header{width:calc(100% - 32px);max-width:1024px;margin:0 auto;border:1px solid color-mix(in srgb,var(--color-border) 55%,transparent);border-radius:16px;height:56px;padding:10px 20px}
    .landing-agent .landing-header a,.landing-agent .landing-header button,.landing-crypto .landing-header a,.landing-crypto .landing-header button{border-radius:999px}
    .landing-hero-copy p{max-width:600px;margin-left:auto;margin-right:auto;font-size:16px;line-height:28px}
    .landing-eyebrow{font-size:12px!important;line-height:20px!important;letter-spacing:0!important;text-transform:none!important}
    .landing-agent-hero{max-width:1064px;margin:auto;padding:64px 20px 0;text-align:center}
    .landing-agent-hero .landing-eyebrow{display:inline-flex;align-items:center;justify-content:center;height:32px;padding:4px 10px;border-radius:999px;background:color-mix(in srgb,var(--color-muted) 40%,transparent)}
    .landing-agent-hero h1{max-width:768px;margin:24px auto 0;font-size:48px;line-height:1.1;letter-spacing:-2px;font-weight:600}
    .landing-agent-hero .landing-hero-copy>p:not(.landing-eyebrow){margin-top:24px;max-width:600px;font-size:16px;line-height:28px}
    .landing-hero-actions{display:flex;justify-content:center;flex-wrap:wrap;gap:12px;margin-top:30px}
    .landing-hero-actions a{border-radius:999px;font-size:14px;height:46px}
    .landing-agent-hero .landing-hero-actions{margin-top:32px}
    .landing-agent-hero .landing-hero-actions a{height:44px}
    .landing-agent-scene{margin-top:56px;padding:96px 40px 0;border-radius:24px;background:radial-gradient(ellipse at 25% 20%,#c6d9ff 0,transparent 45%),radial-gradient(ellipse at 85% 70%,#4564fd 0,transparent 60%),#263eee;display:grid;grid-template-columns:1fr 1fr;gap:28px;text-align:left;min-height:543.5px;overflow:hidden}
    .landing-scene-panel{border:1px solid #fff7;border-radius:20px;background:var(--color-background);padding:24px;box-shadow:0 0 0 6px #ffffff24,0 24px 50px #0002;font-size:12px}
    .landing-scene-panel h2{font-size:14px;font-weight:600;margin:0}
    .landing-scene-meta{font-size:10px;color:var(--color-muted-foreground)}
    .landing-run-list{margin:24px 0 0;padding:0;list-style:none;display:grid;gap:20px}
    .landing-run-list li{display:flex;gap:12px;align-items:flex-start}
    .landing-run-dot{width:8px;height:8px;border-radius:50%;background:#0cba8e;flex:none;margin-top:5px}
    .landing-run-list li:nth-child(2) .landing-run-dot{background:#0aa7d1}
    .landing-run-list li:nth-child(3) .landing-run-dot{background:#e6a400}
    .landing-run-list p{margin:0;font-size:12px;line-height:18px}
    .landing-run-list small{font-size:10px;color:var(--color-muted-foreground)}
    .landing-chat-question{border-radius:16px 16px 4px 16px;background:#0ba7ce;color:white;margin:28px 0 20px 32px;padding:12px;font-size:11px}
    .landing-chat-answer{display:flex;gap:12px;margin:20px 0;font-size:11px;line-height:19px}
    .landing-chat-answer>span{color:#0ba7ce}
    .landing-chat-caption{margin-top:28px;border-top:1px solid var(--color-border);padding-top:16px;color:var(--color-muted-foreground);font-size:10px}
    .landing-integrations{max-width:1152px;margin:0 auto;padding:70px 20px 32px;text-align:center}
    .landing-integrations>p{font-size:12px;color:var(--color-muted-foreground);margin-bottom:24px}
    .landing-integrations>div{display:flex;gap:40px;justify-content:center;overflow:auto;scrollbar-width:none;white-space:nowrap;font-size:20px;font-weight:500;color:var(--color-muted-foreground)}
    .landing-crypto-hero{max-width:1152px;margin:auto;padding:64px 0;display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.15fr);gap:32px;align-items:center}
    .landing-crypto-copy h1{font:60px/1 Fraunces,Georgia,serif;letter-spacing:-2px;max-width:530px;margin:24px 0}
    .landing-crypto-copy>p:not(.landing-eyebrow){font-size:16px;line-height:28px;color:var(--color-muted-foreground);max-width:500px}
    .landing-crypto-copy{align-self:start;padding-top:51px}
    .landing-crypto-copy .landing-eyebrow{height:34px;padding:6px 12px}
    .landing-crypto-copy>p.landing-wallet-trust{font:10px/20px monospace;margin-top:28px;letter-spacing:.5px}
    .landing-crypto-copy .landing-hero-actions{justify-content:flex-start}
    .landing-wallet-demo{max-width:1152px;margin:40px auto 0;border:1px solid var(--color-border);border-radius:18px;overflow:hidden;box-shadow:0 30px 80px #0001}
    .landing-crypto .landing-wallet-demo{width:1019px;max-width:none;height:616px;margin:0;padding:38px 0 0 62px;border-radius:24px 0 0 0;background:radial-gradient(ellipse at 10% 35%,#b4eea3,transparent 55%),radial-gradient(ellipse at 80% 30%,#70a9af,transparent 50%),linear-gradient(125deg,#e8ff86,#d9faad 48%,#7991c7);box-shadow:none}
    .landing-crypto .landing-wallet-demo>.landing-demo-title{width:978px;height:38px;border:1px solid var(--color-border);border-radius:16px 0 0 0;padding:8px 12px;background:var(--color-card);font-size:10px}
    .landing-crypto .landing-wallet-demo>.landing-wallet-body{width:978px;min-height:540px;background:var(--color-card);border-left:1px solid var(--color-border)}
    .landing-crypto .landing-wallet-content{padding:24px 20px}
    .landing-crypto .landing-wallet-content .landing-balance{font-size:28px;letter-spacing:-.5px}
    .landing-crypto .landing-integrations{padding:64px 20px;text-align:center;max-width:1152px;overflow:hidden}
    .landing-crypto .landing-integrations>h2{font-size:14px;font-weight:400;margin-bottom:28px;color:var(--color-muted-foreground)}
    .landing-crypto .landing-integrations>div{font-size:20px;gap:48px;justify-content:center}
    .landing-demo-title{display:flex;align-items:center;justify-content:space-between;gap:16px;border-bottom:1px solid var(--color-border);padding:16px 24px;font-size:12px}
    .landing-wallet-body{display:grid;grid-template-columns:190px 1fr}
    .landing-wallet-sidebar{border-right:1px solid var(--color-border);padding:24px 16px;font-size:12px}
    .landing-wallet-sidebar a{display:block;padding:10px 12px;color:var(--color-muted-foreground);border-radius:8px}
    .landing-wallet-sidebar a:first-of-type{background:var(--color-muted);color:var(--color-foreground)}
    .landing-wallet-content{min-width:0;padding:28px}
    .landing-wallet-content .landing-balance{font-size:42px;font-weight:500;letter-spacing:-2px}
    .landing-crypto .landing-section h2{font-family:Fraunces,Georgia,serif;font-weight:400}
    .landing-developer{position:relative}
    .landing-developer .landing-header{position:absolute;inset:4px 0 auto;height:49.5px;padding:10px 24px;background:transparent;border:0;color:#f1f8f2}
    .landing-developer .landing-mark{background:transparent;color:#00c991;font-size:26px}
    .landing-developer .landing-header-inner{max-width:none}
    .landing-developer .landing-header a[href]{border-radius:999px}
    .landing-dev-hero{height:1000px;min-height:760px;margin:8px 12px;border:1px solid #ffffff12;border-radius:28px;padding:296.875px 24px 40px;background:#032b22;color:#f3fff8;isolation:isolate;position:relative;overflow:hidden;text-align:center;display:flex;flex-direction:column;align-items:center}
    .landing-dev-shader{position:absolute;inset:0;z-index:-1;pointer-events:none;background:radial-gradient(ellipse at 75% 80%,#0d4536,transparent 65%),#031c15}
    .landing-dev-hero h1{font-size:74px;font-weight:600;line-height:1.05;letter-spacing:-4px;margin:28px 0 0}
    .landing-dev-hero .landing-hero-copy>p{font-size:17px;line-height:27px;max-width:520px;color:#c4d8ce;margin-top:16px}
    .landing-dev-hero .landing-eyebrow{display:inline-flex;border:1px solid #ffffff20;background:#ffffff08;border-radius:999px;padding:7px 14px;color:#d4e8df;margin-top:0!important}
    .landing-dev-command{display:flex;align-items:center;justify-content:center;gap:12px;margin-top:32px;flex-wrap:wrap}
    .landing-command-copy{display:flex;gap:14px;align-items:center;border:1px solid #ffffff20;background:#ffffff08;border-radius:999px;padding:12px 18px;font:12px/20px monospace;color:#d9f6e7}
    .landing-command-copy:focus-visible{outline:2px solid currentColor;outline-offset:4px}
    .landing-dev-command>a{border-radius:999px;background:#00bd89;color:white;font-size:13px;height:46px}
    .landing-dev-scroll{position:absolute;right:32px;bottom:24px;font-size:12px;color:#b0c6b8}
    .landing-analytics{--color-primary:#0055ed;--color-primary-foreground:#fff}
    .landing-analytics .landing-header{height:57px}
    .landing-analytics .landing-header-inner{max-width:1118px}
    .landing-analytics .landing-mark{background:#0055ed;border-radius:0;color:#fff}
    .landing-analytics .landing-header a,.landing-analytics .landing-header button{border-radius:0}
    .landing-analytics-main{max-width:1152px;margin:auto;border-left:1px solid var(--color-border);border-right:1px solid var(--color-border)}
    .landing-analytics-hero{padding:96px 40px 0;position:relative;overflow:hidden}
    .landing-analytics-copy{position:relative;padding:0 0 44px;z-index:1}
    .landing-analytics-copy h1{max-width:896px;font-size:72px;line-height:.98;letter-spacing:-3px;font-weight:600;margin:28px 0 24px}
    .landing-analytics-copy>p:not(.landing-eyebrow){max-width:570px;font-size:16px;line-height:27px;color:var(--color-muted-foreground)}
    .landing-analytics-copy .landing-hero-actions{justify-content:flex-start}
    .landing-analytics-copy .landing-hero-actions a{border-radius:0}
    .landing-checker{position:absolute;right:-20px;top:24px;width:620px;height:580px;background:repeating-conic-gradient(from 0deg,#2559ed99 0% 25%,transparent 0% 50%) 0 0/12px 12px;mask-image:radial-gradient(ellipse at 55% 55%,#000 0,transparent 64%);transform:rotate(-11deg);opacity:.8;pointer-events:none}
    .landing-analytics-badges{margin-top:30px;font:10px/18px monospace;letter-spacing:1.5px;color:var(--color-muted-foreground)}
    .landing-analytics-dashboard{position:relative;margin:0 -16px;border:1px solid var(--color-border);background:var(--color-background);box-shadow:0 0 30px #0055ed14;border-radius:0;overflow:hidden}
    .landing-analytics-dashboard .landing-demo-title{font:10px/18px monospace;padding:12px 16px}
    .landing-analytics-dashboard .landing-wallet-body{grid-template-columns:146px 1fr}
    .landing-analytics-dashboard .landing-wallet-sidebar{padding:14px 8px;font-size:11px}
    .landing-analytics-dashboard .landing-wallet-content{padding:16px}
    .landing-analytics .landing-section h2{font-size:44px;line-height:1.05;letter-spacing:-1.8px}
    .landing-workspace .landing-header{background:#060815;color:white;border:0}
    .landing-workspace .landing-mark{background:transparent;color:#9fdcff}
    .landing-workspace-hero{background:#060815;color:#f8f8fc;position:relative;isolation:isolate;overflow:hidden;min-height:936px;padding:196.7px 24px 100px;text-align:center}
    .landing-workspace-hero h1{font-size:84px;line-height:.98;letter-spacing:-4px;font-weight:500;margin:32px auto 0;max-width:780px;width:fit-content}
    .landing-workspace-hero .landing-hero-copy>p:not(.landing-eyebrow){max-width:690px;color:#a8a7b5;margin-top:24px;font-size:17px;line-height:28px}
    .landing-spectrum{position:absolute;inset:0;z-index:-1;pointer-events:none;background:linear-gradient(to top,#060815,#064cbd 12%,#b0d4e7 22%,#e6b821 29%,#cb095e 35%,#9f0ba6 41%,#060815 55%)}
    .landing-workspace-composer{max-width:768px;margin:36px auto 0;border-radius:22px;background:#24202be8;color:#fff;border:1px solid #ffffff1a;box-shadow:0 24px 70px #0002;text-align:left;padding:20px}
    .landing-workspace-composer textarea{min-height:58px;font-size:16px;resize:vertical}
    .landing-workspace-composer select{background:#302c37;color:#fff;border-color:#ffffff26}
    .landing-workspace-composer button{border-radius:12px}
    .landing-workspace-prompts{max-width:820px;margin:16px auto 0;display:flex;flex-wrap:wrap;justify-content:center;gap:8px}
    .landing-workspace-prompts button{font-size:11px;color:#fff9;background:transparent}
    .landing-workspace .landing-section h2{font-weight:500;font-size:60px;line-height:1.02;letter-spacing:-2px}
    .landing-mobile{background:#f7f7f7;color:#201d1d;--color-background:#f7f7f7;--color-foreground:#201d1d;--color-muted:#eeeded;--color-muted-foreground:#797676;--color-card:#fff;--color-border:#e7e5e5;--color-primary:#262323;--color-primary-foreground:#fff}
    .landing-mobile .landing-header{height:64px;background:#f7f7f7;border-bottom:1px solid #e7e5e5}
    .landing-mobile .landing-header-inner{max-width:1120px}
    .landing-mobile-hero{text-align:center;max-width:1120px;margin:auto;padding:78px 20px 0;overflow:hidden}
    .landing-mobile-hero h1{font-size:60px;line-height:.94;letter-spacing:-3px;font-weight:500;margin:20px auto 0;max-width:540px}
    .landing-mobile-hero .landing-hero-copy>p:not(.landing-eyebrow){max-width:430px;font-size:14px;line-height:24px;margin-top:24px;color:#797676}
    .landing-phone{width:304px;position:relative;margin:56px auto 0;border:7px solid #282626;border-radius:44px;background:#fff;box-shadow:0 24px 60px #0002;padding:18px 18px 32px;text-align:left;min-height:520px}
    .landing-phone:before{content:"";width:82px;height:23px;border-radius:99px;background:#201d1d;position:absolute;top:8px;left:50%;transform:translateX(-50%)}
    .landing-phone-status{font-size:10px;margin-bottom:32px;display:flex;justify-content:space-between}
    .landing-phone h2{font-size:24px;letter-spacing:-1px;margin-top:8px;font-weight:500}
    .landing-phone .landing-phone-amount{font-size:34px;font-weight:500;letter-spacing:-1px;margin:12px 0 6px}
    .landing-phone-nav{display:flex;justify-content:space-between;gap:5px;margin-top:24px;padding-top:16px;border-top:1px solid #e7e5e5;font-size:10px}
    .landing-mobile .landing-section h2{font-size:42px;line-height:1.05;font-weight:500;letter-spacing:-1.5px}
    .landing-personal{padding:0}
    .landing-personal>main{max-width:598px;margin:auto;padding:80px 24px 0}
    .landing-profile{display:flex;gap:16px;align-items:center;margin-bottom:32px}
    .landing-profile-theme{margin-left:auto;display:grid;place-items:center;width:40px;height:40px;flex:none;border-radius:999px;color:var(--color-muted-foreground);padding:0;border:0;background:transparent}
    @media(hover:hover) and (pointer:fine){.landing-profile-theme:hover{background:var(--color-muted)}}
    .landing-profile-portrait{width:56px;height:56px;border-radius:12px;overflow:hidden;flex:none}
    .landing-profile h1{font-size:14px;line-height:20px;font-weight:500;margin:0;letter-spacing:0}
    .landing-profile p{font-size:14px;line-height:20px;margin:0;color:var(--color-muted-foreground)}
    .landing-personal-copy{font-size:14px;line-height:20px;color:var(--color-muted-foreground)}
    .landing-personal-copy>p,.landing-personal-story{margin-top:16px}
    .landing-personal h2.landing-personal-heading{font:500 36px/1 Caveat,cursive;letter-spacing:0;margin-bottom:24px}
    .landing-personal-gallery{display:flex;gap:8px;overflow:auto;scroll-snap-type:x mandatory;padding:0 0 20px;scrollbar-width:none;width:calc(50vw + 275px);max-width:calc(100vw - 24px)}
    .landing-personal-project{width:290px;flex:none;scroll-snap-align:start;overflow:hidden;border:0;background:none;border-radius:0}
    .landing-personal-project button{display:block;width:100%;text-align:left}
    .landing-project-art{width:100%;height:254px;border-radius:18px;background:var(--color-muted);overflow:hidden;display:grid;place-items:center;padding:24px}
    .landing-project-art svg{max-width:100%;height:auto}
    .landing-project-caption{padding:12px 2px;font-size:12px;line-height:18px}
    .landing-project-caption h3{font-size:14px;font-weight:500;letter-spacing:-.2px}
    .landing-project-caption p{color:var(--color-muted-foreground);font-size:11px}
    .landing-personal-section{padding-top:56px}
    .landing-personal-project-row{padding:20px 0;border-bottom:1px solid var(--color-border)}
    .landing-personal-project-row h3{font-size:14px;font-weight:500}
    .landing-personal-project-row p{margin-top:6px;font-size:13px;line-height:22px;color:var(--color-muted-foreground)}
    .landing-writing-list{display:grid;gap:28px}
    .landing-writing-link{display:grid;grid-template-columns:80px minmax(0,1fr);gap:16px;align-items:start;text-decoration:none}
    .landing-writing-art{display:block;width:80px;height:64px;border-radius:8px;overflow:hidden;object-fit:cover;flex:none;background:var(--color-muted)}
    .landing-writing-link h3{font-size:14px;line-height:20px;font-weight:500;letter-spacing:-.1px}
    .landing-writing-link p{margin-top:4px;font-size:13px;line-height:20px;color:var(--color-muted-foreground)}
    .landing-writing-link:focus-visible h3{text-decoration:underline;text-underline-offset:4px}
    @media(hover:hover) and (pointer:fine){.landing-writing-link:hover h3{text-decoration:underline;text-underline-offset:4px}}
    @container landing (max-width:800px){
      .landing-site .landing-header nav[aria-label$="navigation"]:not([id]){display:none}
      .landing-site .landing-header>div>div>button{display:inline-flex}
      .landing-agent-hero{padding:64px 16px 0}
      .landing-agent-hero h1{font-size:30px;line-height:1.1;letter-spacing:-1.2px;margin-top:24px}
      .landing-agent-hero .landing-hero-copy>p:not(.landing-eyebrow){font-size:14px;line-height:23px;margin-top:20px}
      .landing-agent-scene{grid-template-columns:1fr;padding:48px 18px 0;gap:24px;margin-top:48px;border-radius:20px}
      .landing-scene-panel{padding:20px;border-radius:16px}
      .landing-hero-actions{margin-top:26px;gap:10px}
      .landing-hero-actions a{font-size:12px;height:42px;padding-left:18px;padding-right:18px}
      .landing-crypto-hero{grid-template-columns:1fr;padding:64px 16px 0;gap:36px}
      .landing-crypto-copy{padding-top:0}
      .landing-crypto-copy h1{font-size:48px;line-height:1;letter-spacing:-1.5px;margin:24px 0}
      .landing-crypto-copy>p:not(.landing-eyebrow){font-size:14px;line-height:24px}
      .landing-integrations{padding-top:56px}
      .landing-wallet-demo{margin:24px 16px 0}
      .landing-crypto .landing-wallet-demo{width:100%;height:auto;min-height:600px;padding:24px 0 0 20px;margin:0;border-radius:20px 0 0 0}
      .landing-crypto .landing-wallet-demo>.landing-demo-title,.landing-crypto .landing-wallet-demo>.landing-wallet-body{width:100%}
      .landing-crypto .landing-integrations{padding:64px 0 12px}
      .landing-crypto .landing-wallet-sidebar{display:none}
      .landing-wallet-body,.landing-analytics-dashboard .landing-wallet-body{grid-template-columns:1fr}
      .landing-wallet-sidebar{display:none}
      .landing-wallet-content,.landing-analytics-dashboard .landing-wallet-content{padding:18px}
      .landing-wallet-content .landing-balance{font-size:34px}
      .landing-dev-hero{height:844px;min-height:740px;margin:8px;padding:263.96875px 29px 40px;border-radius:22px}
      .landing-dev-hero h1{font-size:32px;line-height:1.05;letter-spacing:-1.4px;margin-top:26px}
      .landing-dev-hero .landing-hero-copy>p{font-size:13px;line-height:22px;margin-top:18px}
      .landing-dev-hero .landing-eyebrow{font-size:10px!important;padding:4px 8px}
      .landing-dev-command{margin-top:26px;gap:8px}
      .landing-command-copy{padding:10px 12px;font-size:10px;gap:8px}
      .landing-dev-command>a{font-size:11px;padding:10px 14px;height:40px}
      .landing-analytics-main{margin:0 16px}
      .landing-analytics-hero{padding:80px 24px 0}
      .landing-analytics-copy h1{font-size:48px;line-height:.98;letter-spacing:-2px;margin:28px 0 24px}
      .landing-analytics-copy>p:not(.landing-eyebrow){font-size:14px;line-height:24px}
      .landing-analytics-dashboard{margin:0 -8px}
      .landing-checker{width:500px;right:-300px;opacity:.3}
      .landing-analytics-badges{font-size:8px;letter-spacing:1px}
      .landing-workspace-hero{min-height:780px;padding:90.45px 18px 100px}
      .landing-workspace-hero h1{font-size:48px;line-height:.98;letter-spacing:-2px;margin-top:24px}
      .landing-workspace-hero .landing-hero-copy>p:not(.landing-eyebrow){font-size:14px;line-height:24px;margin-top:22px}
      .landing-workspace-composer{padding:16px;border-radius:18px;margin-top:28px}
      .landing-workspace-composer textarea{font-size:14px;min-height:52px}
      .landing-workspace-composer select{max-width:130px}
      .landing-workspace-composer button{font-size:11px;padding:8px 12px}
      .landing-workspace-prompts{margin-top:14px;gap:4px}
      .landing-workspace-prompts button{font-size:10px}
      .landing-workspace .landing-section h2{font-size:40px;letter-spacing:-1.5px}
      .landing-mobile-hero{padding:62px 20px 0}
      .landing-mobile-hero h1{font-size:48px;line-height:.94;letter-spacing:-2.4px}
      .landing-phone{margin-top:44px;width:284px}
      .landing-personal>main{padding:64px 16px 0}
      .landing-personal-gallery{width:calc(100cqw - 16px);max-width:none}
      .landing-personal-project{width:264px}
      .landing-project-art{height:236px}
    }
    @media(prefers-reduced-motion:reduce){.landing-site *{scroll-behavior:auto!important}}
  `}</style>;
}
