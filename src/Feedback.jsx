import { useState, useEffect, useRef } from "react"

// ─── Filler words list ───────────────────────────────────────────────
const FILLER_WORDS = ["um", "uh", "like", "basically", "literally", "actually", "you know", "i mean", "sort of", "kind of", "right", "okay", "so", "well", "just"]

function detectFillers(text) {
  const lower = text.toLowerCase()
  const found = {}
  FILLER_WORDS.forEach(word => {
    const regex = new RegExp(`\\b${word}\\b`, "gi")
    const matches = lower.match(regex)
    if (matches) found[word] = matches.length
  })
  return found
}

// ─── Main feedback API ───────────────────────────────────────────────
async function getFeedback(question, answer, type, difficulty) {
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
          content: `You are an expert interview coach. The question difficulty is ${difficulty}. Adjust your feedback strictness accordingly (Easy = lenient, Medium = balanced, Hard = strict). Analyze the answer and respond ONLY in this exact format:
STRENGTHS: (2-3 bullet points starting with •)
IMPROVEMENTS: (2-3 bullet points starting with •)
BETTER ANSWER TIP: (1-2 sentences)
IMPROVED ANSWER: (rewrite the user's answer as a stronger, more polished full answer, 3-5 sentences)
TONE: (exactly one word: Confident or Nervous or Professional or Casual or Aggressive)
TONE REASON: (1 sentence explaining the tone detected)
STAR CHECK: (only if question type is Behavioral - write YES if answer follows Situation-Task-Action-Result format, else NO)
STAR FEEDBACK: (only if Behavioral - 1-2 sentences on how well STAR was followed or what's missing)
SCORE: X/10
VERDICT: (exactly one word: Excellent or Good or Average or Weak)`
        },
        {
          role: "user",
          content: `Question Type: ${type}\nDifficulty: ${difficulty}\nQuestion: ${question}\nAnswer: ${answer}`
        }
      ]
    })
  })
  const data = await res.json()
  return data.choices[0].message.content
}

// ─── Comparison API ──────────────────────────────────────────────────
async function compareAnswers(question, answer1, answer2, type) {
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
          content: `You are an expert interview coach comparing two answers to the same question. Respond ONLY in this exact format:
WINNER: (exactly "Answer 1" or "Answer 2" or "Tie")
ANSWER1 SCORE: X/10
ANSWER2 SCORE: X/10
ANSWER1 STRENGTHS: (1-2 bullet points starting with •)
ANSWER2 STRENGTHS: (1-2 bullet points starting with •)
ANSWER1 WEAKNESS: (1 sentence)
ANSWER2 WEAKNESS: (1 sentence)
WHY WINNER: (2-3 sentences explaining which answer is better and why)`
        },
        {
          role: "user",
          content: `Question Type: ${type}\nQuestion: ${question}\nAnswer 1: ${answer1}\nAnswer 2: ${answer2}`
        }
      ]
    })
  })
  const data = await res.json()
  return data.choices[0].message.content
}

// ─── Constants ───────────────────────────────────────────────────────
const SAMPLE_QUESTIONS = {
  "HR": "Tell me about yourself.",
  "Technical": "What is the difference between process and thread?",
  "Behavioral": "Describe a challenge you faced and how you overcame it.",
  "Cybersecurity": "What is the CIA triad?",
  "System Design": "How would you design a URL shortener?",
  "Coding": "Explain the time complexity of binary search.",
  "Case Study": "How would you handle a sudden drop in user signups?",
  "Salary Negotiation": "What are your salary expectations for this role?",
}

const QUESTION_TYPES = ["HR", "Technical", "Behavioral", "Cybersecurity", "System Design", "Coding", "Case Study", "Salary Negotiation"]
const DIFFICULTY_LEVELS = ["Easy", "Medium", "Hard"]
const HISTORY_KEY = "prepai_feedback_history"

// ─── Score Ring ──────────────────────────────────────────────────────
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

