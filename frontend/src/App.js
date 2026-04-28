import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import ResultCard from "./components/ResultCard";
import SkeletonLoader from "./components/SkeletonLoader";
import ToastContainer from "./components/ToastContainer";
import HowItWorks from "./components/HowItWorks";
import FeaturesSection from "./components/FeaturesSection";
import FormatsSection from "./components/FormatsSection";
import FAQSection from "./components/FAQSection";
import Footer from "./components/Footer";

const API_BASE = process.env.REACT_APP_API_URL || "";

export default function App() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [shakeInput, setShakeInput] = useState(false);
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = "success") => {
    const id = Date.now() + Math.random();
    setToasts(p => [...p, { id, message, type }]);
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 3500);
  }, []);

  const triggerShake = () => {
    setShakeInput(true);
    setTimeout(() => setShakeInput(false), 500);
  };

  const handleExtract = async () => {
    const trimmed = url.trim();
    if (!trimmed) { triggerShake(); setError("Please enter an Instagram URL"); return; }
    setError(null);
    setResult(null);
    setLoading(true);
    try {
      const { data } = await axios.post(`${API_BASE}/api/extract`, { url: trimmed });
      setResult(data);
      setTimeout(() => {
        document.getElementById("result-area")?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 200);
    } catch (err) {
      setError(err.response?.data?.error || err.message || "Something went wrong.");
      triggerShake();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen" style={{ background: "#080810" }}>
      {/* ── Background orbs ── */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="orb1 absolute rounded-full opacity-[0.14]"
          style={{ width: 500, height: 500, top: "-8%", left: "-10%",
            background: "radial-gradient(circle, #833ab4 0%, transparent 70%)", filter: "blur(70px)" }} />
        <div className="orb2 absolute rounded-full opacity-[0.11]"
          style={{ width: 400, height: 400, top: "35%", right: "-8%",
            background: "radial-gradient(circle, #fd1d1d 0%, transparent 70%)", filter: "blur(70px)" }} />
        <div className="orb3 absolute rounded-full opacity-[0.13]"
          style={{ width: 350, height: 350, bottom: "5%", left: "20%",
            background: "radial-gradient(circle, #fcb045 0%, transparent 70%)", filter: "blur(70px)" }} />
      </div>

      <div className="relative z-10">
        <Navbar />

        {/* ── Tool area ── */}
        <section className="max-w-3xl mx-auto px-4 pt-16 pb-8">
          <motion.div initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}>
            <HeroSection
              url={url} setUrl={setUrl}
              onExtract={handleExtract}
              loading={loading} error={error} shakeInput={shakeInput}
            />
          </motion.div>

          <div id="result-area" className="mt-8">
            <AnimatePresence mode="wait">
              {loading && (
                <motion.div key="skel"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
                  <SkeletonLoader />
                </motion.div>
              )}
              {result && !loading && (
                <motion.div key="result"
                  initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }} transition={{ duration: 0.45, ease: "easeOut" }}>
                  <ResultCard data={result} addToast={addToast} apiBase={API_BASE} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>

        {/* ── SEO sections ── */}
        <HowItWorks />
        <FeaturesSection />
        <FormatsSection />
        <FAQSection />
        <Footer />
      </div>

      <ToastContainer toasts={toasts} />
    </div>
  );
}
