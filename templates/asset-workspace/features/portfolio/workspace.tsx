"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { Button } from "@/components/motion/button";
import { Input } from "@/components/motion/input";
import { CenterMorphModal, CenterMorphModalContent, CenterMorphModalTrigger } from "@/components/motion/center-morph-modal";
import { ChartNoAxesCombined, CircleDot, LayoutGrid, MessageCircle, PanelLeft, Search, Settings, Shield, Star, Wallet } from "lucide-react";
import { assets } from "./model";
import { usePortfolio } from "./provider";

const navigation = [
  { href: "/", label: "Overview", icon: LayoutGrid }, { href: "/assets/", label: "Assets", icon: CircleDot },
  { href: "/wallets/", label: "Wallets", icon: Wallet }, { href: "/activity/", label: "Activity", icon: ChartNoAxesCombined },
  { href: "/staking/", label: "Staking", icon: Shield }, { href: "/watchlist/", label: "Watchlist", icon: Star },
  { href: "/assistant/", label: "Assistant", icon: MessageCircle }, { href: "/settings/", label: "Settings", icon: Settings },
];
function Navigation({ close }: { close?: () => void }) {
  const pathname = usePathname();
  return <nav aria-label="Workspace navigation">{navigation.map(item => {
    const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href.slice(0, -1));
    return <Link key={item.href} href={item.href} className={`nav-link ${active ? "active" : ""}`} aria-current={active ? "page" : undefined} onClick={close}><span aria-hidden="true"><item.icon size={16} strokeWidth={1.5}/></span>{item.label}{item.label === "Assistant" && <small>LOCAL</small>}</Link>;
  })}</nav>;
}
function WorkspaceGuide() {
  const [step, setStep] = useState(0);
  const [dismissed, setDismissed] = useState(false);
  const steps = [
    { title: "Bring your wallets together", description: "Keep public addresses in one place. No keys, syncing or signing.", action: "Add wallet", href: "/wallets/", icon: Wallet },
    { title: "Keep your favorites close", description: "Follow assets in your browser-local watchlist.", action: "Explore assets", href: "/assets/", icon: Star },
    { title: "A clearer view of your portfolio", description: "Explore your demo holdings with a rule-based local assistant.", action: "Open assistant", href: "/assistant/", icon: MessageCircle },
  ];
  const current = steps[step];
  if (dismissed) return null;
  return <section className="workspace-guide" aria-label="Explore your local workspace"><div className="workspace-guide-art"><span aria-hidden="true"><current.icon size={20} strokeWidth={1.5}/></span><Link href={current.href}>{current.action}</Link></div><div className="workspace-guide-copy" aria-live="polite"><strong>{current.title}</strong><p>{current.description}</p></div><div className="workspace-guide-controls"><span>{step + 1} of {steps.length}</span><button type="button" onClick={() => setDismissed(true)}>Skip</button><button type="button" onClick={() => step === steps.length - 1 ? setDismissed(true) : setStep(step + 1)}>{step === steps.length - 1 ? "Done" : "Next"}</button></div></section>;
}
export function Workspace({ children }: { children: ReactNode }) {
  const { state, ready, error, notice, clearError } = usePortfolio();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed,setCollapsed] = useState(false); const [searchOpen,setSearchOpen] = useState(false); const [query,setQuery] = useState("");
  useEffect(()=>{const onKey=(event:KeyboardEvent)=>{if(!(event.metaKey||event.ctrlKey))return;if(event.key.toLowerCase()==="k"){event.preventDefault();setSearchOpen(value=>!value);}if(event.key.toLowerCase()==="b"){event.preventDefault();setCollapsed(value=>!value);}};window.addEventListener("keydown",onKey);return()=>window.removeEventListener("keydown",onKey);},[]);
  const previousPath = useRef(pathname);
  useEffect(() => {
    if (previousPath.current === pathname) return;
    previousPath.current = pathname;
    setMobileOpen(false);
  }, [pathname]);
  const login = pathname.startsWith("/login");
  const currentAsset = assets.find(asset => pathname.startsWith(`/assets/${asset.id}`));
  const settingsSection = pathname.startsWith("/settings/") ? ({ appearance: "Appearance", notifications: "Notifications", data: "Data & privacy" } as Record<string, string>)[pathname.split("/")[2]] : undefined;
  return <div className={`orbit-shell ${collapsed ? "is-collapsed" : ""}`}>
    <a className="skip-link" href="#main-content">Skip to content</a>
    {!login && <aside className="sidebar"><Link className="brand" href="/"><span className="brand-mark" aria-hidden="true">◈</span>Orbit<span className="brand-dot">.</span></Link><button type="button" className="orbit-search" aria-label="Search workspace" onClick={()=>setSearchOpen(true)}><Search size={16}/><span>Search workspace</span><kbd>⌘K</kbd></button><Navigation /><div className="sidebar-bottom"><WorkspaceGuide /><Link className="profile" href={state.profile ? "/settings/" : "/login/"}><span className="avatar">{state.profile?.name.slice(0, 1).toUpperCase() ?? "G"}</span><span><strong>{state.profile?.name ?? "Guest explorer"}</strong><small>{state.profile ? "Demo workspace" : "Sign in locally"}</small></span></Link></div></aside>}
    <div className={login ? "login-layout" : "workspace-main"}>
      {!login && <header className="topbar"><Button className="desktop-sidebar-toggle" variant="ghost" size="icon" aria-label="Toggle sidebar" aria-expanded={!collapsed} onClick={()=>setCollapsed(value=>!value)}><PanelLeft size={18}/></Button><div className="mobile-nav"><CenterMorphModal open={mobileOpen} onOpenChange={setMobileOpen}><CenterMorphModalTrigger><Button variant="ghost" size="icon" aria-label="Open navigation"><PanelLeft size={16}/></Button></CenterMorphModalTrigger><CenterMorphModalContent ariaLabel="Navigation"><h2>Orbit workspace</h2><Navigation close={() => setMobileOpen(false)} /></CenterMorphModalContent></CenterMorphModal></div><div className="breadcrumb">{currentAsset ? <><Link href="/assets/">Assets</Link><span>/</span>{currentAsset.name}</> : settingsSection ? <><Link href="/settings/">Settings</Link><span>/</span>{settingsSection}</> : navigation.find(item => item.href === `${pathname.replace(/\/$/, "")}/`)?.label ?? "Overview"}</div>{pathname === "/" && <Link href="/wallets/" className="primary-link overview-wallets-link">Manage wallets ↗</Link>}<div className="topbar-actions"><Link href="/settings/" aria-label="Workspace settings" className="avatar small-avatar">{state.profile?.name.slice(0, 1).toUpperCase() ?? "G"}</Link></div></header>}
      <main id="main-content" tabIndex={-1} className={login ? "" : "page-content"}>
        {error && <div className="error-banner" role="alert"><span>{error}</span><Button variant="ghost" size="sm" onClick={clearError}>Dismiss</Button></div>}
        {notice && <p role="status" className="notice">{notice}</p>}
        {!ready ? <p role="status" className="loading">Restoring your local workspace…</p> : children}
      {!login && <footer className="footer"><span>Orbit · an independent local portfolio demo</span><span>No live prices. No custody. No financial advice.</span></footer>}
      </main>
    </div>
    <CenterMorphModal open={searchOpen} onOpenChange={setSearchOpen}><CenterMorphModalContent ariaLabel="Search workspace" className="max-w-lg"><Input label="Search workspace" placeholder="Search pages or assets…" value={query} onChange={setQuery} autoFocus/><div className="orbit-search-results">{navigation.filter(item=>item.label.toLowerCase().includes(query.toLowerCase())).map(item=><Link key={item.href} href={item.href} onClick={()=>setSearchOpen(false)}>{item.label}<small>Page</small></Link>)}{assets.filter(asset=>`${asset.name} ${asset.symbol}`.toLowerCase().includes(query.toLowerCase())).map(asset=><Link key={asset.id} href={`/assets/${asset.id}/`} onClick={()=>setSearchOpen(false)}>{asset.name}<small>{asset.symbol}</small></Link>)}</div></CenterMorphModalContent></CenterMorphModal>
  </div>;
}
export function LoginScreen() {
  const { state, signIn, busy, update } = usePortfolio();
  const [name, setName] = useState(""); const [email, setEmail] = useState("");
  return (
    <div className="login-screen">
      <div className="login-story">
        <Link href="/" className="brand">◈ Orbit.</Link>
        <div><p className="eyebrow">A CLEARER PERSPECTIVE</p><h1>Your assets.<br />One calm place.</h1><p>Follow your portfolio, explore staking, and make sense of the numbers — without connecting a wallet.</p></div>
        <small>Independent demo · local data only</small>
      </div>
      <section className="login-form panel">
        <p className="eyebrow">WELCOME TO YOUR WORKSPACE</p>
        <h2>{state.profile ? `Welcome, ${state.profile.name}` : "Make yourself at home"}</h2>
        <p className="muted">Demo sign-in saves your name and email in this browser. It is not authentication. No password, email delivery, or account is created.</p>
        {state.profile ? (
          <div className="stack"><Link className="primary-link" href="/">Open overview →</Link><Button variant="outline" onClick={() => update(s => ({ ...s, profile: null }))}>Sign out of demo</Button></div>
        ) : (
          <form className="stack" onSubmit={async event => { event.preventDefault(); await signIn(name, email); }}>
            <Input label="Your name" value={name} onChange={setName} autoComplete="name" required maxLength={80} />
            <Input label="Demo email" type="email" value={email} onChange={setEmail} autoComplete="email" required maxLength={160} />
            <Button type="submit" disabled={busy}>{busy ? "Saving…" : "Enter demo workspace"}</Button>
            <Link className="subtle-link" href="/">Continue as a guest</Link>
          </form>
        )}
      </section>
    </div>
  );
}
