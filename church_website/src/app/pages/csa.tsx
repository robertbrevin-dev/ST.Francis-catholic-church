import { Link } from "react-router"
import { ArrowLeft, GraduationCap, Church, ImageIcon } from "lucide-react"
import { KSUC_GATE_FRAMING_POSITION, KSUC_GATE_IMAGE_URL } from "../../lib/ksucGateImage"

const CSA_DATA = {
  title: "Catholic Students Association (CSA)",
  subtitle: "Faith · Studies · Service",
  description:
    "The Catholic Students Association walks with students in Mosoriot and beyond—especially those at Koitaleel Samoei University College (KSUC). CSA is the parish home for Catholic students: prayer, formation, and friendship so that study and life serve God and neighbour.",
  activities: [
    "Student fellowship and prayer at the parish",
    "Faith formation for university and college students",
    "Walking with KSUC students—our neighbours in learning",
    "Academic encouragement and moral support",
    "Mentorship and outreach to students in need",
    "Linking campus life with parish life in Mosoriot",
  ],
}

const KSUC_GATE = {
  src: KSUC_GATE_IMAGE_URL,
  alt: "Main entrance gate of Koitaleel Samoei University College, Mosoriot",
  caption:
    "Koitaleel Samoei University College (KSUC) — many CSA members study and serve here, then pray with us at St. Francis Cheptarit.",
}

const CSA_PHOTOS: { src: string; alt: string; caption?: string }[] = []

export function CsaPage() {
  return (
    <div>
      <section
        className="relative overflow-hidden py-20 px-4 text-white"
        style={{
          backgroundImage: `url('${KSUC_GATE.src}')`,
          backgroundPosition: KSUC_GATE_FRAMING_POSITION,
          backgroundSize: "cover",
        }}
      >
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(165deg, rgba(45, 55, 20, 0.52) 0%, rgba(45, 55, 20, 0.78) 28%, rgba(90, 70, 15, 0.86) 52%, rgba(58, 31, 19, 0.92) 100%)",
          }}
        />
        <div className="relative z-10 container mx-auto max-w-4xl">
          <Link to="/ministries" className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-green-100 hover:text-white">
            <ArrowLeft className="h-4 w-4" /> Back to Ministries
          </Link>
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-sm">
              <GraduationCap className="h-8 w-8 text-amber-200" aria-hidden />
            </div>
            <div>
              <h1 className="text-4xl font-bold md:text-5xl">{CSA_DATA.title}</h1>
              <p className="mt-1 text-lg font-medium text-green-200">{CSA_DATA.subtitle}</p>
            </div>
          </div>
          <div className="mb-5 h-1 w-20 rounded bg-yellow-400" />
          <p className="max-w-3xl leading-relaxed text-white/95">{CSA_DATA.description}</p>
        </div>
      </section>

      <section className="px-4 py-14">
        <div className="container mx-auto max-w-5xl">
          <div className="parish-glass-card mb-10 rounded-2xl p-6 md:p-8">
            <h2 className="mb-5 flex items-center gap-2 text-xl font-bold text-[#143d2c]">
              <Church className="h-6 w-6" aria-hidden /> KSUC &amp; St. Francis Cheptarit
            </h2>
            <div className="grid gap-6 md:grid-cols-2 md:items-start md:gap-8">
              <figure className="order-2 overflow-hidden rounded-xl shadow-md ring-1 ring-black/5 md:order-1">
                <img
                  src={KSUC_GATE.src}
                  alt={KSUC_GATE.alt}
                  className="aspect-[4/3] w-full object-cover"
                  style={{ objectPosition: KSUC_GATE_FRAMING_POSITION }}
                  loading="eager"
                />
                <figcaption className="border-t border-[#827717]/15 bg-white/60 px-4 py-3 text-xs leading-relaxed text-gray-700 sm:text-sm">
                  {KSUC_GATE.caption}
                </figcaption>
              </figure>
              <div className="order-1 space-y-3 md:order-2">
                <p className="text-sm leading-relaxed text-gray-700 md:text-base">
                  Koitaleel Samoei University College is part of life in Mosoriot, Nandi County—close to the people we serve. Many students and staff belong to our parish; others join us for Mass, reconciliation, and quiet prayer between classes and exams.
                </p>
                <p className="text-sm leading-relaxed text-gray-700 md:text-base">
                  CSA exists so faith is not left at the campus gate: we pray together, encourage one another in studies, and bring the Gospel into academic life. More photos and parish–campus updates will appear in this section as they are ready.
                </p>
              </div>
            </div>
          </div>

          <div className="mb-4 flex items-center gap-2">
            <ImageIcon className="h-5 w-5 text-[#827717]" aria-hidden />
            <h2 className="text-2xl font-bold text-[#143d2c]">CSA photos</h2>
          </div>
          <p className="mb-6 text-sm text-gray-600">Images for the Catholic Students Association. Additional photos will be added here.</p>

          {CSA_PHOTOS.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2">
              {CSA_PHOTOS.map((photo) => (
                <figure key={photo.src} className="parish-glass-card overflow-hidden rounded-2xl shadow-md">
                  <img src={photo.src} alt={photo.alt} className="aspect-[4/3] w-full object-cover object-center" loading="eager" />
                  {photo.caption ? (
                    <figcaption className="border-t border-[#827717]/15 p-4 text-xs leading-relaxed text-gray-700 sm:text-sm">{photo.caption}</figcaption>
                  ) : null}
                </figure>
              ))}
            </div>
          ) : (
            <p className="rounded-xl border border-dashed border-[#827717]/25 bg-[#f9fbf3] px-4 py-8 text-center text-sm text-gray-600">
              The KSUC campus gate is shown above. Additional CSA photos will be added here as they are ready.
            </p>
          )}
        </div>
      </section>

      <section className="border-t border-[#e8ddd4] px-4 py-12" style={{ background: "linear-gradient(180deg, rgba(249, 251, 231, 0.5) 0%, transparent 100%)" }}>
        <div className="container mx-auto max-w-3xl">
          <h3 className="mb-4 text-center font-serif text-xl font-bold text-[#143d2c]">Activities</h3>
          <ul className="space-y-2">
            {CSA_DATA.activities.map((a) => (
              <li key={a} className="flex items-start gap-2 text-sm text-gray-700">
                <span className="mt-1.5 text-[#827717]">&#8226;</span>
                <span>{a}</span>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-center text-sm text-gray-500">Meets: Sundays after Mass · Contact the Parish Office</p>
        </div>
      </section>
    </div>
  )
}
