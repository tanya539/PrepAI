import { useState } from "react"

async function generateQuestions(field) {
  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: "You are an interview question generator. Reply with ONLY a numbered list of 8 interview questions, no extra text, no intro, no explanation."
        },
        {
          role: "user",
          content: `Generate 8 common interview questions for a ${field} student/candidate, mix of technical and HR questions.`
        }
      ]
    })
  })
  const data = await res.json()
  const text = data.choices[0].message.content
  return text
    .split("\n")
    .map(line => line.replace(/^\d+[\.\)]\s*/, "").trim())
    .filter(line => line.length > 0)
}

function Questions({ field, setField }) {
  const [localField, setLocalField] = useState(field || "")
  const [questions, setQuestions] = useState([])
  const [loading, setLoading] = useState(false)

  const handleGenerate = async () => {
    if (!localField.trim()) return
    setLoading(true)
    setQuestions([])
    if (setField) setField(localField)
    const qs = await generateQuestions(localField)
    setQuestions(qs)
    setLoading(false)
  }

  return (
    <div>
      <h2 className="text-3xl font-bold mb-2 text-center">
        Interview <span className="text-emerald-400">Questions</span>
      </h2>
      <p className="text-slate-400 text-center mb-8">
        Enter your field and get AI-generated interview questions
      </p>

      <div className="flex gap-3 mb-8 max-w-xl mx-auto">
        <input
          value={localField}
          onChange={(e) => setLocalField(e.target.value)}
          placeholder="e.g. B.Tech CSE, Law, B.Pharma, MBA..."
          className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
        />
        <button
          onClick={handleGenerate}
          disabled={loading || !localField.trim()}
          className="bg-emerald-500 hover:bg-emerald-400 text-[#06120f] px-6 rounded-xl font-semibold disabled:opacity-40"
        >
          {loading ? "Generating..." : "Generate"}
        </button>
      </div>

      {loading && (
        <p className="text-center text-slate-400">AI is generating questions...</p>
      )}

      {!loading && questions.length === 0 && (
        <p className="text-center text-slate-500">Enter a field above and click Generate</p>
      )}

      <div className="space-y-3">
        {questions.map((q, i) => (
          <div key={i} className="bg-slate-800 border border-slate-700 rounded-xl px-5 py-4 text-slate-200 flex gap-3">
            <span className="text-emerald-400 font-bold">{i + 1}.</span>
            {q}
          </div>
        ))}
      </div>
    </div>
  )
}

export default Questions