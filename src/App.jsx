import { useState, useEffect } from "react";
import Questions from "./Questions"
import MockInterview from "./MockInterview"
import Feedback from "./Feedback"
import Progress from "./Progress"
import PortfolioAnalyzer from "./PortfolioAnalyzer"
import DailyChallenge from "./DailyChallenge"
import AuthModal, { useAuth, UserMenu } from "./Auth"

const FEATURES = [
  { icon: "❓", title: "Questions", desc: "Topic-wise interview Q&A", tab: "questions", color: "from-blue-500/20 to-blue-600/10", border: "hover:border-blue-500/40" },
  { icon: "🎙️", title: "Mock Interview", desc: "Live AI interview session", tab: "mock", color: "from-orange-500/20 to-orange-600/10", border: "hover:border-orange-500/40" },
  { icon: "🤖", title: "AI Feedback", desc: "Analyze your answers instantly", tab: "feedback", color: "from-violet-500/20 to-violet-600/10", border: "hover:border-violet-500/40" },
  { icon: "📈", title: "Progress", desc: "Track your preparation", tab: "progress", color: "from-emerald-500/20 to-emerald-600/10", border: "hover:border-emerald-500/40" },
  { icon: "🗂️", title: "Portfolio Analyzer", desc: "AI analyzes your portfolio code", tab: "portfolio", color: "from-cyan-500/20 to-cyan-600/10", border: "hover:border-cyan-500/40" },
  { icon: "🎯", title: "Daily Challenge", desc: "Role-based daily coding challenge", tab: "daily", color: "from-amber-500/20 to-amber-600/10", border: "hover:border-amber-500/40" },
];

const STEPS = [
  { num: "01", title: "Choose Your Role", desc: "Select your field and difficulty level" },
  { num: "02", title: "Practice Daily", desc: "Solve challenges and mock interviews" },
  { num: "03", title: "Get AI Feedback", desc: "Instant analysis and improvement tips" },
  { num: "04", title: "Track Progress", desc: "Watch your skills grow over time" },
]

const HERO_METRICS = [
  { value: "24/7", label: "AI prep support" },
  { value: "6 tools", label: "Practice in one place" },
  { value: "1 account", label: "Saved progress & history" },
]

const PROTECTED_TABS = new Set(["questions", "mock", "feedback", "progress", "portfolio", "daily"])

// ─── Lock Overlay — shown on protected pages when not logged in ──────
function LockOverlay({ setShowAuth }) {
  return (
    <div className="absolute inset-0 z-30 flex items-center justify-center bg-[#2b1014]/80 backdrop-blur-md rounded-3xl">
      <div className="text-center px-6">
        <div className="text-5xl mb-4">🔒</div>
        <h3 className="text-white font-black text-2xl mb-2">Login to Use This Feature</h3>
        <p className="text-white/50 text-sm mb-6 max-w-xs mx-auto">Create a free account to start practicing and save your progress.</p>
        <button onClick={() => setShowAuth(true)}
          className="px-8 py-3 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold text-sm shadow-lg shadow-orange-500/30 hover:scale-105 transition-all duration-300">
          Login / Sign Up Free
        </button>
      </div>
    </div>
  )
}

// ─── Wraps a feature page: blurred + locked when logged out ──────────
function ProtectedPage({ user, setShowAuth, children }) {
  return (
    <div className="relative">
      <div className={!user ? "pointer-events-none select-none filter blur-sm" : ""}>
        {children}
      </div>
      {!user && <LockOverlay setShowAuth={setShowAuth} />}
    </div>
  )
}

function FeatureCard({ feature, onClick, index }) {
  return (
    <div
      onClick={onClick}
      className={`cursor-pointer group rounded-2xl p-6 bg-[#3a1a1f] border border-white/10 ${feature.border} hover:bg-[#451f26] hover:-translate-y-2 hover:shadow-2xl transition-all duration-300`}
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} border border-white/10 flex items-center justify-center text-xl mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
        {feature.icon}
      </div>
      <h3 className="text-white font-bold text-base mb-1">{feature.title}</h3>
      <p className="text-white/40 text-sm leading-relaxed mb-4">{feature.desc}</p>
      <div className="flex items-center gap-1 text-white/20 text-xs font-medium group-hover:text-orange-400 group-hover:gap-2 transition-all duration-300">
        Explore <span>→</span>
      </div>
    </div>
  );
}

