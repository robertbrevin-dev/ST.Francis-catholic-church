export const USCCB_RSS_PATH = "/api/usccb-rss";

export type DailyReadingDisplay = {
  snippet: string;
  reference: string;
  gospelReference: string;
  dayTitle: string;
  link: string;
  usccbDateKey: string;
};

const USCCB_RSS_URL_DIRECT = "https://www.usccb.org/bible/readings/rss/index.cfm";

export function dateKeyUsccbCalendar(d: Date): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/New_York",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(d);
}

function decodeHtmlEntities(html: string): string {
  if (typeof document === "undefined") {
    return html
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&amp;/g, "&")
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&nbsp;/g, " ");
  }
  const t = document.createElement("textarea");
  t.innerHTML = html;
  return t.value;
}

function stripTags(html: string): string {
  return decodeHtmlEntities(html)
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

type RawRssItem = {
  pubDate: Date | null;
  dayTitle: string;
  link: string;
  description: string;
};

function parseRssItems(xml: string): RawRssItem[] {
  const parser = new DOMParser();
  const doc = parser.parseFromString(xml, "text/xml");
  if (doc.querySelector("parsererror")) return [];

  const nodes = doc.querySelectorAll("item");
  const out: RawRssItem[] = [];

  nodes.forEach((item) => {
    const dayTitle = item.querySelector("title")?.textContent?.trim() || "";
    const link = item.querySelector("link")?.textContent?.trim() || "";
    const rawDesc = item.querySelector("description")?.textContent || "";
    const pubRaw = item.querySelector("pubDate")?.textContent?.trim();
    const pubDate = pubRaw ? new Date(pubRaw) : null;
    if (!dayTitle && !link) return;
    out.push({ pubDate, dayTitle: dayTitle || "Daily Readings", link, description: rawDesc });
  });

  return out;
}

export function pickUsccbItemForToday(items: RawRssItem[]): RawRssItem | null {
  if (items.length === 0) return null;

  const withDates = items.filter((i): i is RawRssItem & { pubDate: Date } => i.pubDate !== null && !Number.isNaN(i.pubDate.getTime()));
  const todayKey = dateKeyUsccbCalendar(new Date());

  if (withDates.length > 0) {
    const exact = withDates.find((i) => dateKeyUsccbCalendar(i.pubDate) === todayKey);
    if (exact) return exact;

    const pastOrToday = withDates
      .filter((i) => dateKeyUsccbCalendar(i.pubDate) <= todayKey)
      .sort((a, b) => b.pubDate.getTime() - a.pubDate.getTime());
    if (pastOrToday.length > 0) return pastOrToday[0];
  }

  return items[0];
}

function extractFromDescription(rawDesc: string): Pick<DailyReadingDisplay, "snippet" | "reference" | "gospelReference"> {
  const decoded = decodeHtmlEntities(rawDesc);

  const refMatch = decoded.match(/Reading\s+1\s*<a[^>]*>\s*([^<]+)/i);
  const reference = refMatch ? stripTags(refMatch[1]).replace(/\s+/g, " ").trim() : "";

  const gospelMatch = decoded.match(/<h4>\s*Gospel\s*<a[^>]*>\s*([^<]+)/i);
  const gospelReference = gospelMatch ? stripTags(gospelMatch[1]).replace(/\s+/g, " ").trim() : "";

  const pMatch = decoded.match(/Reading\s+1[\s\S]*?<p[^>]*>([\s\S]*?)<\/p>/i);
  let snippet = pMatch ? stripTags(pMatch[1]) : "";
  if (!snippet) {
    const gMatch = decoded.match(/Gospel[\s\S]*?<p[^>]*>([\s\S]*?)<\/p>/i);
    snippet = gMatch ? stripTags(gMatch[1]) : stripTags(decoded).slice(0, 400);
  }
  if (snippet.length > 280) snippet = `${snippet.slice(0, 277).trim()}…`;

  return { snippet, reference, gospelReference };
}

export function parseUsccbDailyReadingsRss(xml: string): DailyReadingDisplay | null {
  const items = parseRssItems(xml);
  const item = pickUsccbItemForToday(items);
  if (!item) return null;

  const { snippet, reference, gospelReference } = extractFromDescription(item.description);
  const link =
    item.link || "https://bible.usccb.org/bible/readings";
  const pub = item.pubDate && !Number.isNaN(item.pubDate.getTime()) ? item.pubDate : new Date();
  const usccbDateKey = dateKeyUsccbCalendar(pub);

  if (!snippet && !reference) return null;

  return {
    snippet: snippet || item.dayTitle,
    reference,
    gospelReference,
    dayTitle: item.dayTitle,
    link,
    usccbDateKey,
  };
}

export function getLocalFallbackReading(): DailyReadingDisplay {
  return {
    snippet: "The Lord is my shepherd; there is nothing I shall want.",
    reference: "Psalm 23:1",
    gospelReference: "",
    dayTitle: "Daily Readings",
    link: "https://bible.usccb.org/bible/readings",
    usccbDateKey: dateKeyUsccbCalendar(new Date()),
  };
}

export async function fetchUsccbDailyReading(): Promise<DailyReadingDisplay> {
  const tryFetch = async (url: string) => {
    const res = await fetch(url, { credentials: "omit", cache: "no-store" });
    if (!res.ok) throw new Error(String(res.status));
    return res.text();
  };

  try {
    const xml = await tryFetch(USCCB_RSS_PATH);
    const parsed = parseUsccbDailyReadingsRss(xml);
    if (parsed) return parsed;
  } catch {}

  try {
    const xml = await tryFetch(USCCB_RSS_URL_DIRECT);
    const parsed = parseUsccbDailyReadingsRss(xml);
    if (parsed) return parsed;
  } catch {}

  return getLocalFallbackReading();
}
