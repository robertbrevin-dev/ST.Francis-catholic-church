export default async function handler(req, res) {
  if (req.method && req.method !== "GET" && req.method !== "HEAD") {
    res.status(405).setHeader("Allow", "GET, HEAD").send("Method Not Allowed");
    return;
  }

  try {
    const upstream = await fetch("https://www.usccb.org/bible/readings/rss/index.cfm", {
      headers: {
        Accept: "application/rss+xml, application/xml, text/xml, */*",
        "User-Agent": "StFrancisCheptaritParish/1.0 (parish website; USCCB readings RSS)",
      },
    });

    if (!upstream.ok) {
      res.status(upstream.status).send("Upstream error");
      return;
    }

    const text = await upstream.text();
    res
      .status(200)
      .setHeader("Content-Type", "application/xml; charset=utf-8")
      .setHeader("Cache-Control", "public, s-maxage=1800, stale-while-revalidate=86400")
      .send(text);
  } catch (e) {
    res.status(502).send(String(e?.message || e));
  }
}
