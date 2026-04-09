import { Link } from "react-router"
import { ArrowLeft, Sparkles, BookOpen, Users } from "lucide-react"

const PMC_DATA = {
  title: "Parish Missionary Children (PMC)",
  subtitle: "Faith · Formation · Mission",
  description:
    "PMC forms children in Catholic faith through prayer, Scripture, service, and missionary spirit. It helps them grow as young disciples who love Christ and the Church.",
  activities: [
    "Children prayer meetings and fellowship",
    "Bible sharing and catechesis support",
    "Participation in liturgy and parish events",
    "Mission awareness and charity activities",
    "Mentorship in discipline and Christian values",
  ],
}

export function PmcPage() {
  return (
    <div>
      <section
        className="py-20 px-4 text-white relative overflow-hidden"
        style={{ backgroundImage: "url('/images/pmc-3.png')", backgroundPosition: "center 42%", backgroundSize: "cover" }}
      >
        <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, rgba(36,22,13,0.9) 0%, rgba(86,48,28,0.85) 100%)" }} />
        <div className="container mx-auto max-w-4xl relative z-10">
          <Link to="/ministries" className="inline-flex items-center gap-2 text-sm font-semibold text-green-100 hover:text-white mb-6">
            <ArrowLeft className="h-4 w-4" /> Back to Ministries
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold mb-3">{PMC_DATA.title}</h1>
          <p className="text-green-200 text-lg font-medium mb-3">{PMC_DATA.subtitle}</p>
          <div className="w-20 h-1 bg-yellow-400 rounded mb-5" />
          <p className="text-white/95 leading-relaxed max-w-3xl">{PMC_DATA.description}</p>
        </div>
      </section>

      <section
        className="py-14 px-4 relative overflow-hidden"
        style={{ backgroundImage: "url('/images/pmc-background.png')", backgroundPosition: "center 40%", backgroundSize: "cover" }}
      >
        <div className="absolute inset-0" style={{ background: "linear-gradient(145deg, rgba(16,20,29,0.72) 0%, rgba(69,35,18,0.7) 55%, rgba(26,34,24,0.74) 100%)" }} />
        <div className="container mx-auto max-w-5xl grid md:grid-cols-2 gap-6 relative z-10">
          <div className="rounded-2xl border p-6 shadow-xl backdrop-blur-md" style={{ borderColor: "rgba(255,255,255,0.28)", background: "rgba(255,255,255,0.12)" }}>
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-white">
              <Sparkles className="h-5 w-5" /> Umuhimu wa PMC / Importance
            </h2>
            <p className="text-white/90 text-sm leading-relaxed mb-4">
              PMC ni msingi wa malezi ya watoto ndani ya Kanisa Katoliki. Kwa St. Francis Mosoriot, watoto wetu wanajifunza sala,
              discipline, and missionary heart mapema, ili wakue kuwa vijana na viongozi wa kesho wenye imani thabiti.
            </p>
            <ul className="space-y-2">
              {PMC_DATA.activities.map((a) => (
                <li key={a} className="text-sm text-white/90 flex items-start gap-2">
                  <span className="mt-0.5 text-yellow-300">&#8226;</span>
                  <span>{a}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <div className="rounded-2xl border p-6 shadow-xl backdrop-blur-md" style={{ borderColor: "rgba(255,255,255,0.28)", background: "rgba(255,255,255,0.12)" }}>
              <h2 className="text-xl font-bold mb-3 flex items-center gap-2 text-white">
                <BookOpen className="h-5 w-5" /> Bible Verse (English)
              </h2>
              <p className="text-white/90 leading-relaxed text-sm italic">
                "Let the little children come to me, and do not hinder them, for the kingdom of God belongs to such as these."
              </p>
              <p className="text-xs font-semibold text-green-100 mt-2">Luke 18:16</p>
            </div>

            <div className="rounded-2xl border p-6 shadow-xl backdrop-blur-md" style={{ borderColor: "rgba(255,255,255,0.28)", background: "rgba(255,255,255,0.12)" }}>
              <h2 className="text-xl font-bold mb-3 flex items-center gap-2 text-white">
                <Users className="h-5 w-5" /> Aya ya Biblia (Kiswahili)
              </h2>
              <p className="text-white/90 leading-relaxed text-sm italic">
                "Waacheni watoto wadogo waje kwangu, wala msiwazuie; kwa maana ufalme wa Mungu ni wa watu kama hao."
              </p>
              <p className="text-xs font-semibold text-green-100 mt-2">Luka 18:16</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
