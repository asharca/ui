import { applyCommand, assets, money, portfolioValue, type Command, type PortfolioState } from "./model";

/** Replace these boundaries with authenticated host services. Local adapters never contact a network. */
export interface AssetServices {
  signIn(profile: { name: string; email: string }): Promise<{ name: string; email: string }>;
  execute(command: Command, snapshot: PortfolioState): Promise<PortfolioState>;
  assistant(input: { prompt: string; model: string; snapshot: PortfolioState; signal: AbortSignal }): AsyncIterable<string>;
}
export const localServices: AssetServices = {
  async signIn(profile) {
    if (!profile.name.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profile.email)) throw new Error("Enter your name and a valid demo email.");
    return { name: profile.name.trim(), email: profile.email.trim() };
  },
  async execute(command, snapshot) { return applyCommand(snapshot, command); },
  async *assistant({ prompt, model, snapshot, signal }) {
    const total = portfolioValue(snapshot);
    const largest = [...assets].sort((a, b) => snapshot.balances[b.id] * b.price - snapshot.balances[a.id] * a.price)[0];
    let reply: string;
    if (/stak|reward|yield/i.test(prompt)) reply = `Your local staking positions total ${money(snapshot.positions.reduce((sum, p) => sum + p.amount * assets.find(a => a.id === p.asset)!.price, 0))}. Demo APRs are illustrative: ETH 3.8%, SOL 6.2%, and AVAX 4.9%. The Staking page lets you allocate, unstake instantly, and claim rewards. Real staking introduces lockups, validator risk, and network fees that this local simulation does not model.`;
    else if (/swap|trade|buy|sell/i.test(prompt)) reply = `Use the Assets page to simulate a swap against fixed reference prices. The preview deducts a 0.3% demo fee and checks your available balance. No order is sent to an exchange or chain. Your largest liquid holding is ${largest.symbol} at ${money(snapshot.balances[largest.id] * largest.price)}. This is a walkthrough, not an investment recommendation.`;
    else if (/wallet|address/i.test(prompt)) reply = `You are tracking ${snapshot.wallets.length} public address${snapshot.wallets.length === 1 ? "" : "es"}. Wallet tracking saves labels and addresses locally; it does not fetch balances or establish ownership. Never paste seed phrases or private keys. A production integration needs a read-only chain indexer and explicit wallet-signing consent for any execution.`;
    else reply = `Your illustrative portfolio is ${money(total)}, including staked principal. ${largest.name} is your largest liquid holding at ${money(snapshot.balances[largest.id] * largest.price)}. You follow ${snapshot.watchlist.length} assets and have ${snapshot.positions.filter(p => p.amount > 0).length} active staking positions. Explore Assets for allocations and Activity for your simulated transactions. Prices are a fixed local snapshot, not live market data.`;
    if (model === "local-educator") reply = `Let's unpack the local demo. ${reply} Diversification describes spreading exposure across assets; it never guarantees a return. Always verify current data independently.`;
    if (model === "local-concise") reply = `${reply.split(". ").slice(0, 2).join(". ")}.`;
    for (const chunk of reply.match(/\S+\s*/g) ?? []) {
      if (signal.aborted) return;
      const { promise, resolve } = Promise.withResolvers<void>();
      const finish = () => { clearTimeout(timer); signal.removeEventListener("abort", finish); resolve(); };
      const timer = setTimeout(finish, 24);
      signal.addEventListener("abort", finish, { once: true });
      await promise;
      if (signal.aborted) return;
      yield chunk;
    }
  },
};
