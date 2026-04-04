import { useState, useEffect } from 'react'
import { Bell, Send, Calendar, Pin, MessageSquare, ThumbsUp, Share2 } from 'lucide-react'
import { supabase } from '../../lib/supabase'

const CATEGORIES = ['All', 'General', 'Mass', 'Sacraments', 'Finance', 'Community', 'Events']

type Announcement = {
  id: string
  title: string
  content: string
  display_date: string
  category: string
  color: string
  pinned: boolean
  author_id: string
  created_at: string
  expires_at: string
}

type Message = {
  id: string
  sender_name: string
  message: string
  avatar: string
  created_at: string
}

function daysUntilExpire(expires_at: string) {
  return Math.max(0, Math.ceil((new Date(expires_at).getTime() - Date.now()) / (24 * 60 * 60 * 1000)))
}

export function Announcements() {
  const [activeCategory, setActiveCategory] = useState('All')
  const [pinned, setPinned] = useState<Announcement[]>([])
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [likes, setLikes] = useState<Record<string, number>>({})
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState({ name: '', message: '' })
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAnnouncements()
    fetchMessages()
    fetchLikes()

    const channel = supabase
      .channel('announcements')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'announcements' }, fetchAnnouncements)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'parish_messages' }, fetchMessages)
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [])

  async function fetchAnnouncements() {
    const { data } = await supabase
      .from('announcements')
      .select('*')
      .eq('is_active', true)
      .gt('expires_at', new Date().toISOString())
      .order('created_at', { ascending: false })
    if (data) {
      setPinned(data.filter(a => a.pinned))
      setAnnouncements(data.filter(a => !a.pinned))
    }
    setLoading(false)
  }

  async function fetchMessages() {
    const { data } = await supabase
      .from('parish_messages')
      .select('*')
      .eq('is_visible', true)
      .order('created_at', { ascending: true })
    if (data) setMessages(data)
  }

  async function fetchLikes() {
    const { data } = await supabase.from('announcement_likes').select('announcement_id')
    if (data) {
      const counts: Record<string, number> = {}
      data.forEach(l => { counts[l.announcement_id] = (counts[l.announcement_id] || 0) + 1 })
      setLikes(counts)
    }
  }

  async function handleLike(id: string) {
    await supabase.from('announcement_likes').insert({ announcement_id: id })
    setLikes(prev => ({ ...prev, [id]: (prev[id] || 0) + 1 }))
  }

  async function handleSend() {
    if (!newMessage.name.trim() || !newMessage.message.trim()) return
    setSending(true)
    const { error } = await supabase.from('parish_messages').insert({
      sender_name: newMessage.name.trim(),
      message: newMessage.message.trim(),
      avatar: newMessage.name.trim().slice(0, 2).toUpperCase(),
    })
    if (!error) {
      setNewMessage({ name: '', message: '' })
      setSent(true)
      setTimeout(() => setSent(false), 3000)
      fetchMessages()
    }
    setSending(false)
  }

  const filtered = activeCategory === 'All' ? announcements : announcements.filter(a => a.category === activeCategory)

  return (
    <div>
      <section className="py-20 px-4 text-white relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #3a1f13 0%, #7c4c2e 100%)' }}>
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

      <section className="py-10 px-4 bg-white">
        <div className="container mx-auto max-w-5xl">
          <div className="flex items-center gap-2 mb-6">
            <Pin className="h-5 w-5 text-red-500" />
            <h2 className="text-xl font-bold text-green-900">Pinned Notices</h2>
          </div>
          {loading ? (
            <p className="text-gray-400 text-sm">Loading...</p>
          ) : pinned.length === 0 ? (
            <p className="text-gray-400 text-sm">No pinned notices at this time.</p>
          ) : (
            <div className="grid md:grid-cols-2 gap-5">
              {pinned.map(a => (
                <div key={a.id} className="rounded-2xl p-6 text-white shadow-lg relative overflow-hidden" style={{ background: `linear-gradient(135deg, ${a.color}, ${a.color}cc)` }}>
                  <div className="absolute top-3 right-3"><Pin className="h-4 w-4 text-white/70" /></div>
                  <div className="inline-block bg-white/20 text-white text-xs font-semibold px-3 py-1 rounded-full mb-3">{a.category}</div>
                  <h3 className="font-bold text-lg mb-3">{a.title}</h3>
                  <p className="text-white/85 text-sm leading-relaxed whitespace-pre-line">{a.content}</p>
                  <p className="text-white/60 text-xs mt-4">— {a.display_date}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="py-10 px-4" style={{ background: '#f8efe2' }}>
        <div className="container mx-auto max-w-5xl">
          <div className="flex items-center gap-2 mb-6">
            <Bell className="h-5 w-5 text-green-600" />
            <h2 className="text-xl font-bold text-green-900">Latest Announcements</h2>
          </div>
          <div className="flex flex-wrap gap-2 mb-6">
            {CATEGORIES.map(cat => (
              <button key={cat} onClick={() => setActiveCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${activeCategory === cat ? 'text-white shadow-md' : 'bg-white text-gray-600 hover:bg-green-50'}`}
                style={activeCategory === cat ? { background: '#7c4c2e' } : {}}>
                {cat}
              </button>
            ))}
          </div>
          <div className="space-y-4">
            {filtered.length === 0 ? (
              <p className="text-gray-400 text-sm">No announcements in this category.</p>
            ) : filtered.map(a => (
              <div key={a.id} className="bg-white rounded-2xl shadow-sm p-6 border border-green-100 hover:shadow-md transition-all">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <span className="text-xs font-semibold px-3 py-1 rounded-full text-white" style={{ background: a.color }}>{a.category}</span>
                  <div className="flex items-center gap-2 text-xs text-gray-400"><Calendar className="h-3.5 w-3.5" />{a.display_date}</div>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-green-900 text-lg">{a.title}</h3>
                  <span className="text-xs text-orange-600">Expires in {daysUntilExpire(a.expires_at)} days</span>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">{a.content}</p>
                <div className="flex items-center gap-4 mt-4 pt-3 border-t border-gray-100">
                  <button onClick={() => handleLike(a.id)} className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-green-600 transition-colors">
                    <ThumbsUp className="h-4 w-4" /><span>Amen {(likes[a.id] || 0) > 0 ? `(${likes[a.id]})` : ''}</span>
                  </button>
                  <button onClick={() => navigator.share?.({ title: a.title, text: a.content })} className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-green-600 transition-colors">
                    <Share2 className="h-4 w-4" />Share
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 px-4 bg-white">
        <div className="container mx-auto max-w-4xl">
          <div className="flex items-center gap-2 mb-2">
            <MessageSquare className="h-5 w-5 text-green-600" />
            <h2 className="text-xl font-bold text-green-900">Parish Message Board</h2>
            <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full">Interactive</span>
          </div>
          <p className="text-gray-500 text-sm mb-6">Leave a prayer request, a message of encouragement, or a question for the parish.</p>
          <div className="space-y-4 mb-6 max-h-96 overflow-y-auto pr-2">
            {messages.map(msg => (
              <div key={msg.id} className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0" style={{ background: '#7c4c2e' }}>{msg.avatar}</div>
                <div className="flex-1 bg-green-50 rounded-2xl rounded-tl-none px-4 py-3 border border-green-100">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-sm text-green-900">{msg.sender_name}</span>
                    <span className="text-xs text-gray-400">{new Date(msg.created_at).toLocaleDateString()}</span>
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
              <input type="text" placeholder="Your name" value={newMessage.name} onChange={e => setNewMessage(p => ({ ...p, name: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-xl border border-green-200 bg-white text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition-all" />
              <textarea placeholder="Write your message, prayer request, or question..." value={newMessage.message} onChange={e => setNewMessage(p => ({ ...p, message: e.target.value }))} rows={3}
                className="w-full px-4 py-2.5 rounded-xl border border-green-200 bg-white text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition-all resize-none" />
              <div className="flex items-center justify-between">
                <p className="text-xs text-gray-400">Be respectful and kind in your messages.</p>
                <button onClick={handleSend} disabled={sending || !newMessage.name.trim() || !newMessage.message.trim()}
                  className="flex items-center gap-2 text-white font-semibold px-6 py-2.5 rounded-full text-sm transition-all disabled:opacity-50"
                  style={{ background: 'linear-gradient(135deg, #7c4c2e, #ae7c5f)' }}>
                  {sending ? 'Sending...' : <><Send className="h-4 w-4" />Send</>}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}