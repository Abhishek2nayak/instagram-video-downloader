import { motion } from "framer-motion";

const formats = [
  {
    label: "Reels",
    desc: "Download Instagram Reels (short videos) in HD. Works for any public reel — just copy the reel URL and paste it above.",
    tag: "/reel/",
    color: "#a855f7",
    icon: <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 20 20"><path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zm12.553 1.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z"/></svg>,
  },
  {
    label: "Single Posts",
    desc: "Save any single photo or video post from Instagram. Supports both square and portrait format images and videos.",
    tag: "/p/",
    color: "#ec4899",
    icon: <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>,
  },
  {
    label: "Carousel Posts",
    desc: "Extract all photos and videos from multi-slide carousel posts. Download each slide individually or get everything in a ZIP.",
    tag: "/p/ (multiple)",
    color: "#f97316",
    icon: <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2"/></svg>,
  },
  {
    label: "IGTV Videos",
    desc: "Download long-form IGTV videos from any public Instagram profile. Full resolution, no time limits.",
    tag: "/tv/",
    color: "#06b6d4",
    icon: <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 10l4.553-2.069A1 1 0 0121 8.87v6.26a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg>,
  },
];

const outputFormats = [
  { label: "MP4", desc: "Videos in .mp4 format", color: "#a855f7" },
  { label: "JPG", desc: "Images in .jpg format", color: "#ec4899" },
  { label: "ZIP", desc: "Bulk download as .zip", color: "#f97316" },
  { label: "HD", desc: "Always highest resolution", color: "#10b981" },
];

export default function FormatsSection() {
  return (
    <section id="formats" className="py-20 px-4"
      style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-14">
          <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "#f97316" }}>Supported Content</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            What Types of Instagram Content Can You Download?
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto">
            InstaDown supports all major Instagram content types from public accounts.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-5 mb-12">
          {formats.map((f, i) => (
            <motion.div key={i}
              className="flex gap-4 rounded-2xl p-5"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
              initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.45 }}>

              <div className="w-12 h-12 rounded-xl flex-shrink-0 flex items-center justify-center"
                style={{ background: `${f.color}15`, color: f.color, border: `1px solid ${f.color}25` }}>
                {f.icon}
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <h3 className="text-white font-semibold">{f.label}</h3>
                  <code className="text-xs px-2 py-0.5 rounded-md font-mono"
                    style={{ background: "rgba(255,255,255,0.06)", color: "#9ca3af" }}>{f.tag}</code>
                </div>
                <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Output formats */}
        <div className="rounded-2xl p-6" style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)" }}>
          <h3 className="text-white font-semibold mb-5 text-center">Download Output Formats</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {outputFormats.map((f, i) => (
              <div key={i} className="rounded-xl p-4 text-center"
                style={{ background: `${f.color}0e`, border: `1px solid ${f.color}20` }}>
                <div className="text-2xl font-black mb-1" style={{ color: f.color }}>.{f.label}</div>
                <div className="text-gray-500 text-xs">{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
