import { Link } from "react-router";
import { Phone, Clock, Sun, Sunrise, Sparkles, Cross } from "lucide-react";

const CHURCH_PHONE = "+254 700 000 000";

export function MassTimes() {
  return (
    <div>
      <section className="py-20 px-4 text-white" style={{ background: "linear-gradient(135deg, #3a1f13 0%, #7c4c2e 100%)" }}>
        <div className="container mx-auto max-w-4xl text-center">
          <Clock className="h-14 w-14 mx-auto mb-4 text-white" />
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Mass Times</h1>
          <div className="w-20 h-1 bg-yellow-400 mx-auto mb-4 rounded"></div>
          <p className="text-green-200 text-lg">Join us to worship God through the Holy Eucharist</p>
        </div>
      </section>

      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-10">
            <p className="text-gray-600 leading-relaxed text-lg">
              The Holy Eucharist is the centre of our parish life. All are welcome to attend Mass at St. Francis Cheptarit Catholic Parish.
              Mass times may vary during special liturgical seasons — please check the announcements board for any changes.
            </p>
          </div>

          {/* Mass Schedule Cards */}
          <div className="space-y-6">
            {/* Sunday */}
            <div className="rounded-2xl overflow-hidden shadow-md border border-green-100">
              <div className="p-5 text-white flex items-center gap-3" style={{ background: "linear-gradient(135deg, #7c4c2e, #ae7c5f)" }}>
                <Sun className="h-10 w-10 text-green-200" />
                <div>
                  <h2 className="font-bold text-xl">Sunday Masses</h2>
                  <p className="text-green-200 text-sm">The Lord's Day — Principal Celebration</p>
                </div>
              </div>
              <div className="p-6 grid sm:grid-cols-2 gap-4">
                {[
                  { time: "7:00 AM", label: "Early Morning Mass", note: "For early risers and working parishioners" },
                  { time: "9:00 AM", label: "Main Sunday Mass", note: "Full parish celebration — choir & all ministries" },
                ].map((m, i) => (
                  <div key={i} className="bg-green-50 rounded-xl p-4 border border-green-100">
                    <p className="text-2xl font-bold text-green-800">{m.time}</p>
                    <p className="font-semibold text-green-700">{m.label}</p>
                    <p className="text-gray-500 text-sm mt-1">{m.note}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Weekday */}
            <div className="rounded-2xl overflow-hidden shadow-md border border-green-100">
              <div className="p-5 text-white flex items-center gap-3" style={{ background: "linear-gradient(135deg, #ae7c5f, #4caf50)" }}>
                <Sun className="h-10 w-10 text-white" />
                <div>
                  <h2 className="font-bold text-xl">Weekday Masses</h2>
                  <p className="text-green-100 text-sm">Monday through Friday</p>
                </div>
              </div>
              <div className="p-6">
                <div className="bg-green-50 rounded-xl p-4 border border-green-100 max-w-sm">
                  <p className="text-2xl font-bold text-green-800">6:30 AM</p>
                  <p className="font-semibold text-green-700">Morning Mass</p>
                  <p className="text-gray-500 text-sm mt-1">Monday through Friday — Parish Church</p>
                </div>
              </div>
            </div>

            {/* Saturday */}
            <div className="rounded-2xl overflow-hidden shadow-md border border-green-100">
              <div className="p-5 text-white flex items-center gap-3" style={{ background: "linear-gradient(135deg, #8d5439, #e6c7ad)" }}>
                <Sunrise className="h-10 w-10 text-yellow-200" />
                <div>
                  <h2 className="font-bold text-xl text-green-950">Saturday Mass</h2>
                  <p className="text-yellow-900 text-sm">Followed by Confessions in the afternoon</p>
                </div>
              </div>
              <div className="p-6 grid sm:grid-cols-2 gap-4">
                <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-100">
                  <p className="text-2xl font-bold text-yellow-800">7:00 AM</p>
                  <p className="font-semibold text-yellow-700">Saturday Morning Mass</p>
                  <p className="text-gray-500 text-sm mt-1">Parish Church</p>
                </div>
                <div className="bg-purple-50 rounded-xl p-4 border border-purple-100">
                  <p className="text-2xl font-bold text-purple-800">4:00 – 5:30 PM</p>
                  <p className="font-semibold text-purple-700">Confessions / Reconciliation</p>
                  <p className="text-gray-500 text-sm mt-1">Sacrament of Reconciliation available</p>
                </div>
              </div>
            </div>

            {/* Special Occasions */}
            <div className="rounded-2xl overflow-hidden shadow-md border border-green-100">
              <div className="p-5 text-white flex items-center gap-3" style={{ background: "linear-gradient(135deg, #6a1b9a, #9c27b0)" }}>
                <Sparkles className="h-10 w-10 text-purple-200" />
                <div>
                  <h2 className="font-bold text-xl">Special Celebrations</h2>
                  <p className="text-purple-200 text-sm">Holy Days of Obligation & Feast Days</p>
                </div>
              </div>
              <div className="p-6">
                <p className="text-gray-600 mb-4">
                  Special Masses are celebrated on Holy Days of Obligation and major feast days. 
                  Watch the announcements board for specific times and dates.
                </p>
                <div className="grid sm:grid-cols-2 gap-3">
                  {[
                    "Christmas Day — 25 December",
                    "Assumption of Mary — 15 August",
                    "All Saints Day — 1 November",
                    "Immaculate Conception — 8 December",
                    "Feast of St. Francis — 4 October",
                    "Easter Triduum — Good Friday to Easter Sunday",
                  ].map((day, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-gray-700 bg-purple-50 px-3 py-2 rounded-lg">
                      <Cross className="h-4 w-4 text-purple-500" /> {day}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Note */}
          <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-2xl p-6">
            <p className="text-yellow-800 font-semibold mb-2">📢 Important Notice</p>
            <p className="text-yellow-700 text-sm leading-relaxed">
              Mass times may change during Advent, Lent, Easter, and other special liturgical seasons. 
              Please check the parish announcements board, attend Sunday Mass for notices, or contact 
              the parish office for the most current schedule.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4" style={{ background: "linear-gradient(135deg, #3a1f13, #7c4c2e)" }}>
        <div className="container mx-auto max-w-3xl text-center text-white">
          <h2 className="text-2xl font-bold mb-3">Questions About Mass Times?</h2>
          <p className="text-green-200 mb-6">Contact the Parish Office or call us directly.</p>
          <a href={`tel:${CHURCH_PHONE.replace(/\s/g,"")}`} className="inline-flex items-center gap-2 bg-yellow-500 hover:bg-yellow-400 text-green-950 font-bold px-8 py-4 rounded-full transition-all shadow-lg">
            <Phone className="h-5 w-5" /> {CHURCH_PHONE}
          </a>
        </div>
      </section>
    </div>
  );
}
