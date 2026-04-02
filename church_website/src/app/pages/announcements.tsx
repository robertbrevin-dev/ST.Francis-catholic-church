import { useState, useEffect } from "react";
import { Bell, Send, Calendar, Pin, MessageSquare, ThumbsUp, Share2, ChevronRight } from "lucide-react";
import { Link } from "react-router";

const PINNED_ANNOUNCEMENTS: Announcement[] = [
  { id:1, title:"Welcome to St. Francis Cheptarit Catholic Parish", content:"We warmly welcome all parishioners, visitors, and those seeking to know our faith community. Mass times, events, and ministry information are available throughout this website. God bless you.", date:"Parish Office", category:"General", color:"#7c4c2e", pinned:true, author:"Parish Secretary", createdAt:new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString() },
  { id:2, title:"Sadaka / Contributions — M-PESA Paybill", content:"You can now make your parish contributions conveniently via M-PESA. Paybill: 247247 | Account Number: 341370. All contributions go towards parish operations, outreach, and development. Thank you for your generosity.", date:"Parish Finance Office", category:"Finance", color:"#c8a84b", pinned:true, author:"Finance Coordinator", createdAt:new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() },
];

let ANNOUNCEMENTS: Announcement[] = [
  { id:3, title:"Siku ya Jumatano Takatifu - Holy Wednesday: Pentesia for Children", content:"Watoto wetu watashiriki katika Pentesia takatifu siku ya Jumatano. All children are warmly invited to this sacred gathering. Hii ni fursa nzuri kwa watoto kutembelea Roho Mtakatifu. Parents - karibu kusambaza habar hii kwa familia zenu.", date:"Wednesday", category:"Events", color:"#7b68ee", author:"Parish Secretary", createdAt:new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() },
  
  { id:4, title:"Siku ya Alhamisi Takatifu - Holy Thursday Evening Mass", content:"Holy Thursday Mass ihongezwa na M.Y.M kuanzia saa kumi jioni (4:00 P.M) at St. Francis Cheptarit. Wanaume kumi na wawili wataoshwa miguu kama kumbukumbu ya huduma ya Kristo. This sacred Eucharist commemorates our Lord's Last Supper and His humble service. Karibu kushiriki!", date:"Thursday Evening - 4:00 PM", category:"Mass", color:"#d4af37", author:"Fr. Joseph", createdAt:new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() },
  
  { id:5, title:"Siku ya Ijumaa Kuu - Good Friday: Way of the Cross Procession", content:"Tutashiriki Njia ya Msalaba (Way of the Cross) kwa vikundi vitatu kuanzia saa nne asubuhi (10:00 A.M). Abiria zitakuwa:\n\nROUTE 1: Washiriki wa KAPTIEN + MOGOGET stations wataungana na wakristu kutoka: ST. MARIA FAUSTINA, ST. ANGELA, ST. CAMILA, ST. CLARA, ST. GETRUDE, ST. MICHAELS\n\nROUTE 2: NGECHEK STATION + LELBOINET - SCC from ST. FRANCIS CHEPTARIT joining: ST. GEORGE, ST. MARCELINE, ST. VERONICA, ST. MARK, ST. AMBROSE, ST. TERESA\n\nROUTE 3: KOKWET STATION - SCC from ST. FRANCIS CHEPTARIT joining ST. JUDES: ST. SCHOLASTICA, ST. MAGDALENE, ST. JOSEPH, ST. PADRE PIO, ST. AGATHA, ST. FRANCIS\n\nJumlah kuanzia saa nne asubuhi (10:00 A.M). Kumbuka Passion ya Kristo!", date:"Friday - 10:00 AM", category:"Events", color:"#8b0000", author:"Parish Office", createdAt:new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() },
  
  { id:6, title:"Usiku wa Pasaka - Easter Vigil: Holy Saturday Evening Mass", content:"Misa ya Kesha ya Pasaka (Easter Vigil) itaongozwa na Wanachoir saa tatu usiku (9:00 P.M) at St. Francis Cheptarit. Hii ni misa muhimu sana inayoikumbukia ufufuko wa Kristo. The choir will lead us in joyful celebration of Christ's Resurrection. Karibu nao!\n\nSt. Lawrence Tebeson: Misa itaanza saa tatu jioni (3:00 P.M) - Substation in Tebeson.", date:"Saturday Evening - 9:00 PM", category:"Mass", color:"#228b22", author:"Sr. Mary", createdAt:new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() },
  
  { id:7, title:"Holy Thursday Evening Reading - Johane 13:1-15", content:"Gospel Message (Ujumbe wa Injili): Yohane 13:1-15 - 'He loved them to the end' (Aliwapenda mpaka mwisho). On Holy Thursday, we meditate on Jesus Christ's ultimate act of service and love - washing the feet of His disciples. Tutafikiria sana juu ya huduma na upendo wa Kristo kwetu sote. This is at the heart of our faith and our call to serve one another.", date:"Holy Thursday", category:"Sacraments", color:"#6a1b9a", author:"Fr. Joseph", createdAt:new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() },
];

