import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const faqs = [
  {
    q: "Is InstaDown free to use?",
    a: "Yes, InstaDown is completely free. There are no hidden charges, no premium plans, and no usage limits. You can download as many Instagram videos, reels, and photos as you want at no cost.",
  },
  {
    q: "Do I need to log in to Instagram to use this tool?",
    a: "No. You do not need an Instagram account or to log in to anything. Simply copy the URL of any public Instagram post and paste it into the tool. That's it.",
  },
  {
    q: "Can I download private Instagram videos?",
    a: "No. InstaDown only works with publicly accessible Instagram posts. Private accounts and posts that require a follow to view cannot be downloaded, as we do not store any credentials or session data.",
  },
  {
    q: "What types of Instagram content can I download?",
    a: "You can download Instagram Reels, single photo/video posts, multi-image carousel posts (all slides at once), and IGTV videos. Stories are not currently supported as they require account authentication.",
  },
  {
    q: "What is the video download quality?",
    a: "InstaDown always fetches the highest available resolution for every video and image. For videos this is typically 720p HD. The quality depends on what the original uploader posted — we never compress or reduce quality.",
  },
  {
    q: "How do I download a carousel post with multiple photos?",
    a: "Paste the carousel post URL and click Download. All media items will appear as individual cards. You can download each one separately, or click the 'Download All' button to receive a single ZIP file containing everything.",
  },
  {
    q: "Why is my download not working?",
    a: "The most common reasons are: (1) The account is private. (2) The post has been deleted. (3) The Instagram URL is invalid — make sure to copy the full link including https://. (4) Instagram may temporarily rate-limit requests — wait a minute and try again.",
  },
  {
    q: "Does InstaDown work on iPhone and Android?",
    a: "Yes. InstaDown is fully responsive and works in any modern mobile browser, including Safari on iPhone and Chrome on Android. No app download required.",
  },
  {
    q: "Is it legal to download Instagram videos?",
    a: "Downloading content for personal use is generally acceptable. However, re-uploading, re-distributing, or monetising downloaded content without the original creator's permission may violate Instagram's Terms of Service and copyright law. Always respect creators' rights.",
  },
  {
    q: "Does InstaDown store my data or downloaded files?",
    a: "No. We do not store any URLs you submit, any media you download, or any personal information. All processing happens in real-time and nothing is retained on our servers after the request completes.",
  },
];

function FAQItem({ faq, index }) {
  const [open, setOpen] = useState(false);
  return (
    <motion.div
      className="rounded-xl overflow-hidden"
      style={{ border: `1px solid ${open ? "rgba(168,85,247,0.25)" : "rgba(255,255,255,0.07)"}`, transition: "border-color .2s" }}
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.04 }}>

      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left"
        style={{ background: open ? "rgba(168,85,247,0.06)" : "rgba(255,255,255,0.025)" }}>
        <span className="text-white font-medium text-sm sm:text-base">{faq.q}</span>
        <motion.span animate={{ rotate: open ? 45 : 0 }} transition={{ duration: 0.2 }}
          className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-gray-400"
          style={{ background: "rgba(255,255,255,0.08)" }}>
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4"/>
          </svg>
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}>
            <p className="px-5 pb-5 text-gray-400 text-sm leading-relaxed"
              style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
              {faq.a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function FAQSection() {
  const half = Math.ceil(faqs.length / 2);
  const left = faqs.slice(0, half);
  const right = faqs.slice(half);

  return (
    <section id="faq" className="py-20 px-4"
      style={{ background: "rgba(255,255,255,0.015)", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-14">
          <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "#a855f7" }}>FAQ</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto">
            Everything you need to know about downloading Instagram videos and media.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-3">
          <div className="space-y-3">
            {left.map((f, i) => <FAQItem key={i} faq={f} index={i} />)}
          </div>
          <div className="space-y-3">
            {right.map((f, i) => <FAQItem key={i + half} faq={f} index={i + half} />)}
          </div>
        </div>
      </div>
    </section>
  );
}
