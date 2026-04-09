import { Link } from "react-router"
import { ArrowLeft, Users, BookOpen, Heart } from "lucide-react"

const YOUTH_DATA = {
  title: "Youth Ministry",
  subtitle: "Faith · Fun · Future",
  description:
    "Our Youth Ministry gathers young people from the parish to grow together in Catholic faith, fellowship and service. The youth are the future of the Church.",
  activities: [
    "Weekly youth meetings",
    "Faith formation & catechesis",
    "Sports and recreational activities",
    "Youth camps and retreats",
    "Community service and charity",
  ],
}

export function YouthPage() {
  return (
    <div>
      <section
        className="py-20 px-4 text-white relative overflow-hidden"
        style={{ backgroundImage: "url('/images/youth-1.png')", backgroundPosition: "center 40%", backgroundSize: "cover" }}
      >
        <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, rgba(26,14,9,0.88) 0%, rgba(58,31,19,0.82) 45%, rgba(230,81,0,0.35) 100%)" }} />
        <div className="container mx-auto max-w-4xl relative z-10">
          <Link to="/ministries" className="inline-flex items-center gap-2 text-sm font-semibold text-green-100 hover:text-white mb-6">
            <ArrowLeft className="h-4 w-4" /> Back to Ministries
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold mb-3">{YOUTH_DATA.title}</h1>
          <p className="text-green-200 text-lg font-medium mb-3">{YOUTH_DATA.subtitle}</p>
          <div className="w-20 h-1 bg-yellow-400 rounded mb-5" />
          <p className="text-white/95 leading-relaxed max-w-3xl">{YOUTH_DATA.description}</p>
        </div>
      </section>

      <section
        className="py-14 px-4 relative overflow-hidden"
        style={{ backgroundImage: "url('/images/youth-2.png')", backgroundPosition: "center 38%", backgroundSize: "cover" }}
      >
        <div className="absolute inset-0" style={{ background: "linear-gradient(145deg, rgba(17,20,28,0.72) 0%, rgba(58,31,19,0.68) 55%, rgba(230,81,0,0.28) 100%)" }} />
        <div className="container mx-auto max-w-5xl grid md:grid-cols-2 gap-6 relative z-10">
          <div className="rounded-2xl border p-6 shadow-xl backdrop-blur-md" style={{ borderColor: "rgba(255,255,255,0.28)", background: "rgba(255,255,255,0.12)" }}>
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-white">
              <Users className="h-5 w-5" /> Contribution to the Church
            </h2>
            <p className="text-white/90 text-sm leading-relaxed mb-4">
              Youth ministry helps the Church remain alive and missionary. Through prayer, formation, and service, young people learn to
              follow Christ with courage and become leaders of faith in families, schools, and the wider Mosoriot community.
            </p>
            <ul className="space-y-2">
              {YOUTH_DATA.activities.map((a) => (
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
                &ldquo;Let no one despise your youth, but set the believers an example in speech and conduct, in love, in faith, in purity.&rdquo;
              </p>
              <p className="text-xs font-semibold text-green-100 mt-2">1 Timothy 4:12</p>
            </div>

            <div className="rounded-2xl border p-6 shadow-xl backdrop-blur-md" style={{ borderColor: "rgba(255,255,255,0.28)", background: "rgba(255,255,255,0.12)" }}>
              <h2 className="text-xl font-bold mb-3 flex items-center gap-2 text-white">
                <Heart className="h-5 w-5" /> Aya ya Biblia (Kiswahili)
              </h2>
              <p className="text-white/90 leading-relaxed text-sm italic">
                &ldquo;Mtu asidharau ujana wako; bali uwe mfano kwa waumini katika usemi, mwenendo, upendo, imani, na usafi.&rdquo;
              </p>
              <p className="text-xs font-semibold text-green-100 mt-2">1 Timotheo 4:12</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
