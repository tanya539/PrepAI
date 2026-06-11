import { useState } from "react"

async function getFeedback(question, answer, type) {
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
          content: "You are an expert interview coach. Analyze the answer and respond ONLY in this exact format:\nSTRENGTHS: (2-3 bullet points starting with •)\nIMPROVEMENTS: (2-3 bullet points starting with •)\nBETTER ANSWER TIP: (1-2 sentences)\nSCORE: X/10\nVERDICT: (exactly one word: Excellent or Good or Average or Weak)"
        },
        {
          role: "user",
          content: `Question Type: ${type}\nQuestion: ${question}\nAnswer: ${answer}`
        }
      ]
    })
  })
  const data = await res.json()
  return data.choices[0].message.content
}

const SAMPLE_QUESTIONS = {
  "HR": "Tell me about yourself.",
  "Technical": "What is the difference between process and thread?",
  "Behavioral": "Describe a challenge you faced and how you overcame it.",
  "Cybersecurity": "What is the CIA triad?",
}

function ScoreRing({ score }) {
  const color = score >= 8 ? "#10b981" : score >= 5 ? "#f59e0b" : "#ef4444"
  const label = score >= 8 ? "Excellent" : score >= 5 ? "Good" : "Needs Work"
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative w-20 h-20">
        <svg viewBox="0 0 36 36" className="w-20 h-20 -rotate-90">
          <circle cx="18" cy="18" r="15" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="3" />
          <circle cx="18" cy="18" r="15" fill="none" stroke={color} strokeWidth="3"
            strokeDasharray={`${score * 9.4} 94`} strokeLinecap="round" />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xl font-black text-white">{score}</span>
        </div>
      </div>
      <span className="text-xs font-semibold" style={{ color }}>{label}</span>
    </div>
  )
}

function Feedback() {
  const [question, setQuestion] = useState("")
  const [answer, setAnswer] = useState("")
  const [type, setType] = useState("HR")
  const [feedback, setFeedback] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    if (!question.trim() || !answer.trim()) return
    setLoading(true)
    setFeedback(null)
    const result = await getFeedback(question, answer, type)
    setFeedback(result)
    setLoading(false)
  }

  const parseScore = (text) => {
    const match = text?.match(/SCORE:\s*(\d+)\/10/)
    return match ? parseInt(match[1]) : null
  }

  const parseSections = (text) => {
    if (!text) return {}
    const sections = {}
    const parts = text.split(/\n(?=[A-Z ]+:)/)
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

  const score = parseScore(feedback)
  const sections = parseSections(feedback)

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-3xl font-bold mb-2 text-center text-white">
        AI <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-400">Feedback</span>
      </h2>
      <p className="text-white/40 text-center text-sm mb-8">Paste any question + your answer — get instant analysis</p>

      <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 space-y-4 mb-6">
        {/* Type selector */}
        <div>
          <label className="text-white/50 text-xs font-semibold uppercase tracking-wider block mb-2">Question Type</label>
          <div className="flex gap-2 flex-wrap">
            {["HR", "Technical", "Behavioral", "Cybersecurity"].map(t => (
              <button key={t} onClick={() => setType(t)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                  type === t
                    ? "bg-gradient-to-r from-violet-600 to-cyan-600 text-white shadow-lg"
                    : "bg-white/5 text-white/50 border border-white/10 hover:text-white"
                }`}>
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Quick fill */}
        <div>
          <label className="text-white/50 text-xs font-semibold uppercase tracking-wider block mb-2">Quick Fill</label>
          <div className="flex gap-2 flex-wrap">
            {Object.entries(SAMPLE_QUESTIONS).map(([t, q]) => (
              <button key={t} onClick={() => { setQuestion(q); setType(t) }}
                className="px-3 py-1 rounded-lg bg-white/5 text-white/40 text-xs border border-white/5 hover:bg-white/10 hover:text-white transition-all">
                Try: "{q.slice(0, 25)}..."
              </button>
            ))}
          </div>
        </div>

        {/* Question input */}
        <div>
          <label className="text-white/50 text-xs font-semibold uppercase tracking-wider block mb-2">Interview Question</label>
          <input value={question} onChange={e => setQuestion(e.target.value)}
            placeholder="e.g. Tell me about yourself"
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-violet-500 transition-all text-sm" />
        </div>

        {/* Answer input */}
        <div>
          <label className="text-white/50 text-xs font-semibold uppercase tracking-wider block mb-2">Your Answer</label>
          <textarea value={answer} onChange={e => setAnswer(e.target.value)}
            placeholder="Type your answer here..."
            rows={4}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 resize-none focus:outline-none focus:border-violet-500 transition-all text-sm" />
          <div className="text-right text-white/20 text-xs mt-1">{answer.length} characters</div>
        </div>

        <button onClick={handleSubmit} disabled={loading || !question.trim() || !answer.trim()}
          className="w-full py-4 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-600 text-white font-bold text-base shadow-lg shadow-violet-500/30 hover:scale-[1.02] transition-all disabled:opacity-40 disabled:cursor-not-allowed">
          {loading ? "🤖 Analyzing your answer..." : "⚡ Get AI Feedback"}
        </button>
      </div>

      {/* Loading */}
      {loading && (
        <div className="text-center py-8">
          <div className="flex gap-1 justify-center mb-3">
            {[1,2,3,4,5].map(i => (
              <div key={i} className="w-2 h-2 rounded-full bg-violet-400 animate-bounce" style={{ animationDelay: `${i * 0.1}s` }} />
            ))}
          </div>
          <p className="text-white/40 text-sm">AI is analyzing your answer...</p>
        </div>
      )}

      {/* Result */}
      {feedback && !loading && (
        <div className="bg-white/[0.03] border border-violet-500/20 rounded-2xl p-6 space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-white font-bold text-lg">Analysis Result</h3>
            {score !== null && <ScoreRing score={score} />}
          </div>

          {sections["STRENGTHS"] && (
            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4">
              <div className="text-emerald-400 font-semibold text-sm mb-2">✅ Strengths</div>
              <div className="text-white/70 text-sm leading-relaxed whitespace-pre-line">{sections["STRENGTHS"]}</div>
            </div>
          )}

          {sections["IMPROVEMENTS"] && (
            <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4">
              <div className="text-amber-400 font-semibold text-sm mb-2">⚠️ Improvements</div>
              <div className="text-white/70 text-sm leading-relaxed whitespace-pre-line">{sections["IMPROVEMENTS"]}</div>
            </div>
          )}

          {sections["BETTER ANSWER TIP"] && (
            <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-xl p-4">
              <div className="text-cyan-400 font-semibold text-sm mb-2">💡 Better Answer Tip</div>
              <div className="text-white/70 text-sm leading-relaxed">{sections["BETTER ANSWER TIP"]}</div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default Feedback