function HomePage({ onNavigate, field, setField }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 100)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="relative overflow-hidden">
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-orange-500/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-[30%] right-[-10%] w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
        <div className="absolute bottom-[-10%] left-[30%] w-[400px] h-[400px] bg-red-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "2s" }} />
      </div>

      <div className={`relative z-10 px-6 pt-20 pb-20 max-w-6xl mx-auto transition-all duration-1000 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
        <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] items-center">
          <div className="text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-300 text-xs font-semibold mb-8 tracking-widest uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse" />
              AI-Powered Interview Prep Platform
            </div>

            <h1 className="text-5xl md:text-7xl font-black leading-[1.02] mb-6 tracking-tight max-w-4xl">
              <span className="text-white block">Practice smarter.</span>
              <span className="block bg-gradient-to-r from-orange-400 via-amber-300 to-yellow-200 bg-clip-text text-transparent">
                Interview faster.
              </span>
              <span className="text-white/80 block text-3xl md:text-5xl font-bold mt-3">One workspace for your prep run.</span>
            </h1>

            <p className="text-white/55 text-lg md:text-xl max-w-2xl mb-10 leading-relaxed">
              Get interview questions, mock sessions, AI feedback, and progress tracking in one polished flow. Sign in once and your prep stays with you.
            </p>

            <div className="max-w-md mb-8">
              <div className="relative group">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 text-lg transition-all group-focus-within:text-orange-400">🎓</span>
                <input
                  value={field}
                  onChange={(e) => setField(e.target.value)}
                  placeholder="e.g. B.Tech CSE, MBA, Law..."
                  className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-5 py-4 text-white placeholder-white/25 text-sm focus:outline-none focus:border-orange-400/60 focus:bg-white/8 focus:shadow-[0_0_0_4px_rgba(251,146,60,0.1)] transition-all duration-300"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-10">
              <button
                onClick={() => onNavigate("mock")}
                className="group relative px-10 py-4 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-400 text-white text-base font-bold shadow-xl shadow-orange-500/30 hover:shadow-orange-500/50 hover:scale-105 transition-all duration-300 overflow-hidden">
                <span className="relative z-10 flex items-center gap-2">🎙️ Start Mock Interview</span>
                <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-orange-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </button>
              <button
                onClick={() => onNavigate("feedback")}
                className="px-10 py-4 rounded-2xl border border-white/15 bg-white/5 text-white text-base font-semibold hover:border-orange-400/50 hover:bg-white/10 hover:text-orange-300 hover:scale-105 transition-all duration-300">
                🤖 Explore AI Feedback
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-3xl">
              {HERO_METRICS.map((metric) => (
                <div key={metric.label} className="rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-4">
                  <div className="text-white font-black text-xl mb-1">{metric.value}</div>
                  <div className="text-white/40 text-sm">{metric.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative lg:pt-6">
            <div className="absolute -inset-6 rounded-[2rem] bg-gradient-to-br from-orange-500/10 via-transparent to-amber-500/10 blur-2xl" />
            <div className="relative rounded-[2rem] border border-white/10 bg-[#3a1a1f]/85 backdrop-blur-xl p-6 shadow-2xl shadow-black/20">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-white/35 text-xs font-semibold tracking-[0.3em] uppercase">Live Prep Dashboard</p>
                  <h3 className="text-white text-2xl font-black mt-2">Your session is ready</h3>
                </div>
                <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-emerald-300 text-xs font-semibold border border-emerald-500/20">Secure access</span>
              </div>

              <div className="space-y-4 mb-6">
                {[
                  ["Mock interview", "Practice with guided prompts and timed answers."],
                  ["AI feedback", "Turn responses into clear improvement notes instantly."],
                  ["Progress tracking", "Save streaks and measure readiness over time."],
                ].map(([title, desc]) => (
                  <div key={title} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                    <div className="flex items-center justify-between gap-4 mb-2">
                      <span className="text-white font-semibold">{title}</span>
                      <span className="h-2 w-2 rounded-full bg-orange-400 shadow-[0_0_12px_rgba(251,146,60,0.9)]" />
                    </div>
                    <p className="text-white/45 text-sm leading-relaxed">{desc}</p>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-3 gap-3">
                {[
                  ["Score", "92%"],
                  ["Focus", "Live"],
                  ["Saved", "On"],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-2xl border border-white/10 bg-black/15 px-4 py-4 text-center">
                    <div className="text-orange-300 text-xl font-black">{value}</div>
                    <div className="text-white/35 text-xs uppercase tracking-[0.2em] mt-1">{label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-300 text-xs font-semibold mb-8 tracking-widest uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse" />
            Ready to build confidence faster
          </div>
          <div className="flex flex-wrap items-center justify-center gap-6 text-white/30 text-xs font-medium">
            {["✅ Free to use", "⚡ Instant AI feedback", "🔒 Secure login", "🎯 Role-based challenges"].map((badge, i) => (
              <span key={i} className="hover:text-white/60 transition-colors">{badge}</span>
            ))}
          </div>
        </div>
      </div>

      <div className="relative z-10 px-6 py-20 max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <p className="text-orange-400 text-xs font-bold tracking-[0.3em] uppercase mb-3">How It Works</p>
          <h2 className="text-3xl md:text-4xl font-black text-white">4 Steps to Interview Success</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {STEPS.map((step, i) => (
            <div key={i} className="relative group">
              {i < STEPS.length - 1 && (
                <div className="hidden lg:block absolute top-8 left-full w-full h-px bg-gradient-to-r from-orange-500/30 to-transparent z-10" />
              )}
              <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 hover:border-orange-500/30 hover:bg-white/[0.06] transition-all duration-300">
                <div className="text-4xl font-black text-orange-500/20 mb-3 group-hover:text-orange-500/40 transition-colors">{step.num}</div>
                <h3 className="text-white font-bold mb-2">{step.title}</h3>
                <p className="text-white/40 text-sm leading-relaxed">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="relative z-10 px-6 py-10 max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <p className="text-orange-400 text-xs font-bold tracking-[0.3em] uppercase mb-3">Everything You Need</p>
          <h2 className="text-3xl md:text-4xl font-black text-white">Your Complete Prep Kit</h2>
          <p className="text-white/40 text-base mt-3 max-w-xl mx-auto">All tools in one place — no switching between apps</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map((f, i) => (
            <FeatureCard key={i} feature={f} index={i} onClick={() => setTab(f.tab)} />
          ))}
        </div>
      </div>

      <div className="relative z-10 px-6 py-10 max-w-6xl mx-auto mb-10">
        <div className="relative rounded-3xl overflow-hidden border border-orange-500/20 bg-gradient-to-br from-[#3a1a1f] to-[#2b1014] p-12 text-center">
          <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 via-amber-500/5 to-orange-500/5" />
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl" />
          <div className="relative z-10">
            <div className="text-5xl mb-4">🚀</div>
            <h2 className="text-3xl md:text-5xl font-black text-white mb-4 leading-tight">
              Ready to Crack Your<br />
              <span className="bg-gradient-to-r from-orange-400 to-amber-300 bg-clip-text text-transparent">Next Interview?</span>
            </h2>
            <p className="text-white/50 text-base mb-8 max-w-md mx-auto">Start practicing today — it's free, instant, and AI-powered.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button onClick={() => user ? setTab("mock") : setShowAuth(true)}
                className="px-10 py-4 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-400 text-white font-bold text-base shadow-xl shadow-orange-500/30 hover:scale-105 transition-all duration-300">
                🎙️ Start Mock Interview
              </button>
              <button onClick={() => user ? setTab("feedback") : setShowAuth(true)}
                className="px-10 py-4 rounded-2xl border border-white/15 bg-white/5 text-white font-semibold text-base hover:border-orange-400/50 hover:text-orange-300 hover:scale-105 transition-all duration-300">
                🤖 Try AI Feedback
              </button>
            </div>
          </div>
        </div>
      </div>

      <footer className="relative z-10 border-t border-white/5 px-6 py-10 max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-gradient-to-br from-orange-500 to-amber-500 rounded-lg flex items-center justify-center text-white text-xs font-bold">P</div>
            <span className="text-white font-bold text-lg">PrepAI 🚀</span>
          </div>
          <p className="text-white/20 text-sm text-center">
            Built with ❤️ by Tanya • Powered by Groq AI • Open Source
          </p>
          <div className="flex items-center gap-5">
            {["Questions", "Mock Interview", "Feedback", "Progress"].map((t, i) => (
              <button key={i} onClick={() => setTab(["questions","mock","feedback","progress"][i])}
                className="text-white/30 text-xs hover:text-white transition-colors">
                {t}
              </button>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  const [tab, setTab] = useState("home");
  const [field, setField] = useState("");
  const [showAuth, setShowAuth] = useState(false);
  const { user, loading } = useAuth();

  const NAV_TABS = ["home","questions","mock","feedback","progress","portfolio","daily"]
  const NAV_LABELS = ["Home","Questions","Mock Interview","Feedback","Progress","Portfolio","Daily Challenge"]
  const navigateToTab = (nextTab) => {
    if (PROTECTED_TABS.has(nextTab) && !user) {
      setShowAuth(true)
      return
    }
    setTab(nextTab)
  }

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
              <button key={t} onClick={() => navigateToTab(t)}
                className={`text-sm font-medium transition-all duration-300 ${tab === t ? "text-orange-400" : "text-white/40 hover:text-white"}`}>
                {NAV_LABELS[i]}
              </button>
            ))}
          </div>

          {!loading && (
            user ? (
              <UserMenu user={user} />
            ) : (
              <button onClick={() => setShowAuth(true)}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white text-sm font-semibold shadow-md shadow-orange-500/30 hover:shadow-lg hover:scale-105 transition-all duration-300">
                Login / Sign Up
              </button>
            )
          )}
        </div>
      </nav>

      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}

      <div className={tab === "home" ? "" : "max-w-4xl mx-auto px-6 py-12"}>
        {tab === "home" && <HomePage onNavigate={navigateToTab} field={field} setField={setField} />}

        {tab === "questions" && (
          <div className="bg-[#3a1a1f] border border-white/10 rounded-3xl p-8 text-white relative">
            <button onClick={() => setTab("home")} className="mb-4 text-white/50 hover:text-amber-300 text-sm font-medium flex items-center gap-2 transition-all duration-300">← Back to Home</button>
            <ProtectedPage user={user} setShowAuth={setShowAuth}>
              <Questions field={field} setField={setField} />
            </ProtectedPage>
          </div>
        )}
        {tab === "mock" && (
          <div className="bg-[#3a1a1f] border border-white/10 rounded-3xl p-8 text-white relative">
            <button onClick={() => setTab("home")} className="mb-4 text-white/50 hover:text-amber-300 text-sm font-medium flex items-center gap-2 transition-all duration-300">← Back to Home</button>
            <ProtectedPage user={user} setShowAuth={setShowAuth}>
              <MockInterview field={field} />
            </ProtectedPage>
          </div>
        )}
        {tab === "feedback" && (
          <div className="bg-[#3a1a1f] border border-white/10 rounded-3xl p-8 text-white relative">
            <button onClick={() => setTab("home")} className="mb-4 text-white/50 hover:text-amber-300 text-sm font-medium flex items-center gap-2 transition-all duration-300">← Back to Home</button>
            <ProtectedPage user={user} setShowAuth={setShowAuth}>
              <Feedback />
            </ProtectedPage>
          </div>
        )}
        {tab === "progress" && (
          <div className="bg-[#3a1a1f] border border-white/10 rounded-3xl p-8 text-white relative">
            <button onClick={() => setTab("home")} className="mb-4 text-white/50 hover:text-amber-300 text-sm font-medium flex items-center gap-2 transition-all duration-300">← Back to Home</button>
            <ProtectedPage user={user} setShowAuth={setShowAuth}>
              <Progress />
            </ProtectedPage>
          </div>
        )}
        {tab === "portfolio" && (
          <div className="bg-[#3a1a1f] border border-white/10 rounded-3xl p-8 text-white relative">
            <button onClick={() => setTab("home")} className="mb-4 text-white/50 hover:text-amber-300 text-sm font-medium flex items-center gap-2 transition-all duration-300">← Back to Home</button>
            <ProtectedPage user={user} setShowAuth={setShowAuth}>
              <PortfolioAnalyzer />
            </ProtectedPage>
          </div>
        )}
        {tab === "daily" && (
          <div className="bg-[#3a1a1f] border border-white/10 rounded-3xl p-8 text-white relative">
            <button onClick={() => setTab("home")} className="mb-4 text-white/50 hover:text-amber-300 text-sm font-medium flex items-center gap-2 transition-all duration-300">← Back to Home</button>
            <ProtectedPage user={user} setShowAuth={setShowAuth}>
              <DailyChallenge />
            </ProtectedPage>
          </div>
        )}
      </div>
    </div>
  );
}