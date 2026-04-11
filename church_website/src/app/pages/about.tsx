import { useEffect, useState } from "react";
import { Link } from "react-router";
import { ArrowRight, Phone, Church, Target, Star, MapPin, Building2, Globe, Mail, CalendarDays, Users, Sparkles } from "lucide-react";
import { useScrollReveal, ScrollReveal } from "../components/scroll-reveal";
import { AboutGalleryImage } from "../components/AboutGalleryImage";
import { isSupabaseConfigured, supabase } from "../../lib/supabase";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "../components/ui/carousel";
import {
  PARISH_EMAIL,
  PARISH_PHONE_DISPLAY,
  PARISH_MAILTO_HREF,
  PARISH_POSTAL_LINES,
  PARISH_TEL_HREF,
} from "../../lib/parishContact";

type AboutStory = {
  id: string;
  title: string;
  occasion_type: string;
  event_date: string | null;
  location: string;
  people_present: string;
  description: string;
  impact: string;
  photo_url: string;
  display_order: number;
  is_featured: boolean;
  created_at: string;
  about_story_photos?: {
    id: string;
    story_id: string;
    photo_url: string;
    photo_path: string;
    sort_order: number;
  }[];
};

function formatStoryDate(value: string | null) {
  if (!value) return "Date not provided";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });
}

function storyPhotos(story: AboutStory) {
  if (story.about_story_photos && story.about_story_photos.length > 0) {
    return [...story.about_story_photos].sort((a, b) => b.sort_order - a.sort_order);
  }
  return story.photo_url
    ? [{ id: `${story.id}-legacy`, story_id: story.id, photo_url: story.photo_url, photo_path: "", sort_order: 1 }]
    : [];
}

const ABOUT_NAV = [
  { href: "#who-we-are", label: "Who we are" },
  { href: "#mission-vision", label: "Mission & vision" },
  { href: "#patron-saint", label: "Patron saint" },
  { href: "#diocese", label: "Diocese" },
  { href: "#community-moments", label: "Community" },
  { href: "#substations", label: "Substations" },
  { href: "#find-us", label: "Find us" },
] as const;

function AboutSectionHeader({
  eyebrow,
  title,
  subtitle,
  align = "center",
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  align?: "center" | "left";
}) {
  return (
    <div
      className={
        align === "center"
          ? "mx-auto mb-10 max-w-3xl text-center sm:mb-14"
          : "mb-8 max-w-2xl sm:mb-10"
      }
    >
      <p className="mb-2 text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-[#6f4c3e] sm:text-xs">{eyebrow}</p>
      <h2 className="font-serif text-2xl font-bold tracking-tight text-[#143d2c] sm:text-3xl md:text-[2.15rem] md:leading-snug">
        {title}
      </h2>
      {subtitle ? (
        <p className="mt-4 text-sm leading-relaxed text-gray-600 sm:text-base">{subtitle}</p>
      ) : null}
      <div className={align === "center" ? "section-divider mt-6" : "section-divider-left mt-6"} />
    </div>
  );
}

type StoryGalleryProps = {
  story: AboutStory;
  variant: "hero" | "card";
};

