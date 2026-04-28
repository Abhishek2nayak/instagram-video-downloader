import { motion } from "framer-motion";

const steps = [
  {
    num: "01",
    title: "Copy the Instagram URL",
    desc: "Open Instagram and find the post, reel, or carousel you want. Tap the three-dot menu and choose Copy Link, or copy the URL from your browser.",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
          d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/>
      </svg>
    ),
  },
  {
    num: "02",
    title: "Paste & Click Download",
    desc: "Paste the copied link into the input box above and click the Download button. Our tool instantly fetches all available media from the post.",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
          d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/>
      </svg>
    ),
  },
  {
    num: "03",
    title: "Save to Your Device",
    desc: "Preview each video or photo, then click the individual Download button. For carousel posts, download all media at once with the Download All (ZIP) button.",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
          d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
      </svg>
    ),
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 px-4"
      style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-14">
          <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "#a855f7" }}>Simple Process</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            How to Download Instagram Videos
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto text-base">
            Download any Instagram content in just three easy steps — no extensions, no software, completely browser-based.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {steps.map((s, i) => (
            <motion.div key={i}
              className="relative rounded-2xl p-7"
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.07)",
              }}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}>

              {/* Step number — big faded */}
              <span className="absolute top-5 right-6 text-6xl font-black select-none"
                style={{ color: "rgba(168,85,247,0.06)", lineHeight: 1 }}>
                {s.num}
              </span>

              {/* Icon */}
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 text-purple-400"
                style={{ background: "rgba(168,85,247,0.12)", border: "1px solid rgba(168,85,247,0.2)" }}>
                {s.icon}
              </div>

              <h3 className="text-white font-semibold text-lg mb-3">{s.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
