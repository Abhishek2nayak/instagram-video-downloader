import { motion } from "framer-motion";

const features = [
  {
    title: "Download Instagram Reels",
    desc: "Save any public Instagram Reel to your device in original HD quality. Works on mobile and desktop.",
    color: "#a855f7",
    icon: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zm12.553 1.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z"/></svg>,
  },
  {
    title: "Download Carousel Posts",
    desc: "Extract every photo and video from multi-image carousel posts. Download them individually or as a single ZIP file.",
    color: "#ec4899",
    icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>,
  },
  {
    title: "Extract Captions & Hashtags",
    desc: "Copy the full post caption and all hashtags with one click. Perfect for reposting or research.",
    color: "#f97316",
    icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"/></svg>,
  },
  {
    title: "HD Video Quality",
    desc: "We always fetch the highest available resolution. No compression, no quality loss — exactly as uploaded.",
    color: "#06b6d4",
    icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>,
  },
  {
    title: "No Login Required",
    desc: "You never need to sign in to Instagram or create any account. Just paste the URL and download — completely anonymous.",
    color: "#10b981",
    icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z"/></svg>,
  },
  {
    title: "Works on All Devices",
    desc: "Fully responsive — use on iPhone, Android, PC, Mac or tablet. No app to install. Works in any modern browser.",
    color: "#f59e0b",
    icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"/></svg>,
  },
  {
    title: "100% Free Forever",
    desc: "No hidden fees, no premium plan, no usage limits. InstaDown is and will always be completely free to use.",
    color: "#a855f7",
    icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>,
  },
  {
    title: "Fast & Secure",
    desc: "Your privacy matters. We never store your downloads or the URLs you paste. Everything is processed in real-time and deleted immediately.",
    color: "#ec4899",
    icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>,
  },
];

export default function FeaturesSection() {
  return (
    <section id="features" className="py-20 px-4"
      style={{ background: "rgba(255,255,255,0.015)", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "#ec4899" }}>Why InstaDown</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Everything You Need to Save Instagram Content
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto">
            The most complete Instagram downloader — handles every content type with zero friction.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((f, i) => (
            <motion.div key={i}
              className="rounded-2xl p-5"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05, duration: 0.45 }}>

              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4 flex-shrink-0"
                style={{ background: `${f.color}18`, color: f.color, border: `1px solid ${f.color}28` }}>
                {f.icon}
              </div>
              <h3 className="text-white font-semibold text-sm mb-2">{f.title}</h3>
              <p className="text-gray-500 text-xs leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
