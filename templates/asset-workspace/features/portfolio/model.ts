export const assets = [
  { id: "bitcoin", symbol: "BTC", name: "Bitcoin", network: "Bitcoin", price: 68420, change: 2.84, color: "#dd8b29", apr: 0, description: "A decentralized monetary network with a fixed supply. The local demo tracks Bitcoin without custody or a wallet connection." },
  { id: "ethereum", symbol: "ETH", name: "Ethereum", network: "Ethereum", price: 3540, change: 1.76, color: "#8579d6", apr: 3.8, description: "A programmable proof-of-stake network. Practice allocating ETH to a simulated validator position without signing a transaction." },
  { id: "solana", symbol: "SOL", name: "Solana", network: "Solana", price: 172.6, change: -1.23, color: "#43a98c", apr: 6.2, description: "A high-throughput proof-of-stake network. Staking and rewards in this workspace are entirely local simulations." },
  { id: "usd-coin", symbol: "USDC", name: "USD Coin", network: "Ethereum", price: 1, change: 0.01, color: "#3979ce", apr: 0, description: "A dollar-referenced stablecoin used as the quote asset in the local swap simulation. No redemption or price feed is connected." },
  { id: "arbitrum", symbol: "ARB", name: "Arbitrum", network: "Arbitrum", price: 0.82, change: 3.12, color: "#559ab1", apr: 0, description: "A governance token for an Ethereum scaling ecosystem. Market values are a fixed illustrative snapshot, not live quotes." },
  { id: "avalanche", symbol: "AVAX", name: "Avalanche", network: "Avalanche", price: 32.8, change: -0.67, color: "#c95e62", apr: 4.9, description: "A proof-of-stake network supporting application-specific chains. Explore a local position with instant demo unstaking." },
] as const;
export type AssetId = typeof assets[number]["id"];
export const networks = ["All networks", ...new Set(assets.map(asset => asset.network))];
export const findAsset = (id: string) => assets.find(asset => asset.id === id);
export const money = (value: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 }).format(value);
export const quantity = (value: number) => new Intl.NumberFormat("en-US", { maximumFractionDigits: 6 }).format(value);
export const STORAGE_KEY = "asset-workspace:v1";
export type ActivityKind = "swap" | "stake" | "unstake" | "reward" | "wallet";
export type Activity = { id: string; kind: ActivityKind; asset: AssetId; network: string; description: string; amount: number; at: string };
export type Wallet = { id: string; name: string; address: string; network: string };
export type Position = { asset: AssetId; amount: number; rewards: number; updatedAt: number };
export type ChatMessage = { id: string; role: "user" | "assistant"; text: string; model: string };
export const defaultPreferences = { locale: "en-US" as "en-US" | "en-GB", compact: false, weeklyRecap: true, walletUpdates: true, stakingUpdates: false };
export type PortfolioState = {
  version: 1;
  profile: { name: string; email: string } | null;
  balances: Record<AssetId, number>;
  wallets: Wallet[];
  watchlist: AssetId[];
  positions: Position[];
  activity: Activity[];
  messages: ChatMessage[];
  model: string;
  theme: "light" | "dark" | "system";
  preferences?: typeof defaultPreferences;
};
export function initialState(): PortfolioState {
  return { version: 1, profile: null, balances: { bitcoin: 0.42, ethereum: 4.8, solana: 36, "usd-coin": 6250, arbitrum: 1800, avalanche: 24 }, wallets: [], watchlist: ["bitcoin", "ethereum", "solana"], positions: [{ asset: "ethereum", amount: 1.2, rewards: 0.0034, updatedAt: Date.now() }], activity: [], messages: [], model: "local-analyst", theme: "system" };
}
export const portfolioValue = (state: PortfolioState) => assets.reduce((sum, asset) => sum + (state.balances[asset.id] + state.positions.filter(position => position.asset === asset.id).reduce((n, position) => n + position.amount, 0)) * asset.price, 0);
export function earned(position: Position, now = Date.now()) {
  const apr = findAsset(position.asset)?.apr ?? 0;
  return position.rewards + position.amount * apr / 100 * Math.max(0, now - position.updatedAt) / (365 * 24 * 60 * 60 * 1000);
}
export type Command =
  | { type: "swap"; from: AssetId; to: AssetId; amount: number }
  | { type: "stake" | "unstake"; asset: AssetId; amount: number }
  | { type: "claim"; asset: AssetId }
  | { type: "wallet"; name: string; address: string; network: string }
  | { type: "remove-wallet"; id: string }
  | { type: "watch"; asset: AssetId };
