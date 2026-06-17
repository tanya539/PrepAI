import DailyChallenge from "./DailyChallenge"
import { useState } from "react"

// ─── Skill Radar Chart ───────────────────────────────────────────────
function RadarChart({ skills }) {
  const cx = 150, cy = 150, r = 100
  const levels = [0.2, 0.4, 0.6, 0.8, 1.0]
  const total = skills.length

  const angleOf = (i) => (Math.PI / 2) - (2 * Math.PI * i) / total

  const point = (i, ratio) => ({
    x: cx + r * ratio * Math.cos(angleOf(i)),
    y: cy - r * ratio * Math.sin(angleOf(i)),
  })

  const dataPoints = skills.map((s, i) => point(i, s.value / 100))
  const polyline = dataPoints.map(p => `${p.x},${p.y}`).join(" ")

  return (
    <div className="flex flex-col items-center">
      <svg width="300" height="300" viewBox="0 0 300 300">
        {/* Grid circles */}
        {levels.map((l, li) => {
          const pts = skills.map((_, i) => point(i, l))
          const poly = pts.map(p => `${p.x},${p.y}`).join(" ")
          return (
            <polygon key={li} points={poly}
              fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
          )
        })}

        {/* Axis lines */}
        {skills.map((_, i) => {
          const p = point(i, 1)
          return <line key={i} x1={cx} y1={cy} x2={p.x} y2={p.y}
            stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
        })}

        {/* Data polygon */}
        <polygon points={polyline}
          fill="rgba(251,146,60,0.15)" stroke="#f97316" strokeWidth="2" strokeLinejoin="round" />

        {/* Data points */}
        {dataPoints.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r="4"
            fill="#f97316" stroke="#2b1014" strokeWidth="2" />
        ))}

        {/* Labels */}
        {skills.map((s, i) => {
          const lp = point(i, 1.28)
          return (
            <text key={i} x={lp.x} y={lp.y}
              textAnchor="middle" dominantBaseline="middle"
              fill="rgba(255,255,255,0.8)" fontSize="11" fontWeight="600">
              {s.name}
            </text>
          )
        })}

        {/* % labels on axis */}
        {levels.map((l, li) => {
          const p = point(0, l)
          return (
            <text key={li} x={p.x + 4} y={p.y - 4}
              fill="rgba(255,255,255,0.25)" fontSize="9">
              {l * 100}%
            </text>
          )
        })}
      </svg>
    </div>
  )
}

// ─── Skill Row ───────────────────────────────────────────────────────
function SkillRow({ skill, onChange, onDelete }) {
  return (
    <div className="flex items-center gap-3 bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3">
      <input
        value={skill.name}
        onChange={e => onChange({ ...skill, name: e.target.value })}
        className="bg-transparent text-white text-sm font-medium w-32 focus:outline-none placeholder-white/20"
        placeholder="Skill name"
      />
      <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
        <div className="h-full bg-gradient-to-r from-orange-500 to-amber-400 rounded-full transition-all duration-300"
          style={{ width: `${skill.value}%` }} />
      </div>
      <input
        type="range" min="0" max="100" value={skill.value}
        onChange={e => onChange({ ...skill, value: parseInt(e.target.value) })}
        className="w-24 accent-orange-500"
      />
      <span className="text-orange-400 font-bold text-sm w-10 text-right">{skill.value}%</span>
      <button onClick={onDelete}
        className="text-white/20 hover:text-red-400 transition-all text-sm">✕</button>
    </div>
  )
}

