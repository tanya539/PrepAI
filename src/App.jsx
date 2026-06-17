import { useState } from "react";
import Questions from "./Questions"
import MockInterview from "./MockInterview"
import Feedback from "./Feedback"
import Progress from "./Progress"
import PortfolioAnalyzer from "./PortfolioAnalyzer"
import DailyChallenge from "./DailyChallenge"

const FEATURES = [
  { icon: "❓", title: "Questions", desc: "Topic-wise interview Q&A", tab: "questions" },
  { icon: "🎙️", title: "Mock Interview", desc: "Live AI interview session", tab: "mock" },
  { icon: "🤖", title: "AI Feedback", desc: "Analyze your answers", tab: "feedback" },
  { icon: "📈", title: "Progress", desc: "Track your preparation", tab: "progress" },
  { icon: "🗂️", title: "Portfolio Analyzer", desc: "AI analyzes your portfolio code", tab: "portfolio" },
  { icon: "🎯", title: "Daily Challenge", desc: "Role-based daily coding challenge", tab: "daily" },
];

const STATS = [
  { value: "500+", label: "Interview Questions" },
  { value: "10K+", label: "Students Prepared" },
  { value: "95%", label: "Success Rate" },
];

function FeatureCard({ feature, onClick }) {
  return (
    <div
      onClick={onClick}
      className="cursor-pointer group rounded-2xl p-6 bg-[#3a1a1f] border border-white/10 hover:border-orange-500/40 hover:bg-[#451f26] hover:-translate-y-1 transition-all duration-300"
    >
      <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-orange-500/20 to-amber-500/10 border border-orange-500/20 flex items-center justify-center text-lg mb-4 group-hover:scale-110 transition-all duration-300">
        {feature.icon}
      </div>
      <h3 className="text-white font-semibold text-base mb-1">{feature.title}</h3>
      <p className="text-white/40 text-sm leading-relaxed">{feature.desc}</p>
      <div className="mt-4 text-white/30 text-sm font-medium opacity-0 group-hover:opacity-100 group-hover:text-orange-400 group-hover:translate-x-1 transition-all duration-300">
        Explore →
      </div>
    </div>
  );
}