export function applyCommand(state: PortfolioState, command: Command): PortfolioState {
  const next = structuredClone(state);
  const now = Date.now();
  const log = (kind: ActivityKind, asset: AssetId, amount: number, description: string, network?: string) => next.activity.unshift({ id: crypto.randomUUID(), kind, asset, network: network ?? findAsset(asset)!.network, amount, description, at: new Date(now).toISOString() });
  if (command.type === "watch") {
    next.watchlist = next.watchlist.includes(command.asset) ? next.watchlist.filter(id => id !== command.asset) : [...next.watchlist, command.asset];
  } else if (command.type === "remove-wallet") {
    next.wallets = next.wallets.filter(wallet => wallet.id !== command.id);
  } else if (command.type === "wallet") {
    const address = command.address.trim();
    const valid = command.network === "Solana" ? /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(address) : command.network === "Bitcoin" ? /^(bc1[a-z0-9]{25,87}|[13][a-km-zA-HJ-NP-Z1-9]{25,34})$/.test(address) : /^0x[a-fA-F0-9]{40}$/.test(address);
    if (!networks.slice(1).includes(command.network) || !valid) throw new Error("Enter a valid public address for the selected network. Never enter a private key.");
    if (!command.name.trim()) throw new Error("Give this address a name.");
    if (next.wallets.some(wallet => wallet.network === command.network && (command.network === "Solana" || command.network === "Bitcoin" ? wallet.address === address : wallet.address.toLowerCase() === address.toLowerCase()))) throw new Error("This address is already tracked on that network.");
    next.wallets.push({ id: crypto.randomUUID(), name: command.name.trim(), address, network: command.network });
    log("wallet", "usd-coin", 0, `Tracking ${command.name.trim()} · no balance sync`, command.network);
  } else if (command.type === "swap") {
    if (command.from === command.to) throw new Error("Choose two different assets.");
    if (!Number.isFinite(command.amount) || command.amount <= 0 || command.amount > next.balances[command.from]) throw new Error("Enter an amount greater than zero within your available balance.");
    const receive = command.amount * findAsset(command.from)!.price / findAsset(command.to)!.price * 0.997;
    next.balances[command.from] -= command.amount;
    next.balances[command.to] += receive;
    log("swap", command.from, command.amount, `Simulated swap: ${quantity(command.amount)} ${findAsset(command.from)!.symbol} → ${quantity(receive)} ${findAsset(command.to)!.symbol} (0.3% demo fee)`);
  } else {
    const asset = findAsset(command.asset)!;
    if (!asset.apr) throw new Error("This asset is not supported for demo staking.");
    let position = next.positions.find(item => item.asset === command.asset);
    if (command.type === "claim") {
      if (!position || earned(position, now) <= 0) throw new Error("No rewards are available.");
      const reward = earned(position, now);
      next.balances[command.asset] += reward;
      position.rewards = 0;
      position.updatedAt = now;
      log("reward", command.asset, reward, `Claimed ${quantity(reward)} ${asset.symbol} in demo rewards`);
    } else {
      if (!Number.isFinite(command.amount) || command.amount <= 0) throw new Error("Enter an amount greater than zero.");
      if (command.type === "stake") {
        if (command.amount > next.balances[command.asset]) throw new Error("Not enough available balance.");
        if (!position) { position = { asset: command.asset, amount: 0, rewards: 0, updatedAt: now }; next.positions.push(position); }
        position.rewards = earned(position, now); position.updatedAt = now; position.amount += command.amount;
        next.balances[command.asset] -= command.amount;
      } else {
        if (!position || command.amount > position.amount) throw new Error("Amount exceeds your staked position.");
        position.rewards = earned(position, now); position.updatedAt = now; position.amount -= command.amount;
        next.balances[command.asset] += command.amount;
      }
      log(command.type, command.asset, command.amount, `${command.type === "stake" ? "Staked" : "Unstaked"} ${quantity(command.amount)} ${asset.symbol} · local simulation`);
    }
  }
  return next;
}
export function parseState(value: string): PortfolioState {
  const data: unknown = JSON.parse(value);
  if (!data || typeof data !== "object") throw new Error("Invalid saved workspace.");
  const s = data as PortfolioState;
  const validId = (id: unknown) => typeof id === "string" && !!findAsset(id);
  const amount = (n: unknown) => typeof n === "number" && Number.isFinite(n) && n >= 0;
  if (s.version !== 1 || !s.balances || !assets.every(a => amount(s.balances[a.id])) || !["light", "dark", "system"].includes(s.theme) || !["local-analyst", "local-educator", "local-concise"].includes(s.model)
    || !(s.profile === null || (typeof s.profile?.name === "string" && typeof s.profile.email === "string"))
    || !Array.isArray(s.watchlist) || !s.watchlist.every(validId)
    || !Array.isArray(s.wallets) || !s.wallets.every(w => typeof w.id === "string" && typeof w.name === "string" && typeof w.address === "string" && networks.slice(1).includes(w.network))
    || !Array.isArray(s.positions) || !s.positions.every(p => validId(p.asset) && amount(p.amount) && amount(p.rewards) && amount(p.updatedAt))
    || !Array.isArray(s.activity) || !s.activity.every(a => typeof a.id === "string" && ["swap", "stake", "unstake", "reward", "wallet"].includes(a.kind) && validId(a.asset) && amount(a.amount) && typeof a.network === "string" && typeof a.description === "string" && Number.isFinite(Date.parse(a.at)))
    || !Array.isArray(s.messages) || !s.messages.every(m => typeof m.id === "string" && ["user", "assistant"].includes(m.role) && typeof m.text === "string" && typeof m.model === "string")) throw new Error("Saved workspace is incompatible or damaged. Export it before resetting.");
  if (s.preferences && (!["en-US", "en-GB"].includes(s.preferences.locale) || ![s.preferences.compact, s.preferences.weeklyRecap, s.preferences.walletUpdates, s.preferences.stakingUpdates].every(value => typeof value === "boolean"))) throw new Error("Saved workspace preferences are incompatible. Export before resetting.");
  return s;
}
