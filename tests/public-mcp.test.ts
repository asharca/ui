import { describe, expect, mock, test } from "bun:test";
import { createPublicMcpHandler } from "../mcp/src/public-handler";

function setup() {
  const mcp = mock((_request: Request, _env: object, _context: object) => new Response("public MCP", { status: 202 }));
  const sse = mock((_request: Request, _env: object, _context: object) => new Response("legacy SSE"));
  return { handler: createPublicMcpHandler({ mcp, sse }), mcp, sse };
}

describe("public MCP request routing", () => {
  test.each(["/mcp", "/mcp/", "/mcp/messages?session=test"])("delegates %s to the public transport unchanged", async (pathname) => {
    const { handler, mcp, sse } = setup();
    const request = new Request(`https://worker.example${pathname}`, { method: "POST", body: '{"jsonrpc":"2.0"}' });
    const env = { registry: "test" }; const context = {};
    const response = await handler.fetch(request, env, context);
    expect(response.status).toBe(202);
    expect(await response.text()).toBe("public MCP");
    expect(mcp).toHaveBeenCalledWith(request, env, context);
    expect(sse).not.toHaveBeenCalled();
  });

  test.each(["/sse", "/sse/", "/sse/message"])("preserves the legacy transport at %s", async (pathname) => {
    const { handler, mcp, sse } = setup();
    const request = new Request(`https://worker.example${pathname}`);
    const response = await handler.fetch(request, {}, {});
    expect(await response.text()).toBe("legacy SSE");
    expect(sse).toHaveBeenCalledTimes(1);
    expect(mcp).not.toHaveBeenCalled();
  });

  test.each([
    "/pro", "/pro/mcp", "/pro/mcp/messages", "/authorize", "/token", "/register",
    "/.well-known/oauth-authorization-server", "/.well-known/oauth-protected-resource/pro/mcp",
    "/mcprivate", "/sse-other", "/missing",
  ])("does not expose a retired or lookalike endpoint at %s", async (pathname) => {
    const { handler, mcp, sse } = setup();
    const response = await handler.fetch(new Request(`https://worker.example${pathname}`), {}, {});
    expect(response.status).toBe(404);
    expect(await response.text()).toBe("Not found");
    expect(mcp).not.toHaveBeenCalled();
    expect(sse).not.toHaveBeenCalled();
  });

  test("landing uses the actual deployment origin and lists only public endpoints", async () => {
    const { handler } = setup();
    const response = await handler.fetch(new Request("https://custom.example/"), {}, {});
    const body = await response.text();
    expect(response.status).toBe(200);
    expect(body).toContain("https://custom.example/mcp");
    expect(body).toContain("https://custom.example/sse");
    expect(body).not.toMatch(/Pro|OAuth|license|Bearer|premium/);
  });

  test("root HEAD has no body and unsupported root methods return 405", async () => {
    const { handler } = setup();
    const head = await handler.fetch(new Request("https://custom.example/", { method: "HEAD" }), {}, {});
    expect(head.status).toBe(200);
    expect(await head.text()).toBe("");
    const post = await handler.fetch(new Request("https://custom.example/", { method: "POST" }), {}, {});
    expect(post.status).toBe(405);
    expect(post.headers.get("allow")).toBe("GET, HEAD");
  });
});