// ─── Main Component ──────────────────────────────────────────────────
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

  const [skills, setSkills] = useState([
    { id: 1, name: "React", value: 80 },
    { id: 2, name: "JavaScript", value: 70 },
    { id: 3, name: "CSS", value: 90 },
    { id: 4, name: "DSA", value: 50 },
    { id: 5, name: "Python", value: 75 },
    { id: 6, name: "SQL", value: 55 },
  ])

  const [newSkill, setNewSkill] = useState("")

  const toggle = (i) => {
    const updated = [...topics]
    updated[i].done = !updated[i].done
    setTopics(updated)
  }

  const updateSkill = (id, updated) => {
    setSkills(skills.map(s => s.id === id ? updated : s))
  }

  const deleteSkill = (id) => {
    if (skills.length <= 3) return
    setSkills(skills.filter(s => s.id !== id))
  }

  const addSkill = () => {
    if (!newSkill.trim() || skills.length >= 8) return
    setSkills([...skills, { id: Date.now(), name: newSkill.trim(), value: 60 }])
    setNewSkill("")
  }

  const completed = topics.filter(t => t.done).length

  return (
    <div className="space-y-10">
      <h2 className="text-3xl font-bold mb-2 text-center text-white">
        My <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-400">Progress</span>
      </h2>

      {/* ── Skill Radar Chart ── */}
      <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6">
        <h3 className="text-lg font-bold text-white mb-1">🕸️ Skill Radar Chart</h3>
        <p className="text-white/40 text-xs mb-6">Customize your skills — recruiters love this!</p>

        <div className="flex flex-col lg:flex-row gap-8 items-center">
          {/* Chart */}
          <div className="flex-shrink-0">
            <RadarChart skills={skills} />
          </div>

          {/* Skill editor */}
          <div className="flex-1 w-full space-y-3">
            {skills.map(s => (
              <SkillRow key={s.id} skill={s}
                onChange={(updated) => updateSkill(s.id, updated)}
                onDelete={() => deleteSkill(s.id)} />
            ))}

            {/* Add skill */}
            {skills.length < 8 && (
              <div className="flex gap-2 mt-2">
                <input
                  value={newSkill}
                  onChange={e => setNewSkill(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && addSkill()}
                  placeholder="Add a skill (e.g. TypeScript)"
                  className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white text-sm placeholder-white/20 focus:outline-none focus:border-orange-500 transition-all"
                />
                <button onClick={addSkill}
                  className="px-4 py-2 rounded-xl bg-orange-500/20 border border-orange-500/30 text-orange-400 text-sm font-semibold hover:bg-orange-500/30 transition-all">
                  + Add
                </button>
              </div>
            )}
            <p className="text-white/20 text-xs">{skills.length}/8 skills (min 3)</p>
          </div>
        </div>
      </div>

      {/* ── Progress Bar ── */}
      <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6">
        <h3 className="text-lg font-bold text-white mb-4">📋 Topics to Cover</h3>
        <div className="mb-4">
          <p className="text-white/40 text-sm mb-2">{completed}/{topics.length} topics completed</p>
          <div className="w-full bg-white/5 rounded-full h-3">
            <div className="bg-gradient-to-r from-orange-500 to-amber-400 h-3 rounded-full transition-all duration-500"
              style={{ width: `${(completed / topics.length) * 100}%` }} />
          </div>
        </div>

        <div className="space-y-3">
          {topics.map((t, i) => (
            <div key={i} onClick={() => toggle(i)}
              className="bg-white/[0.03] border border-white/10 rounded-xl px-5 py-4 flex items-center gap-3 cursor-pointer hover:bg-white/[0.06] transition-all">
              <div className={`w-5 h-5 rounded border-2 flex-shrink-0 flex items-center justify-center transition-all ${t.done ? "bg-orange-500 border-orange-500" : "border-white/20"}`}>
                {t.done && <span className="text-white text-xs">✓</span>}
              </div>
              <span className={`text-sm ${t.done ? "line-through text-white/30" : "text-white/80"}`}>
                {t.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Tips ── */}
      <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6">
        <h3 className="text-lg font-bold text-white mb-4">💡 Interview Tips</h3>
        <div className="space-y-3">
          {tips.map((tip, i) => (
            <div key={i} className="bg-white/[0.03] border border-white/10 rounded-xl px-5 py-4 text-white/70 flex gap-3 text-sm">
              <span className="text-orange-400 font-bold flex-shrink-0">{i + 1}.</span>
              {tip}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Progress