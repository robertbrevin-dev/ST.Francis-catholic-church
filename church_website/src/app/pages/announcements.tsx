import { useState } from "react";
import { Bell, Send, Calendar, Pin, MessageSquare, ThumbsUp, Share2, ChevronRight } from "lucide-react";
import { Link } from "react-router";

const PINNED_ANNOUNCEMENTS = [
  { id:1, title:"Welcome to St. Francis Cheptarit Catholic Parish", content:"We warmly welcome all parishioners, visitors, and those seeking to know our faith community. Mass times, events, and ministry information are available throughout this website. God bless you.", date:"Parish Office", category:"General", color:"#1b6b35", pinned:true },
  { id:2, title:"Sadaka / Contributions — M-PESA Paybill", content:"You can now make your parish contributions conveniently via M-PESA. Paybill: 247247 | Account Number: 341370. All contributions go towards parish operations, outreach, and development. Thank you for your generosity.", date:"Parish Finance Office", category:"Finance", color:"#c8a84b", pinned:true },
];

const ANNOUNCEMENTS = [
  { id:3, title:"Sunday Mass Schedule", content:"Sunday Masses are held at 7:00 AM and 9:00 AM every week. All parishioners are encouraged to attend and participate fully in the Eucharistic celebration.", date:"Every Week", category:"Mass", color:"#2d8a48" },
  { id:4, title:"Confession / Reconciliation", content:"The Sacrament of Reconciliation is available every Saturday from 4:00 PM to 5:30 PM and before Sunday Masses. Please make time to avail yourself of this beautiful sacrament.", date:"Every Saturday", category:"Sacraments", color:"#6a1b9a" },
  { id:5, title:"Parish Announcement — To Be Updated", content:"This section will be updated with current parish announcements. Contact the Parish Office to submit an announcement for inclusion on this page.", date:"Parish Office", category:"General", color:"#1565c0" },
  { id:6, title:"Small Christian Community (SCC) Meetings", content:"Each SCC meets weekly in homes throughout the Cheptarit and Mosoriot area for Scripture reflection, prayer, and fellowship. Contact the parish office to be linked to one near you.", date:"Weekly", category:"Community", color:"#00695c" },
];

const CATEGORIES = ["All","General","Mass","Sacraments","Finance","Community","Events"];

type Message = { id:number; name:string; message:string; time:string; avatar:string; };
const INITIAL_MESSAGES: Message[] = [
  { id:1, name:"Parish Secretary", message:"Welcome to the St. Francis Cheptarit Parish interactive board! You can leave prayer requests, questions, or messages here. God bless you.", time:"Today", avatar:"PS" },
];

