import { motion } from "framer-motion";

function S({ className, style }) {
  return <div className={`skel rounded-xl ${className || ""}`} style={style} />;
}

export default function SkeletonLoader() {
  return (
    <div className="space-y-4">
      {/* Profile card */}
      <div className="rounded-2xl p-5 flex items-center gap-4"
        style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
        <S className="w-16 h-16 rounded-full flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <S className="h-4 w-36" />
          <S className="h-3 w-24" />
        </div>
        <div className="hidden sm:flex gap-2">
          <S className="h-8 w-20 rounded-full" />
          <S className="h-8 w-20 rounded-full" />
        </div>
      </div>

      {/* Media grid */}
      <div className="grid sm:grid-cols-2 gap-4">
        {[1, 2].map(i => (
          <div key={i} className="rounded-2xl overflow-hidden"
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
            <S className="w-full rounded-none" style={{ height: 280 }} />
            <div className="p-4 flex justify-between items-center">
              <S className="h-3 w-28" />
              <S className="h-9 w-36 rounded-xl" />
            </div>
          </div>
        ))}
      </div>

      {/* Caption */}
      <div className="rounded-2xl p-5 space-y-3"
        style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
        <S className="h-3 w-20" />
        <S className="h-3 w-full" />
        <S className="h-3 w-5/6" />
        <S className="h-3 w-2/3" />
      </div>

      {/* Spinner */}
      <motion.div className="flex justify-center py-2"
        animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 1.4, repeat: Infinity }}>
        <div className="relative w-8 h-8">
          <div className="absolute inset-0 rounded-full g-bg" style={{ animation: "spin 1s linear infinite" }} />
          <div className="absolute inset-0.5 rounded-full" style={{ background: "#080810" }} />
        </div>
      </motion.div>
    </div>
  );
}
