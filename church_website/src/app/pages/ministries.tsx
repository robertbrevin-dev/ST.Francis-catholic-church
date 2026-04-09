import { useEffect, useState } from "react"
import { Phone, Users, Music, BookOpen, Heart, Cross, Mic2, GraduationCap, Home, HandHeart, Church } from "lucide-react"
import { Link } from "react-router"

import { PARISH_PHONE_DISPLAY, PARISH_TEL_HREF } from "../../lib/parishContact"
import { supabase } from "../../lib/supabase"
import { ParishPageHero } from "../components/parish-page-hero"

const MenIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8">
    <circle cx="9" cy="7" r="3"/><path d="M3 21v-2a4 4 0 014-4h4a4 4 0 014 4v2"/>
    <path d="M16 3.13a4 4 0 010 7.75"/><path d="M21 21v-2a4 4 0 00-3-3.87"/>
  </svg>
);
const WomenIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8">
    <circle cx="12" cy="8" r="4"/><path d="M12 14v8M8 18h8"/>
    <path d="M6 21c.5-3 3-5 6-5s5.5 2 6 5"/>
  </svg>
);
const CrossSVG = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="h-8 w-8">
    <path d="M12 2v20M2 12h20"/>
  </svg>
);
const DoveIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8">
    <path d="M16 12c0 0 2-1 3-3 1-2 1-4-1-5-2-1-4 0-5 2l-5 7c-1 1.5-1 3 0 4s3 1 4 0l4-5z"/>
    <path d="M10 14l-4 4M8 20l4-4"/>
  </svg>
);
const CommunityIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8">
    <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
    <polyline points="9 22 9 12 15 12 15 22"/>
  </svg>
);
const AltarIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8">
    <path d="M12 2v8M8 6h8"/><rect x="3" y="14" width="18" height="6" rx="1"/><path d="M3 14l2-4h14l2 4"/>
  </svg>
);

type MinistryIcon = React.ComponentType<{ className?: string }>
const MINISTRY_ICONS: Record<string, MinistryIcon> = {
  cma: MenIcon,
  cwa: WomenIcon,
  youth: Users,
  pmc: DoveIcon,
  choir: Music,
  csa: GraduationCap,
  catechism: BookOpen,
  "altar-servers": AltarIcon,
  scc: CommunityIcon,
  eucharistic: CrossSVG,
  lectors: BookOpen,
  svdp: HandHeart,
}

type DbMinistry = {
  id: string
  slug: string
  title: string
  subtitle: string
  description: string
  activities: unknown
  meets: string
  contact_info: string
  color: string
}

function normalizeActivities(raw: unknown): string[] {
  if (!Array.isArray(raw)) return []
  return raw.filter((x): x is string => typeof x === "string")
}

