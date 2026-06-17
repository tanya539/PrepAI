import { useState } from "react"

async function analyzePortfolio(code) {
  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: `You are an expert frontend developer and UI/UX reviewer. Analyze the given portfolio code and respond ONLY in this exact format:
RESPONSIVENESS SCORE: X/10
RESPONSIVENESS FEEDBACK: (2-3 bullet points starting with •)
ACCESSIBILITY SCORE: X/10
ACCESSIBILITY FEEDBACK: (2-3 bullet points starting with •)
PERFORMANCE SCORE: X/10
PERFORMANCE FEEDBACK: (2-3 bullet points starting with •)
UI SCORE: X/10
UI FEEDBACK: (2-3 bullet points starting with •)
OVERALL SCORE: X/10
TOP SUGGESTIONS: (3-4 most impactful improvements, bullet points starting with •)
VERDICT: (exactly one word: Excellent or Good or Average or Weak)`
        },
        {
          role: "user",
          content: `Analyze this portfolio code:\n\n${code}`
        }
      ]
    })
  })
  const data = await res.json()
  return data.choices[0].message.content
}

function ScoreBar({ score, color }) {
  const colors = {
    blue: { bar: "bg-blue-500", text: "text-blue-400" },
    emerald: { bar: "bg-emerald-500", text: "text-emerald-400" },
    amber: { bar: "bg-amber-500", text: "text-amber-400" },
    violet: { bar: "bg-violet-500", text: "text-violet-400" },
  }
  const c = colors[color] || colors.blue
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${c.bar} transition-all duration-700`} style={{ width: `${score * 10}%` }} />
      </div>
      <span className={`text-sm font-black w-10 text-right ${c.text}`}>{score}/10</span>
    </div>
  )
}

function Section({ title, score, feedback, color, emoji }) {
  const bgColors = {
    blue: "bg-blue-500/10 border-blue-500/20",
    emerald: "bg-emerald-500/10 border-emerald-500/20",
    amber: "bg-amber-500/10 border-amber-500/20",
    violet: "bg-violet-500/10 border-violet-500/20",
  }
  const textColors = {
    blue: "text-blue-400",
    emerald: "text-emerald-400",
    amber: "text-amber-400",
    violet: "text-violet-400",
  }
  return (
    <div className={`rounded-xl p-4 border ${bgColors[color]}`}>
      <div className="flex items-center justify-between mb-2">
        <div className={`font-semibold text-sm ${textColors[color]}`}>{emoji} {title}</div>
      </div>
      <ScoreBar score={score} color={color} />
      {feedback && (
        <div className="text-white/60 text-xs leading-relaxed whitespace-pre-line mt-3">{feedback}</div>
      )}
    </div>
  )
}

function PortfolioAnalyzer() {
  const [code, setCode] = useState("")
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleAnalyze = async () => {
    if (!code.trim()) return
    setLoading(true)
    setResult(null)
    const res = await analyzePortfolio(code)
    setResult(res)
    setLoading(false)
  }

  const parseSections = (text) => {
    if (!text) return {}
    const sections = {}
    const parts = text.split(/\n(?=[A-Z][A-Z0-9 ]+:)/)
    parts.forEach(part => {
      const colonIdx = part.indexOf(":")
      if (colonIdx !== -1) {
        const key = part.slice(0, colonIdx).trim()
        const val = part.slice(colonIdx + 1).trim()
        sections[key] = val
      }
    })
    return sections
  }

  const parseScore = (val) => {
    const match = val?.match(/(\d+)/)
    return match ? parseInt(match[1]) : 0
  }

  const s = parseSections(result)
  const overallScore = parseScore(s["OVERALL SCORE"])
  const verdictColor = overallScore >= 8 ? "text-emerald-400" : overallScore >= 5 ? "text-amber-400" : "text-red-400"
  const verdictBg = overallScore >= 8 ? "bg-emerald-500/10 border-emerald-500/20" : overallScore >= 5 ? "bg-amber-500/10 border-amber-500/20" : "bg-red-500/10 border-red-500/20"

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <h2 className="text-3xl font-bold text-center text-white mb-2">
        🗂️ Portfolio <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-400">Analyzer</span>
      </h2>
      <p className="text-white/40 text-center text-sm mb-8">Paste your portfolio HTML/CSS/JSX code — get instant AI analysis</p>

      {/* Input */}
      <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 space-y-4 mb-6">
        <div>
          <label className="text-white/50 text-xs font-semibold uppercase tracking-wider block mb-2">
            Your Portfolio Code (HTML / CSS / JSX)
          </label>
          <textarea
            value={code}
            onChange={e => setCode(e.target.value)}
            placeholder={`Paste your portfolio code here...\n\nExample:\n<!DOCTYPE html>\n<html>\n  <head>...</head>\n  <body>...</body>\n</html>`}
            rows={10}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 resize-none focus:outline-none focus:border-orange-500 transition-all text-sm font-mono"
          />
          <div className="text-right text-white/20 text-xs mt-1">{code.length} characters</div>
        </div>

        <button
          onClick={handleAnalyze}
          disabled={loading || !code.trim()}
          className="w-full py-4 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold text-base shadow-lg shadow-orange-500/30 hover:scale-[1.02] transition-all disabled:opacity-40 disabled:cursor-not-allowed">
          {loading ? "🔍 Analyzing your portfolio..." : "🚀 Analyze Portfolio"}
        </button>
      </div>

      {/* Loading */}
      {loading && (
        <div className="text-center py-8">
          <div className="flex gap-1 justify-center mb-3">
            {[1,2,3,4,5].map(i => (
              <div key={i} className="w-2 h-2 rounded-full bg-orange-400 animate-bounce" style={{ animationDelay: `${i * 0.1}s` }} />
            ))}
          </div>
          <p className="text-white/40 text-sm">AI is reviewing your portfolio...</p>
        </div>
      )}

      {/* Result */}
      {result && !loading && (
        <div className="space-y-4">
          {/* Overall score */}
          <div className={`rounded-2xl p-5 border text-center ${verdictBg}`}>
            <div className="text-white/50 text-xs font-semibold uppercase tracking-wider mb-1">Overall Score</div>
            <div className={`text-5xl font-black ${verdictColor}`}>{overallScore}<span className="text-2xl text-white/30">/10</span></div>
            {s["VERDICT"] && (
              <div className={`text-sm font-bold mt-1 ${verdictColor}`}>{s["VERDICT"]}</div>
            )}
          </div>

          {/* 4 scores */}
          <div className="grid grid-cols-1 gap-4">
            {s["RESPONSIVENESS SCORE"] && (
              <Section
                title="Responsiveness"
                score={parseScore(s["RESPONSIVENESS SCORE"])}
                feedback={s["RESPONSIVENESS FEEDBACK"]}
                color="blue"
                emoji="📱"
              />
            )}
            {s["ACCESSIBILITY SCORE"] && (
              <Section
                title="Accessibility"
                score={parseScore(s["ACCESSIBILITY SCORE"])}
                feedback={s["ACCESSIBILITY FEEDBACK"]}
                color="emerald"
                emoji="♿"
              />
            )}
            {s["PERFORMANCE SCORE"] && (
              <Section
                title="Performance"
                score={parseScore(s["PERFORMANCE SCORE"])}
                feedback={s["PERFORMANCE FEEDBACK"]}
                color="amber"
                emoji="⚡"
              />
            )}
            {s["UI SCORE"] && (
              <Section
                title="UI / Design"
                score={parseScore(s["UI SCORE"])}
                feedback={s["UI FEEDBACK"]}
                color="violet"
                emoji="🎨"
              />
            )}
          </div>

          {/* Top suggestions */}
          {s["TOP SUGGESTIONS"] && (
            <div className="bg-white/[0.03] border border-white/10 rounded-xl p-4">
              <div className="text-white font-semibold text-sm mb-3">💡 Top Suggestions to Improve</div>
              <div className="text-white/60 text-sm leading-relaxed whitespace-pre-line">{s["TOP SUGGESTIONS"]}</div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default PortfolioAnalyzer