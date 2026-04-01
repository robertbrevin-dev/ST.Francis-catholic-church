import { Link } from "react-router";
import { ArrowRight, Phone, Church, Target, Star, MapPin, Home, Globe } from "lucide-react";

const CHURCH_PHONE = "+254 700 000 000";

export function About() {
  return (
    <div>
      {/* Header */}
      <section className="py-20 px-4 text-white relative overflow-hidden" style={{ background: "linear-gradient(135deg, #0d3320 0%, #1b6b35 100%)" }}>
        <div className="container mx-auto max-w-4xl text-center relative z-10">
          <Church className="h-14 w-14 mx-auto mb-4" />
          <h1 className="text-4xl md:text-5xl font-bold mb-4">About Our Parish</h1>
          <div className="w-20 h-1 bg-yellow-400 mx-auto mb-4 rounded"></div>
          <p className="text-green-200 text-lg">St. Francis Cheptarit Catholic Parish — Mosoriot, Nandi County</p>
        </div>
      </section>

      {/* Church Photo + Intro */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="rounded-2xl overflow-hidden shadow-2xl border-4 border-white" style={{ boxShadow: "0 20px 60px rgba(27,107,53,0.2)" }}>
                <img src="/images/logo.jpeg" alt="St. Francis Cheptarit Catholic Church" className="w-full h-80 object-cover" />
              </div>
              <div className="mt-4 text-center">
                <p className="text-sm text-gray-500">St. Francis Cheptarit Catholic Parish Church Building</p>
              </div>
            </div>
            <div>
              <p className="text-green-600 font-semibold text-sm uppercase tracking-wider mb-2">Who We Are</p>
              <h2 className="text-3xl font-bold text-green-900 mb-4">A Parish Rooted in Faith & Community</h2>
              <div className="w-16 h-1 rounded" style={{ background: "linear-gradient(90deg, #1b6b35, #c8a84b)", marginBottom: "20px" }}></div>
              <p className="text-gray-600 leading-relaxed mb-4">
                St. Francis Cheptarit Catholic Parish is located in Cheptarit, Mosoriot — in the heart of Nandi County, Kenya. 
                We are a parish of the <strong>Diocese of Eldoret</strong>, dedicated to St. Francis of Assisi, the beloved patron of nature, peace, and the poor.
              </p>
              <p className="text-gray-600 leading-relaxed mb-4">
                Our parish community is made up of vibrant, faithful Catholic families and individuals from Cheptarit, Mosoriot, and the surrounding villages. 
                We are united in worship, prayer, fellowship, and service to our community and beyond.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Guided by the Gospel of Jesus Christ and the teachings of the Catholic Church, we strive to be a welcoming, 
                missionary community that brings the love of God to all people.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Patron Saint */}
      <section className="py-16 px-4" style={{ background: "#eaf7ee" }}>
        <div className="container mx-auto max-w-5xl">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div className="flex justify-center">
              <div className="h-52 w-52 rounded-full overflow-hidden border-4 border-yellow-400 shadow-2xl">
                <img src="/images/church.jpg" alt="St. Francis of Assisi" className="h-full w-full object-cover" />
              </div>
            </div>
            <div>
              <p className="text-green-600 font-semibold text-sm uppercase tracking-wider mb-2">Our Patron Saint</p>
              <h2 className="text-3xl font-bold text-green-900 mb-4">St. Francis of Assisi</h2>
              <div className="w-16 h-1 rounded mb-5" style={{ background: "linear-gradient(90deg, #1b6b35, #c8a84b)" }}></div>
              <p className="text-gray-600 leading-relaxed mb-4">
                St. Francis of Assisi (1181–1226) is one of the most beloved saints in the Catholic Church. Born into wealth in Assisi, Italy, 
                he gave up all his possessions to follow Christ in radical poverty, simplicity, and love.
              </p>
              <p className="text-gray-600 leading-relaxed mb-4">
                He founded the Order of Friars Minor (Franciscans) and is renowned for his deep love of nature, the poor, and all of God's creation. 
                He is the author of the "Canticle of the Sun" and is famously known for the Prayer of St. Francis.
              </p>
              <div className="bg-white rounded-xl p-4 border-l-4 border-yellow-400">
                <p className="text-green-800 italic text-sm leading-relaxed">
                  "Lord, make me an instrument of your peace. Where there is hatred, let me sow love; where there is injury, pardon; where there is doubt, faith..."
                </p>
                <p className="text-green-600 text-xs mt-2 font-semibold">— Prayer of St. Francis of Assisi</p>
              </div>
              <p className="text-gray-500 text-sm mt-4">Feast Day: <strong className="text-green-700">4th October</strong></p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Mission & Vision */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12">
            <p className="text-green-600 font-semibold text-sm uppercase tracking-wider mb-2">Our Direction</p>
            <h2 className="text-3xl font-bold text-green-900 mb-3">Mission & Vision</h2>
            <div className="section-divider"></div>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="rounded-2xl p-8 shadow-md border border-green-100 hover:shadow-lg transition-all" style={{ background: "linear-gradient(135deg, #1b6b35, #2d8a48)" }}>
              <Target className="h-10 w-10 mb-4 block text-white" />
              <h3 className="text-white font-bold text-xl mb-3">Our Mission</h3>
              <p className="text-green-100 leading-relaxed">
                To proclaim the Good News of Jesus Christ, celebrate the Sacraments with joy and reverence, 
                build a strong community of faith, and serve the people of Cheptarit, Mosoriot, and Nandi County 
                with compassion, generosity, and love — inspired by the example of St. Francis of Assisi.
              </p>
            </div>
            <div className="rounded-2xl p-8 shadow-md border border-yellow-200 hover:shadow-lg transition-all" style={{ background: "linear-gradient(135deg, #c8a84b, #e8c96a)" }}>
              <Star className="h-10 w-10 mb-4 block text-green-900" />
              <h3 className="text-green-900 font-bold text-xl mb-3">Our Vision</h3>
              <p className="text-yellow-900 leading-relaxed">
                To be a vibrant, missionary, and welcoming Catholic parish where every person — regardless of background — 
                encounters God's love, finds a spiritual home, is formed in authentic Catholic faith, 
                and is empowered to transform their families and community.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Diocese Info */}
      <section className="py-16 px-4" style={{ background: "#f0faf2" }}>
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-green-900 mb-3">Diocese of Eldoret</h2>
            <div className="section-divider"></div>
          </div>
          <div className="bg-white rounded-2xl p-8 shadow-md border border-green-100 max-w-3xl mx-auto">
            <p className="text-gray-600 leading-relaxed mb-4">
              St. Francis Cheptarit Catholic Parish is part of the <strong>Catholic Diocese of Eldoret</strong>, 
              which serves the Rift Valley region of Kenya. The Diocese of Eldoret was established in 1968 
              and is led by the Bishop of Eldoret.
            </p>
            <p className="text-gray-600 leading-relaxed mb-4">
              The Diocese encompasses many parishes across Uasin Gishu, Nandi, Trans Nzoia, Elgeyo-Marakwet, 
              and West Pokot counties, serving hundreds of thousands of Catholics across the region.
            </p>
            <p className="text-gray-600 leading-relaxed">
              As a parish in Nandi County, we are proud to be part of this great diocesan family and 
              committed to the evangelization mission of the Church in Western Kenya.
            </p>
          </div>
        </div>
      </section>

      {/* Location */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-green-900 mb-3">Find Us</h2>
            <div className="section-divider"></div>
          </div>
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              {[
                { icon: <MapPin className="h-6 w-6" />, label: "Address", value: "Cheptarit, Mosoriot\nNandi County, Kenya" },
                { icon: <Home className="h-6 w-6" />, label: "Diocese", value: "Diocese of Eldoret" },
                { icon: <Phone className="h-6 w-6" />, label: "Phone", value: CHURCH_PHONE, href: `tel:${CHURCH_PHONE.replace(/\s/g,"")}` },
                { icon: <Globe className="h-6 w-6" />, label: "County", value: "Nandi County, Rift Valley Region" },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-4 p-4 bg-green-50 rounded-xl border border-green-100">
                  <span className="text-2xl">{item.icon}</span>
                  <div>
                    <p className="text-xs font-bold text-green-700 uppercase tracking-wider mb-0.5">{item.label}</p>
                    {item.href ? (
                      <a href={item.href} className="text-gray-700 font-medium hover:text-green-700 transition-colors">{item.value}</a>
                    ) : (
                      <p className="text-gray-700 font-medium whitespace-pre-line">{item.value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div className="rounded-2xl overflow-hidden shadow-xl h-64 bg-green-100 flex items-center justify-center border border-green-200">
              <div className="text-center p-8">
                <MapPin className="h-14 w-14 mx-auto mb-3" />
                <p className="text-green-800 font-semibold text-lg">Cheptarit, Mosoriot</p>
                <p className="text-green-600 text-sm">Nandi County, Kenya</p>
                <p className="text-green-500 text-xs mt-2">Diocese of Eldoret</p>
                <a
                  href="https://maps.google.com/?q=Mosoriot+Nandi+Kenya"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center gap-2 bg-green-600 text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-green-700 transition-colors"
                >
                  Open in Google Maps
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 text-white" style={{ background: "linear-gradient(135deg, #0d3320, #1b6b35)" }}>
        <div className="container mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold mb-4">Come and See</h2>
          <p className="text-green-200 mb-8">Join us for Mass, meet our community, and discover your home in faith. All are welcome.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/mass-times" className="inline-flex items-center justify-center gap-2 bg-yellow-500 hover:bg-yellow-400 text-green-950 font-bold px-8 py-4 rounded-full transition-all shadow-lg">
              Mass Times <ArrowRight className="h-5 w-5" />
            </Link>
            <Link to="/contact" className="inline-flex items-center justify-center gap-2 border-2 border-white text-white font-semibold px-8 py-4 rounded-full hover:bg-white hover:text-green-900 transition-all">
              <Phone className="h-5 w-5" /> Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
