// Runs in front of every request on Cloudflare Pages.
// 1. www.sheafai.app -> sheafai.app (one canonical host).
// 2. Agents that send "Accept: text/markdown" get the page's Markdown copy from /md/.
export async function onRequest({ request, next, env }) {
  const url = new URL(request.url);
  if (url.hostname === "www.sheafai.app") {
    url.hostname = "sheafai.app";
    url.protocol = "https:";
    return Response.redirect(url.toString(), 301);
  }
  const accept = request.headers.get("Accept") || "";
  if (request.method === "GET" && accept.includes("text/markdown") && !url.pathname.startsWith("/md/")) {
    let p = url.pathname.replace(/\.html$/, "");
    if (p.endsWith("/")) p += "index";
    const md = await env.ASSETS.fetch(new URL("/md" + p + ".md", url.origin));
    if (md.ok) {
      return new Response(md.body, { headers: {
        "Content-Type": "text/markdown; charset=utf-8",
        "Vary": "Accept",
        "Link": `<${url.origin}${url.pathname}>; rel="canonical"`,
        "X-Robots-Tag": "noindex",
      } });
    }
  }
  const res = await next();
  if (!res.headers.get("Content-Type")?.startsWith("text/html")) return res;
  const out = new Response(res.body, res);
  out.headers.append("Vary", "Accept");
  return out;
}
