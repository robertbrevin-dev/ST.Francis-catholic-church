import { Link } from "react-router"
import { ArrowLeft, Heart, BookOpen, Users } from "lucide-react"

const CWA_DATA = {
  title: "Catholic Women Association (CWA)",
  subtitle: "Faith · Service · Solidarity",
  description:
    "The Catholic Women Association unites women of the parish in faith, prayer, and service. CWA members support one another, engage in charitable activities, and mentor young women.",
  activities: [
    "Weekly prayer and fellowship",
    "Charitable works and fundraising",
    "Mentoring young women",
    "Hospital and home visits",
    "Annual women's day celebrations",
  ],
}

export function CwaPage() {
  return (
    <div>
      <section
        className="py-20 px-4 text-white relative overflow-hidden"
        style={{ backgroundImage: "url('/images/cwa-4.png')", backgroundPosition: "center", backgroundSize: "cover" }}
      >
        <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, rgba(58,31,19,0.88) 0%, rgba(124,76,46,0.86) 100%)" }} />
        <div className="container mx-auto max-w-4xl relative z-10">
          <Link
            to="/ministries"
            className="inline-flex items-center gap-2 text-sm font-semibold text-green-100 hover:text-white mb-6"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Ministries
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold mb-3">{CWA_DATA.title}</h1>
          <p className="text-green-200 text-lg font-medium mb-3">{CWA_DATA.subtitle}</p>
          <div className="w-20 h-1 bg-yellow-400 rounded mb-5" />
          <p className="text-white/95 leading-relaxed max-w-3xl">{CWA_DATA.description}</p>
        </div>
      </section>

      <section
        className="py-14 px-4 relative overflow-hidden"
        style={{ backgroundImage: "url('/images/cwa-background.png')", backgroundPosition: "center", backgroundSize: "cover" }}
      >
        <div className="absolute inset-0" style={{ background: "linear-gradient(145deg, rgba(18,24,27,0.74) 0%, rgba(58,31,19,0.7) 55%, rgba(24,38,28,0.72) 100%)" }} />
        <div className="absolute inset-0 opacity-20" style={{ background: "radial-gradient(circle at top right, #ffffff 0%, transparent 50%)" }} />
        <div className="container mx-auto max-w-5xl grid md:grid-cols-2 gap-6">
          <div className="relative z-10 rounded-2xl border p-6 shadow-xl backdrop-blur-md" style={{ borderColor: "rgba(255,255,255,0.28)", background: "rgba(255,255,255,0.12)" }}>
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-white">
              <Heart className="h-5 w-5" /> Their Contribution to the Church
            </h2>
            <p className="text-white/90 text-sm leading-relaxed mb-4">
              Following Catholic teaching on charity, dignity, and service, CWA women strengthen parish life through prayer, works of mercy,
              support for families, care for the sick, and active participation in liturgical and community outreach.
            </p>
            <ul className="space-y-2">
              {CWA_DATA.activities.map((a) => (
                <li key={a} className="text-sm text-white/90 flex items-start gap-2">
                  <span className="mt-0.5 text-yellow-300">&#8226;</span>
                  <span>{a}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="relative z-10 space-y-4">
            <div className="rounded-2xl border p-6 shadow-xl backdrop-blur-md" style={{ borderColor: "rgba(255,255,255,0.28)", background: "rgba(255,255,255,0.12)" }}>
              <h2 className="text-xl font-bold mb-3 flex items-center gap-2 text-white">
                <BookOpen className="h-5 w-5" /> Bible Verse (English)
              </h2>
              <p className="text-white/90 leading-relaxed text-sm italic">
                "She opens her mouth with wisdom, and the teaching of kindness is on her tongue."
              </p>
              <p className="text-xs font-semibold text-green-100 mt-2">Proverbs 31:26</p>
            </div>

            <div className="rounded-2xl border p-6 shadow-xl backdrop-blur-md" style={{ borderColor: "rgba(255,255,255,0.28)", background: "rgba(255,255,255,0.12)" }}>
              <h2 className="text-xl font-bold mb-3 flex items-center gap-2 text-white">
                <Users className="h-5 w-5" /> Aya ya Biblia (Kiswahili)
              </h2>
              <p className="text-white/90 leading-relaxed text-sm italic">
                "Hufumbua kinywa chake kwa hekima, na sheria ya fadhili i katika ulimi wake."
              </p>
              <p className="text-xs font-semibold text-green-100 mt-2">Mithali 31:26</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
