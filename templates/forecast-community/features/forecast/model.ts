import { markets, people, rewards, topics, type Topic } from "./data";

export const STORAGE_KEY = "forecast-community:v1";
export type Draft = { id: string; title: string; description: string; topic: Topic; closes: string; rules: string; outcomes: string; updatedAt: string };
export type Position = { marketId: string; outcomeId: string; shares: number; cost: number };
export type Activity = { id: string; kind: "buy" | "sell" | "deposit" | "withdraw" | "reward"; amount: number; at: string; detail: string; marketId?: string };
export type Reply = { id: string; marketId: string; author: string; text: string; at: string };
export type ForecastState = { version: 1; authenticated: boolean; name: string; bio: string; theme: "light" | "dark" | "system"; balance: number; watchlist: string[]; following: string[]; positions: Position[]; activity: Activity[]; replies: Reply[]; drafts: Draft[]; claimed: string[] };
export const initialState: ForecastState = { version: 1, authenticated: false, name: "Your forecast", bio: "Curious about what comes next.", theme: "system", balance: 1000, watchlist: [], following: [], positions: [], activity: [], replies: [], drafts: [], claimed: [] };
export type Command =
  | { type: "auth"; name?: string; authenticated: boolean }
  | { type: "profile"; name: string; bio: string }
  | { type: "theme"; value: ForecastState["theme"] }
  | { type: "watch"; marketId: string }
  | { type: "follow"; personId: string }
  | { type: "trade"; marketId: string; outcomeId: string; mode: "buy" | "sell"; amount: number }
  | { type: "funds"; mode: "deposit" | "withdraw"; amount: number }
  | { type: "reply"; marketId: string; text: string }
  | { type: "claim"; rewardId: string }
  | { type: "draft"; draft: Draft }
  | { type: "deleteDraft"; id: string };
