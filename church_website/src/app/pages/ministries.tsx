import { Phone, Users, Music, BookOpen, Heart, Cross, Mic2, GraduationCap, Home, HandHeart, Church } from "lucide-react";

const CHURCH_PHONE = "+254 700 000 000";

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

const MINISTRIES = [
  { id:"cma", Icon: MenIcon, title:"Catholic Men Association (CMA)", subtitle:"Faith · Brotherhood · Leadership", description:"The Catholic Men Association brings together men of the parish to deepen their faith, support one another in Christian brotherhood, and serve the community with integrity.", activities:["Monthly meetings and prayers","Family life seminars","Community service projects","Annual retreats and recollections","Support for parish development"], meets:"Monthly – as announced", contact:"Speak to the Parish Priest", color:"#7c4c2e", bg:"#eaf7ee" },
  { id:"cwa", Icon: WomenIcon, title:"Catholic Women Association (CWA)", subtitle:"Faith · Service · Solidarity", description:"The Catholic Women Association unites women of the parish in faith, prayer, and service. CWA members support one another, engage in charitable activities, and mentor young women.", activities:["Weekly prayer and fellowship","Charitable works and fundraising","Mentoring young women","Hospital and home visits","Annual women's day celebrations"], meets:"Every 2nd Saturday at 10:00 AM", contact:"Contact the Parish Office", color:"#880e4f", bg:"#fce4ec" },
  { id:"youth", Icon: Users, title:"Youth Ministry", subtitle:"Faith · Fun · Future", description:"Our Youth Ministry gathers young people from the parish to grow together in Catholic faith, fellowship and service. The youth are the future of the Church.", activities:["Weekly youth meetings","Faith formation & catechesis","Sports and recreational activities","Youth camps and retreats","Community service and charity"], meets:"Every Saturday at 3:00 PM", contact:"Contact the Parish Priest", color:"#e65100", bg:"#fff3e0" },
  { id:"pmc", Icon: DoveIcon, title:"Parish Missionary Council (PMC)", subtitle:"Evangelization · Outreach · Mission", description:"The Parish Missionary Council coordinates missionary activities and evangelization efforts within and beyond the parish. PMC members are passionate about spreading the Good News.", activities:["Parish evangelization programs","Coordination of outreach missions","Support for missionary activities","Home visits and pastoral care","Supporting the Diocese of Kapsabet mission"], meets:"First Sunday of the month", contact:"Contact the Parish Priest", color:"#1565c0", bg:"#e3f2fd" },
  { id:"choir", Icon: Music, title:"Choir Ministry", subtitle:"Praise · Worship · Music", description:"Our dedicated choir ministers use their musical gifts to glorify God and enhance the celebration of the Eucharist and other sacraments at all Sunday Masses.", activities:["Rehearsals every Thursday","Sunday Mass worship","Special occasion performances","Liturgical music training","Annual choir festivals"], meets:"Thursday 6:00 PM (Rehearsals)", contact:"Speak to Choir Master", color:"#00695c", bg:"#e0f2f1" },
  { id:"csa", Icon: GraduationCap, title:"Catholic Students Association (CSA)", subtitle:"Faith · Studies · Service", description:"The Catholic Students Association serves students within and around the parish, providing a nurturing environment to grow in Catholic faith and support each other academically and morally.", activities:["Student fellowship and prayer","Faith formation sessions","Academic encouragement and support","Mentorship programs","Outreach to students in need"], meets:"Sundays after Mass", contact:"Contact the Parish Office", color:"#827717", bg:"#f9fbe7" },
  { id:"catechism", Icon: BookOpen, title:"Catechism / CRE Classes", subtitle:"Formation · Sacraments · Faith", description:"Religious education and catechism classes prepare children and adults for the Sacraments of Initiation — Baptism, First Holy Communion, and Confirmation.", activities:["Sunday catechism for children","Adult faith formation","Sacramental preparation","Prayer and Scripture study","Annual catechism day celebration"], meets:"Sundays 9:00 AM", contact:"Contact Parish Catechists", color:"#4a148c", bg:"#f3e5f5" },
  { id:"altar-servers", Icon: AltarIcon, title:"Altar Servers", subtitle:"Service · Reverence · Dedication", description:"Altar servers assist the priest during the celebration of Mass and other liturgical functions. This ministry forms young people in a spirit of service and reverence.", activities:["Serving at all Masses","Training for new servers (age 10+)","Altar servers' retreats","Annual altar servers' day"], meets:"As scheduled for Masses", contact:"Speak to the Parish Priest", color:"#bf360c", bg:"#fbe9e7" },
  { id:"scc", Icon: CommunityIcon, title:"Small Christian Communities (SCCs)", subtitle:"Prayer · Sharing · Community", description:"The parish is organised into Small Christian Communities that meet in homes throughout the area, providing grassroots faith sharing, prayer, and community support.", activities:["Weekly Scripture reflection","Communal prayer and sharing","Support for members in need","Reporting to the parish council","Participating in parish events"], meets:"Weekly in homes", contact:"Contact the Parish Office", color:"#2e7d32", bg:"#e8f5e9" },
  { id:"eucharistic", Icon: CrossSVG, title:"Eucharistic Ministers", subtitle:"Service · Communion · Care", description:"Extraordinary Ministers of Holy Communion assist in distributing Communion during Mass and to the sick and homebound. This ministry requires commissioning.", activities:["Distribute Holy Communion at Mass","Bring Communion to the sick","Spiritual formation and training"], meets:"As scheduled", contact:"Contact the Parish Priest", color:"#7c4c2e", bg:"#eaf7ee" },
  { id:"lectors", Icon: BookOpen, title:"Lectors Ministry", subtitle:"Word · Proclamation · Service", description:"Lectors proclaim the Word of God during Mass from the Scriptures. Open to all parishioners willing to be trained and commit to serving at Mass.", activities:["Read Scripture at Mass","Training and formation","Ministry scheduling"], meets:"As scheduled", contact:"Contact the Parish Office", color:"#4a148c", bg:"#f3e5f5" },
  { id:"svdp", Icon: HandHeart, title:"St. Vincent de Paul Society", subtitle:"Charity · Service · Compassion", description:"The St. Vincent de Paul Society serves people in need in our community, offering material and moral support through home visits, food assistance, and help for the vulnerable.", activities:["Home visits to the poor","Food and material assistance","Hospital visitation","Monthly meetings and charity drives"], meets:"Monthly – as announced", contact:"Contact the Parish Office", color:"#1565c0", bg:"#e3f2fd" },
];