// ─── Tone Badge ──────────────────────────────────────────────────────
function ToneBadge({ tone }) {
  const config = {
    Confident:    { color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20", emoji: "💪" },
    Professional: { color: "text-cyan-400",    bg: "bg-cyan-500/10 border-cyan-500/20",       emoji: "🎯" },
    Nervous:      { color: "text-amber-400",   bg: "bg-amber-500/10 border-amber-500/20",     emoji: "😟" },
    Casual:       { color: "text-blue-400",    bg: "bg-blue-500/10 border-blue-500/20",       emoji: "😊" },
    Aggressive:   { color: "text-red-400",     bg: "bg-red-500/10 border-red-500/20",         emoji: "⚡" },
  }
  const c = config[tone] || { color: "text-white/60", bg: "bg-white/5 border-white/10", emoji: "🎙️" }
  return (
    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full border text-xs font-semibold ${c.bg} ${c.color}`}>
      {c.emoji} {tone}
    </span>
  )
}

// ─── STAR Checker ────────────────────────────────────────────────────
function StarChecker({ passed, feedback }) {
  const letters = ["S", "T", "A", "R"]
  const fullNames = ["Situation", "Task", "Action", "Result"]
  return (
    <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="text-indigo-400 font-semibold text-sm">⭐ STAR Method Check</div>
        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${passed ? "bg-emerald-500/20 text-emerald-400" : "bg-red-500/20 text-red-400"}`}>
          {passed ? "✓ Followed" : "✗ Incomplete"}
        </span>
      </div>
      <div className="flex gap-2 mb-3">
        {letters.map((l, i) => (
          <div key={l} className={`flex-1 rounded-lg py-2 text-center border ${passed ? "border-indigo-500/30 bg-indigo-500/10" : "border-white/5 bg-white/5"}`}>
            <div className={`font-black text-base ${passed ? "text-indigo-400" : "text-white/20"}`}>{l}</div>
            <div className="text-white/30 text-[10px]">{fullNames[i]}</div>
          </div>
        ))}
      </div>
      {feedback && <div className="text-white/60 text-xs leading-relaxed">{feedback}</div>}
    </div>
  )
}

// ─── Filler Words Display ────────────────────────────────────────────
function FillerWordsPanel({ fillers }) {
  const total = Object.values(fillers).reduce((a, b) => a + b, 0)
  if (total === 0) return (
    <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4">
      <div className="text-emerald-400 font-semibold text-sm mb-1">🎉 Filler Words</div>
      <div className="text-white/60 text-xs">No filler words detected! Great job speaking clearly.</div>
    </div>
  )
  const rating = total <= 2 ? { label: "Good", color: "text-emerald-400" } : total <= 5 ? { label: "Okay", color: "text-amber-400" } : { label: "Too Many", color: "text-red-400" }
  return (
    <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="text-orange-400 font-semibold text-sm">🗣️ Filler Words Detected</div>
        <span className={`text-xs font-bold ${rating.color}`}>{total} total — {rating.label}</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {Object.entries(fillers).map(([word, count]) => (
          <span key={word} className="px-2 py-1 rounded-lg bg-orange-500/10 border border-orange-500/20 text-orange-300 text-xs">
            "{word}" ×{count}
          </span>
        ))}
      </div>
      <div className="text-white/40 text-xs mt-2">Tip: Practice pausing instead of using filler words in interviews.</div>
    </div>
  )
}

