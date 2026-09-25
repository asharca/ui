type Transport<Env, Context> = (
  request: Request,
  env: Env,
  context: Context,
) => Response | Promise<Response>;

/** Pure request routing, testable without a Worker runtime or listening server. */
export function createPublicMcpHandler<Env, Context>(transports: {
  mcp: Transport<Env, Context>;
  sse: Transport<Env, Context>;
}) {
  return {
    async fetch(request: Request, env: Env, context: Context): Promise<Response> {
      const { pathname, origin } = new URL(request.url);
      if (pathname === "/mcp" || pathname.startsWith("/mcp/")) {
        return transports.mcp(request, env, context);
      }
      if (pathname === "/sse" || pathname.startsWith("/sse/")) {
        return transports.sse(request, env, context);
      }
      if (pathname !== "/") return new Response("Not found", { status: 404 });
      if (request.method !== "GET" && request.method !== "HEAD") {
        return new Response("Method not allowed", {
          status: 405,
          headers: { allow: "GET, HEAD" },
        });
      }
      const landing = `beUI MCP server

Open-source animated components for React and Next.js.

Connect your MCP client to:
  ${origin}/mcp   (Streamable HTTP, recommended)
  ${origin}/sse   (SSE, legacy)

Tools: list_components, search_components, get_component, get_install_command
Docs: https://beui.dev
`;
      return new Response(request.method === "HEAD" ? null : landing, {
        headers: { "content-type": "text/plain; charset=utf-8" },
      });
    },
  };
}