const CATEGORIES = ["All","General","Mass","Sacraments","Finance","Community","Events"];

const ADMIN_USERS = ["Fr. Joseph","Sr. Mary","Parish Secretary","Finance Coordinator","Pastoral Council Chair"];
const PUBLIC_USERS = 1100;

type Announcement = {
  id:number;
  title:string;
  content:string;
  date:string;
  category:string;
  color:string;
  pinned?:boolean;
  author?:string;
  createdAt:string;
};

type Message = { id:number; name:string; message:string; time:string; avatar:string; };
const INITIAL_MESSAGES: Message[] = [
  { id:1, name:"Parish Secretary", message:"Welcome to the St. Francis Cheptarit Parish interactive board! You can leave prayer requests, questions, or messages here. God bless you.", time:"Today", avatar:"PS" },
];

const ANNOUNCEMENT_EXPIRY_MS = 28 * 24 * 60 * 60 * 1000;

function isExpired(item: Announcement) {
  return Date.now() - new Date(item.createdAt).getTime() > ANNOUNCEMENT_EXPIRY_MS;
}

function daysUntilExpire(item: Announcement) {
  return Math.max(0, Math.ceil((ANNOUNCEMENT_EXPIRY_MS - (Date.now() - new Date(item.createdAt).getTime())) / (24 * 60 * 60 * 1000)));
}

