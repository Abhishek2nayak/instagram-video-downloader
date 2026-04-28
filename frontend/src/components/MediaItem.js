import { useState } from "react";
import { motion } from "framer-motion";

export default function MediaItem({ item, index, total, apiBase, addToast }) {
  const [downloading, setDownloading] = useState(false);
  const [done, setDone] = useState(false);

  const ext = item.type === "video" ? "mp4" : "jpg";
  const filename = `instagram_${index + 1}.${ext}`;
  const proxyUrl = `${apiBase}/api/proxy?url=${encodeURIComponent(item.url)}&filename=${encodeURIComponent(filename)}`;

  const handleDownload = async () => {
    setDownloading(true);
    try {
      const resp = await fetch(proxyUrl);
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      const blob = await resp.blob();
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(blobUrl), 10000);
      setDone(true);
      addToast(`${item.type === "video" ? "Video" : "Image"} ${index + 1} downloaded!`, "success");
      setTimeout(() => setDone(false), 3000);
    } catch (err) {
      // Fallback: open proxy URL directly in new tab
      window.open(proxyUrl, "_blank");
      addToast("Opening in new tab — right-click → Save As", "success");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <motion.div
      className="w-full rounded-2xl overflow-hidden"
      style={{
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.08)",
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
    >
      {/* Media preview */}
      <div
        className="relative w-full bg-black overflow-hidden"
        style={{ minHeight: 280, maxHeight: 480 }}
      >
        {item.type === "video" ? (
          <video
            src={item.url}
            poster={item.thumbnail || undefined}
            className="w-full h-full object-contain"
            style={{ maxHeight: 480, display: "block" }}
            controls
            playsInline
            preload="metadata"
            onError={(e) => {
              // If video fails to load, show thumbnail fallback
              if (item.thumbnail && e.target.poster !== item.thumbnail) {
                e.target.poster = item.thumbnail;
              }
            }}
          />
        ) : (
          <img
            src={item.url}
            alt={`Media ${index + 1}`}
            className="w-full object-contain"
            style={{ maxHeight: 480, display: "block" }}
            onError={(e) => {
              if (item.thumbnail) e.target.src = item.thumbnail;
            }}
          />
        )}

        {/* Index badge (only for carousels) */}
        {total > 1 && (
          <div
            className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-semibold text-white"
            style={{ background: "rgba(0,0,0,0.65)", backdropFilter: "blur(8px)" }}
          >
            {index + 1} / {total}
          </div>
        )}

        {/* Type pill */}
        <div
          className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold text-white"
          style={{
            background: item.type === "video"
              ? "linear-gradient(135deg,#833ab4,#fd1d1d)"
              : "linear-gradient(135deg,#833ab4,#fcb045)",
            boxShadow: "0 2px 12px rgba(0,0,0,0.4)",
          }}
        >
          {item.type === "video" ? (
            <>
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zm12.553 1.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
              </svg>
              Video
            </>
          ) : (
            <>
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Image
            </>
          )}
        </div>
      </div>

      {/* Download button row */}
      <div className="px-4 py-3 flex items-center justify-between gap-3">
        <span className="text-gray-500 text-sm truncate">{filename}</span>

        <motion.button
          onClick={handleDownload}
          disabled={downloading}
          whileTap={{ scale: 0.96 }}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white flex-shrink-0 disabled:opacity-60 disabled:cursor-not-allowed shimmer"
          style={{
            background: done
              ? "linear-gradient(135deg,#059669,#10b981)"
              : "linear-gradient(135deg,#833ab4,#fd1d1d,#fcb045)",
            boxShadow: done
              ? "0 4px 15px rgba(16,185,129,0.35)"
              : "0 4px 15px rgba(131,58,180,0.35)",
            minWidth: 130,
            justifyContent: "center",
          }}
        >
          {downloading ? (
            <>
              <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
              Downloading…
            </>
          ) : done ? (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
              Downloaded!
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download {item.type === "video" ? "Video" : "Image"}
            </>
          )}
        </motion.button>
      </div>
    </motion.div>
  );
}
