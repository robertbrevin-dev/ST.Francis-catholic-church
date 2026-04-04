import { useState } from "react";
import { MapPin, Phone, Mail, Clock, Send, MessageCircle, AlertTriangle, CheckCircle } from "lucide-react";
import { useScrollReveal, ScrollReveal } from "../components/scroll-reveal";
import {
  PARISH_EMAIL,
  PARISH_PHONE_DISPLAY,
  PARISH_MAILTO_HREF,
  PARISH_POSTAL_LINES,
  PARISH_TEL_HREF,
  PARISH_WHATSAPP_E164,
} from "../../lib/parishContact";

export function Contact() {
  useScrollReveal();
  
  const [form, setForm] = useState({ name:"", email:"", phone:"", subject:"", message:"" });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.message) return;
    setSending(true);
    setTimeout(() => {
      setSending(false);
      setSent(true);
      setForm({ name:"", email:"", phone:"", subject:"", message:"" });
      setTimeout(() => setSent(false), 5000);
    }, 1000);
  };

  const inputClass = "w-full px-4 py-3 rounded-xl border border-green-200 bg-green-50 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition-all";

  return (
    <div>
      <section className="py-20 px-4 text-white page-background-section" style={{ background: "linear-gradient(135deg, #3a1f13 0%, #7c4c2e 100%)" }}>
        <div className="container mx-auto max-w-4xl text-center">
          <Phone className="h-12 w-12 mx-auto mb-4 text-white" />
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Contact Us</h1>
          <div className="w-20 h-1 bg-yellow-400 mx-auto mb-4 rounded"></div>
          <p className="text-green-200 text-lg">We would love to hear from you. Reach out any time.</p>
        </div>
      </section>

      <section className="py-16 px-4 bg-white page-background-section">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div>
              <h2 className="text-2xl font-bold text-green-900 mb-6">Get In Touch</h2>
              <div className="space-y-4 mb-8">
                {[
                  { icon: <MapPin className="h-5 w-5" />, label: "Address", value: PARISH_POSTAL_LINES },
                  {
                    icon: <Phone className="h-5 w-5" />,
                    label: "Parish phone",
                    value: PARISH_PHONE_DISPLAY,
                    href: PARISH_TEL_HREF,
                    ariaLabel: `Call parish at ${PARISH_PHONE_DISPLAY}`,
                  },
                  {
                    icon: <MessageCircle className="h-5 w-5" />,
                    label: "WhatsApp",
                    value: PARISH_PHONE_DISPLAY,
                    href: `https://wa.me/${PARISH_WHATSAPP_E164}`,
                    external: true,
                  },
                  {
                    icon: <Mail className="h-5 w-5" />,
                    label: "Email",
                    value: PARISH_EMAIL,
                    href: PARISH_MAILTO_HREF,
                    ariaLabel: `Email ${PARISH_EMAIL}`,
                  },
                  { icon: <Clock className="h-5 w-5" />, label: "Office Hours", value: "Mon–Fri: 8:00 AM – 5:00 PM\nSaturday: 9:00 AM – 12:00 PM" },
                ].map((item, i) => {
                  const bubble = (
                    <div className="w-10 h-10 rounded-full bg-green-600 text-white flex items-center justify-center flex-shrink-0">
                      {item.icon}
                    </div>
                  );
                  const cardClass =
                    "flex items-start gap-4 p-4 bg-green-50 rounded-xl border border-green-100";
                  if (!("href" in item) || !item.href) {
                    return (
                      <div key={i} className={cardClass}>
                        {bubble}
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-green-700 uppercase tracking-wider mb-0.5">{item.label}</p>
                          <p className="text-gray-700 whitespace-pre-line">{item.value}</p>
                        </div>
                      </div>
                    );
                  }
                  const isExternal = "external" in item && item.external;
                  return (
                    <a
                      key={i}
                      href={item.href}
                      className={`${cardClass} no-underline text-inherit hover:bg-green-100/90 active:bg-green-100 transition-colors`}
                      {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                      {...("ariaLabel" in item && item.ariaLabel ? { "aria-label": item.ariaLabel } : {})}
                    >
                      {bubble}
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-green-700 uppercase tracking-wider mb-0.5">{item.label}</p>
                        <p className="text-gray-700 whitespace-pre-line">{item.value}</p>
                      </div>
                    </a>
                  );
                })}
              </div>

              {/* WhatsApp Quick Contact */}
              <div className="bg-green-600 rounded-2xl p-6 text-white">
                <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                  <MessageCircle className="h-5 w-5" /> WhatsApp — Quick Contact
                </h3>
                <p className="text-green-100 text-sm mb-4">For quick questions, prayer requests, or to reach the parish team, send us a WhatsApp message.</p>
                <a
                  href={`https://wa.me/${PARISH_WHATSAPP_E164}?text=Hello%20St.%20Francis%20Cheptarit%20Parish%2C%20I%20would%20like%20to%20inquire%20about...`}
                  target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-white text-green-800 font-bold px-6 py-3 rounded-full hover:bg-green-50 transition-all"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  Open WhatsApp
                </a>
              </div>
            </div>

            {/* Contact Form */}
            <div>
              <h2 className="text-2xl font-bold text-green-900 mb-6">Send a Message</h2>
              {sent && (
                <div className="bg-green-100 border border-green-300 rounded-xl p-4 mb-6 text-green-800 font-medium flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  Message received! We will get back to you soon. God bless you.
                </div>
              )}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-semibold text-gray-700 block mb-1">Full Name *</label>
                    <input className={inputClass} placeholder="Your name" value={form.name} onChange={e => setForm(p=>({...p,name:e.target.value}))} required />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-700 block mb-1">Phone Number</label>
                    <input className={inputClass} placeholder="+254 7xx xxx xxx" value={form.phone} onChange={e => setForm(p=>({...p,phone:e.target.value}))} />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700 block mb-1">Email Address</label>
                  <input className={inputClass} type="email" placeholder="your@email.com" value={form.email} onChange={e => setForm(p=>({...p,email:e.target.value}))} />
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700 block mb-1">Subject</label>
                  <input className={inputClass} placeholder="What is your enquiry about?" value={form.subject} onChange={e => setForm(p=>({...p,subject:e.target.value}))} />
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700 block mb-1">Message *</label>
                  <textarea className={inputClass} rows={5} placeholder="Write your message, prayer request, or question here..." value={form.message} onChange={e => setForm(p=>({...p,message:e.target.value}))} required />
                </div>
                <button type="submit" disabled={sending} className="w-full flex items-center justify-center gap-2 text-white font-bold px-8 py-4 rounded-xl transition-all disabled:opacity-60 hover:opacity-90 shadow-md" style={{ background: "linear-gradient(135deg, #7c4c2e, #ae7c5f)" }}>
                  {sending ? "Sending..." : <><Send className="h-5 w-5" /> Send Message</>}
                </button>
                <p className="text-xs text-gray-400 text-center">You can also call or WhatsApp us directly for faster response</p>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Emergency Pastoral Care */}
      <section className="py-10 px-4" style={{ background: "#ecd5c5" }}>
        <div className="container mx-auto max-w-4xl">
          <div className="bg-white rounded-2xl p-6 border border-red-100 shadow-sm">
            <h3 className="font-bold text-red-700 text-lg mb-2 flex items-center gap-2"><AlertTriangle className="h-5 w-5" />Pastoral Emergency?</h3>
            <p className="text-gray-600 text-sm mb-3">
              If you or a loved one urgently needs a priest — for Last Rites, Anointing of the Sick, or any pastoral emergency — 
              please call the parish phone immediately at any time of day or night.
            </p>
            <a href={PARISH_TEL_HREF} className="inline-flex items-center gap-2 bg-red-600 text-white font-bold px-6 py-3 rounded-full hover:bg-red-700 transition-all">
              <Phone className="h-4 w-4" /> Emergency: {PARISH_PHONE_DISPLAY}
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