export function Announcements() {
  const [currentUser, setCurrentUser] = useState(ADMIN_USERS[0]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [likes, setLikes] = useState<Record<number,number>>({});
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [newMessage, setNewMessage] = useState({ name:"", message:"" });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const [pinnedAnnouncements, setPinnedAnnouncements] = useState<Announcement[]>(PINNED_ANNOUNCEMENTS);
  const [announcements, setAnnouncements] = useState<Announcement[]>(ANNOUNCEMENTS);
  const [newAnnouncement, setNewAnnouncement] = useState({ title:"", content:"", category:"General", pinned:false });
  const [posting, setPosting] = useState(false);
  const [posted, setPosted] = useState(false);

  const isAdmin = ADMIN_USERS.includes(currentUser);

  const handleLike = (id:number) => setLikes(prev => ({ ...prev, [id]:(prev[id]||0)+1 }));

  useEffect(() => {
    const interval = setInterval(() => {
      setPinnedAnnouncements(prev => prev.filter(a => !isExpired(a)));
      setAnnouncements(prev => prev.filter(a => !isExpired(a)));
    }, 2 * 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const handlePublish = () => {
    if (!isAdmin || !newAnnouncement.title.trim() || !newAnnouncement.content.trim()) return;
    setPosting(true);

    setTimeout(() => {
      const item: Announcement = {
        id: Date.now(),
        title: newAnnouncement.title.trim(),
        content: newAnnouncement.content.trim(),
        date: new Date().toLocaleDateString(),
        category: newAnnouncement.category,
        color: newAnnouncement.pinned ? '#d9534f' : '#288a35',
        pinned: newAnnouncement.pinned,
        author: currentUser,
        createdAt: new Date().toISOString(),
      };

      if (newAnnouncement.pinned) {
        setPinnedAnnouncements(prev => [item, ...prev].filter(a => !isExpired(a)));
      } else {
        setAnnouncements(prev => [item, ...prev].filter(a => !isExpired(a)));
      }

      setNewAnnouncement({ title:'', content:'', category:'General', pinned:false });
      setPosting(false);
      setPosted(true);
      setTimeout(() => setPosted(false), 3000);
    }, 900);
  };

  const handleSend = () => {
    if (!newMessage.name.trim() || !newMessage.message.trim()) return;
    setSending(true);
    setTimeout(() => {
      setMessages(prev => [...prev, { id:Date.now(), name:newMessage.name, message:newMessage.message, time:'Just now', avatar:newMessage.name.slice(0,2).toUpperCase() }]);
      setNewMessage({ name:'', message:'' });
      setSending(false); setSent(true);
      setTimeout(() => setSent(false), 3000);
    }, 800);
  };

  const filtered = activeCategory === "All" ? announcements : announcements.filter(a => a.category === activeCategory);

  return (
    <div>
      <section className="py-20 px-4 text-white relative overflow-hidden" style={{ background: "linear-gradient(135deg, #3a1f13 0%, #7c4c2e 100%)" }}>
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
          <p className="text-green-100 text-sm mt-2">Visible to {PUBLIC_USERS.toLocaleString()} parish members and visitors.</p>
        </div>
      </section>

      <section className="py-8 px-4 bg-green-50 border-t border-b border-green-100">
        <div className="container mx-auto max-w-5xl">
          <div className="flex flex-wrap gap-3 items-center mb-4">
            <span className="text-sm font-semibold text-green-900">Current User:</span>
            <select value={currentUser} onChange={(e) => setCurrentUser(e.target.value)} className="rounded-lg border px-2 py-1 text-sm">
              {ADMIN_USERS.map((user) => <option key={user} value={user}>{user} (admin)</option>)}
              <option value="Guest">Guest</option>
            </select>
            <span className="text-xs text-green-700">{isAdmin ? 'Admin mode active (post announcements)' : 'Read-only guest mode'}</span>
          </div>

          <div className="grid gap-3 md:grid-cols-4 mb-3">
            <input className="md:col-span-2 border rounded-lg px-3 py-2" placeholder="Announcement title" value={newAnnouncement.title} onChange={(e) => setNewAnnouncement((p) => ({ ...p, title: e.target.value }))} disabled={!isAdmin} />
            <select className="border rounded-lg px-3 py-2" value={newAnnouncement.category} onChange={(e) => setNewAnnouncement((p) => ({ ...p, category: e.target.value }))} disabled={!isAdmin}>
              {CATEGORIES.filter((c) => c !== 'All').map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={newAnnouncement.pinned} onChange={(e) => setNewAnnouncement((p) => ({ ...p, pinned: e.target.checked }))} disabled={!isAdmin} /> Pin announcement</label>
          </div>
          <textarea className="w-full border rounded-lg px-3 py-2 mb-3" rows={3} placeholder="Announcement details" value={newAnnouncement.content} onChange={(e) => setNewAnnouncement((p) => ({ ...p, content: e.target.value }))} disabled={!isAdmin} />
          <div className="flex items-center gap-3">
            <button onClick={handlePublish} disabled={!isAdmin || posting || !newAnnouncement.title.trim() || !newAnnouncement.content.trim()} className="bg-green-700 text-white px-4 py-2 rounded-lg disabled:opacity-50">{posting ? 'Publishing...' : 'Publish announcement'}</button>
            {posted && <span className="text-sm text-green-800">Announcement posted — will auto-expire after 4 weeks.</span>}
          </div>
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
      <section className="py-10 px-4" style={{ background:"#f8efe2" }}>
        <div className="container mx-auto max-w-5xl">
          <div className="flex items-center gap-2 mb-6">
            <Bell className="h-5 w-5 text-green-600" />
            <h2 className="text-xl font-bold text-green-900">Latest Announcements</h2>
          </div>
          <div className="flex flex-wrap gap-2 mb-6">
            {CATEGORIES.map(cat => (
              <button key={cat} onClick={() => setActiveCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${activeCategory===cat?"text-white shadow-md":"bg-white text-gray-600 hover:bg-green-50"}`}
                style={activeCategory===cat?{background:"#7c4c2e"}:{}}>
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
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-green-900 text-lg">{a.title}</h3>
                  <span className="text-xs text-orange-600">Expires in {daysUntilExpire(a)} days</span>
                </div>
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
                <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0" style={{background:"#7c4c2e"}}>{msg.avatar}</div>
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
                  style={{background:"linear-gradient(135deg, #7c4c2e, #ae7c5f)"}}>
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