const FALLBACK_MINISTRIES = [
  { id:"cma", Icon: MenIcon, title:"Catholic Men Association (CMA)", subtitle:"Faith · Brotherhood · Leadership", description:"The Catholic Men Association brings together men of the parish to deepen their faith, support one another in Christian brotherhood, and serve the community with integrity.", activities:["Monthly meetings and prayers","Family life seminars","Community service projects","Annual retreats and recollections","Support for parish development"], meets:"Monthly – as announced", contact:"Speak to the Parish Priest", color:"#7c4c2e", bg:"#eaf7ee" },
  { id:"cwa", Icon: WomenIcon, title:"Catholic Women Association (CWA)", subtitle:"Faith · Service · Solidarity", description:"The Catholic Women Association unites women of the parish in faith, prayer, and service. CWA members support one another, engage in charitable activities, and mentor young women.", activities:["Weekly prayer and fellowship","Charitable works and fundraising","Mentoring young women","Hospital and home visits","Annual women's day celebrations"], meets:"Every 2nd Saturday at 10:00 AM", contact:"Contact the Parish Office", color:"#880e4f", bg:"#fce4ec" },
  { id:"youth", Icon: Users, title:"Youth Ministry", subtitle:"Faith · Fun · Future", description:"Our Youth Ministry gathers young people from the parish to grow together in Catholic faith, fellowship and service. The youth are the future of the Church.", activities:["Weekly youth meetings","Faith formation & catechesis","Sports and recreational activities","Youth camps and retreats","Community service and charity"], meets:"Every Saturday at 3:00 PM", contact:"Contact the Parish Priest", color:"#e65100", bg:"#fff3e0" },
  { id:"pmc", Icon: DoveIcon, title:"Parish Missionary Council (PMC)", subtitle:"Evangelization · Outreach · Mission", description:"The Parish Missionary Council coordinates missionary activities and evangelization efforts within and beyond the parish. PMC members are passionate about spreading the Good News.", activities:["Parish evangelization programs","Coordination of outreach missions","Support for missionary activities","Home visits and pastoral care","Supporting the Diocese of Kapsabet mission"], meets:"First Sunday of the month", contact:"Contact the Parish Priest", color:"#1565c0", bg:"#e3f2fd" },
  { id:"choir", Icon: Music, title:"Choir Ministry", subtitle:"Praise · Worship · Music", description:"Our dedicated choir ministers use their musical gifts to glorify God and enhance the celebration of the Eucharist and other sacraments at all Sunday Masses.", activities:["Rehearsals every Thursday","Sunday Mass worship","Special occasion performances","Liturgical music training","Annual choir festivals"], meets:"Thursday 6:00 PM (Rehearsals)", contact:"Speak to Choir Master", color:"#00695c", bg:"#e0f2f1" },
  { id:"csa", Icon: GraduationCap, title:"Catholic Students Association (CSA)", subtitle:"Faith · Studies · Service", description:"The Catholic Students Association walks with students in Mosoriot and beyond—especially those at Koitaleel Samoei University College (KSUC), right here in our community. CSA helps Catholic students live their faith on campus and in the lecture hall: Sunday Mass at St. Francis Cheptarit, the sacraments, prayer, and honest friendship so that study and career serve God and neighbour.", activities:["Student fellowship and prayer at the parish","Faith formation for university and college students","Walking with KSUC students—our neighbours in learning","Academic encouragement and moral support","Mentorship and outreach to students in need","Linking campus life with parish life in Mosoriot"], meets:"Sundays after Mass", contact:"Contact the Parish Office", color:"#827717", bg:"#f9fbe7" },
  { id:"catechism", Icon: BookOpen, title:"Catechism / CRE Classes", subtitle:"Formation · Sacraments · Faith", description:"Religious education and catechism classes prepare children and adults for the Sacraments of Initiation — Baptism, First Holy Communion, and Confirmation.", activities:["Sunday catechism for children","Adult faith formation","Sacramental preparation","Prayer and Scripture study","Annual catechism day celebration"], meets:"Sundays 9:00 AM", contact:"Contact Parish Catechists", color:"#4a148c", bg:"#f3e5f5" },
  { id:"altar-servers", Icon: AltarIcon, title:"Altar Servers", subtitle:"Service · Reverence · Dedication", description:"Altar servers assist the priest during the celebration of Mass and other liturgical functions. This ministry forms young people in a spirit of service and reverence.", activities:["Serving at all Masses","Training for new servers (age 10+)","Altar servers' retreats","Annual altar servers' day"], meets:"As scheduled for Masses", contact:"Speak to the Parish Priest", color:"#bf360c", bg:"#fbe9e7" },
  { id:"scc", Icon: CommunityIcon, title:"Small Christian Communities (SCCs)", subtitle:"Prayer · Sharing · Community", description:"The parish is organised into Small Christian Communities that meet in homes throughout the area, providing grassroots faith sharing, prayer, and community support.", activities:["Weekly Scripture reflection","Communal prayer and sharing","Support for members in need","Reporting to the parish council","Participating in parish events"], meets:"Weekly in homes", contact:"Contact the Parish Office", color:"#2e7d32", bg:"#e8f5e9" },
  { id:"eucharistic", Icon: CrossSVG, title:"Eucharistic Ministers", subtitle:"Service · Communion · Care", description:"Extraordinary Ministers of Holy Communion assist in distributing Communion during Mass and to the sick and homebound. This ministry requires commissioning.", activities:["Distribute Holy Communion at Mass","Bring Communion to the sick","Spiritual formation and training"], meets:"As scheduled", contact:"Contact the Parish Priest", color:"#7c4c2e", bg:"#eaf7ee" },
  { id:"lectors", Icon: BookOpen, title:"Lectors Ministry", subtitle:"Word · Proclamation · Service", description:"Lectors proclaim the Word of God during Mass from the Scriptures. Open to all parishioners willing to be trained and commit to serving at Mass.", activities:["Read Scripture at Mass","Training and formation","Ministry scheduling"], meets:"As scheduled", contact:"Contact the Parish Office", color:"#4a148c", bg:"#f3e5f5" },
  { id:"svdp", Icon: HandHeart, title:"St. Vincent de Paul Society", subtitle:"Charity · Service · Compassion", description:"The St. Vincent de Paul Society serves people in need in our community, offering material and moral support through home visits, food assistance, and help for the vulnerable.", activities:["Home visits to the poor","Food and material assistance","Hospital visitation","Monthly meetings and charity drives"], meets:"Monthly – as announced", contact:"Contact the Parish Office", color:"#1565c0", bg:"#e3f2fd" },
]

