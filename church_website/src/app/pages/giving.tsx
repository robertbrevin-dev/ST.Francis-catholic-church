import { Smartphone, Heart, ArrowRight, Phone, Church, Hammer, Handshake, BookOpen, Star, Music, Globe, Hospital, Clipboard, Check, CreditCard, Gift, Home } from "lucide-react";
import { Link } from "react-router";

const CHURCH_PHONE = "+254 700 000 000";
const WHATSAPP_NUMBER = "254700000000";

const GIVING_PURPOSES = [
  { icon:<Church className="h-10 w-10 mx-auto mb-3 text-green-700" />, title:"Parish Operations (Sadaka)", desc:"Weekly offertory supporting the daily running of the parish — utilities, staff, and maintenance." },
  { icon:<Hammer className="h-10 w-10 mx-auto mb-3 text-green-700" />, title:"Building & Development Fund", desc:"Contributions for church construction, renovations, and facility improvements across the parish." },
  { icon:<Handshake className="h-10 w-10 mx-auto mb-3 text-green-700" />, title:"Outreach & Charity (Harambee)", desc:"Support the St. Vincent de Paul Society and other parish initiatives for the poor and vulnerable." },
  { icon:<BookOpen className="h-10 w-10 mx-auto mb-3 text-green-700" />, title:"Religious Education", desc:"Fund catechism materials, teacher training, and faith formation programmes for children and adults." },
  { icon:<Star className="h-10 w-10 mx-auto mb-3 text-green-700" />, title:"Youth Ministry Fund", desc:"Support youth retreats, activities, mentorship programmes, and CSA/Youth group operations." },
  { icon:<Music className="h-10 w-10 mx-auto mb-3 text-green-700" />, title:"Liturgy & Music Ministry", desc:"Support the choir, altar supplies, liturgical vestments, and music equipment for worship." },
  { icon:<Globe className="h-10 w-10 mx-auto mb-3 text-green-700" />, title:"Mission & Evangelisation (PMC)", desc:"Fund outreach missions, home visits, evangelisation campaigns, and missionary activities." },
  { icon:<Hospital className="h-10 w-10 mx-auto mb-3 text-green-700" />, title:"Sick & Bereaved Support", desc:"Support for parishioners facing medical hardship, bereavement, or other emergencies." },
];

