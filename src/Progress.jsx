import { useState } from "react"

function Progress() {
  const tips = [
    "Practice answering questions out loud every day.",
    "Use the STAR method for behavioral questions.",
    "Research the company before every interview.",
    "Prepare 2-3 questions to ask the interviewer.",
    "Review your projects and be ready to explain them.",
    "Work on SQL and Power BI to strengthen your profile.",
  ]

  const [topics, setTopics] = useState([
    { name: "Cybersecurity Basics", done: false },
    { name: "OOP Concepts", done: false },
    { name: "Data Structures", done: false },
    { name: "SQL Fundamentals", done: false },
    { name: "HR Questions Practice", done: false },
    { name: "Mock Interview x3", done: false },
  ])

  const toggle = (i) => {
    const updated = [...topics]
    updated[i].done = !updated[i].done
    setTopics(updated)
  }

  const completed = topics.filter(t => t.done).length

  return (
    <div>
      <h2 className="text-3xl font-bold mb-2 text-center">
        My <span className="text-indigo-400">Progress</span>
      </h2>

      {/* Progress bar */}
      <div className="mb-8 text-center">
        <p className="text-slate-400 text-sm mb-2">{completed}/{topics.length} topics completed</p>
        <div className="w-full bg-slate-700 rounded-full h-3">
          <div
            className="bg-indigo-500 h-3 rounded-full transition-all duration-500"
            style={{ width: `${(completed / topics.length) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Checklist */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-indigo-400 mb-4">📋 Topics to Cover</h3>
        <div className="space-y-3">
          {topics.map((t, i) => (
            <div
              key={i}
              onClick={() => toggle(i)}
              className="bg-slate-800 border border-slate-700 rounded-xl px-5 py-4 flex items-center gap-3 cursor-pointer hover:bg-slate-700 transition-all"
            >
              <div className={`w-5 h-5 rounded border-2 flex-shrink-0 flex items-center justify-center transition-all ${t.done ? "bg-indigo-500 border-indigo-500" : "border-slate-500"}`}>
                {t.done && <span className="text-white text-xs">✓</span>}
              </div>
              <span className={`${t.done ? "line-through text-slate-500" : "text-slate-200"}`}>
                {t.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Tips */}
      <div>
        <h3 className="text-xl font-semibold text-indigo-400 mb-4">💡 Interview Tips</h3>
        <div className="space-y-3">
          {tips.map((tip, i) => (
            <div key={i} className="bg-slate-800 border border-slate-700 rounded-xl px-5 py-4 text-slate-200 flex gap-3">
              <span className="text-indigo-400 font-bold">{i + 1}.</span>
              {tip}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Progress