export function Ministries() {
  const [dbRows, setDbRows] = useState<DbMinistry[] | null>(null)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      const { data, error } = await supabase
        .from("ministries")
        .select("*")
        .eq("is_active", true)
        .order("title", { ascending: true })
      if (cancelled) return
      if (error || !data?.length) {
        setDbRows(null)
        return
      }
      setDbRows(data as DbMinistry[])
    })()
    return () => {
      cancelled = true
    }
  }, [])

  const displayList =
    dbRows && dbRows.length > 0
      ? dbRows.map((m) => {
      const color = m.color || "#7c4c2e"
      const Icon = MINISTRY_ICONS[m.slug] || Users
      return {
        key: m.id,
        slug: m.slug,
        Icon,
        title: m.title,
        subtitle: m.subtitle,
        description: m.description,
        activities: normalizeActivities(m.activities),
        meets: m.meets || "—",
        contact: m.contact_info || "",
        color,
        bg: `${color}22`,
      }
    })
      : FALLBACK_MINISTRIES.map((m) => ({
      key: m.id,
      slug: m.id,
      Icon: m.Icon,
      title: m.title,
      subtitle: m.subtitle,
      description: m.description,
      activities: m.activities,
      meets: m.meets,
      contact: m.contact,
      color: m.color,
      bg: m.bg,
    }))

  return (
    <div>
      <ParishPageHero
        imageUrl="/images/ministries-hero-background.png"
        eyebrow="Parish life"
        title="Ministries & Groups"
        icon={<Users className="text-white drop-shadow-sm" aria-hidden />}
        tagline="Find your place to serve, grow, and belong in the St. Francis Cheptarit Parish community"
      >
        <p className="text-center font-serif text-lg leading-relaxed text-[#3a1f13] [text-shadow:0_1px_2px_rgba(255,255,255,0.35)] md:text-xl">
          At St. Francis Cheptarit, we believe every person has unique gifts to offer. Our ministries and groups provide opportunities to grow in faith, serve God, and build meaningful relationships within our parish and the wider Mosoriot community.
        </p>
      </ParishPageHero>

      <section className="parish-page-content-bg page-background-section py-12 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayList.map((m) => {
              const { Icon } = m
              const isCmaCard = m.title.includes("Catholic Men Association")
              const isCwaCard = m.title.includes("Catholic Women Association")
              const isPmcCard = m.title.includes("Parish Missionary Council")
              const isChoirCard = m.title.includes("Choir Ministry")
              const isYouthCard = m.title.includes("Youth Ministry")
              const isCsaCard = m.slug === "csa" || m.title.includes("Catholic Students Association")
              return (
                <div key={m.key} className="ministry-card parish-glass-card rounded-2xl shadow-md overflow-hidden border border-green-100/80">
                  <div className="p-5 text-white flex items-center gap-3" style={{ background: `linear-gradient(135deg, ${m.color}, ${m.color}cc)` }}>
                    <div className="opacity-90"><Icon /></div>
                    <div>
                      <h3 className="font-bold text-lg leading-tight">{m.title}</h3>
                      <p className="text-white/75 text-xs mt-0.5">{m.subtitle}</p>
                    </div>
                  </div>
                  <div className="p-5 space-y-4">
                    <p className="text-gray-600 text-sm leading-relaxed">{m.description}</p>
                    {isCsaCard ? (
                      <p className="rounded-lg border border-[#827717]/20 bg-[#f9fbe7]/60 px-3 py-2.5 text-xs leading-relaxed text-gray-700">
                        Photos and updates for CSA—including Koitaleel Samoei University College (KSUC)—live on the{" "}
                        <strong>Catholic Students Association</strong> page.
                      </p>
                    ) : null}
                    <div className="rounded-xl p-3" style={{ background: m.bg }}>
                      <p className="text-xs font-bold mb-2" style={{ color: m.color }}>Activities</p>
                      <ul className="space-y-1">
                        {m.activities.map((a, i) => (
                          <li key={i} className="text-xs text-gray-600 flex items-start gap-1.5">
                            <span style={{ color: m.color }} className="mt-0.5 flex-shrink-0">&#8226;</span>{a}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="flex items-center justify-between text-xs pt-1 border-t border-gray-100">
                      <div><span className="text-gray-400">Meets: </span><span className="font-medium text-gray-700">{m.meets}</span></div>
                      <span className="text-gray-500">{m.contact}</span>
                    </div>
                    {isCwaCard ? (
                      <Link
                        to="/ministries/cwa"
                        className="inline-flex items-center justify-center w-full rounded-lg px-3 py-2 text-xs font-semibold text-white transition-opacity hover:opacity-90"
                        style={{ background: `linear-gradient(135deg, ${m.color}, ${m.color}cc)` }}
                      >
                        Open CWA Page
                      </Link>
                    ) : null}
                    {isCmaCard ? (
                      <Link
                        to="/ministries/cma"
                        className="inline-flex items-center justify-center w-full rounded-lg px-3 py-2 text-xs font-semibold text-white transition-opacity hover:opacity-90"
                        style={{ background: `linear-gradient(135deg, ${m.color}, ${m.color}cc)` }}
                      >
                        Open CMA Page
                      </Link>
                    ) : null}
                    {isPmcCard ? (
                      <Link
                        to="/ministries/pmc"
                        className="inline-flex items-center justify-center w-full rounded-lg px-3 py-2 text-xs font-semibold text-white transition-opacity hover:opacity-90"
                        style={{ background: `linear-gradient(135deg, ${m.color}, ${m.color}cc)` }}
                      >
                        Open PMC Page
                      </Link>
                    ) : null}
                    {isChoirCard ? (
                      <Link
                        to="/ministries/choir"
                        className="inline-flex items-center justify-center w-full rounded-lg px-3 py-2 text-xs font-semibold text-white transition-opacity hover:opacity-90"
                        style={{ background: `linear-gradient(135deg, ${m.color}, ${m.color}cc)` }}
                      >
                        Open Choir Page
                      </Link>
                    ) : null}
                    {isYouthCard ? (
                      <Link
                        to="/ministries/youth"
                        className="inline-flex items-center justify-center w-full rounded-lg px-3 py-2 text-xs font-semibold text-white transition-opacity hover:opacity-90"
                        style={{ background: `linear-gradient(135deg, ${m.color}, ${m.color}cc)` }}
                      >
                        Open Youth Page
                      </Link>
                    ) : null}
                    {isCsaCard ? (
                      <Link
                        to="/ministries/csa"
                        className="inline-flex items-center justify-center w-full rounded-lg px-3 py-2 text-xs font-semibold text-white transition-opacity hover:opacity-90"
                        style={{ background: `linear-gradient(135deg, ${m.color}, ${m.color}cc)` }}
                      >
                        Open CSA page (photos &amp; KSUC)
                      </Link>
                    ) : null}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <section className="py-16 px-4 text-white" style={{ background: "linear-gradient(135deg, #3a1f13, #7c4c2e)" }}>
        <div className="container mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold mb-4">Want to Get Involved?</h2>
          <p className="text-green-200 mb-8 leading-relaxed">Speak to the Parish Priest, contact the parish office, or approach any ministry coordinator after Mass. You are always welcome.</p>
          <a href={PARISH_TEL_HREF} className="inline-flex items-center justify-center gap-2 bg-yellow-500 hover:bg-yellow-400 text-green-950 font-bold px-8 py-4 rounded-full transition-all shadow-lg">
            <Phone className="h-5 w-5" /> Call: {PARISH_PHONE_DISPLAY}
          </a>
        </div>
      </section>
    </div>
  );
}