export interface ForecastPersistence { load(): string | null; save(value: string): void }
export interface ForecastService { execute(state: ForecastState, command: Command): ForecastState | Promise<ForecastState> }
const round = (value: number) => Math.round(value * 1e8) / 1e8;
const toggle = (values: string[], id: string) => values.includes(id) ? values.filter(value => value !== id) : [...values, id];
export function tradeCount(state: ForecastState) { return state.activity.filter(item => item.kind === "buy" || item.kind === "sell").length; }
export function rewardEligible(state: ForecastState, reward: typeof rewards[number]) { return tradeCount(state) >= reward.trades && (!("reply" in reward) || state.replies.length > 0); }
export function applyCommand(state: ForecastState, command: Command, now = new Date().toISOString(), id = crypto.randomUUID()): ForecastState {
  if (command.type === "theme") return { ...state, theme: command.value };
  if (command.type === "auth") {
    const name = command.name?.trim() || state.name;
    if (name.length > 40) throw new Error("Display name must be 40 characters or fewer.");
    return { ...state, authenticated: command.authenticated, name };
  }
  if (command.type === "watch") {
    if (!markets.some(market => market.id === command.marketId)) throw new Error("Market not found.");
    return { ...state, watchlist: toggle(state.watchlist, command.marketId) };
  }
  if (command.type === "follow") {
    if (!people.some(person => person.id === command.personId)) throw new Error("Forecaster not found.");
    return { ...state, following: toggle(state.following, command.personId) };
  }
  if (!state.authenticated) throw new Error("Connect a local demo profile to continue. No wallet or real funds are used.");
  if (command.type === "profile") {
    if (!command.name.trim() || command.name.trim().length > 40 || command.bio.length > 240) throw new Error("Use a name of 1–40 characters and a bio of up to 240 characters.");
    return { ...state, name: command.name.trim(), bio: command.bio.trim() };
  }
  if (command.type === "trade") {
    const market = markets.find(item => item.id === command.marketId);
    const outcome = market?.outcomes.find(item => item.id === command.outcomeId);
    if (!market || !outcome || market.resolved || market.closes < now.slice(0, 10)) throw new Error("This market is not open for trading.");
    if (!Number.isFinite(command.amount) || command.amount <= 0) throw new Error("Enter a positive amount.");
    const key = (position: Position) => position.marketId === market.id && position.outcomeId === outcome.id;
    const current = state.positions.find(key) ?? { marketId: market.id, outcomeId: outcome.id, shares: 0, cost: 0 };
    const buying = command.mode === "buy";
    if (buying && (command.amount < 1 || command.amount > state.balance)) throw new Error(command.amount < 1 ? "Minimum demo trade is 1 USDC." : "Insufficient demo balance.");
    if (!buying && command.amount > current.shares + 1e-8) throw new Error("Not enough shares to sell.");
    const shares = buying ? command.amount / outcome.price : command.amount;
    const amount = buying ? -command.amount : shares * outcome.price;
    const nextPosition = { ...current, shares: round(current.shares + (buying ? shares : -shares)), cost: round(buying ? current.cost + command.amount : current.cost * Math.max(0, 1 - shares / current.shares)) };
    return { ...state, balance: round(state.balance + amount), positions: [...state.positions.filter(position => !key(position)), ...(nextPosition.shares > 1e-7 ? [nextPosition] : [])], activity: [{ id, kind: command.mode, amount: round(amount), at: now, marketId: market.id, detail: `${buying ? "Bought" : "Sold"} ${shares.toFixed(2)} ${outcome.label} · ${market.title}` }, ...state.activity] };
  }
  if (command.type === "funds") {
    if (!Number.isFinite(command.amount) || command.amount < 1 || command.amount > 10000) throw new Error("Enter an amount from 1 to 10,000 demo USDC.");
    if (command.mode === "withdraw" && command.amount > state.balance) throw new Error("Insufficient demo balance.");
    const amount = command.mode === "deposit" ? command.amount : -command.amount;
    return { ...state, balance: round(state.balance + amount), activity: [{ id, kind: command.mode, amount, at: now, detail: command.mode === "deposit" ? "Local faucet credit — no real funds" : "Local demo withdrawal — no funds transferred" }, ...state.activity] };
  }
  if (command.type === "reply") {
    if (!markets.some(market => market.id === command.marketId)) throw new Error("Market not found.");
    const text = command.text.trim();
    if (!text || text.length > 1000) throw new Error("Write a reply between 1 and 1,000 characters.");
    return { ...state, replies: [...state.replies, { id, marketId: command.marketId, text, author: "local", at: now }] };
  }
  if (command.type === "claim") {
    const reward = rewards.find(item => item.id === command.rewardId);
    if (!reward || state.claimed.includes(reward.id)) throw new Error("Reward unavailable or already claimed.");
    if (!rewardEligible(state, reward)) throw new Error("Complete this reward's requirements first.");
    return { ...state, balance: round(state.balance + reward.amount), claimed: [...state.claimed, reward.id], activity: [{ id, kind: "reward", amount: reward.amount, at: now, detail: reward.title }, ...state.activity] };
  }
  if (command.type === "deleteDraft") return { ...state, drafts: state.drafts.filter(draft => draft.id !== command.id) };
  if (!command.draft.title.trim() || command.draft.title.length > 140 || command.draft.description.length > 2000 || command.draft.rules.length > 4000 || !command.draft.rules.trim() || !topics.includes(command.draft.topic) || !/^\d{4}-\d{2}-\d{2}$/.test(command.draft.closes) || Number.isNaN(Date.parse(command.draft.closes)) || command.draft.closes <= now.slice(0, 10)) throw new Error("Add a question, future close date, valid topic and clear resolution rules.");
  const outcomes = command.draft.outcomes.split(",").map(value => value.trim()).filter(Boolean);
  if (outcomes.length < 2 || outcomes.length > 8 || new Set(outcomes.map(value => value.toLowerCase())).size !== outcomes.length) throw new Error("Provide 2–8 unique outcomes separated by commas.");
  return { ...state, drafts: [{ ...command.draft, title: command.draft.title.trim(), updatedAt: now }, ...state.drafts.filter(draft => draft.id !== command.draft.id)] };
}
export const localForecastService: ForecastService = { execute: applyCommand };
export function parseState(raw: string | null): ForecastState {
  if (raw === null) return { ...initialState };
  const value: unknown = JSON.parse(raw);
  if (!value || typeof value !== "object") throw new Error("Saved demo data is not readable.");
  const s = value as ForecastState;
  const strings = (list: unknown): list is string[] => Array.isArray(list) && list.every(item => typeof item === "string");
  const number = (n: unknown) => typeof n === "number" && Number.isFinite(n);
  if (s.version !== 1 || typeof s.authenticated !== "boolean" || typeof s.name !== "string" || typeof s.bio !== "string" || !["light", "dark", "system"].includes(s.theme) || !number(s.balance) || s.balance < 0 || !strings(s.watchlist) || !strings(s.following) || !strings(s.claimed)
    || !Array.isArray(s.positions) || !s.positions.every(p => p && typeof p.marketId === "string" && typeof p.outcomeId === "string" && markets.some(market => market.id === p.marketId && market.outcomes.some(outcome => outcome.id === p.outcomeId)) && number(p.shares) && p.shares > 0 && number(p.cost) && p.cost >= 0)
    || !Array.isArray(s.activity) || !s.activity.every(a => a && typeof a.id === "string" && typeof a.at === "string" && typeof a.detail === "string" && number(a.amount) && ["buy", "sell", "deposit", "withdraw", "reward"].includes(a.kind))
    || !Array.isArray(s.replies) || !s.replies.every(r => r && [r.id, r.marketId, r.author, r.text, r.at].every(v => typeof v === "string"))
    || !Array.isArray(s.drafts) || !s.drafts.every(d => d && [d.id, d.title, d.description, d.closes, d.rules, d.outcomes, d.updatedAt].every(v => typeof v === "string") && topics.includes(d.topic))) throw new Error("Saved demo data has an unsupported format. Reset local data to continue.");
  return s;
}
export function positionValue(position: Position) { return position.shares * (markets.find(market => market.id === position.marketId)?.outcomes.find(outcome => outcome.id === position.outcomeId)?.price ?? 0); }
export const money = (value: number) => new Intl.NumberFormat("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value);
