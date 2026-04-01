import { useState } from "react";
import { Calendar, Clock, MapPin, BookOpen, Users, Music, GraduationCap, Star, Heart, Bell, ChevronRight } from "lucide-react";

const CrossIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="h-5 w-5"><path d="M12 2v20M2 12h20"/></svg>;
const ChurchIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><path d="M4 22V10l8-6 8 6v12H4z"/><rect x="9" y="14" width="6" height="8"/></svg>;

const EVENTS = [
  { id:1, Icon:ChurchIcon, title:"Sunday Mass", date:"Every Sunday", time:"7:00 AM & 9:00 AM", location:"Main Church", category:"Mass", color:"#1b6b35" },
  { id:2, Icon:ChurchIcon, title:"Weekday Mass", date:"Monday – Friday", time:"6:30 AM", location:"Main Church", category:"Mass", color:"#2d8a48" },
  { id:3, Icon:CrossIcon, title:"Confessions / Reconciliation", date:"Every Saturday", time:"4:00 PM – 5:30 PM", location:"Confession Room", category:"Sacrament", color:"#6a1b9a" },
  { id:4, Icon:BookOpen, title:"Bible Study / Scripture Sharing", date:"Every Wednesday", time:"6:00 PM", location:"Parish Hall", category:"Formation", color:"#1565c0" },
  { id:5, Icon:Users, title:"CMA Monthly Meeting", date:"Monthly – as announced", time:"TBA", location:"Parish Hall", category:"Ministry", color:"#1b6b35" },
  { id:6, Icon:Heart, title:"CWA Meeting", date:"2nd Saturday of the Month", time:"10:00 AM", location:"Parish Hall", category:"Ministry", color:"#880e4f" },
  { id:7, Icon:Users, title:"Youth Ministry Meeting", date:"Every Saturday", time:"3:00 PM", location:"Youth Room", category:"Youth", color:"#e65100" },
  { id:8, Icon:CrossIcon, title:"PMC Meeting", date:"1st Sunday of the Month", time:"After Mass", location:"Parish Hall", category:"Ministry", color:"#1565c0" },
  { id:9, Icon:GraduationCap, title:"CSA Meeting", date:"Every Sunday", time:"After Main Mass", location:"Parish Hall", category:"Students", color:"#827717" },
  { id:10, Icon:BookOpen, title:"Children's Catechism Classes", date:"Every Sunday", time:"9:00 AM", location:"Catechism Rooms", category:"Formation", color:"#4a148c" },
  { id:11, Icon:Music, title:"Choir Rehearsal", date:"Every Thursday", time:"6:00 PM", location:"Church", category:"Ministry", color:"#00695c" },
  { id:12, Icon:Star, title:"Feast of St. Francis of Assisi", date:"4th October (Annual)", time:"Special Mass", location:"Main Church", category:"Feast Day", color:"#c8a84b" },
];
const CATEGORIES = ["All","Mass","Sacrament","Formation","Ministry","Youth","Students","Feast Day"];

export function Events() {
  const [active, setActive] = useState("All");
  const filtered = active === "All" ? EVENTS : EVENTS.filter(e => e.category === active);
  return (
    <div>
      <section className="py-20 px-4 text-white" style={{ background:"linear-gradient(135deg, #0d3320 0%, #1b6b35 100%)" }}>
        <div className="container mx-auto max-w-4xl text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-full bg-yellow-400/20 border-2 border-yellow-400 flex items-center justify-center">
              <Calendar className="h-8 w-8 text-yellow-300" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Parish Events &amp; Calendar</h1>
          <div className="w-20 h-1 bg-yellow-400 mx-auto mb-4 rounded"></div>
          <p className="text-green-200 text-lg">Stay connected with everything happening at St. Francis Cheptarit</p>
        </div>
      </section>
      <section className="py-12 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <p className="text-center text-gray-600 mb-8 text-lg">Regular events and activities at our parish. Check <a href="/announcements" className="text-green-600 underline font-medium">Announcements</a> for special events.</p>
          <div className="flex flex-wrap gap-2 mb-8 justify-center">
            {CATEGORIES.map(cat => (
              <button key={cat} onClick={() => setActive(cat)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${active===cat?"text-white shadow-md":"bg-gray-100 text-gray-600 hover:bg-green-50"}`}
                style={active===cat?{background:"#1b6b35"}:{}}>
                {cat}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map(event => {
              const { Icon } = event;
              return (
                <div key={event.id} className="ministry-card bg-white rounded-2xl shadow-md overflow-hidden border border-green-100">
                  <div className="p-4 text-white flex items-center gap-3" style={{ background:`linear-gradient(135deg, ${event.color}, ${event.color}cc)` }}>
                    <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0"><Icon /></div>
                    <div>
                      <span className="text-xs font-semibold bg-white/20 px-2 py-0.5 rounded-full">{event.category}</span>
                      <h3 className="font-bold text-base mt-1 leading-tight">{event.title}</h3>
                    </div>
                  </div>
                  <div className="p-4 space-y-2.5">
                    <div className="flex items-center gap-2 text-sm text-gray-600"><Calendar className="h-4 w-4 text-green-500 flex-shrink-0"/><span>{event.date}</span></div>
                    <div className="flex items-center gap-2 text-sm text-gray-600"><Clock className="h-4 w-4 text-green-500 flex-shrink-0"/><span>{event.time}</span></div>
                    <div className="flex items-center gap-2 text-sm text-gray-600"><MapPin className="h-4 w-4 text-green-500 flex-shrink-0"/><span>{event.location}</span></div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-10 bg-green-50 border border-green-200 rounded-2xl p-6 text-center">
            <p className="text-green-800 font-semibold mb-2 flex items-center justify-center gap-2"><Bell className="h-4 w-4"/>Special Events &amp; Announcements</p>
            <p className="text-green-700 text-sm mb-4">Special events, retreats, and diocesan activities will be announced from the pulpit and on the announcements board.</p>
            <a href="/announcements" className="inline-flex items-center gap-2 text-white font-semibold px-6 py-3 rounded-full" style={{background:"#1b6b35"}}>
              View Announcements <ChevronRight className="h-4 w-4"/>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
