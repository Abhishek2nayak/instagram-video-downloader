import { useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import MediaItem from "./MediaItem";

function formatDate(iso) {
  if (!iso) return null;
  try {
    return new Date(iso).toLocaleDateString("en-US", {
      year: "numeric", month: "long", day: "numeric",
    });
  } catch { return null; }
}

function formatLikes(n) {
  if (n == null) return null;
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toString();
}

function StatPill({ icon, label, value }) {
  if (!value && value !== 0) return null;
  return (
    <div
      className="flex items-center gap-2 px-4 py-2 rounded-full text-sm"
      style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}
    >
      {icon}
      <span className="text-gray-300 font-medium">{value}</span>
      <span className="text-gray-600">{label}</span>
    </div>
  );
}

export default function ResultCard({ data, addToast, apiBase }) {
  const [captionExpanded, setCaptionExpanded] = useState(false);
  const [downloadingAll, setDownloadingAll] = useState(false);
  const [allDone, setAllDone] = useState(false);
  const [copiedCaption, setCopiedCaption] = useState(false);
  const [copiedTags, setCopiedTags] = useState(false);

  const { username, profilePic, caption, hashtags, mediaItems, likesCount, timestamp } = data;

  const captionClean = caption ? caption.replace(/#[\wÀ-ſ]+/g, "").trim() : "";
  const isLong = captionClean.length > 220;
  const displayCaption = isLong && !captionExpanded ? captionClean.slice(0, 220) + "…" : captionClean;

  const copyCaption = async () => {
    try {
      await navigator.clipboard.writeText(caption || "");
      setCopiedCaption(true);
      addToast("Caption copied!", "success");
      setTimeout(() => setCopiedCaption(false), 2000);
    } catch { addToast("Copy failed", "error"); }
  };

  const copyHashtags = async () => {
    try {
      await navigator.clipboard.writeText((hashtags || []).join(" "));
      setCopiedTags(true);
      addToast("Hashtags copied!", "success");
      setTimeout(() => setCopiedTags(false), 2000);
    } catch { addToast("Copy failed", "error"); }
  };

  const downloadAll = async () => {
    setDownloadingAll(true);
    try {
      const resp = await axios.post(
        `${apiBase}/api/download-all`,
        { mediaItems, username },
        { responseType: "blob" }
      );
      const blob = new Blob([resp.data], { type: "application/zip" });
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = `instagram_${username || "media"}_${Date.now()}.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(blobUrl);
      setAllDone(true);
      addToast("All media downloaded as ZIP!", "success");
      setTimeout(() => setAllDone(false), 3000);
    } catch {
      addToast("ZIP download failed. Try individual downloads.", "error");
    } finally {
      setDownloadingAll(false);
    }
  };

  return (
    <div className="space-y-4">

      {/* ── Profile + meta card ── */}
      <div
        className="rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center gap-4"
        style={{
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.08)",
          backdropFilter: "blur(20px)",
        }}
      >
        {/* Avatar */}
        <div className="relative flex-shrink-0">
          {profilePic ? (
            <img
              src={profilePic}
              alt={username}
              className="w-16 h-16 rounded-full object-cover"
              style={{
                border: "2px solid transparent",
                backgroundImage: "linear-gradient(#111,#111),linear-gradient(135deg,#833ab4,#fd1d1d,#fcb045)",
                backgroundOrigin: "border-box",
                backgroundClip: "padding-box,border-box",
              }}
              onError={(e) => { e.target.style.display = "none"; }}
            />
          ) : (
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-2xl"
              style={{ background: "linear-gradient(135deg,#833ab4,#fd1d1d,#fcb045)" }}
            >
              {username?.[0]?.toUpperCase() || "?"}
            </div>
          )}
          {/* Instagram ring */}
          <div
            className="absolute -inset-0.5 rounded-full -z-10"
            style={{ background: "linear-gradient(135deg,#833ab4,#fd1d1d,#fcb045)" }}
          />
        </div>

        {/* Name + date */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-white font-bold text-lg">@{username}</span>
            {/* verified badge */}
            <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
              <defs>
                <linearGradient id="vgrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#833ab4"/>
                  <stop offset="50%" stopColor="#fd1d1d"/>
                  <stop offset="100%" stopColor="#fcb045"/>
                </linearGradient>
              </defs>
              <circle cx="12" cy="12" r="10" fill="url(#vgrad)"/>
              <path d="M8 12l3 3 5-5" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
            </svg>
          </div>
          {timestamp && <p className="text-gray-500 text-sm mt-0.5">{formatDate(timestamp)}</p>}
        </div>

        {/* Stats */}
        <div className="flex flex-wrap gap-2">
          <StatPill
            value={formatLikes(likesCount)}
            label="likes"
            icon={<svg className="w-4 h-4 text-red-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd"/></svg>}
          />
          <StatPill
            value={mediaItems?.length}
            label={mediaItems?.length === 1 ? "file" : "files"}
            icon={<svg className="w-4 h-4 text-purple-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14"/></svg>}
          />
        </div>
      </div>

      {/* ── Media cards ── */}
      {mediaItems?.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-white font-semibold text-base">
              Media
              <span className="ml-2 text-sm font-normal text-gray-500">
                ({mediaItems.length} {mediaItems.length === 1 ? "item" : "items"})
              </span>
            </h2>
            {mediaItems.length > 1 && (
              <motion.button
                onClick={downloadAll}
                disabled={downloadingAll}
                whileTap={{ scale: 0.97 }}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white shimmer"
                style={{
                  background: allDone
                    ? "linear-gradient(135deg,#059669,#10b981)"
                    : "linear-gradient(135deg,#833ab4,#fd1d1d,#fcb045)",
                  boxShadow: "0 4px 16px rgba(131,58,180,0.3)",
                }}
              >
                {downloadingAll ? (
                  <><svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg> Zipping…</>
                ) : allDone ? (
                  <><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7"/></svg> Done!</>
                ) : (
                  <><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg> Download All</>
                )}
              </motion.button>
            )}
          </div>

          <div className="grid gap-4" style={{ gridTemplateColumns: mediaItems.length === 1 ? "1fr" : "repeat(auto-fill, minmax(min(100%, 380px), 1fr))" }}>
            {mediaItems.map((item, i) => (
              <MediaItem
                key={item.id || i}
                item={item}
                index={i}
                total={mediaItems.length}
                apiBase={apiBase}
                addToast={addToast}
              />
            ))}
          </div>
        </div>
      )}

      {/* ── Caption ── always shown */}
      <div
        className="rounded-2xl p-5 space-y-3"
        style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
      >
        <div className="flex items-center justify-between">
          <h3 className="text-gray-400 text-xs font-semibold uppercase tracking-widest">Caption</h3>
          {captionClean && (
            <motion.button onClick={copyCaption} whileTap={{ scale: 0.95 }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium"
              style={{
                background: copiedCaption ? "rgba(16,185,129,0.15)" : "rgba(255,255,255,0.06)",
                color: copiedCaption ? "#10b981" : "#9ca3af",
                border: `1px solid ${copiedCaption ? "rgba(16,185,129,0.3)" : "rgba(255,255,255,0.08)"}`,
              }}>
              {copiedCaption
                ? <><svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7"/></svg> Copied!</>
                : <><svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg> Copy</>}
            </motion.button>
          )}
        </div>

        {captionClean ? (
          <>
            <p className="text-gray-200 text-sm leading-relaxed whitespace-pre-wrap">{displayCaption}</p>
            {isLong && (
              <button onClick={() => setCaptionExpanded(!captionExpanded)}
                className="text-xs font-semibold" style={{ color: "#a855f7" }}>
                {captionExpanded ? "Show less ▲" : "Show more ▼"}
              </button>
            )}
          </>
        ) : (
          <p className="text-gray-600 text-sm italic">
            Caption not available — this API plan does not return post text.
          </p>
        )}
      </div>

      {/* ── Hashtags ── always shown */}
      <div
        className="rounded-2xl p-5 space-y-4"
        style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
      >
        <div className="flex items-center justify-between">
          <h3 className="text-gray-400 text-xs font-semibold uppercase tracking-widest">
            Hashtags
            {hashtags?.length > 0 && (
              <span className="ml-1.5 text-gray-600 normal-case font-normal">({hashtags.length})</span>
            )}
          </h3>
          {hashtags?.length > 0 && (
            <motion.button onClick={copyHashtags} whileTap={{ scale: 0.95 }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium"
              style={{
                background: copiedTags ? "rgba(16,185,129,0.15)" : "rgba(255,255,255,0.06)",
                color: copiedTags ? "#10b981" : "#9ca3af",
                border: `1px solid ${copiedTags ? "rgba(16,185,129,0.3)" : "rgba(255,255,255,0.08)"}`,
              }}>
              {copiedTags
                ? <><svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7"/></svg> Copied!</>
                : <><svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg> Copy All</>}
            </motion.button>
          )}
        </div>

        {hashtags?.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {hashtags.map((tag, i) => (
              <motion.button key={i}
                onClick={async () => { await navigator.clipboard.writeText(tag); addToast(`${tag} copied!`, "success"); }}
                className="hchip px-3 py-1.5 rounded-full text-xs font-medium"
                style={{
                  background: "linear-gradient(135deg,rgba(131,58,180,0.18),rgba(253,29,29,0.12))",
                  border: "1px solid rgba(131,58,180,0.28)",
                  color: "#d8b4fe",
                }}
                whileHover={{ y: -2, scale: 1.06 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.15 }}
                title="Click to copy">
                {tag}
              </motion.button>
            ))}
          </div>
        ) : (
          <p className="text-gray-600 text-sm italic">
            No hashtags found — paste a post with a caption containing hashtags to see them here.
          </p>
        )}
      </div>
    </div>
  );
}