function StoryGallery({ story, variant }: StoryGalleryProps) {
  const photos = storyPhotos(story);
  const aspect = variant === "hero" ? "aspect-[4/3] sm:aspect-[16/10]" : "aspect-[5/3]";
  const rounded =
    variant === "hero" ? "rounded-2xl sm:rounded-3xl" : "rounded-t-2xl sm:rounded-t-3xl";
  const ring = variant === "hero" ? "shadow-2xl ring-1 ring-black/[0.06]" : "";
  const imgClass =
    variant === "hero"
      ? "absolute inset-0 h-full w-full min-h-0 object-cover"
      : "absolute inset-0 h-full w-full min-h-0 object-cover transition-transform duration-500 group-hover:scale-[1.03]";
  const navSm = variant === "hero";

  if (photos.length === 0) {
    return (
      <div
        className={`relative w-full overflow-hidden ${rounded} ${aspect} ${ring} bg-gradient-to-br from-[#f0e8e0] to-[#e8ddd4]`}
        aria-hidden
      />
    );
  }

  if (photos.length === 1) {
    const p = photos[0];
    return (
      <div className={`relative w-full overflow-hidden ${rounded} ${aspect} ${ring}`}>
        <AboutGalleryImage
          photoPath={p.photo_path}
          photoUrlFallback={p.photo_url}
          alt={story.title}
          className={imgClass}
          loading={variant === "hero" ? "eager" : "lazy"}
        />
      </div>
    );
  }

  const slideAspect =
    variant === "hero" ? "aspect-[4/3] w-full sm:aspect-[16/10]" : "aspect-[5/3] w-full";

  return (
    <div className={`relative w-full overflow-hidden ${rounded} ${ring}`}>
      <Carousel opts={{ align: "start", loop: true }} className="w-full">
        <CarouselContent className="-ml-0">
          {photos.map((photo, index) => (
            <CarouselItem key={photo.id} className="basis-full pl-0">
              <div className={`relative overflow-hidden ${slideAspect}`}>
                <AboutGalleryImage
                  photoPath={photo.photo_path}
                  photoUrlFallback={photo.photo_url}
                  alt={story.title}
                  className={imgClass}
                  loading={variant === "hero" && index === 0 ? "eager" : "lazy"}
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious
          className={
            navSm
              ? "left-2 top-1/2 z-20 size-9 -translate-y-1/2 border-white/80 bg-white/80 text-[#143d2c] shadow-md backdrop-blur-md hover:bg-white/95 sm:left-4 sm:size-10"
              : "left-2 top-1/2 z-20 size-8 -translate-y-1/2 border-white/80 bg-white/80 text-[#143d2c] backdrop-blur-md hover:bg-white/95 sm:left-3 sm:size-9"
          }
        />
        <CarouselNext
          className={
            navSm
              ? "right-2 top-1/2 z-20 size-9 -translate-y-1/2 border-white/80 bg-white/80 text-[#143d2c] shadow-md backdrop-blur-md hover:bg-white/95 sm:right-4 sm:size-10"
              : "right-2 top-1/2 z-20 size-8 -translate-y-1/2 border-white/80 bg-white/80 text-[#143d2c] backdrop-blur-md hover:bg-white/95 sm:right-3 sm:size-9"
          }
        />
      </Carousel>
    </div>
  );
}

export function About() {
  useScrollReveal();
  const [stories, setStories] = useState<AboutStory[]>([]);
  const [storiesLoading, setStoriesLoading] = useState(true);

  const heroStory = stories[0] ?? null;
  const gridStories = stories.slice(1);

  useEffect(() => {
    let cancelled = false;

    async function loadStories(initial: boolean) {
      if (!isSupabaseConfigured) {
        setStories([]);
        setStoriesLoading(false);
        return;
      }

      if (initial) setStoriesLoading(true);

      try {
        const { data, error } = await supabase
          .from("about_stories")
          .select("*, about_story_photos(*)")
          .eq("is_active", true)
          .order("created_at", { ascending: false });

        if (cancelled) return;
        if (error) {
          console.error("[About] stories:", error.message);
          setStories([]);
          return;
        }
        setStories(data ?? []);
      } catch (e) {
        if (!cancelled) {
          console.error("[About] stories:", e);
          setStories([]);
        }
      } finally {
        if (!cancelled && initial) setStoriesLoading(false);
      }
    }

    void loadStories(true);

    const onVis = () => {
      if (document.visibilityState === "visible") void loadStories(false);
    };
    document.addEventListener("visibilitychange", onVis);

    return () => {
      cancelled = true;
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  return (
    <div className="overflow-x-hidden">
      <section
        className="relative overflow-hidden py-20 px-4 text-white page-background-section sm:py-28"
        style={{ backgroundImage: "url('/images/about-background-styled.png')", backgroundPosition: "center 42%", backgroundSize: "cover" }}
      >
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(145deg, rgba(26,14,9,0.72) 0%, rgba(58,31,19,0.7) 45%, rgba(33,54,40,0.62) 100%)" }}
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -inset-40 opacity-[0.2] blur-3xl"
          style={{ background: "radial-gradient(ellipse at 30% 20%, #f59e0b 0%, transparent 55%)" }}
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -right-20 top-1/2 h-72 w-72 -translate-y-1/2 rounded-full opacity-[0.12] blur-3xl sm:h-96 sm:w-96"
          style={{ background: "radial-gradient(circle, #4ade80 0%, transparent 70%)" }}
          aria-hidden
        />
        <div className="container relative z-10 mx-auto max-w-4xl text-center">
          <div className="mx-auto mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl border border-white/20 bg-white/10 shadow-lg backdrop-blur-sm sm:h-[4.5rem] sm:w-[4.5rem]">
            <Church className="h-9 w-9 text-amber-100 sm:h-10 sm:w-10" aria-hidden />
          </div>
          <p className="mb-4 text-[0.7rem] font-semibold uppercase tracking-[0.35em] text-amber-100/90 sm:text-xs">
            St. Francis Cheptarit
          </p>
          <h1 className="mb-5 font-serif text-4xl font-bold leading-tight tracking-tight text-white md:text-5xl md:leading-tight">
            About Our Parish
          </h1>
          <div className="mx-auto mb-6 h-1 w-24 rounded-full bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400/90" />
          <p className="mx-auto max-w-2xl text-sm leading-relaxed text-green-100/95 sm:text-lg">
            St. Francis Cheptarit Catholic Parish — Mosoriot, Nandi County
          </p>
        </div>
      </section>

      <nav
        aria-label="About page sections"
        className="border-b border-[#e5d9ce]/80 bg-[#fdfaf6]/85 py-3.5 shadow-[0_1px_0_rgba(255,255,255,0.5)_inset] backdrop-blur-md"
      >
        <div className="container mx-auto max-w-6xl px-4">
          <p className="mb-2.5 text-center text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-[#8b7355]">On this page</p>
          <ul className="flex flex-wrap items-center justify-center gap-x-1 gap-y-2 sm:gap-x-1.5">
            {ABOUT_NAV.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="inline-block rounded-full border border-transparent px-3 py-1.5 text-[0.7rem] font-medium text-[#52200d] transition-all hover:border-[#d4c4b8] hover:bg-white/80 hover:text-[#143d2c] sm:px-3.5 sm:text-xs"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      <section
        id="who-we-are"
        className="scroll-mt-28 py-16 px-4 page-background-section sm:scroll-mt-32 sm:py-20"
        style={{ background: "linear-gradient(180deg, #faf6f1 0%, #f8efe2 45%, #f5ebe0 100%)" }}
      >
        <div className="container mx-auto max-w-6xl">
          <ScrollReveal>
            <div className="grid items-center gap-12 md:grid-cols-2 md:gap-14 lg:gap-16">
              <div className="relative order-2 md:order-1">
                <div
                  className="absolute -inset-1 rounded-[1.35rem] bg-gradient-to-br from-[#c9a06c]/40 via-transparent to-[#5a7d5c]/25 opacity-80 blur-sm"
                  aria-hidden
                />
                <div
                  className="relative overflow-hidden rounded-2xl border-[3px] border-white shadow-2xl ring-1 ring-black/[0.06] sm:rounded-3xl"
                  style={{ boxShadow: "0 24px 64px rgba(82, 32, 13, 0.18)" }}
                >
                  <div className="aspect-[4/3] w-full sm:aspect-[5/4]">
                    <img
                      src="/images/logo.jpeg"
                      alt="St. Francis Cheptarit Catholic Church"
                      className="h-full w-full object-cover"
                    />
                  </div>
                </div>
                <p className="mt-4 text-center text-sm text-[#6e5c4d]">St. Francis Cheptarit Catholic Parish — our church home</p>
              </div>
              <div className="order-1 md:order-2">
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#6f4c3e]">Who we are</p>
                <h2 className="mb-4 font-serif text-3xl font-bold tracking-tight text-[#143d2c] sm:text-[2rem] sm:leading-snug">
                  A parish rooted in faith &amp; community
                </h2>
                <div className="section-divider-left mb-6" />
                <div className="space-y-4 text-[0.9375rem] leading-relaxed text-gray-600 sm:text-base">
                  <p>
                    St. Francis Cheptarit Catholic Parish is located in Cheptarit, Mosoriot — in the heart of Nandi County, Kenya.
                    We are a parish of the <strong className="font-semibold text-[#143d2c]">Diocese of Kapsabet</strong>, dedicated to
                    St. Francis of Assisi, the beloved patron of nature, peace, and the poor.
                  </p>
                  <p>
                    Our parish community is made up of vibrant, faithful Catholic families and individuals from Cheptarit, Mosoriot,
                    and the surrounding villages. We are united in worship, prayer, fellowship, and service to our community and beyond.
                  </p>
                  <p className="text-balance">
                    Guided by the Gospel of Jesus Christ and the teachings of the Catholic Church, we strive to be a welcoming,
                    missionary community that brings the love of God to all people.
                  </p>
                </div>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal className="mt-14 sm:mt-16" direction="up" duration={0.65}>
            <div className="parish-glass-card rounded-[1.75rem] p-6 shadow-xl shadow-[#3a1f13]/[0.06] sm:p-8 md:p-10">
              <AboutSectionHeader
                eyebrow="Parish life"
                title="Easter with our children after Mass"
                subtitle="After we celebrate the Lord’s Resurrection at Mass, our parish family continues the joy outdoors — a moment to thank God together and be with our young people. Rev. Dr. Fr. Richard shares fellowship with the children in front of our church, in the hope of the Risen Christ."
              />
              <div className="parish-glass-card mx-auto mb-10 max-w-2xl rounded-2xl border-l-4 border-amber-400 p-5 shadow-sm ring-1 ring-[#e8ddd4]/60 sm:p-6">
                <p className="text-sm italic leading-relaxed text-[#143d2c] sm:text-base">
                  &ldquo;Let the children come to me; do not prevent them, for the kingdom of God belongs to such as these.&rdquo;
                </p>
                <p className="mt-3 text-xs font-semibold text-[#6f2a10] sm:text-sm">— Mark 10:14</p>
              </div>
              <div className="grid gap-8 md:grid-cols-2 md:gap-10">
                <figure className="m-0">
                  <div
                    className="group relative overflow-hidden rounded-2xl border-[3px] border-white shadow-xl ring-1 ring-black/[0.05] sm:rounded-3xl"
                    style={{ boxShadow: "0 20px 50px rgba(82, 32, 13, 0.14)" }}
                  >
                    <div className="aspect-[4/3] w-full overflow-hidden">
                      <img
                        src="/images/easter-after-mass-1.png"
                        alt="Rev. Dr. Fr. Richard with parish children in front of St. Francis Cheptarit church after Easter Mass"
                        className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                        loading="eager"
                      />
                    </div>
                  </div>
                  <figcaption className="mt-3 text-center text-sm text-[#6e5c4d]">
                    Parish children with Rev. Dr. Fr. Richard after Easter Mass
                  </figcaption>
                </figure>
                <figure className="m-0">
                  <div
                    className="group relative overflow-hidden rounded-2xl border-[3px] border-white shadow-xl ring-1 ring-black/[0.05] sm:rounded-3xl"
                    style={{ boxShadow: "0 20px 50px rgba(82, 32, 13, 0.14)" }}
                  >
                    <div className="aspect-[4/3] w-full overflow-hidden">
                      <img
                        src="/images/easter-after-mass-2.png"
                        alt="Community gathered with Rev. Dr. Fr. Richard and youth outside the parish church on Easter"
                        className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                        loading="eager"
                      />
                    </div>
                  </div>
                  <figcaption className="mt-3 text-center text-sm text-[#6e5c4d]">
                    Easter fellowship outside the parish church
                  </figcaption>
                </figure>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <section id="mission-vision" className="scroll-mt-28 py-16 px-4 sm:scroll-mt-32 sm:py-20">
        <div className="container mx-auto max-w-5xl">
          <ScrollReveal>
            <AboutSectionHeader
              eyebrow="Our direction"
              title="Mission & vision"
              subtitle="What we are called to do today — and the parish God is helping us become."
            />
          </ScrollReveal>
          <div className="grid gap-6 md:grid-cols-2 md:gap-8">
            <ScrollReveal delay="60ms">
              <div
                className="flex h-full flex-col rounded-3xl border border-white/10 p-8 shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:shadow-2xl"
                style={{ background: "linear-gradient(145deg, #6b3d26 0%, #7c4c2e 38%, #9a6b4a 100%)" }}
              >
                <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 ring-1 ring-white/20">
                  <Target className="h-7 w-7 text-white" aria-hidden />
                </div>
                <h3 className="mb-3 text-center font-serif text-xl font-bold text-white">Our mission</h3>
                <p className="text-center text-sm leading-relaxed text-amber-50/95 sm:text-[0.9375rem]">
                  To proclaim the Good News of Jesus Christ, celebrate the Sacraments with joy and reverence, build a strong
                  community of faith, and serve the people of Cheptarit, Mosoriot, and Nandi County with compassion, generosity,
                  and love — inspired by the example of St. Francis of Assisi.
                </p>
              </div>
            </ScrollReveal>
            <ScrollReveal delay="120ms">
              <div className="flex h-full flex-col rounded-3xl border border-[#d4b8a0] bg-gradient-to-br from-[#f0dcc8] via-[#e8d0bc] to-[#dfc2ad] p-8 shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:shadow-2xl">
                <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#143d2c]/10 ring-1 ring-[#143d2c]/15">
                  <Star className="h-7 w-7 text-[#143d2c]" aria-hidden />
                </div>
                <h3 className="mb-3 text-center font-serif text-xl font-bold text-[#143d2c]">Our vision</h3>
                <p className="text-center text-sm leading-relaxed text-[#3d2918] sm:text-[0.9375rem]">
                  To be a vibrant, missionary, and welcoming Catholic parish where every person — regardless of background —
                  encounters God&apos;s love, finds a spiritual home, is formed in authentic Catholic faith, and is empowered to
                  transform their families and community.
                </p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      <section
        id="patron-saint"
        className="scroll-mt-28 py-16 px-4 sm:scroll-mt-32 sm:py-20"
        style={{ background: "linear-gradient(165deg, #ecd5c5 0%, #e8c9b5 50%, #e2bcaa 100%)" }}
      >
        <div className="container mx-auto max-w-5xl">
          <ScrollReveal>
            <div className="grid items-center gap-10 md:grid-cols-2 md:gap-12">
              <div className="flex justify-center md:justify-start">
                <div className="relative">
                  <div
                    className="absolute -inset-3 rounded-[2rem] bg-gradient-to-br from-amber-300/50 to-[#5a7d5c]/30 opacity-90 blur-md"
                    aria-hidden
                  />
                  <div className="relative aspect-square w-full max-w-[min(100%,20rem)] overflow-hidden rounded-3xl border-4 border-white shadow-2xl ring-1 ring-black/[0.08] sm:max-w-[22rem]">
                    <img src="/images/church.jpg" alt="Parish and faith imagery at St. Francis Cheptarit" className="h-full w-full object-cover" />
                  </div>
                </div>
              </div>
              <div>
                <AboutSectionHeader
                  align="left"
                  eyebrow="Our patron saint"
                  title="St. Francis of Assisi"
                  subtitle="Our parish takes its name from the saint of poverty, peace, and all creation."
                />
                <div className="space-y-4 text-[0.9375rem] leading-relaxed text-[#4a3428] sm:text-base">
                  <p>
                    St. Francis of Assisi (1181–1226) is one of the most beloved saints in the Catholic Church. Born into wealth in
                    Assisi, Italy, he gave up his possessions to follow Christ in radical poverty, simplicity, and love.
                  </p>
                  <p>
                    He founded the Order of Friars Minor (Franciscans) and is renowned for his love of nature, the poor, and all of
                    God&apos;s creation. He gave us the Canticle of the Sun and the Prayer of St. Francis.
                  </p>
                </div>
                <div className="parish-glass-card mt-6 rounded-2xl border-l-4 border-amber-500 p-5 shadow-md ring-1 ring-white/40">
                  <p className="text-sm italic leading-relaxed text-[#143d2c]">
                    &ldquo;Lord, make me an instrument of your peace. Where there is hatred, let me sow love; where there is injury,
                    pardon; where there is doubt, faith…&rdquo;
                  </p>
                  <p className="mt-2 text-xs font-semibold text-[#6f2a10]">— Prayer of St. Francis of Assisi</p>
                </div>
                <p className="mt-5 text-sm text-[#5c4a3d]">
                  Feast day: <strong className="text-[#143d2c]">4 October</strong>
                </p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <section
        id="diocese"
        className="scroll-mt-28 py-16 px-4 sm:scroll-mt-32 sm:py-20"
        style={{ background: "linear-gradient(180deg, #f8efe2 0%, #f3e6d8 100%)" }}
      >
        <div className="container mx-auto max-w-5xl">
          <ScrollReveal>
            <AboutSectionHeader
              eyebrow="Wider church family"
              title="Diocese of Kapsabet"
              subtitle="We belong to a diocesan family that spans Western Kenya — united in faith, sacraments, and mission."
            />
          </ScrollReveal>
          <ScrollReveal>
            <div className="parish-glass-card mx-auto max-w-3xl rounded-3xl p-8 shadow-xl shadow-[#7c4c2e]/[0.07] sm:p-10">
              <div className="mb-6 flex justify-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#143d2c]/8 text-[#143d2c]">
                  <Building2 className="h-6 w-6" aria-hidden />
                </div>
              </div>
              <div className="space-y-4 text-[0.9375rem] leading-relaxed text-gray-600 sm:text-base">
                <p>
                  St. Francis Cheptarit Catholic Parish is part of the <strong className="text-[#143d2c]">Catholic Diocese of Kapsabet</strong>,
                  which serves Nandi County and neighbouring communities in western Kenya, under the pastoral care of the Bishop of Kapsabet.
                </p>
                <p>
                  The diocese encompasses many parishes across Uasin Gishu, Nandi, Trans Nzoia, Elgeyo-Marakwet, and West Pokot counties,
                  serving hundreds of thousands of Catholics across the region.
                </p>
                <p className="text-balance">
                  As a parish in Nandi County, we are grateful to share in this family and committed to the evangelizing mission of the
                  Church in Western Kenya.
                </p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <section
        id="community-moments"
        className="relative scroll-mt-28 overflow-hidden bg-gradient-to-b from-[#fbf9f5] via-[#faf6f0]/95 to-[#f3ebe3] py-14 px-4 sm:scroll-mt-32 sm:py-16 md:py-20 sm:px-6"
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(124,76,46,0.08),transparent)]" aria-hidden />
        <div className="container relative mx-auto max-w-6xl">
          <ScrollReveal>
            <AboutSectionHeader
              eyebrow="Living witness"
              title="Community moments & occasions"
              subtitle="Stories and photos that help us remember what God is doing among us — outreach, celebrations, visits, youth moments, and the people who make each occasion meaningful."
            />
          </ScrollReveal>

          {storiesLoading ? (
            <div className="py-16 text-center text-sm text-gray-500 sm:text-base">Loading community moments…</div>
          ) : stories.length === 0 ? (
            <div className="parish-glass-card mx-auto max-w-3xl rounded-3xl px-6 py-12 text-center shadow-lg shadow-[#7c4c2e]/5">
              <Sparkles className="mx-auto mb-4 h-10 w-10 text-[#5a7d5c]" />
              <h3 className="mb-2 text-xl font-bold text-[#143d2c]">More parish stories coming soon</h3>
              <p className="text-gray-600">
                The About gallery will appear here once the parish team uploads occasion photos and their stories from the admin dashboard.
              </p>
            </div>
          ) : (
            <div className="space-y-12 sm:space-y-16">
              {heroStory && (
                <div
                  key={heroStory.id}
                  className="parish-glass-card flex flex-col gap-8 rounded-[1.75rem] p-4 shadow-xl shadow-[#3a1f13]/[0.06] sm:gap-10 sm:p-6 lg:grid lg:grid-cols-[minmax(0,1.12fr)_minmax(0,0.88fr)] lg:items-center lg:gap-10 lg:p-8"
                >
                  <StoryGallery story={heroStory} variant="hero" />
                  <div className="parish-glass-card flex flex-col justify-center rounded-2xl p-6 shadow-inner sm:rounded-3xl sm:p-8 lg:p-10">
                    <div className="mb-4 flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center rounded-full bg-[#e8f4ea] px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-[#143d2c] sm:text-xs">
                        Latest
                      </span>
                      {heroStory.is_featured && (
                        <span className="inline-flex items-center rounded-full bg-amber-100/90 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-amber-950 sm:text-xs">
                          Featured
                        </span>
                      )}
                      <span className="inline-flex items-center rounded-full bg-[#e8f0e8] px-3 py-1 text-[11px] font-semibold text-[#1e4d2b] sm:text-xs">
                        {heroStory.occasion_type}
                      </span>
                    </div>
                    <h3 className="mb-4 text-2xl font-bold leading-tight tracking-tight text-[#0f2d1f] sm:text-3xl md:text-[2rem]">
                      {heroStory.title}
                    </h3>
                    <div className="mb-5 space-y-2.5 text-sm text-gray-600 sm:space-y-3 sm:text-[0.9375rem]">
                      <div className="flex items-start gap-3">
                        <CalendarDays className="mt-0.5 h-4 w-4 shrink-0 text-[#5a7d5c]" />
                        <span>{formatStoryDate(heroStory.event_date)}</span>
                      </div>
                      {heroStory.location && (
                        <div className="flex items-start gap-3">
                          <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#5a7d5c]" />
                          <span className="leading-snug">{heroStory.location}</span>
                        </div>
                      )}
                      {heroStory.people_present && (
                        <div className="flex items-start gap-3">
                          <Users className="mt-0.5 h-4 w-4 shrink-0 text-[#5a7d5c]" />
                          <span className="leading-snug">{heroStory.people_present}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-3">
                        <Sparkles className="h-4 w-4 shrink-0 text-[#8d5439]" />
                        <span>
                          {storyPhotos(heroStory).length} photo{storyPhotos(heroStory).length === 1 ? "" : "s"} in this occasion
                        </span>
                      </div>
                    </div>
                    <p className="mb-5 text-[0.9375rem] leading-relaxed text-gray-700 sm:text-base">{heroStory.description}</p>
                    {heroStory.impact && (
                      <div className="parish-glass-card rounded-2xl border border-amber-200/80 p-4 sm:p-5">
                        <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-amber-900/90">Impact</p>
                        <p className="text-sm leading-relaxed text-gray-700 sm:text-[0.9375rem]">{heroStory.impact}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="grid gap-6 sm:gap-7 md:grid-cols-2 xl:grid-cols-3">
                {gridStories.map((story) => (
                  <article
                    key={story.id}
                    className="group parish-glass-card flex flex-col overflow-hidden rounded-2xl shadow-md shadow-[#3a1f13]/[0.04] transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#3a1f13]/[0.08] sm:rounded-3xl"
                  >
                    <div className="relative w-full overflow-hidden">
                      <StoryGallery story={story} variant="card" />
                      <div className="absolute left-3 top-3 z-10 flex flex-wrap gap-2 sm:left-4 sm:top-4">
                        <span className="rounded-full bg-white/80 px-2.5 py-1 text-[10px] font-semibold text-[#143d2c] shadow-sm backdrop-blur-md sm:text-xs">
                          {story.occasion_type}
                        </span>
                        {story.is_featured && (
                          <span className="rounded-full bg-amber-300/95 px-2.5 py-1 text-[10px] font-semibold text-amber-950 shadow-sm sm:text-xs">
                            Featured
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-1 flex-col p-5 sm:p-6">
                      <h3 className="mb-3 text-lg font-bold leading-snug text-[#143d2c] sm:text-xl">{story.title}</h3>
                      <div className="mb-4 space-y-2 text-xs text-gray-500 sm:text-sm">
                        <div className="flex items-center gap-2">
                          <CalendarDays className="h-3.5 w-3.5 shrink-0 text-[#5a7d5c] sm:h-4 sm:w-4" />
                          <span>{formatStoryDate(story.event_date)}</span>
                        </div>
                        {story.location && (
                          <div className="flex items-start gap-2">
                            <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#5a7d5c] sm:h-4 sm:w-4" />
                            <span className="leading-snug">{story.location}</span>
                          </div>
                        )}
                        {story.people_present && (
                          <div className="flex items-start gap-2">
                            <Users className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#5a7d5c] sm:h-4 sm:w-4" />
                            <span className="leading-snug">{story.people_present}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-2">
                          <Sparkles className="h-3.5 w-3.5 shrink-0 text-[#8d5439] sm:h-4 sm:w-4" />
                          <span>
                            {storyPhotos(story).length} photo{storyPhotos(story).length === 1 ? "" : "s"}
                          </span>
                        </div>
                      </div>
                      <p className="mb-4 line-clamp-4 flex-1 text-sm leading-relaxed text-gray-600">{story.description}</p>
                      {story.impact && (
                        <div className="rounded-xl border border-[#d4e4d4] bg-[#f6faf6] px-4 py-3">
                          <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-[#2d5a3d] sm:text-xs">Why it matters</p>
                          <p className="line-clamp-3 text-xs leading-relaxed text-gray-700 sm:text-sm">{story.impact}</p>
                        </div>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      <section id="substations" className="scroll-mt-28 py-16 px-4 sm:scroll-mt-32 sm:py-20">
        <div className="container mx-auto max-w-5xl">
          <ScrollReveal>
            <AboutSectionHeader
              eyebrow="Outreach"
              title="Our substations"
              subtitle="We extend pastoral care and worship beyond our main church so more families can pray and receive the sacraments closer to home."
            />
          </ScrollReveal>
          <div className="grid gap-8 md:grid-cols-2 md:gap-10">
            <ScrollReveal>
              <div className="flex h-full flex-col rounded-3xl border border-[#c8e6c9]/80 bg-gradient-to-br from-[#f4faf4] to-[#e8f5e9] p-8 shadow-lg shadow-[#143d2c]/[0.06] transition-all hover:shadow-xl md:p-9">
                <div className="mb-5 flex items-center gap-3">
                  <div className="parish-glass-card flex h-12 w-12 items-center justify-center rounded-2xl shadow-sm ring-1 ring-[#143d2c]/12">
                    <Church className="h-6 w-6 text-[#143d2c]" aria-hidden />
                  </div>
                  <h3 className="font-serif text-xl font-bold text-[#143d2c] sm:text-2xl">St. Lawrence Tebeson</h3>
                </div>
                <div className="section-divider-left mb-5" />
                <p className="mb-4 text-[0.9375rem] leading-relaxed text-gray-700">
                  St. Lawrence Tebeson is an important outstation church of our parish, serving the Catholic faithful in the Tebeson area
                  and surrounding communities.
                </p>
                <p className="mb-6 text-[0.9375rem] leading-relaxed text-gray-700">
                  The chapel is a place of worship, prayer, and community for local families — Mass and sacraments closer to home. Through
                  this church, the mission of St. Francis Cheptarit reaches further in faith.
                </p>
                <div className="mt-auto rounded-2xl border border-amber-200/90 bg-amber-50/80 p-4 ring-1 ring-amber-100/80">
                  <p className="text-sm leading-relaxed text-gray-700">
                    <strong className="text-[#143d2c]">Parish commitment:</strong> We maintain St. Lawrence Tebeson Church as an active centre for
                    spiritual growth and community service in that region.
                  </p>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal delay="80ms">
              <div className="parish-glass-card flex h-full flex-col rounded-3xl p-8 shadow-lg shadow-[#3a1f13]/[0.05] md:p-9">
                <h3 className="mb-2 font-serif text-xl font-bold text-[#143d2c]">Substation services</h3>
                <p className="mb-6 text-sm text-gray-600">What the Tebeson community can count on from our parish.</p>
                <ul className="space-y-4">
                  {[
                    { icon: "", label: "Sunday worship", desc: "Regular Mass celebrations for the Tebeson community" },
                    { icon: "", label: "Sacraments", desc: "Confession, Eucharist, and community prayer" },
                    { icon: "‍‍‍", label: "Community events", desc: "Gatherings, prayer groups, and faith formation" },
                    { icon: "", label: "Pastoral care", desc: "Spiritual guidance and support from our clergy" },
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-4 rounded-xl border border-[#eef4ee] bg-[#fafcf9] p-3 sm:p-4">
                      <span className="text-2xl leading-none" aria-hidden>
                        {item.icon}
                      </span>
                      <div>
                        <p className="font-semibold text-[#143d2c] text-sm">{item.label}</p>
                        <p className="mt-0.5 text-xs leading-relaxed text-gray-600 sm:text-sm">{item.desc}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      <section
        id="find-us"
        className="scroll-mt-28 py-16 px-4 sm:scroll-mt-32 sm:py-20"
        style={{ background: "linear-gradient(180deg, #f8efe2 0%, #f0e4d6 100%)" }}
      >
        <div className="container mx-auto max-w-5xl">
          <ScrollReveal>
            <AboutSectionHeader eyebrow="Visit" title="Find us" subtitle="Reach out or plan a visit — we would love to welcome you." />
          </ScrollReveal>
          <div className="grid items-stretch gap-8 md:grid-cols-2 md:gap-10">
            <ScrollReveal className="space-y-3 sm:space-y-4">
              {[
                { icon: <MapPin className="h-5 w-5" />, label: "Address", value: PARISH_POSTAL_LINES },
                { icon: <Building2 className="h-5 w-5" />, label: "Diocese", value: "Diocese of Kapsabet" },
                {
                  icon: <Phone className="h-5 w-5" />,
                  label: "Phone",
                  value: PARISH_PHONE_DISPLAY,
                  href: PARISH_TEL_HREF,
                  ariaLabel: `Call parish at ${PARISH_PHONE_DISPLAY}`,
                },
                {
                  icon: <Mail className="h-5 w-5" />,
                  label: "Email",
                  value: PARISH_EMAIL,
                  href: PARISH_MAILTO_HREF,
                  ariaLabel: `Email ${PARISH_EMAIL}`,
                },
                { icon: <Globe className="h-5 w-5" />, label: "County", value: "Nandi County, Rift Valley Region" },
              ].map((item, i) => {
                const ico = (
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#143d2c]/8 text-[#143d2c] ring-1 ring-[#143d2c]/10">
                    {item.icon}
                  </span>
                );
                const cardClass =
                  "parish-glass-card flex items-start gap-4 rounded-2xl p-4 shadow-sm transition-colors sm:p-4";
                if (!("href" in item) || !item.href) {
                  return (
                    <div key={i} className={cardClass}>
                      {ico}
                      <div className="min-w-0 pt-0.5">
                        <p className="text-[0.65rem] font-bold uppercase tracking-wider text-[#6f2a10]">{item.label}</p>
                        <p className="mt-1 text-sm font-medium whitespace-pre-line text-gray-800 sm:text-[0.9375rem]">{item.value}</p>
                      </div>
                    </div>
                  );
                }
                return (
                  <a
                    key={i}
                    href={item.href}
                    className={`${cardClass} no-underline text-inherit hover:border-[#c9a06c]/40 hover:shadow-md active:bg-white/25`}
                    {...("ariaLabel" in item && item.ariaLabel ? { "aria-label": item.ariaLabel } : {})}
                  >
                    {ico}
                    <div className="min-w-0 pt-0.5">
                      <p className="text-[0.65rem] font-bold uppercase tracking-wider text-[#6f2a10]">{item.label}</p>
                      <p className="mt-1 text-sm font-medium break-all whitespace-pre-line text-gray-800 sm:text-[0.9375rem]">{item.value}</p>
                    </div>
                  </a>
                );
              })}
            </ScrollReveal>
            <ScrollReveal delay="100ms">
              <div className="relative flex h-full min-h-[16rem] flex-col items-center justify-center overflow-hidden rounded-3xl border-2 border-white bg-gradient-to-br from-[#143d2c] via-[#1a4d36] to-[#0f2d1f] p-8 text-center shadow-2xl shadow-[#0f2d1f]/25 ring-1 ring-white/20 md:min-h-0">
                <div
                  className="pointer-events-none absolute inset-0 opacity-30"
                  style={{
                    background:
                      "radial-gradient(ellipse 90% 80% at 50% 0%, rgba(251,191,36,0.25) 0%, transparent 55%)",
                  }}
                  aria-hidden
                />
                <MapPin className="relative z-[1] mb-4 h-14 w-14 text-amber-200" aria-hidden />
                <p className="relative z-[1] font-serif text-xl font-bold text-white sm:text-2xl">Cheptarit, Mosoriot</p>
                <p className="relative z-[1] mt-1 text-sm text-emerald-100/90">Nandi County, Kenya</p>
                <p className="relative z-[1] mt-2 text-xs text-emerald-200/75">Diocese of Kapsabet</p>
                <a
                  href="https://maps.google.com/?q=Mosoriot+Nandi+Kenya"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative z-[1] mt-6 inline-flex items-center gap-2 rounded-full bg-amber-400 px-6 py-2.5 text-sm font-bold text-[#143d2c] shadow-lg transition-transform hover:scale-[1.02] hover:bg-amber-300"
                >
                  Open in Google Maps
                </a>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden py-16 px-4 text-white sm:py-20" style={{ background: "linear-gradient(135deg, #2a150c 0%, #3a1f13 45%, #7c4c2e 100%)" }}>
        <div
          className="pointer-events-none absolute -right-24 top-0 h-64 w-64 rounded-full opacity-20 blur-3xl"
          style={{ background: "radial-gradient(circle, #fbbf24 0%, transparent 70%)" }}
          aria-hidden
        />
        <ScrollReveal className="container relative z-[1] mx-auto max-w-3xl text-center">
          <h2 className="mb-4 font-serif text-3xl font-bold sm:text-4xl">Come and see</h2>
          <p className="mb-9 text-sm leading-relaxed text-amber-50/90 sm:text-base">
            Join us for Mass, meet our community, and discover your home in faith. All are welcome.
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row sm:gap-5">
            <Link
              to="/mass-times"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-amber-400 px-8 py-4 text-sm font-bold text-[#143d2c] shadow-lg transition-all hover:bg-amber-300 hover:shadow-xl"
            >
              Mass times <ArrowRight className="h-5 w-5" aria-hidden />
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-white/90 px-8 py-4 text-sm font-semibold text-white transition-all hover:bg-white hover:text-[#143d2c]"
            >
              <Phone className="h-5 w-5" aria-hidden /> Contact us
            </Link>
          </div>
        </ScrollReveal>
      </section>
    </div>
  );
}
