import { Link } from "react-router"
import { ArrowLeft, Shield, BookOpen, Users } from "lucide-react"

const CMA_DATA = {
  title: "Catholic Men Association (CMA)",
  subtitle: "Faith · Brotherhood · Leadership",
  description:
    "The Catholic Men Association brings together men of the parish to deepen their faith, support one another in Christian brotherhood, and serve the community with integrity.",
  activities: [
    "Monthly meetings and prayers",
    "Family life seminars",
    "Community service projects",
    "Annual retreats and recollections",
    "Support for parish development",
  ],
}

export function CmaPage() {
  return (
    <div>
      <section
        className="py-20 px-4 text-white relative overflow-hidden"
        style={{ backgroundImage: "url('/images/cma-3.png')", backgroundPosition: "center 40%", backgroundSize: "cover" }}
      >
        <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, rgba(36,22,13,0.9) 0%, rgba(124,76,46,0.86) 100%)" }} />
        <div className="container mx-auto max-w-4xl relative z-10">
          <Link to="/ministries" className="inline-flex items-center gap-2 text-sm font-semibold text-green-100 hover:text-white mb-6">
            <ArrowLeft className="h-4 w-4" /> Back to Ministries
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold mb-3">{CMA_DATA.title}</h1>
          <p className="text-green-200 text-lg font-medium mb-3">{CMA_DATA.subtitle}</p>
          <div className="w-20 h-1 bg-yellow-400 rounded mb-5" />
          <p className="text-white/95 leading-relaxed max-w-3xl">{CMA_DATA.description}</p>
        </div>
      </section>

      <section
        className="py-14 px-4 relative overflow-hidden"
        style={{ backgroundImage: "url('/images/cma-4.png')", backgroundPosition: "center 44%", backgroundSize: "cover" }}
      >
        <div className="absolute inset-0" style={{ background: "linear-gradient(145deg, rgba(17,23,29,0.72) 0%, rgba(58,31,19,0.7) 55%, rgba(22,36,26,0.74) 100%)" }} />
        <div className="container mx-auto max-w-5xl grid md:grid-cols-2 gap-6 relative z-10">
          <div className="rounded-2xl border p-6 shadow-xl backdrop-blur-md" style={{ borderColor: "rgba(255,255,255,0.28)", background: "rgba(255,255,255,0.12)" }}>
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-white">
              <Shield className="h-5 w-5" /> Their Importance to the Church
            </h2>
            <p className="text-white/90 text-sm leading-relaxed mb-4">
              In Catholic life, CMA helps men live their vocation as fathers, husbands, servants, and witnesses of Christ. At St. Francis
              Mosoriot, they support parish leadership, strengthen families, mentor younger men, and work closely with Fr. Richard in parish mission.
            </p>
            <ul className="space-y-2">
              {CMA_DATA.activities.map((a) => (
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
                "Be watchful, stand firm in your faith, be courageous, be strong."
              </p>
              <p className="text-xs font-semibold text-green-100 mt-2">1 Corinthians 16:13</p>
            </div>

            <div className="rounded-2xl border p-6 shadow-xl backdrop-blur-md" style={{ borderColor: "rgba(255,255,255,0.28)", background: "rgba(255,255,255,0.12)" }}>
              <h2 className="text-xl font-bold mb-3 flex items-center gap-2 text-white">
                <Users className="h-5 w-5" /> Aya ya Biblia (Kiswahili)
              </h2>
              <p className="text-white/90 leading-relaxed text-sm italic">
                "Kesheni, simameni imara katika imani, iweni hodari, muwe na nguvu."
              </p>
              <p className="text-xs font-semibold text-green-100 mt-2">1 Wakorintho 16:13</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
