import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

export type Manager = 'pnpm' | 'npm' | 'yarn' | 'bun';
export type Theme = 'system' | 'light' | 'dark';
export const managers: Manager[] = ['pnpm', 'npm', 'yarn', 'bun'];
export const runners: Record<Manager, string> = { pnpm: 'pnpm dlx shadcn@latest', npm: 'npx shadcn@latest', yarn: 'yarn dlx shadcn@latest', bun: 'bunx --bun shadcn@latest' };
function read(key: string) { try { return localStorage.getItem(key); } catch { return null; } }
interface Preferences { theme: Theme; setTheme: (theme: Theme) => void; dark: boolean; manager: Manager; setManager: (manager: Manager) => void }
const Context = createContext<Preferences | null>(null);
export function PreferencesProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => { const stored = read('asharca-theme'); return stored === 'light' || stored === 'dark' ? stored : 'system'; });
  const [dark, setDark] = useState(() => document.documentElement.classList.contains('dark'));
  const [manager, setManager] = useState<Manager>(() => { const stored = read('asharca-manager'); return managers.includes(stored as Manager) ? stored as Manager : 'pnpm'; });
  useEffect(() => {
    const media = matchMedia('(prefers-color-scheme: dark)');
    const update = () => { const next = theme === 'dark' || (theme === 'system' && media.matches); setDark(next); document.documentElement.classList.toggle('dark', next); };
    update(); media.addEventListener('change', update);
    try { localStorage.setItem('asharca-theme', theme); } catch { /* Preferences are optional. */ }
    return () => media.removeEventListener('change', update);
  }, [theme]);
  useEffect(() => { try { localStorage.setItem('asharca-manager', manager); } catch { /* Preferences are optional. */ } }, [manager]);
  return <Context.Provider value={{ theme, setTheme, dark, manager, setManager }}>{children}</Context.Provider>;
}
export function usePreferences() { const value = useContext(Context); if (!value) throw new Error('Missing PreferencesProvider'); return value; }
export const publicPath = (path: string) => `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`;
export const registryUrl = (slug: string) => new URL(publicPath(`r/${slug}.json`), window.location.origin).href;
