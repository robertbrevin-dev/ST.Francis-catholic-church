import { Link } from "react-router"
import { ArrowLeft, Music, BookOpen, Heart } from "lucide-react"

const CHOIR_DATA = {
  title: "Choir Ministry",
  subtitle: "Praise · Worship · Music",
  description:
    "Our dedicated choir ministers use their musical gifts to glorify God and enhance the celebration of the Eucharist and other sacraments at all Sunday Masses.",
  activities: [
    "Rehearsals every Thursday",
    "Sunday Mass worship",
    "Special occasion performances",
    "Liturgical music training",
    "Annual choir festivals",
  ],
}

export function ChoirPage() {
  return (
    <div>
      <section
        className="py-20 px-4 text-white relative overflow-hidden"
        style={{ backgroundImage: "url('/images/choir-3.png')", backgroundPosition: "center 40%", backgroundSize: "cover" }}
      >
        <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, rgba(26,14,9,0.88) 0%, rgba(58,31,19,0.84) 45%, rgba(23,69,64,0.72) 100%)" }} />
        <div className="container mx-auto max-w-4xl relative z-10">
          <Link to="/ministries" className="inline-flex items-center gap-2 text-sm font-semibold text-green-100 hover:text-white mb-6">
            <ArrowLeft className="h-4 w-4" /> Back to Ministries
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold mb-3">{CHOIR_DATA.title}</h1>
          <p className="text-green-200 text-lg font-medium mb-3">{CHOIR_DATA.subtitle}</p>
          <div className="w-20 h-1 bg-yellow-400 rounded mb-5" />
          <p className="text-white/95 leading-relaxed max-w-3xl">{CHOIR_DATA.description}</p>
        </div>
      </section>

      <section
        className="py-14 px-4 relative overflow-hidden"
        style={{ backgroundImage: "url('/images/choir-4.png')", backgroundPosition: "center 40%", backgroundSize: "cover" }}
      >
        <div className="absolute inset-0" style={{ background: "linear-gradient(145deg, rgba(17,20,28,0.72) 0%, rgba(58,31,19,0.68) 55%, rgba(19,74,67,0.72) 100%)" }} />
        <div className="container mx-auto max-w-5xl grid md:grid-cols-2 gap-6 relative z-10">
          <div className="rounded-2xl border p-6 shadow-xl backdrop-blur-md" style={{ borderColor: "rgba(255,255,255,0.28)", background: "rgba(255,255,255,0.12)" }}>
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-white">
              <Music className="h-5 w-5" /> Their Contribution to Church
            </h2>
            <p className="text-white/90 text-sm leading-relaxed mb-4">
              The choir helps the whole Church pray through song. Their ministry supports the liturgy by leading responses, hymns, and sacred
              moments with reverence. At St. Francis Cheptarit, they create unity in worship and help people encounter God with joy.
            </p>
            <ul className="space-y-2">
              {CHOIR_DATA.activities.map((a) => (
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
                "Sing to the Lord a new song; sing to the Lord, all the earth."
              </p>
              <p className="text-xs font-semibold text-green-100 mt-2">Psalm 96:1</p>
            </div>

            <div className="rounded-2xl border p-6 shadow-xl backdrop-blur-md" style={{ borderColor: "rgba(255,255,255,0.28)", background: "rgba(255,255,255,0.12)" }}>
              <h2 className="text-xl font-bold mb-3 flex items-center gap-2 text-white">
                <Heart className="h-5 w-5" /> Aya ya Biblia (Kiswahili)
              </h2>
              <p className="text-white/90 leading-relaxed text-sm italic">
                "Mwimbieni Bwana wimbo mpya; mwimbieni Bwana, nchi yote."
              </p>
              <p className="text-xs font-semibold text-green-100 mt-2">Zaburi 96:1</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