// ─── Voice Input Button ──────────────────────────────────────────────
function VoiceButton({ onTranscript, disabled }) {
  const [listening, setListening] = useState(false)
  const recognitionRef = useRef(null)

  const toggle = () => {
    if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) {
      alert("Voice input not supported in this browser. Please use Chrome.")
      return
    }
    if (listening) {
      recognitionRef.current?.stop()
      setListening(false)
      return
    }
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition
    const rec = new SR()
    rec.lang = "en-IN"
    rec.continuous = true
    rec.interimResults = false
    rec.onresult = (e) => {
      const transcript = Array.from(e.results).map(r => r[0].transcript).join(" ")
      onTranscript(transcript)
    }
    rec.onerror = () => { setListening(false) }
    rec.onend = () => { setListening(false) }
    rec.start()
    recognitionRef.current = rec
    setListening(true)
  }

  return (
    <button type="button" onClick={toggle} disabled={disabled}
      title={listening ? "Stop recording" : "Speak your answer"}
      className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
        listening
          ? "bg-red-500/20 border-red-500/40 text-red-400 animate-pulse"
          : "bg-white/5 border-white/10 text-white/50 hover:text-white hover:bg-white/10"
      }`}>
      {listening ? "🔴 Stop" : "🎤 Speak"}
    </button>
  )
}

// ─── Main Component ──────────────────────────────────────────────────
function Feedback() {
  const [mode, setMode] = useState("single")

  // Single mode
  const [question, setQuestion] = useState("")
  const [answer, setAnswer] = useState("")
  const [type, setType] = useState("HR")
  const [difficulty, setDifficulty] = useState("Medium")
  const [feedback, setFeedback] = useState(null)
  const [loading, setLoading] = useState(false)
  const [fillers, setFillers] = useState(null)

  // Compare mode
  const [cmpQuestion, setCmpQuestion] = useState("")
  const [cmpAnswer1, setCmpAnswer1] = useState("")
  const [cmpAnswer2, setCmpAnswer2] = useState("")
  const [cmpType, setCmpType] = useState("HR")
  const [cmpResult, setCmpResult] = useState(null)
  const [cmpLoading, setCmpLoading] = useState(false)

  // History
  const [history, setHistory] = useState([])
  const [showHistory, setShowHistory] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem(HISTORY_KEY)
    if (saved) { try { setHistory(JSON.parse(saved)) } catch {} }
  }, [])

  const saveToHistory = (entry) => {
    const updated = [entry, ...history].slice(0, 20)
    setHistory(updated)
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updated))
  }

  const deleteHistoryItem = (id) => {
    const updated = history.filter(h => h.id !== id)
    setHistory(updated)
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updated))
  }

  const clearHistory = () => {
    setHistory([])
    localStorage.removeItem(HISTORY_KEY)
  }

  const loadHistoryItem = (item) => {
    setQuestion(item.question)
    setAnswer(item.answer)
    setType(item.type)
    setDifficulty(item.difficulty || "Medium")
    setFeedback(item.feedback)
    setFillers(item.fillers || null)
    setMode("single")
    setShowHistory(false)
  }

  const handleSubmit = async () => {
    if (!question.trim() || !answer.trim()) return
    setLoading(true)
    setFeedback(null)
    setFillers(null)

    // Detect fillers instantly
    const detectedFillers = detectFillers(answer)
    setFillers(detectedFillers)

    const result = await getFeedback(question, answer, type, difficulty)
    setFeedback(result)
    setLoading(false)
    const sc = parseScore(result)
    saveToHistory({
      id: Date.now(), question, answer, type, difficulty,
      feedback: result, score: sc, fillers: detectedFillers,
      date: new Date().toLocaleString()
    })
  }

  const handleCompare = async () => {
    if (!cmpQuestion.trim() || !cmpAnswer1.trim() || !cmpAnswer2.trim()) return
    setCmpLoading(true)
    setCmpResult(null)
    const result = await compareAnswers(cmpQuestion, cmpAnswer1, cmpAnswer2, cmpType)
    setCmpResult(result)
    setCmpLoading(false)
  }

  const parseScore = (text) => {
    const match = text?.match(/SCORE:\s*(\d+)\/10/)
    return match ? parseInt(match[1]) : null
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

  const score = parseScore(feedback)
  const sections = parseSections(feedback)
  const cmpSections = parseSections(cmpResult)
  const winner = cmpSections["WINNER"]
  const score1 = cmpSections["ANSWER1 SCORE"]?.match(/(\d+)/)?.[1]
  const score2 = cmpSections["ANSWER2 SCORE"]?.match(/(\d+)/)?.[1]

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="w-20" />
        <h2 className="text-3xl font-bold text-center text-white">
          AI <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-400">Feedback</span>
        </h2>
        <button onClick={() => setShowHistory(s => !s)}
          className="text-xs font-medium px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10 transition-all">
          🕑 History
        </button>
      </div>
      <p className="text-white/40 text-center text-sm mb-6">Paste any question + your answer — get instant analysis</p>

      {/* Mode toggle */}
      <div className="flex gap-2 justify-center mb-6">
        {["single", "compare"].map(m => (
          <button key={m} onClick={() => setMode(m)}
            className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${
              mode === m
                ? "bg-gradient-to-r from-violet-600 to-cyan-600 text-white shadow-lg"
                : "bg-white/5 text-white/50 border border-white/10 hover:text-white"
            }`}>
            {m === "single" ? "⚡ Single Analysis" : "⚔️ Compare Mode"}
          </button>
        ))}
      </div>

      {/* History panel */}
      {showHistory && (
        <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-4 mb-6 space-y-2 max-h-72 overflow-y-auto">
          <div className="flex items-center justify-between mb-2">
            <span className="text-white/50 text-xs font-semibold uppercase tracking-wider">Past Feedback ({history.length})</span>
            {history.length > 0 && (
              <button onClick={clearHistory} className="text-red-400 text-xs hover:text-red-300">Clear All</button>
            )}
          </div>
          {history.length === 0 && <p className="text-white/30 text-sm text-center py-4">No history yet</p>}
          {history.map(item => (
            <div key={item.id} className="flex items-center justify-between bg-white/5 rounded-lg px-3 py-2 hover:bg-white/10 transition-all">
              <button onClick={() => loadHistoryItem(item)} className="flex-1 text-left">
                <div className="text-white/80 text-sm truncate">{item.question}</div>
                <div className="text-white/30 text-xs">
                  {item.type} • {item.difficulty || "Medium"} • {item.date}
                  {item.score !== null && ` • ${item.score}/10`}
                </div>
              </button>
              <button onClick={() => deleteHistoryItem(item.id)} className="text-white/30 hover:text-red-400 px-2 text-sm">✕</button>
            </div>
          ))}
        </div>
      )}

      {/* ── SINGLE MODE ── */}
      {mode === "single" && (
        <>
          <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 space-y-4 mb-6">

            {/* Type + Difficulty row */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex-1">
                <label className="text-white/50 text-xs font-semibold uppercase tracking-wider block mb-2">Question Type</label>
                <div className="flex gap-2 flex-wrap">
                  {QUESTION_TYPES.map(t => (
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
            </div>

            {/* Difficulty selector */}
            <div>
              <label className="text-white/50 text-xs font-semibold uppercase tracking-wider block mb-2">Difficulty Level</label>
              <div className="flex gap-2">
                {DIFFICULTY_LEVELS.map(d => {
                  const colors = {
                    Easy: type === d || difficulty === d ? "bg-emerald-600 text-white" : "bg-white/5 text-emerald-400/70 border border-emerald-500/20 hover:bg-emerald-500/10",
                    Medium: difficulty === d ? "bg-amber-500 text-white" : "bg-white/5 text-amber-400/70 border border-amber-500/20 hover:bg-amber-500/10",
                    Hard: difficulty === d ? "bg-red-600 text-white" : "bg-white/5 text-red-400/70 border border-red-500/20 hover:bg-red-500/10",
                  }
                  const icons = { Easy: "🟢", Medium: "🟡", Hard: "🔴" }
                  return (
                    <button key={d} onClick={() => setDifficulty(d)}
                      className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${
                        difficulty === d
                          ? d === "Easy" ? "bg-emerald-600 text-white shadow-lg"
                          : d === "Medium" ? "bg-amber-500 text-white shadow-lg"
                          : "bg-red-600 text-white shadow-lg"
                          : "bg-white/5 text-white/50 border border-white/10 hover:text-white"
                      }`}>
                      {icons[d]} {d}
                    </button>
                  )
                })}
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

            {/* Question */}
            <div>
              <label className="text-white/50 text-xs font-semibold uppercase tracking-wider block mb-2">Interview Question</label>
              <input value={question} onChange={e => setQuestion(e.target.value)}
                placeholder="e.g. Tell me about yourself"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-violet-500 transition-all text-sm" />
            </div>

            {/* Answer + Voice */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-white/50 text-xs font-semibold uppercase tracking-wider">Your Answer</label>
                <VoiceButton
                  disabled={loading}
                  onTranscript={(t) => setAnswer(prev => prev ? prev + " " + t : t)}
                />
              </div>
              <textarea value={answer} onChange={e => setAnswer(e.target.value)}
                placeholder="Type your answer here, or click 🎤 Speak to use voice input..."
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

          {/* Filler words - shown immediately after submit */}
          {fillers && !loading && Object.keys(fillers).length >= 0 && (
            <div className="mb-4">
              <FillerWordsPanel fillers={fillers} />
            </div>
          )}

          {/* Result */}
          {feedback && !loading && (
            <div className="bg-white/[0.03] border border-violet-500/20 rounded-2xl p-6 space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-white font-bold text-lg">Analysis Result</h3>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full mt-1 inline-block ${
                    difficulty === "Easy" ? "bg-emerald-500/20 text-emerald-400"
                    : difficulty === "Medium" ? "bg-amber-500/20 text-amber-400"
                    : "bg-red-500/20 text-red-400"
                  }`}>
                    {difficulty === "Easy" ? "🟢" : difficulty === "Medium" ? "🟡" : "🔴"} {difficulty} Difficulty
                  </span>
                </div>
                {score !== null && <ScoreRing score={score} />}
              </div>

              {sections["TONE"] && (
                <div className="bg-white/[0.03] border border-white/10 rounded-xl p-4">
                  <div className="text-white/50 font-semibold text-xs uppercase tracking-wider mb-2">🎙️ Tone Detected</div>
                  <div className="flex items-center gap-3">
                    <ToneBadge tone={sections["TONE"]} />
                    {sections["TONE REASON"] && (
                      <span className="text-white/50 text-xs">{sections["TONE REASON"]}</span>
                    )}
                  </div>
                </div>
              )}

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

              {type === "Behavioral" && sections["STAR CHECK"] && (
                <StarChecker
                  passed={sections["STAR CHECK"]?.toUpperCase().includes("YES")}
                  feedback={sections["STAR FEEDBACK"]}
                />
              )}

              {sections["BETTER ANSWER TIP"] && (
                <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-xl p-4">
                  <div className="text-cyan-400 font-semibold text-sm mb-2">💡 Better Answer Tip</div>
                  <div className="text-white/70 text-sm leading-relaxed">{sections["BETTER ANSWER TIP"]}</div>
                </div>
              )}

              {sections["IMPROVED ANSWER"] && (
                <div className="bg-violet-500/10 border border-violet-500/20 rounded-xl p-4">
                  <div className="text-violet-400 font-semibold text-sm mb-2">✨ Improved Answer</div>
                  <div className="text-white/70 text-sm leading-relaxed">{sections["IMPROVED ANSWER"]}</div>
                </div>
              )}
            </div>
          )}
        </>
      )}

      {/* ── COMPARE MODE ── */}
      {mode === "compare" && (
        <>
          <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 space-y-4 mb-6">
            <div>
              <label className="text-white/50 text-xs font-semibold uppercase tracking-wider block mb-2">Question Type</label>
              <div className="flex gap-2 flex-wrap">
                {QUESTION_TYPES.map(t => (
                  <button key={t} onClick={() => setCmpType(t)}
                    className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                      cmpType === t
                        ? "bg-gradient-to-r from-violet-600 to-cyan-600 text-white shadow-lg"
                        : "bg-white/5 text-white/50 border border-white/10 hover:text-white"
                    }`}>
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-white/50 text-xs font-semibold uppercase tracking-wider block mb-2">Interview Question</label>
              <input value={cmpQuestion} onChange={e => setCmpQuestion(e.target.value)}
                placeholder="e.g. Tell me about yourself"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-violet-500 transition-all text-sm" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-white/50 text-xs font-semibold uppercase tracking-wider">Answer 1</label>
                  <VoiceButton disabled={cmpLoading} onTranscript={(t) => setCmpAnswer1(prev => prev ? prev + " " + t : t)} />
                </div>
                <textarea value={cmpAnswer1} onChange={e => setCmpAnswer1(e.target.value)}
                  placeholder="Your first answer..."
                  rows={5}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 resize-none focus:outline-none focus:border-violet-500 transition-all text-sm" />
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-white/50 text-xs font-semibold uppercase tracking-wider">Answer 2</label>
                  <VoiceButton disabled={cmpLoading} onTranscript={(t) => setCmpAnswer2(prev => prev ? prev + " " + t : t)} />
                </div>
                <textarea value={cmpAnswer2} onChange={e => setCmpAnswer2(e.target.value)}
                  placeholder="Your second answer..."
                  rows={5}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 resize-none focus:outline-none focus:border-violet-500 transition-all text-sm" />
              </div>
            </div>

            <button onClick={handleCompare} disabled={cmpLoading || !cmpQuestion.trim() || !cmpAnswer1.trim() || !cmpAnswer2.trim()}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-600 text-white font-bold text-base shadow-lg shadow-violet-500/30 hover:scale-[1.02] transition-all disabled:opacity-40 disabled:cursor-not-allowed">
              {cmpLoading ? "⚔️ Comparing answers..." : "⚔️ Compare Answers"}
            </button>
          </div>

          {cmpLoading && (
            <div className="text-center py-8">
              <div className="flex gap-1 justify-center mb-3">
                {[1,2,3,4,5].map(i => (
                  <div key={i} className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: `${i * 0.1}s` }} />
                ))}
              </div>
              <p className="text-white/40 text-sm">AI is comparing both answers...</p>
            </div>
          )}

          {cmpResult && !cmpLoading && (
            <div className="bg-white/[0.03] border border-violet-500/20 rounded-2xl p-6 space-y-5">
              {winner && (
                <div className={`rounded-xl p-4 text-center border ${
                  winner === "Tie" ? "bg-amber-500/10 border-amber-500/20" : "bg-emerald-500/10 border-emerald-500/20"
                }`}>
                  <div className="text-2xl mb-1">{winner === "Tie" ? "🤝" : "🏆"}</div>
                  <div className={`font-black text-lg ${winner === "Tie" ? "text-amber-400" : "text-emerald-400"}`}>
                    {winner === "Tie" ? "It's a Tie!" : `${winner} Wins!`}
                  </div>
                  {cmpSections["WHY WINNER"] && (
                    <div className="text-white/50 text-sm mt-2">{cmpSections["WHY WINNER"]}</div>
                  )}
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className={`rounded-xl p-4 border space-y-3 ${winner === "Answer 1" ? "border-emerald-500/40 bg-emerald-500/5" : "border-white/10 bg-white/[0.03]"}`}>
                  <div className="flex items-center justify-between">
                    <span className="text-white/70 font-semibold text-sm">Answer 1</span>
                    {score1 && <span className="text-white font-black text-lg">{score1}<span className="text-white/30 text-xs">/10</span></span>}
                  </div>
                  {cmpSections["ANSWER1 STRENGTHS"] && (
                    <div>
                      <div className="text-emerald-400 text-xs font-semibold mb-1">✅ Strengths</div>
                      <div className="text-white/60 text-xs whitespace-pre-line leading-relaxed">{cmpSections["ANSWER1 STRENGTHS"]}</div>
                    </div>
                  )}
                  {cmpSections["ANSWER1 WEAKNESS"] && (
                    <div>
                      <div className="text-red-400 text-xs font-semibold mb-1">❌ Weakness</div>
                      <div className="text-white/60 text-xs leading-relaxed">{cmpSections["ANSWER1 WEAKNESS"]}</div>
                    </div>
                  )}
                </div>

                <div className={`rounded-xl p-4 border space-y-3 ${winner === "Answer 2" ? "border-emerald-500/40 bg-emerald-500/5" : "border-white/10 bg-white/[0.03]"}`}>
                  <div className="flex items-center justify-between">
                    <span className="text-white/70 font-semibold text-sm">Answer 2</span>
                    {score2 && <span className="text-white font-black text-lg">{score2}<span className="text-white/30 text-xs">/10</span></span>}
                  </div>
                  {cmpSections["ANSWER2 STRENGTHS"] && (
                    <div>
                      <div className="text-emerald-400 text-xs font-semibold mb-1">✅ Strengths</div>
                      <div className="text-white/60 text-xs whitespace-pre-line leading-relaxed">{cmpSections["ANSWER2 STRENGTHS"]}</div>
                    </div>
                  )}
                  {cmpSections["ANSWER2 WEAKNESS"] && (
                    <div>
                      <div className="text-red-400 text-xs font-semibold mb-1">❌ Weakness</div>
                      <div className="text-white/60 text-xs leading-relaxed">{cmpSections["ANSWER2 WEAKNESS"]}</div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default Feedback