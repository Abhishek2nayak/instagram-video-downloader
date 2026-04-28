export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer style={{ borderTop: "1px solid rgba(255,255,255,0.06)", background: "rgba(0,0,0,0.3)" }}>

      {/* CTA banner */}
      <div className="py-14 px-4 text-center" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
          Ready to Download Instagram Videos?
        </h2>
        <p className="text-gray-500 mb-7 max-w-md mx-auto text-sm">
          Free, fast, and private. No sign-up required. Start downloading in seconds.
        </p>
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="shimmer g-bg text-white font-bold px-8 py-3.5 rounded-2xl text-sm inline-flex items-center gap-2"
          style={{ boxShadow: "0 4px 24px rgba(131,58,180,0.45)" }}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
          </svg>
          Download Now — It's Free
        </button>
      </div>

      {/* Links */}
      <div className="max-w-5xl mx-auto px-4 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md g-bg flex items-center justify-center">
            <svg viewBox="0 0 24 24" fill="white" className="w-3.5 h-3.5">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
            </svg>
          </div>
          <span className="text-white font-bold text-sm">InstaDown</span>
        </div>

        <div className="flex flex-wrap justify-center gap-x-6 gap-y-1 text-xs text-gray-600">
          <span>Instagram Video Downloader</span>
          <span>·</span>
          <span>Reels Downloader</span>
          <span>·</span>
          <span>Carousel Downloader</span>
          <span>·</span>
          <span>Caption Extractor</span>
        </div>

        <p className="text-gray-700 text-xs">© {year} InstaDown. For personal use only.</p>
      </div>

      {/* SEO disclaimer */}
      <div className="max-w-5xl mx-auto px-4 pb-8">
        <p className="text-gray-700 text-xs leading-relaxed text-center">
          InstaDown is an independent tool and is not affiliated with, endorsed by, or connected to Instagram or Meta Platforms, Inc.
          Use this tool responsibly and only download content you have permission to save. Always respect creators' intellectual property rights.
        </p>
      </div>
    </footer>
  );
}