function HomePage({ setTab, field, setField }) {
  return (
    <div className="px-6 py-20 max-w-6xl mx-auto relative overflow-hidden">
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-40 right-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="text-center mb-24 relative z-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-white/70 text-xs font-medium mb-7 tracking-wide">
          ✨ AI-POWERED INTERVIEW PREP
        </div>
        <h1 className="text-5xl md:text-7xl font-extrabold leading-[1.1] mb-6 tracking-tight">
          <span className="text-white">Crack Your</span><br />
          <span className="bg-gradient-to-r from-amber-300 to-yellow-200 bg-clip-text text-transparent">
            Dream Internship
          </span>
        </h1>
        <p className="text-white/50 text-lg md:text-xl max-w-xl mx-auto mb-10 leading-relaxed">
          Practice with real questions, get instant AI feedback, and track your progress.
        </p>

        <div className="max-w-md mx-auto mb-9">
          <label className="text-white/40 text-xs mb-2 block uppercase tracking-[0.15em] font-medium">Your Field / Course</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 text-lg">🎓</span>
            <input
              value={field}
              onChange={(e) => setField(e.target.value)}
              placeholder="e.g. B.Tech CSE, Law, B.Pharma, MBA..."
              className="w-full bg-[#3a1a1f] border border-white/15 rounded-2xl pl-12 pr-5 py-3.5 text-white placeholder-white/30 text-center text-sm focus:outline-none focus:border-orange-400 focus:shadow-[0_0_0_4px_rgba(251,146,60,0.15)] transition-all duration-300"
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-16">
          <button onClick={() => setTab("mock")} className="px-9 py-4 rounded-xl bg-amber-300/90 text-[#2b1014] text-base font-semibold shadow-lg shadow-amber-300/20 hover:bg-amber-300 hover:scale-105 transition-all duration-300">
            🎙️ Start Mock Interview
          </button>
          <button onClick={() => setTab("questions")} className="px-9 py-4 rounded-xl border border-white/15 bg-white/5 text-white text-base font-semibold hover:border-orange-400/50 hover:text-orange-400 hover:scale-105 transition-all duration-300">
            Browse Questions →
          </button>
        </div>

        <div className="flex items-center justify-center gap-12">
          {STATS.map((s, i) => (
            <div key={i} className="text-center">
              <div className="text-3xl font-bold text-white">{s.value}</div>
              <div className="text-white/40 text-xs mt-1.5 tracking-wide">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-24 relative z-10">
        <div className="text-center mb-12">
          <p className="text-white/40 text-xs font-semibold tracking-[0.25em] uppercase mb-3">Everything You Need</p>
          <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">Your Complete Prep Kit</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {FEATURES.map((f, i) => (
            <FeatureCard key={i} feature={f} onClick={() => setTab(f.tab)} />
          ))}
        </div>
      </div>

      <div className="text-center bg-[#3a1a1f] border border-white/10 rounded-[2rem] px-8 py-16 relative overflow-hidden z-10">
        <div className="absolute -top-16 -right-16 w-48 h-48 bg-orange-500/10 rounded-full blur-2xl" />
        <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-amber-500/10 rounded-full blur-2xl" />
        <div className="relative z-10">
          <div className="text-3xl mb-4">🚀</div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-3 tracking-tight">Ready to Start Winning?</h2>
          <p className="text-white/50 text-sm mb-8 font-light">Join thousands of students prepping smarter with PrepAI</p>
          <button onClick={() => setTab("mock")} className="px-9 py-4 rounded-xl bg-amber-300/90 text-[#2b1014] text-base font-semibold shadow-lg shadow-amber-300/20 hover:bg-amber-300 hover:scale-105 transition-all duration-300">
            Start Free Today ✨
          </button>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [tab, setTab] = useState("home");
  const [field, setField] = useState("");

  const NAV_TABS = ["home","questions","mock","feedback","progress","portfolio","daily"]
  const NAV_LABELS = ["Home","Questions","Mock Interview","Feedback","Progress","Portfolio","Daily Challenge"]

  return (
    <div className="min-h-screen bg-[#2b1014]">
      <nav className="sticky top-0 z-50 bg-[#2b1014]/80 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <button onClick={() => setTab("home")} className="flex items-center gap-2">
            <div className="w-7 h-7 bg-gradient-to-br from-orange-500 to-amber-500 rounded-lg flex items-center justify-center text-white text-xs font-bold">P</div>
            <span className="text-white font-bold text-lg tracking-tight">PrepAI 🚀</span>
          </button>
          <div className="hidden md:flex items-center gap-5">
            {NAV_TABS.map((t, i) => (
              <button key={t} onClick={() => setTab(t)}
                className={`text-sm font-medium transition-all duration-300 ${tab === t ? "text-orange-400" : "text-white/40 hover:text-white"}`}>
                {NAV_LABELS[i]}
              </button>
            ))}
          </div>
          <button onClick={() => setTab("mock")} className="px-5 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white text-sm font-semibold shadow-md shadow-orange-500/30 hover:shadow-lg hover:scale-105 transition-all duration-300">
            Get Started
          </button>
        </div>
      </nav>

      <div className={tab === "home" ? "" : "max-w-4xl mx-auto px-6 py-12"}>
        {tab === "home" && <HomePage setTab={setTab} field={field} setField={setField} />}

        {tab === "questions" && (
          <div className="bg-[#3a1a1f] border border-white/10 rounded-3xl p-8 text-white">
            <button onClick={() => setTab("home")} className="mb-4 text-white/50 hover:text-amber-300 text-sm font-medium flex items-center gap-2 transition-all duration-300">← Back to Home</button>
            <Questions field={field} setField={setField} />
          </div>
        )}
        {tab === "mock" && (
          <div className="bg-[#3a1a1f] border border-white/10 rounded-3xl p-8 text-white">
            <button onClick={() => setTab("home")} className="mb-4 text-white/50 hover:text-amber-300 text-sm font-medium flex items-center gap-2 transition-all duration-300">← Back to Home</button>
            <MockInterview field={field} />
          </div>
        )}
        {tab === "feedback" && (
          <div className="bg-[#3a1a1f] border border-white/10 rounded-3xl p-8 text-white">
            <button onClick={() => setTab("home")} className="mb-4 text-white/50 hover:text-amber-300 text-sm font-medium flex items-center gap-2 transition-all duration-300">← Back to Home</button>
            <Feedback />
          </div>
        )}
        {tab === "progress" && (
          <div className="bg-[#3a1a1f] border border-white/10 rounded-3xl p-8 text-white">
            <button onClick={() => setTab("home")} className="mb-4 text-white/50 hover:text-amber-300 text-sm font-medium flex items-center gap-2 transition-all duration-300">← Back to Home</button>
            <Progress />
          </div>
        )}
        {tab === "portfolio" && (
          <div className="bg-[#3a1a1f] border border-white/10 rounded-3xl p-8 text-white">
            <button onClick={() => setTab("home")} className="mb-4 text-white/50 hover:text-amber-300 text-sm font-medium flex items-center gap-2 transition-all duration-300">← Back to Home</button>
            <PortfolioAnalyzer />
          </div>
        )}
        {tab === "daily" && (
          <div className="bg-[#3a1a1f] border border-white/10 rounded-3xl p-8 text-white">
            <button onClick={() => setTab("home")} className="mb-4 text-white/50 hover:text-amber-300 text-sm font-medium flex items-center gap-2 transition-all duration-300">← Back to Home</button>
            <DailyChallenge />
          </div>
        )}
      </div>
    </div>
  );
}