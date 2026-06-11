import { useState, useEffect } from "react";
import Questions from "./Questions"
import MockInterview from "./MockInterview"
import Feedback from "./Feedback"
import Progress from "./Progress"

const FEATURES = [
  { icon: "❓", title: "Questions", desc: "Topic-wise interview Q&A", gradient: "from-violet-600 to-purple-800", glow: "shadow-violet-500/40", tab: "questions" },
  { icon: "🎙️", title: "Mock Interview", desc: "Live AI interview session", gradient: "from-blue-600 to-cyan-700", glow: "shadow-cyan-500/40", tab: "mock" },
  { icon: "🤖", title: "AI Feedback", desc: "Analyze your answers", gradient: "from-emerald-600 to-teal-700", glow: "shadow-emerald-500/40", tab: "feedback" },
  { icon: "📈", title: "Progress", desc: "Track your preparation", gradient: "from-rose-600 to-pink-700", glow: "shadow-rose-500/40", tab: "progress" },
];

const STATS = [
  { value: "500+", label: "Interview Questions" },
  { value: "10K+", label: "Students Prepared" },
  { value: "95%", label: "Success Rate" },
];

const STEPS = [
  { title: "Pick a Topic", desc: "Choose from CS, Cybersecurity, HR domains", icon: "🎯" },
  { title: "Practice Questions", desc: "Answer real interview questions", icon: "💬" },
  { title: "Get AI Feedback", desc: "Instant detailed feedback on answers", icon: "⚡" },
  { title: "Track & Improve", desc: "Monitor progress and crush weak areas", icon: "🏆" },
];