export function Announcements() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [likes, setLikes] = useState<Record<number,number>>({});
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [newMessage, setNewMessage] = useState({ name:"", message:"" });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleLike = (id:number) => setLikes(prev => ({ ...prev, [id]:(prev[id]||0)+1 }));

  const handleSend = () => {
    if (!newMessage.name.trim() || !newMessage.message.trim()) return;
    setSending(true);
    setTimeout(() => {
      setMessages(prev => [...prev, { id:Date.now(), name:newMessage.name, message:newMessage.message, time:"Just now", avatar:newMessage.name.slice(0,2).toUpperCase() }]);
      setNewMessage({ name:"", message:"" });
      setSending(false); setSent(true);
      setTimeout(() => setSent(false), 3000);
    }, 800);
  };

  const filtered = activeCategory === "All" ? ANNOUNCEMENTS : ANNOUNCEMENTS.filter(a => a.category === activeCategory);

  return (
    <div>
      <section className="py-20 px-4 text-white relative overflow-hidden" style={{ background: "linear-gradient(135deg, #0d3320 0%, #1b6b35 100%)" }}>
        <div className="container mx-auto max-w-4xl text-center relative z-10">
          <div className="flex justify-center mb-4">
            <div className="live-badge text-base px-5 py-2 flex items-center gap-2">
              <Bell className="h-4 w-4" />
              <span className="live-dot w-2 h-2 rounded-full bg-white inline-block"></span>
              ANNOUNCEMENTS
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Parish Announcements</h1>
          <div className="w-20 h-1 bg-yellow-400 mx-auto mb-4 rounded"></div>
          <p className="text-green-200 text-lg max-w-xl mx-auto">Stay up to date with everything happening at St. Francis Cheptarit Catholic Parish</p>
        </div>
      </section>

      {/* Pinned */}
      <section className="py-10 px-4 bg-white">
        <div className="container mx-auto max-w-5xl">
          <div className="flex items-center gap-2 mb-6">
            <Pin className="h-5 w-5 text-red-500" />
            <h2 className="text-xl font-bold text-green-900">Pinned Notices</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-5">
            {PINNED_ANNOUNCEMENTS.map(a => (
              <div key={a.id} className="rounded-2xl p-6 text-white shadow-lg relative overflow-hidden" style={{ background: `linear-gradient(135deg, ${a.color}, ${a.color}cc)` }}>
                <div className="absolute top-3 right-3"><Pin className="h-4 w-4 text-white/70" /></div>
                <div className="inline-block bg-white/20 text-white text-xs font-semibold px-3 py-1 rounded-full mb-3">{a.category}</div>
                <h3 className="font-bold text-lg mb-3">{a.title}</h3>
                <p className="text-white/85 text-sm leading-relaxed">{a.content}</p>
                <p className="text-white/60 text-xs mt-4">— {a.date}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Latest Announcements */}
      <section className="py-10 px-4" style={{ background:"#f0faf2" }}>
        <div className="container mx-auto max-w-5xl">
          <div className="flex items-center gap-2 mb-6">
            <Bell className="h-5 w-5 text-green-600" />
            <h2 className="text-xl font-bold text-green-900">Latest Announcements</h2>
          </div>
          <div className="flex flex-wrap gap-2 mb-6">
            {CATEGORIES.map(cat => (
              <button key={cat} onClick={() => setActiveCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${activeCategory===cat?"text-white shadow-md":"bg-white text-gray-600 hover:bg-green-50"}`}
                style={activeCategory===cat?{background:"#1b6b35"}:{}}>
                {cat}
              </button>
            ))}
          </div>
          <div className="space-y-4">
            {filtered.map(a => (
              <div key={a.id} className="bg-white rounded-2xl shadow-sm p-6 border border-green-100 hover:shadow-md transition-all">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <span className="text-xs font-semibold px-3 py-1 rounded-full text-white" style={{background:a.color}}>{a.category}</span>
                  <div className="flex items-center gap-2 text-xs text-gray-400"><Calendar className="h-3.5 w-3.5"/>{a.date}</div>
                </div>
                <h3 className="font-bold text-green-900 text-lg mb-2">{a.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{a.content}</p>
                <div className="flex items-center gap-4 mt-4 pt-3 border-t border-gray-100">
                  <button onClick={() => handleLike(a.id)} className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-green-600 transition-colors">
                    <ThumbsUp className="h-4 w-4"/><span>Amen {(likes[a.id]||0)>0?`(${likes[a.id]})`:""}</span>
                  </button>
                  <button onClick={() => navigator.share?.({title:a.title,text:a.content})} className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-green-600 transition-colors">
                    <Share2 className="h-4 w-4"/>Share
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Message Board */}
      <section className="py-12 px-4 bg-white">
        <div className="container mx-auto max-w-4xl">
          <div className="flex items-center gap-2 mb-2">
            <MessageSquare className="h-5 w-5 text-green-600"/>
            <h2 className="text-xl font-bold text-green-900">Parish Message Board</h2>
            <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full">Interactive</span>
          </div>
          <p className="text-gray-500 text-sm mb-6">Leave a prayer request, a message of encouragement, or a question for the parish.</p>
          <div className="space-y-4 mb-6 max-h-96 overflow-y-auto pr-2">
            {messages.map(msg => (
              <div key={msg.id} className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0" style={{background:"#1b6b35"}}>{msg.avatar}</div>
                <div className="flex-1 bg-green-50 rounded-2xl rounded-tl-none px-4 py-3 border border-green-100">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-sm text-green-900">{msg.name}</span>
                    <span className="text-xs text-gray-400">{msg.time}</span>
                  </div>
                  <p className="text-gray-700 text-sm leading-relaxed">{msg.message}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="border border-green-200 rounded-2xl p-5 bg-green-50">
            <h3 className="font-semibold text-green-900 mb-4 text-sm">Send a Message</h3>
            {sent && <div className="bg-green-100 border border-green-300 rounded-xl p-3 mb-3 text-green-800 text-sm flex items-center gap-2"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4"><polyline points="20 6 9 17 4 12"/></svg> Message sent! God bless you.</div>}
            <div className="space-y-3">
              <input type="text" placeholder="Your name" value={newMessage.name} onChange={e=>setNewMessage(p=>({...p,name:e.target.value}))}
                className="w-full px-4 py-2.5 rounded-xl border border-green-200 bg-white text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition-all"/>
              <textarea placeholder="Write your message, prayer request, or question..." value={newMessage.message} onChange={e=>setNewMessage(p=>({...p,message:e.target.value}))} rows={3}
                className="w-full px-4 py-2.5 rounded-xl border border-green-200 bg-white text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition-all resize-none"/>
              <div className="flex items-center justify-between">
                <p className="text-xs text-gray-400">Be respectful and kind in your messages.</p>
                <button onClick={handleSend} disabled={sending||!newMessage.name.trim()||!newMessage.message.trim()}
                  className="flex items-center gap-2 text-white font-semibold px-6 py-2.5 rounded-full text-sm transition-all disabled:opacity-50"
                  style={{background:"linear-gradient(135deg, #1b6b35, #2d8a48)"}}>
                  {sending?"Sending...":<><Send className="h-4 w-4"/>Send</>}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
