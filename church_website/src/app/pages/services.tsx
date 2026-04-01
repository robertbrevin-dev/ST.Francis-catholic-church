import { Phone, Church, ShieldCheck, Droplet, Feather, Cross, Gift, Heart, Leaf, BookOpen, Sparkles, Lightbulb } from "lucide-react";
import { Link } from "react-router";

// ============================
const CHURCH_PHONE = "+254 700 000 000"; // ← Replace with actual phone number
// ============================

const SERVICES = [
  {
    id: "mass",
    icon: <Church className="h-10 w-10" />,
    title: "Holy Mass (Eucharist)",
    subtitle: "The Source and Summit of Our Faith",
    description:
      "The Eucharist is at the heart of parish life. We celebrate Holy Mass every day of the week. The Sunday Mass is the high point of our week, gathering the entire parish community to worship God, hear His Word, and receive the Body and Blood of Christ.",
    schedule: [
      { day: "Sunday", times: ["7:00 AM", "9:00 AM (Main Mass)"] },
      { day: "Monday – Friday", times: ["6:30 AM"] },
      { day: "Saturday", times: ["7:00 AM"] },
    ],
    note: "Mass times may change during special liturgical seasons (Advent, Lent, Easter). Check announcements for updates.",
    color: "#1b6b35",
    bg: "#eaf7ee",
  },
  {
    id: "confession",
    icon: <ShieldCheck className="h-10 w-10" />,
    title: "Sacrament of Reconciliation (Confession)",
    subtitle: "God's Mercy and Healing",
    description:
      "The Sacrament of Reconciliation (Confession) is available regularly at the parish. This sacrament offers healing, peace, and God's mercy to all who approach with sincere hearts. We encourage all parishioners to make use of this sacrament regularly.",
    schedule: [
      { day: "Saturday", times: ["4:00 PM – 5:30 PM"] },
      { day: "Before Sunday Masses", times: ["6:30 AM – 6:55 AM", "8:30 AM – 8:55 AM"] },
      { day: "By Appointment", times: ["Contact the Parish Priest"] },
    ],
    note: "Individual confession by appointment is always available. Please do not let embarrassment keep you away — the priest is there to help.",
    color: "#6a1b9a",
    bg: "#f3e5f5",
  },
  {
    id: "baptism",
    icon: <Droplet className="h-10 w-10" />,
    title: "Sacrament of Baptism",
    subtitle: "Welcome into the Family of God",
    description:
      "Baptism is the gateway to Christian life. At St. Francis Cheptarit, we celebrate the Baptism of infants and children of parishioners. Parents and godparents are required to attend a preparation session before the Baptism date.",
    schedule: [
      { day: "Typically celebrated", times: ["Sundays during or after Mass"] },
      { day: "Preparation class", times: ["Contact the Parish Office to register"] },
    ],
    note: "Baptism registration must be done at the Parish Office. Parents must be practicing Catholics or be committed to raising the child in the faith.",
    color: "#1565c0",
    bg: "#e3f2fd",
  },
  {
    id: "confirmation",
    icon: <Feather className="h-10 w-10" />,
    title: "Sacrament of Confirmation",
    subtitle: "Sealed with the Holy Spirit",
    description:
      "The Sacrament of Confirmation completes Baptism and is administered by the Bishop. Young people and adults in the parish prepare through a period of catechesis and formation before receiving this sacrament.",
    schedule: [
      { day: "Administered by the Bishop", times: ["As scheduled by the Diocese of Eldoret"] },
      { day: "Preparation Classes", times: ["Ongoing — contact catechists"] },
    ],
    note: "Candidates must be baptized, have received First Holy Communion, and be actively attending catechism classes.",
    color: "#bf360c",
    bg: "#fbe9e7",
  },
  {
    id: "first-communion",
    icon: <Cross className="h-10 w-10" />,
    title: "First Holy Communion",
    subtitle: "Receiving Jesus for the First Time",
    description:
      "First Holy Communion is a special milestone in the life of a Catholic child. Children are prepared through catechism classes to receive Jesus in the Eucharist for the first time. This is a joyful celebration for the whole parish family.",
    schedule: [
      { day: "Celebrated", times: ["Annually — date announced in advance"] },
      { day: "Preparation", times: ["Sundays 9:00 AM — catechism classes"] },
    ],
    note: "Children must be at least 7–8 years old, be baptized, and have attended the required catechism classes.",
    color: "#00695c",
    bg: "#e0f2f1",
  },
  {
    id: "marriage",
    icon: <Gift className="h-10 w-10" />,
    title: "Sacrament of Holy Matrimony",
    subtitle: "A Covenant of Love",
    description:
      "The Church celebrates the Sacrament of Marriage as a covenant between a man and a woman, and with God. Couples intending to marry in the Church must begin preparation at least six months in advance.",
    schedule: [
      { day: "Marriage Preparation", times: ["Begin at least 6 months before the date"] },
      { day: "Marriage Encounter / Seminar", times: ["As scheduled — contact Parish Office"] },
      { day: "Wedding Ceremony", times: ["By appointment — contact Parish Priest"] },
    ],
    note: "Both parties must be free to marry in the Church. At least one partner should be a practising Catholic. Marriage registration is done at the Parish Office.",
    color: "#880e4f",
    bg: "#fce4ec",
  },
  {
    id: "anointing",
    icon: <Heart className="h-10 w-10" />,
    title: "Anointing of the Sick",
    subtitle: "Healing and Comfort in God",
    description:
      "The Anointing of the Sick is available to all seriously ill, elderly, or hospitalized parishioners. This sacrament brings spiritual healing, strength, and comfort. Family members are encouraged to call the priest promptly when a loved one is ill.",
    schedule: [
      { day: "By Request", times: ["Contact the Parish Priest at any time"] },
      { day: "Hospital Visits", times: ["As requested and arranged"] },
      { day: "Group Anointing", times: ["Occasionally during special Masses — watch for announcements"] },
    ],
    note: "Do not wait until the last moment — this sacrament is for all who are seriously or chronically ill, not only those at the point of death.",
    color: "#4e342e",
    bg: "#efebe9",
  },
  {
    id: "funeral",
    icon: <Leaf className="h-10 w-10" />,
    title: "Christian Burial / Funeral Services",
    subtitle: "Hope in the Resurrection",
    description:
      "The Church accompanies families in prayer and faith at the time of death. The parish offers funeral Masses and prayers for the deceased. Contact the Parish Priest as early as possible to make arrangements.",
    schedule: [
      { day: "Funeral Mass", times: ["By arrangement with the Parish Priest"] },
      { day: "Burial Prayers", times: ["Accompanied by the Parish Priest or deacon"] },
    ],
    note: "Contact the parish office immediately when a parishioner dies. We walk with families through grief and into hope.",
    color: "#37474f",
    bg: "#eceff1",
  },
  {
    id: "catechism",
    icon: <BookOpen className="h-10 w-10" />,
    title: "Catechism & Faith Formation",
    subtitle: "Growing in Knowledge of God",
    description:
      "Catechism classes are offered every Sunday for children preparing for First Holy Communion and Confirmation. Adult faith formation sessions are also available for those wishing to join the Church or deepen their faith.",
    schedule: [
      { day: "Children's Catechism", times: ["Sunday 9:00 AM at the Parish Hall"] },
      { day: "Adult RCIA", times: ["Contact the Parish Priest for schedule"] },
    ],
    note: "All children must attend catechism to receive the Sacraments. Adult newcomers to the Church are warmly welcomed.",
    color: "#1b6b35",
    bg: "#eaf7ee",
  },
  {
    id: "blessings",
    icon: <Sparkles className="h-10 w-10" />,
    title: "Blessings & Sacramentals",
    subtitle: "Seeking God's Grace",
    description:
      "The priest offers various blessings including blessing of homes, vehicles, businesses, and individuals. These blessings invoke God's protection and grace over our daily lives and endeavors.",
    schedule: [
      { day: "Home Blessings", times: ["By appointment — contact Parish Priest"] },
      { day: "Vehicle & Business Blessings", times: ["By appointment — contact Parish Office"] },
      { day: "Other Blessings", times: ["After Mass or by appointment"] },
    ],
    note: "Blessings are offered freely. Please contact the parish to arrange a date and time.",
    color: "#f57f17",
    bg: "#fff8e1",
  },
];

