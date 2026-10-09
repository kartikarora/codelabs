// Cloudflare Pages / Workers content negotiation
// Enables LLMs and AI agents requesting the site or individual pages to receive clean Markdown
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const acceptHeader = request.headers.get("Accept") || "";
    const userAgent = request.headers.get("User-Agent") || "";

    const isLlmAgent = /GPTBot|ClaudeBot|PerplexityBot|Google-Extended|Amazonbot|Applebot-Extended|Bytespider|Diffbot|CCBot/i.test(userAgent);
    const prefersMarkdown = acceptHeader.includes("text/markdown") || (acceptHeader.includes("text/plain") && !acceptHeader.includes("text/html"));

    if (isLlmAgent || prefersMarkdown) {
      let cleanPath = url.pathname.replace(/\/index\.html$/, "").replace(/\/$/, "");

      if (cleanPath === "" || cleanPath === "/index") {
        // Portal root -> serve llms-full.txt (or fallback to llms.txt)
        const targetUrl = new URL("/llms-full.txt", url.origin);
        const resp = await env.ASSETS.fetch(new Request(targetUrl, request));
        if (resp.status === 200) {
          const headers = new Headers(resp.headers);
          headers.set("Content-Type", "text/plain; charset=utf-8");
          headers.set("Vary", "Accept, User-Agent");
          return new Response(resp.body, { status: 200, headers });
        }
      } else {
        // Subpath /<slug> -> serve /<slug>/index.md
        const targetUrl = new URL(`${cleanPath}/index.md`, url.origin);
        const resp = await env.ASSETS.fetch(new Request(targetUrl, request));
        if (resp.status === 200) {
          const headers = new Headers(resp.headers);
          headers.set("Content-Type", "text/markdown; charset=utf-8");
          headers.set("Vary", "Accept, User-Agent");
          return new Response(resp.body, { status: 200, headers });
        }
      }
    }

    return env.ASSETS.fetch(request);
  }
};
