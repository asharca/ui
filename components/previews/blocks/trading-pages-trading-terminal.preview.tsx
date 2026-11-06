"use client";

import { useState } from "react";
import { Button } from "@/components/motion/button";
import { TradingTerminal, type TradingMarket, type TradingOrder, tradingUnits } from "@/components/motion/operations-trading-pages";
import type { Candle } from "@/components/charts/candlestick-chart";

function candles(base: number, count: number, step: number): Candle[] {
  return Array.from({ length: count }, (_, index) => {
    const open = base + Math.sin(index / 8) * base * .0018 + index / count * base * .0011;
    const close = open + Math.sin(index * 2.1) * base * .00022;
    return { id: `${step}-${index}`, label: `${String(10 + Math.floor(index * step / 60)).padStart(2, "0")}:${String(index * step % 60).padStart(2, "0")}`, open, high: Math.max(open, close) + base * .00016, low: Math.min(open, close) - base * .00019, close, volume: 30 + (index * 37 % 170) };
  });
}
function market(id: string, base: string, last: number, availableBase: string, availableQuote: string): TradingMarket {
  const baseInOrders = base === "ETH" ? .4 : 0; const quoteInOrders = base === "ETH" ? 1798.88 : 0;
  return { id, base, quote: "USDC", quantityDecimals: 3, priceDecimals: 2, lastPrice: last.toFixed(2), availableBase, availableQuote, feeRateBps: 10, bookSteps: [.1,.5,1], candles: candles(last, 120, 1), timeframes: [1, 5, 15, 60].map(step => ({ id: String(step), label: step === 60 ? "1h" : `${step}m`, candles: candles(last, 120, step) })), daily: { changePercent: 1.43, low: (last * .983).toFixed(2), high: (last * 1.012).toFixed(2), baseVolume: "184220", quoteVolume: "444400000", asOf: "2026-10-19T12:05:00Z" }, bids: Array.from({ length: 60 }, (_, index) => ({ price: Math.round((last - .1 * (index + 1)) * 100) / 100, size: .3 + (index * 1.37 % 4) })), asks: Array.from({ length: 60 }, (_, index) => ({ price: Math.round((last + .1 * index) * 100) / 100, size: .6 + (index * 1.13 % 4) })), trades: Array.from({ length: 18 }, (_, index) => ({ id: `${id}-trade-${index}`, at: `12:05:${String(59 - index * 3).padStart(2, "0")}`, side: index % 3 ? "buy" : "sell", price: (last + (index % 5 - 2) * .1).toFixed(2), quantity: (.1 + index * .031).toFixed(3) })), balances: [{ symbol: base, available: availableBase, quantity: String(Number(availableBase) + baseInOrders), inOrders: baseInOrders.toFixed(3), valueQuote: String((Number(availableBase) + baseInOrders) * last) }, { symbol: "USDC", available: availableQuote, quantity: String(Number(availableQuote) + quoteInOrders), inOrders: quoteInOrders.toFixed(2), valueQuote: String(Number(availableQuote) + quoteInOrders) }] };
}
const markets = [market("eth", "ETH", 2412.38, "4.218", "12480.50"), market("sol", "SOL", 150, "20.000", "10000.00")];
const initialOrders: TradingOrder[] = [{ id: "paper-1", marketId: "eth", at: "11:52:08", side: "buy", type: "limit", price: "2398.50", quantity: "0.750", filled: "0", status: "open" }, { id: "paper-2", marketId: "eth", at: "11:47:51", side: "sell", type: "limit", price: "2436.00", quantity: "0.400", filled: "0", status: "open" }];
function withReservations(item: TradingMarket, orders: readonly TradingOrder[]): TradingMarket {
  const baseHolding=Number(item.balances?.find(asset=>asset.symbol===item.base)?.quantity ?? item.availableBase); const quoteHolding=Number(item.balances?.find(asset=>asset.symbol===item.quote)?.quantity ?? item.availableQuote); let baseReserved=0; let quoteReserved=0;
  for(const order of orders){if(order.marketId!==item.id || (order.status!=="open" && order.status!=="partial"))continue;const remaining=Math.max(0,Number(order.quantity)-Number(order.filled));if(order.side==="sell")baseReserved+=remaining;else quoteReserved+=remaining*Number(order.price ?? item.lastPrice);}
  const availableBase=Math.max(0,baseHolding-baseReserved).toFixed(item.quantityDecimals);const availableQuote=Math.max(0,quoteHolding-quoteReserved).toFixed(item.priceDecimals);
  return {...item,availableBase,availableQuote,balances:[{symbol:item.base,available:availableBase,quantity:baseHolding.toFixed(item.quantityDecimals),inOrders:baseReserved.toFixed(item.quantityDecimals),valueQuote:String(baseHolding*Number(item.lastPrice))},{symbol:item.quote,available:availableQuote,quantity:quoteHolding.toFixed(item.priceDecimals),inOrders:quoteReserved.toFixed(item.priceDecimals),valueQuote:String(quoteHolding)}]};
}
export function TradingTerminalPreview() {
  const [orders, setOrders] = useState(initialOrders); const [snapshots, setSnapshots] = useState(()=>markets.map(item=>withReservations(item,initialOrders))); const [failure, setFailure] = useState(false);
  const openOrder = orders.find(order => order.status === "open");
  function fillDemoOrder() {
    if (!openOrder) return;
    const nextOrders: TradingOrder[]=orders.map(order=>order.id===openOrder.id ? {...order,filled:order.quantity,status:"filled"}:order);
    setSnapshots(current=>current.map(item=>{if(item.id!==openOrder.marketId)return item;const quantity=Number(openOrder.quantity);const cost=quantity*Number(openOrder.price ?? item.lastPrice);const baseHolding=Number(item.balances?.find(asset=>asset.symbol===item.base)?.quantity ?? item.availableBase)+(openOrder.side==="buy"?quantity:-quantity);const quoteHolding=Number(item.balances?.find(asset=>asset.symbol===item.quote)?.quantity ?? item.availableQuote)+(openOrder.side==="buy"?-cost:cost);const published={...item,balances:[{symbol:item.base,available:String(baseHolding),quantity:String(baseHolding),inOrders:"0",valueQuote:String(baseHolding*Number(item.lastPrice))},{symbol:item.quote,available:String(quoteHolding),quantity:String(quoteHolding),inOrders:"0",valueQuote:String(quoteHolding)}]};return withReservations(published,nextOrders);}));
    setOrders(nextOrders);
  }
  return <div className="space-y-3"><TradingTerminal markets={snapshots} orders={orders} onPlaceOrder={async request => {
    if (failure) throw new Error("Demo exchange rejected the request.");
    const item = snapshots.find(snapshot => snapshot.id === request.marketId); if (!item) throw new Error("Demo market is unavailable.");
    const needed = Number(request.quantity) * (request.side === "buy" ? Number(request.price ?? item.lastPrice) : 1);
    if (needed > Number(request.side === "buy" ? item.availableQuote : item.availableBase)) throw new Error("Demo: insufficient unreserved balance.");
    if (!tradingUnits(request.quantity, item.quantityDecimals)) throw new Error("Invalid demo quantity.");
    const nextOrders: TradingOrder[]=[...orders,{...request,id:`paper-${orders.length+1}`,at:"12:05:00",filled:"0",status:"open"}];setOrders(nextOrders);setSnapshots(current=>current.map(snapshot=>withReservations(snapshot,nextOrders)));
  }} onCancelOrder={async id => { if (failure) throw new Error("Demo cancellation unavailable."); const nextOrders: TradingOrder[] = orders.map(order => order.id === id ? { ...order, status: "cancelled" } : order); setOrders(nextOrders); setSnapshots(current=>current.map(item=>withReservations(item,nextOrders))); }} /><p className="px-6 text-xs text-muted-foreground">Simulated market and account for demonstration. Not market data, and no real orders are placed.</p><details className="px-6 text-xs text-muted-foreground"><summary>Paper trading host controls</summary><label className="my-3 flex gap-2"><input type="checkbox" checked={failure} onChange={event => setFailure(event.target.checked)} />Simulate exchange rejection</label><div className="flex flex-wrap gap-2"><Button size="sm" variant="outline" onClick={() => setSnapshots(current => current.map(item => { const next = Number(item.lastPrice) + (item.id === "eth" ? 2 : .5); return withReservations({ ...item, lastPrice: next.toFixed(2), candles: [...item.candles, { id: `tick-${item.candles.length}`, label: `Tick ${item.candles.length}`, open: Number(item.lastPrice), high: next + 2, low: Number(item.lastPrice) - 2, close: next, volume: 125 }], timeframes: undefined, trades: [{ id: `tick-trade-${item.trades.length}`, at: "Demo tick", side: "buy" as const, price: next.toFixed(2), quantity: "0.100" }, ...item.trades], bids: item.bids.map(level => ({ ...level, price: level.price + (item.id === "eth" ? 2 : .5) })), asks: item.asks.map(level => ({ ...level, price: level.price + (item.id === "eth" ? 2 : .5) })) },orders); }))}>Advance demo market snapshot</Button>{openOrder && <Button size="sm" variant="outline" onClick={fillDemoOrder}>Simulate fill: {openOrder.id}</Button>}</div></details></div>;
}
