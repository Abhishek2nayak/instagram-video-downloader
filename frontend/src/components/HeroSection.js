import { useRef } from "react";
import { motion } from "framer-motion";

export default function HeroSection({ url, setUrl, onExtract, loading, error, shakeInput }) {
  const inputRef = useRef(null);

  const paste = async () => {
    try { setUrl(await navigator.clipboard.readText()); inputRef.current?.focus(); } catch { inputRef.current?.focus(); }
  };

  return (
    <div className="text-center" id="tool">
      {/* Badge */}
      <motion.div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold mb-6"
        style={{ background: "rgba(168,85,247,0.12)", border: "1px solid rgba(168,85,247,0.25)", color: "#c084fc" }}
        initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}>
        <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse inline-block" />
        Free · No login · No watermark
      </motion.div>

      {/* Heading */}
      <motion.h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight mb-4 tracking-tight"
        initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
        <span className="text-white">Instagram </span>
        <span className="g-text">Video Downloader</span>
      </motion.h1>

      <motion.p className="text-gray-400 text-base sm:text-lg mb-10 max-w-xl mx-auto leading-relaxed"
        initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.22 }}>
        Download Instagram videos, Reels, carousels and photos in HD quality.
        Extract captions and hashtags instantly — no account needed.
      </motion.p>

      {/* Input */}
      <motion.div className={`max-w-2xl mx-auto ${shakeInput ? "shake" : ""}`}
        initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.28 }}>

        <div className="input-glow flex items-center rounded-2xl px-4 py-3 gap-3">
          <svg className="w-5 h-5 text-gray-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </svg>

          <input ref={inputRef} type="url" value={url}
            onChange={e => setUrl(e.target.value)}
            onKeyDown={e => e.key === "Enter" && onExtract()}
            placeholder="Paste Instagram link here — post, reel, carousel…"
            className="flex-1 bg-transparent text-white placeholder-gray-600 outline-none text-sm sm:text-base min-w-0"
          />

          {url && (
            <button onClick={() => setUrl("")} className="text-gray-600 hover:text-gray-400 transition-colors flex-shrink-0 p-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}

          <button onClick={paste} title="Paste from clipboard"
            className="p-1.5 rounded-lg hover:bg-white/10 transition-colors flex-shrink-0 text-gray-500 hover:text-gray-300">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </button>

          <motion.button onClick={onExtract} disabled={loading} whileTap={{ scale: 0.96 }}
            className="shimmer g-bg text-white font-bold px-6 py-2.5 rounded-xl text-sm flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ boxShadow: "0 4px 20px rgba(131,58,180,0.45)", minWidth: 110 }}>
            {loading ? (
              <span className="flex items-center gap-2 justify-center">
                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                </svg>
                Fetching
              </span>
            ) : "Download"}
          </motion.button>
        </div>

        {/* Error */}
        {error && (
          <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
            className="mt-3 text-red-400 text-sm flex items-center justify-center gap-2">
            <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
            </svg>
            {error}
          </motion.p>
        )}

        {/* Trust badges */}
        <div className="mt-5 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-gray-600">
          {["✓ HD Quality", "✓ Reels & Carousels", "✓ 100% Free", "✓ No Watermark", "✓ No Login Required"].map(b => (
            <span key={b}>{b}</span>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