function FeatureCard({ feature, onClick }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
      className={`relative cursor-pointer rounded-2xl p-6 border transition-all duration-500 overflow-hidden ${hovered ? "border-white/20 bg-white/10 scale-[1.04] -translate-y-1" : "border-white/5 bg-white/[0.03]"}`}
    >
      <div className={`absolute inset-0 rounded-2xl transition-opacity duration-500 ${hovered ? "opacity-100" : "opacity-0"}`}
        style={{ background: "radial-gradient(circle at 50% 0%, rgba(139,92,246,0.15) 0%, transparent 70%)" }} />
      <div className={`absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-violet-500/60 to-transparent transition-opacity duration-500 ${hovered ? "opacity-100" : "opacity-0"}`} />
      <div className="relative z-10">
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center text-xl mb-4 shadow-lg ${feature.glow} transition-all duration-300 ${hovered ? "scale-110" : ""}`}>
          {feature.icon}
        </div>
        <h3 className="text-white font-bold text-lg mb-2">{feature.title}</h3>
        <p className="text-white/50 text-sm leading-relaxed">{feature.desc}</p>
        <div className={`mt-4 flex items-center gap-1 text-sm font-semibold transition-all duration-300 ${hovered ? "text-violet-400 gap-2" : "text-white/20"}`}>
          Explore <span>→</span>
        </div>
      </div>
    </div>
  );
}

function HomePage({ setTab }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => { setTimeout(() => setVisible(true), 100); }, []);

  return (
    <>
      {/* Hero */}
      <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-[#05030f]">
        <div className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: "linear-gradient(rgba(139,92,246,1) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,1) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-[0.12] blur-[120px]"
          style={{ background: "radial-gradient(circle, #8b5cf6 0%, #06b6d4 50%, transparent 70%)" }} />

        <div className={`relative z-10 text-center px-6 max-w-4xl mx-auto transition-all duration-1000 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-300 text-sm font-medium mb-8">
            <span className="w-2 h-2 rounded-full bg-violet-400 animate-pulse" />
            ✨ AI-Powered Interview Prep
          </div>

          <h1 className="text-6xl md:text-8xl font-black text-white leading-tight mb-6 tracking-tight">
            Crack Your{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-cyan-400 to-violet-400">
              Dream
            </span>
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white/90 to-white/60">
              Internship
            </span>
          </h1>

          <p className="text-lg md:text-xl text-white/50 max-w-2xl mx-auto mb-10 leading-relaxed">
            Practice with real questions, get instant{" "}
            <span className="text-cyan-400 font-medium">AI feedback</span>, and track your progress.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <button onClick={() => setTab("mock")} className="px-8 py-4 rounded-2xl bg-gradient-to-r from-violet-600 to-cyan-600 text-white font-bold text-lg shadow-2xl shadow-violet-500/40 hover:shadow-violet-500/70 hover:scale-105 transition-all duration-300">
              🎙️ Start Mock Interview
            </button>
            <button onClick={() => setTab("questions")} className="px-8 py-4 rounded-2xl border border-white/20 bg-white/5 text-white font-bold text-lg hover:bg-white/10 hover:scale-105 transition-all duration-300">
              Browse Questions →
            </button>
          </div>

          <div className="flex items-center justify-center gap-8 md:gap-16">
            {STATS.map((s, i) => (
              <div key={i} className="text-center">
                <div className="text-2xl md:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-400">{s.value}</div>
                <div className="text-white/40 text-xs md:text-sm mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40">
          <span className="text-white/60 text-xs tracking-widest uppercase">Scroll</span>
          <div className="w-px h-12 bg-gradient-to-b from-white/40 to-transparent animate-pulse" />
        </div>
      </section>

      {/* Features */}
      <section className="bg-[#05030f] py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-violet-400 text-sm font-semibold tracking-[0.2em] uppercase mb-3">Everything You Need</p>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
              Your Complete{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-400">Prep Kit</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map((f, i) => (
              <FeatureCard key={i} feature={f} onClick={() => setTab(f.tab)} />
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-[#05030f] py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-cyan-400 text-sm font-semibold tracking-[0.2em] uppercase mb-3">How It Works</p>
            <h2 className="text-4xl md:text-5xl font-black text-white">
              4 Steps to{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-violet-400">Interview Ready</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {STEPS.map((step, i) => (
              <div key={i} className="text-center group">
                <div className="relative inline-flex w-20 h-20 items-center justify-center rounded-2xl border border-violet-500/30 bg-violet-500/10 text-3xl mb-4 group-hover:border-violet-500/60 group-hover:scale-110 transition-all duration-300">
                  {step.icon}
                  <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-gradient-to-br from-violet-500 to-cyan-500 text-white text-xs font-black flex items-center justify-center">
                    {i + 1}
                  </div>
                </div>
                <h3 className="text-white font-bold text-lg mb-2">{step.title}</h3>
                <p className="text-white/40 text-sm leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#05030f] py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="relative rounded-3xl p-12 border border-violet-500/20 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-violet-900/40 via-[#05030f] to-cyan-900/20" />
            <div className="relative z-10">
              <div className="text-5xl mb-4">🚀</div>
              <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
                Ready to{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-400">Start Winning?</span>
              </h2>
              <p className="text-white/50 text-lg mb-8">Join thousands of students who cracked their internships with PrepAI</p>
              <button onClick={() => setTab("mock")} className="px-10 py-5 rounded-2xl bg-gradient-to-r from-violet-600 to-cyan-600 text-white font-bold text-lg shadow-2xl shadow-violet-500/40 hover:scale-105 transition-all duration-300">
                Start Free Today ✨
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#05030f] border-t border-white/5 py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="text-white font-black text-lg">
            Prep<span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-400">AI</span> 🚀
          </span>
          <p className="text-white/30 text-sm">Built with ❤️ for students, by students</p>
        </div>
      </footer>
    </>
  );
}

export default function App() {
  const [tab, setTab] = useState("home");

  return (
    <div className="font-sans antialiased bg-[#05030f] min-h-screen">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/60 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <button onClick={() => setTab("home")} className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-cyan-500 rounded-lg flex items-center justify-center text-sm font-black text-white">P</div>
            <span className="text-white font-black text-xl">
              Prep<span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-400">AI</span>
            </span>
          </button>
          <div className="hidden md:flex items-center gap-8">
            {["home","questions","mock","feedback","progress"].map((t, i) => (
              <button key={t} onClick={() => setTab(t)}
                className={`text-sm font-medium transition-all duration-300 ${tab === t ? "text-violet-400" : "text-white/60 hover:text-white"}`}>
                {["Home","Questions","Mock Interview","Feedback","Progress"][i]}
              </button>
            ))}
          </div>
          <button onClick={() => setTab("mock")} className="px-5 py-2 rounded-full bg-gradient-to-r from-violet-600 to-cyan-600 text-white text-sm font-semibold hover:scale-105 transition-all duration-300">
            Get Started
          </button>
        </div>
      </nav>

      {/* Pages */}
      <div className={tab === "home" ? "" : "pt-20 max-w-4xl mx-auto px-6 py-12"}>
        {tab === "home" && <HomePage setTab={setTab} />}
        {tab === "questions" && <Questions />}
        {tab === "mock" && <MockInterview />}
        {tab === "feedback" && <Feedback />}
        {tab === "progress" && <Progress />}
      </div>
    </div>
  );
}