export function Services() {
  return (
    <div>
      {/* Header */}
      <section
        className="py-20 px-4 text-white relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #0d3320 0%, #1b6b35 100%)" }}
      >
        <div className="container mx-auto max-w-4xl text-center relative z-10">
          <Cross className="h-14 w-14 mx-auto mb-4" />
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Parish Services</h1>
          <div className="w-20 h-1 bg-yellow-400 mx-auto mb-4 rounded"></div>
          <p className="text-green-200 text-lg max-w-2xl mx-auto">
            Sacraments and pastoral services offered at St. Francis Cheptarit Catholic Parish, Mosoriot, Nandi County
          </p>
        </div>
      </section>

      {/* Intro */}
      <section className="py-10 px-4 bg-white">
        <div className="container mx-auto max-w-4xl text-center">
          <p className="text-gray-600 leading-relaxed text-lg">
            The Sacraments are the living heart of the Catholic Church. At St. Francis Cheptarit, we celebrate 
            all the Sacraments and offer a range of pastoral services to accompany our parishioners through every 
            stage of life — from birth to death and into eternal life.
          </p>
        </div>
      </section>

      {/* Services */}
      <section className="py-10 px-4" style={{ background: "#f0faf2" }}>
        <div className="container mx-auto max-w-6xl">
          <div className="space-y-6">
            {SERVICES.map((s, i) => (
              <div key={s.id} className="bg-white rounded-2xl shadow-md overflow-hidden border border-green-100 hover:shadow-lg transition-all">
                <div className="grid md:grid-cols-3">
                  {/* Left: Icon + Title */}
                  <div
                    className="p-8 flex flex-col justify-center text-white"
                    style={{ background: `linear-gradient(135deg, ${s.color}, ${s.color}bb)` }}
                  >
                    <span className="text-5xl mb-4">{s.icon}</span>
                    <h2 className="font-bold text-xl mb-1">{s.title}</h2>
                    <p className="text-white/75 text-sm">{s.subtitle}</p>
                  </div>

                  {/* Middle: Description */}
                  <div className="p-6">
                    <p className="text-gray-600 text-sm leading-relaxed mb-4">{s.description}</p>
                    {s.note && (
                      <div className="rounded-xl p-3 border-l-4 border-yellow-400 bg-yellow-50">
                        <p className="text-xs text-yellow-800 leading-relaxed"><Lightbulb className="h-4 w-4 inline-block mr-1" /> {s.note}</p>
                      </div>
                    )}
                  </div>

                  {/* Right: Schedule */}
                  <div className="p-6" style={{ background: s.bg }}>
                    <p className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: s.color }}>Schedule</p>
                    <div className="space-y-3">
                      {s.schedule.map((sch, j) => (
                        <div key={j} className="border-l-2 pl-3" style={{ borderColor: s.color }}>
                          <p className="font-semibold text-sm text-gray-800">{sch.day}</p>
                          {sch.times.map((t, k) => (
                            <p key={k} className="text-xs text-gray-600">{t}</p>
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section
        className="py-16 px-4 text-white"
        style={{ background: "linear-gradient(135deg, #0d3320, #1b6b35)" }}
      >
        <div className="container mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold mb-4">Need a Sacrament or Pastoral Service?</h2>
          <p className="text-green-200 mb-8">
            Please contact the Parish Office or speak with the Parish Priest. We are here to serve you with joy.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={`tel:${CHURCH_PHONE.replace(/\s/g, "")}`}
              className="inline-flex items-center justify-center gap-2 bg-yellow-500 hover:bg-yellow-400 text-green-950 font-bold px-8 py-4 rounded-full transition-all shadow-lg"
            >
              <Phone className="h-5 w-5" />
              Call: {CHURCH_PHONE}
            </a>
            <Link
              to="/contact"
              className="inline-flex items-center justify-center gap-2 border-2 border-white text-white font-semibold px-8 py-4 rounded-full hover:bg-white hover:text-green-900 transition-all"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
