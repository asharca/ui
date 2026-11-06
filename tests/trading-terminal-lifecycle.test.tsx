import { afterEach, expect, test } from "bun:test";
import { act, cleanup, fireEvent, render } from "@testing-library/react";
import { TradingTerminal, type TradingMarket, type TradingOrder } from "@/components/motion/operations-trading-pages";

afterEach(cleanup);
const markets: TradingMarket[] = ["first", "second"].map(id => ({ id, base: id.toUpperCase(), quote: "USD", quantityDecimals: 2, priceDecimals: 2, lastPrice: "10.00", availableBase: "2.00", availableQuote: "100.00", candles: [], bids: [], asks: [], trades: [] }));
const order: TradingOrder = { id: "order-1", marketId: "first", side: "buy", type: "limit", price: "10.00", quantity: "1.00", filled: "0.00", status: "open" };
const place = async () => {};
function deferred() {
  return Promise.withResolvers<void>();
}

test("cancellation delivery does not replace the later authoritative order status", async () => {
  const request = deferred();
  const cancel = () => request.promise;
  const view = render(<TradingTerminal markets={markets} marketId="first" orders={[order]} onPlaceOrder={place} onCancelOrder={cancel} />);
  const button = view.getByRole("button", { name: "Cancel order order-1" }) as HTMLButtonElement;
  fireEvent.click(button);
  expect(button.disabled).toBe(true);
  await act(async () => request.resolve());
  expect(button.disabled).toBe(false);
  expect(view.getByRole("status").textContent).toContain("Await the host-published status");
  view.rerender(<TradingTerminal markets={markets} marketId="first" orders={[{ ...order, status: "filled", filled: "1.00" }]} onPlaceOrder={place} onCancelOrder={cancel} />);
  expect(view.getByRole("status").textContent).toBe("Host-published order status: filled.");
  expect(view.queryByRole("button", { name: "Cancel order order-1" })).toBeNull();
  view.rerender(<TradingTerminal markets={markets} marketId="first" orders={[{ ...order, status: "cancelled" }]} onPlaceOrder={place} onCancelOrder={cancel} />);
  expect(view.getByRole("status").textContent).toBe("Host-published order status: cancelled.");
});

test("a removed order snapshot does not invent cancellation confirmation", async () => {
  const request = deferred();
  const cancel = () => request.promise;
  const view = render(<TradingTerminal markets={markets} marketId="first" orders={[order]} onPlaceOrder={place} onCancelOrder={cancel} />);
  fireEvent.click(view.getByRole("button", { name: "Cancel order order-1" }));
  await act(async () => request.resolve());
  view.rerender(<TradingTerminal markets={markets} marketId="first" orders={[]} onPlaceOrder={place} onCancelOrder={cancel} />);
  expect(view.getByRole("status").textContent).toContain("Await the host-published status");
  expect(view.getByText("No open orders for this market.")).toBeTruthy();
});

test("a late rejected cancellation stays with its requested market and preserves the order", async () => {
  const request = deferred();
  const cancel = () => request.promise;
  const view = render(<TradingTerminal markets={markets} marketId="first" orders={[order]} onPlaceOrder={place} onCancelOrder={cancel} />);
  fireEvent.click(view.getByRole("button", { name: "Cancel order order-1" }));
  view.rerender(<TradingTerminal markets={markets} marketId="second" orders={[order]} onPlaceOrder={place} onCancelOrder={cancel} />);
  await act(async () => request.reject(new Error("Host rejected cancellation")));
  expect(view.queryByRole("alert")).toBeNull();
  view.rerender(<TradingTerminal markets={markets} marketId="first" orders={[order]} onPlaceOrder={place} onCancelOrder={cancel} />);
  expect(view.getByRole("alert").textContent).toBe("Host rejected cancellation");
  expect((view.getByRole("button", { name: "Cancel order order-1" }) as HTMLButtonElement).disabled).toBe(false);
});