export function Ministries() {
  return (
    <div>
      <section className="py-20 px-4 text-white relative overflow-hidden" style={{ background: "linear-gradient(135deg, #3a1f13 0%, #7c4c2e 100%)" }}>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-72 h-72 rounded-full border-4 border-yellow-400 -translate-y-1/2 translate-x-1/4"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full border-4 border-white -translate-x-1/4 translate-y-1/2"></div>
        </div>
        <div className="container mx-auto max-w-4xl text-center relative z-10">
          <div className="flex justify-center mb-4">
            <svg viewBox="0 0 24 24" fill="none" stroke="#fbbf24" strokeWidth="1.5" className="h-14 w-14">
              <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" strokeLinecap="round"/>
              <circle cx="9" cy="7" r="4" strokeLinecap="round"/>
              <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" strokeLinecap="round"/>
            </svg>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">Ministries &amp; Groups</h1>
          <div className="w-20 h-1 bg-yellow-400 mx-auto mb-4 rounded"></div>
          <p className="text-xl text-green-200 max-w-2xl mx-auto">Find your place to serve, grow, and belong in the St. Francis Cheptarit Parish community</p>
        </div>
      </section>

      <section className="py-12 px-4 bg-white">
        <div className="container mx-auto max-w-4xl text-center">
          <p className="text-gray-600 leading-relaxed text-lg">
            At St. Francis Cheptarit, we believe every person has unique gifts to offer. Our ministries and groups provide opportunities to grow in faith, serve God, and build meaningful relationships within our parish and the wider Mosoriot community.
          </p>
        </div>
      </section>

      <section className="py-12 px-4" style={{ background: "#f8efe2" }}>
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {MINISTRIES.map((m) => {
              const { Icon } = m;
              return (
                <div key={m.id} className="ministry-card bg-white rounded-2xl shadow-md overflow-hidden border border-green-100">
                  <div className="p-5 text-white flex items-center gap-3" style={{ background: `linear-gradient(135deg, ${m.color}, ${m.color}cc)` }}>
                    <div className="opacity-90"><Icon /></div>
                    <div>
                      <h3 className="font-bold text-lg leading-tight">{m.title}</h3>
                      <p className="text-white/75 text-xs mt-0.5">{m.subtitle}</p>
                    </div>
                  </div>
                  <div className="p-5 space-y-4">
                    <p className="text-gray-600 text-sm leading-relaxed">{m.description}</p>
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
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-16 px-4 text-white" style={{ background: "linear-gradient(135deg, #3a1f13, #7c4c2e)" }}>
        <div className="container mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold mb-4">Want to Get Involved?</h2>
          <p className="text-green-200 mb-8 leading-relaxed">Speak to the Parish Priest, contact the parish office, or approach any ministry coordinator after Mass. You are always welcome.</p>
          <a href={`tel:${CHURCH_PHONE.replace(/\s/g,"")}`} className="inline-flex items-center justify-center gap-2 bg-yellow-500 hover:bg-yellow-400 text-green-950 font-bold px-8 py-4 rounded-full transition-all shadow-lg">
            <Phone className="h-5 w-5" /> Call: {CHURCH_PHONE}
          </a>
        </div>
      </section>
    </div>
  );
}