export function Giving() {
  return (
    <div>
      <section className="py-20 px-4 text-white" style={{ background: "linear-gradient(135deg, #0d3320 0%, #1b6b35 100%)" }}>
        <div className="container mx-auto max-w-4xl text-center">
          <Heart className="h-14 w-14 mx-auto mb-4 text-red-400" />
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Give / Sadaka</h1>
          <div className="w-20 h-1 bg-yellow-400 mx-auto mb-4 rounded"></div>
          <p className="text-green-200 text-lg max-w-xl mx-auto">
            "Each of you should give what you have decided in your heart to give, not reluctantly or under compulsion, 
            for God loves a cheerful giver." — 2 Corinthians 9:7
          </p>
        </div>
      </section>

      {/* M-PESA Hero */}
      <section className="py-16 px-4" style={{ background: "linear-gradient(135deg, #f0faf2, #eaf7ee)" }}>
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-10">
            <p className="text-green-600 font-semibold text-sm uppercase tracking-wider mb-2">Easiest Way to Give</p>
            <h2 className="text-3xl font-bold text-green-900 mb-3">M-PESA Paybill — Sadaka Online</h2>
            <div className="section-divider"></div>
          </div>

          <div className="grid md:grid-cols-2 gap-8 items-start">
            {/* Paybill Details */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-green-100">
              <div className="p-5 text-white" style={{ background: "linear-gradient(135deg, #1b6b35, #2d8a48)" }}>
                <div className="flex items-center gap-3 mb-1">
                  <Smartphone className="h-6 w-6 text-yellow-300" />
                  <h3 className="font-bold text-lg">M-PESA Paybill Details</h3>
                </div>
                <p className="text-green-200 text-sm">Send from any Safaricom M-PESA line</p>
              </div>
              <div className="p-6 space-y-4">
                {[
                  { step:"Step 1", instruction:"Open M-PESA on your phone", detail:"Go to Lipa na M-PESA → Pay Bill" },
                  { step:"Step 2", instruction:"Enter Business Number", detail:"247247", highlight:true },
                  { step:"Step 3", instruction:"Enter Account Number", detail:"341370", highlight:true },
                  { step:"Step 4", instruction:"Enter Amount", detail:"Any amount you wish to give" },
                  { step:"Step 5", instruction:"Enter M-PESA PIN & Confirm", detail:"You will receive an SMS confirmation" },
                ].map((s,i) => (
                  <div key={i} className={`flex items-start gap-3 p-3 rounded-xl ${s.highlight ? "bg-yellow-50 border border-yellow-200" : "bg-green-50 border border-green-100"}`}>
                    <span className="text-xs font-bold text-green-600 bg-green-100 px-2 py-0.5 rounded-full flex-shrink-0 mt-0.5">{s.step}</span>
                    <div>
                      <p className="text-sm font-semibold text-gray-800">{s.instruction}</p>
                      <p className={`text-sm mt-0.5 ${s.highlight ? "text-yellow-700 font-bold text-xl tracking-widest" : "text-gray-500"}`}>{s.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Visual Summary */}
            <div className="space-y-4">
              <div className="rounded-2xl p-8 text-white text-center shadow-lg" style={{ background: "linear-gradient(135deg, #c8a84b, #e8c96a)" }}>
                <p className="text-green-950 text-sm font-semibold mb-1">M-PESA PAYBILL NUMBER</p>
                <p className="text-green-950 text-5xl font-black tracking-widest mb-4">247247</p>
                <div className="w-full h-0.5 bg-green-900/20 mb-4"></div>
                <p className="text-green-950 text-sm font-semibold mb-1">ACCOUNT NUMBER</p>
                <p className="text-green-950 text-4xl font-black tracking-widest">341370</p>
              </div>

              <div className="bg-white rounded-2xl p-5 border border-green-100 shadow-sm">
                <h4 className="font-bold text-green-900 mb-3"><Clipboard className="h-5 w-5 inline-block mr-2" /> Tips for Giving</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start gap-2"><Check className="h-4 w-4 text-green-500 mt-0.5" /> Use your name as reference in M-PESA confirmation</li>
                  <li className="flex items-start gap-2"><Check className="h-4 w-4 text-green-500 mt-0.5" /> Keep your M-PESA confirmation SMS as your receipt</li>
                  <li className="flex items-start gap-2"><Check className="h-4 w-4 text-green-500 mt-0.5" /> Regular weekly giving supports parish operations</li>
                  <li className="flex items-start gap-2"><Check className="h-4 w-4 text-green-500 mt-0.5" /> Special collections are announced from the pulpit</li>
                  <li className="flex items-start gap-2"><Check className="h-4 w-4 text-green-500 mt-0.5" /> All contributions are recorded and accounted for</li>
                </ul>
              </div>

              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}?text=Hello%2C%20I%20have%20made%20a%20contribution%20via%20M-PESA%20Paybill%20247247.%20Kindly%20acknowledge.`}
                target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full bg-green-500 hover:bg-green-400 text-white font-bold px-6 py-4 rounded-xl transition-all shadow-md"
              >
                <svg viewBox="0 0 24 24" fill="white" width="20" height="20"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                Confirm Contribution on WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Ways to Give */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-green-900 mb-3">Other Ways to Give</h2>
            <div className="section-divider"></div>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon:<Gift className="h-10 w-10 mx-auto mb-3 text-green-700" />, title:"Sunday Collection", desc:"Place your offering in the collection basket during Mass. Envelopes are available at the entrance for designated giving.", note:"Cash or envelope" },
              { icon:<Home className="h-10 w-10 mx-auto mb-3 text-green-700" />, title:"Parish Office", desc:"Visit the Parish Office to make your contribution in person or drop off a sealed envelope during office hours.", note:"Mon–Sat during office hours" },
              { icon:<CreditCard className="h-10 w-10 mx-auto mb-3 text-green-700" />, title:"Bank Transfer", desc:"Contact the Parish Office for bank account details for larger contributions or regular standing order donations.", note:"Contact office for details" },
            ].map((w,i) => (
              <div key={i} className="bg-green-50 rounded-2xl p-6 border border-green-100 hover:shadow-md transition-all">
                <span className="text-4xl mb-3 block">{w.icon}</span>
                <h3 className="font-bold text-green-900 text-lg mb-2">{w.title}</h3>
                <p className="text-gray-600 text-sm mb-3">{w.desc}</p>
                <span className="text-xs bg-green-200 text-green-800 px-3 py-1 rounded-full font-medium">{w.note}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What Your Gift Supports */}
      <section className="py-16 px-4" style={{ background: "#f0faf2" }}>
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-green-900 mb-3">What Your Gift Supports</h2>
            <div className="section-divider"></div>
            <p className="text-gray-500 mt-4">Every contribution — big or small — makes a real difference</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {GIVING_PURPOSES.map((p,i) => (
              <div key={i} className="bg-white rounded-2xl p-5 shadow-sm border border-green-100 hover:shadow-md transition-all text-center ministry-card">
                <span className="text-3xl block mb-2">{p.icon}</span>
                <h3 className="font-bold text-green-900 text-sm mb-1">{p.title}</h3>
                <p className="text-gray-500 text-xs leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 text-white" style={{ background: "linear-gradient(135deg, #0d3320, #1b6b35)" }}>
        <div className="container mx-auto max-w-3xl text-center">
          <Heart className="h-12 w-12 mx-auto mb-4 text-red-400" />
          <h2 className="text-3xl font-bold mb-4">Thank You for Your Generosity</h2>
          <p className="text-green-200 mb-8 leading-relaxed">
            Your gifts enable us to celebrate the Sacraments, serve our community, educate our children in faith, 
            and reach out to those in need. May God reward your generosity abundantly.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href={`tel:${CHURCH_PHONE.replace(/\s/g,"")}`} className="inline-flex items-center justify-center gap-2 bg-yellow-500 hover:bg-yellow-400 text-green-950 font-bold px-8 py-4 rounded-full transition-all shadow-lg">
              <Phone className="h-5 w-5" /> {CHURCH_PHONE}
            </a>
            <Link to="/contact" className="inline-flex items-center justify-center gap-2 border-2 border-white text-white font-semibold px-8 py-4 rounded-full hover:bg-white hover:text-green-900 transition-all">
              Contact Us <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
