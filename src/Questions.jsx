import { useState } from "react"

const QUESTIONS = {
  "Cybersecurity": [
    "What is the CIA triad in cybersecurity?",
    "Explain the difference between symmetric and asymmetric encryption.",
    "What is SQL injection and how do you prevent it?",
    "What is a man-in-the-middle attack?",
    "Explain the concept of zero-trust architecture.",
    "What is the difference between IDS and IPS?",
    "What are the phases of a penetration test?",
    "What is social engineering in cybersecurity?",
    "What is a firewall and how does it work?",
    "Explain the difference between authentication and authorization.",
    "What is multi-factor authentication (MFA)?",
    "What is a VPN and how does it work?",
    "What is phishing and how can it be prevented?",
    "What is ransomware? Give an example.",
    "Explain the concept of least privilege.",
    "What is a DDoS attack?",
    "What is the OWASP Top 10?",
    "What is cross-site scripting (XSS)?",
    "What is a digital certificate?",
    "What is the difference between black box and white box testing?",
  ],
  "Computer Science": [
    "What is the difference between process and thread?",
    "Explain time complexity with an example.",
    "What are the four pillars of OOP?",
    "What is the difference between stack and heap memory?",
    "What is a deadlock and how can it be prevented?",
    "Explain what a binary search tree is.",
    "What is the difference between TCP and UDP?",
    "What is recursion? Give an example.",
    "What is the difference between compiler and interpreter?",
    "Explain the concept of polymorphism.",
    "What is a linked list? Types?",
    "What is the difference between SQL and NoSQL?",
    "What is normalization in databases?",
    "Explain what an API is.",
    "What is the difference between GET and POST requests?",
    "What is cloud computing?",
    "What is the difference between RAM and ROM?",
    "What is an operating system?",
    "Explain the concept of virtual memory.",
    "What is the difference between struct and class?",
    "What is Big O notation?",
    "What is a hash table?",
    "Explain the MVC architecture.",
    "What is the difference between deep copy and shallow copy?",
  ],
  "Data Analytics": [
    "What is the difference between supervised and unsupervised learning?",
    "Explain the steps in a data cleaning process.",
    "What is overfitting in machine learning?",
    "Explain mean, median, and mode.",
    "What is a confusion matrix?",
    "Explain feature engineering.",
    "What is the difference between regression and classification?",
    "What is a neural network?",
    "What is pandas used for in Python?",
    "Explain the difference between inner join and outer join in SQL.",
    "What is data normalization?",
    "What is a pivot table?",
    "What is Power BI used for?",
    "Explain the concept of data warehousing.",
    "What is ETL in data engineering?",
    "What is the difference between structured and unstructured data?",
    "What is k-means clustering?",
    "What is linear regression?",
    "What is the purpose of data visualization?",
    "What is an outlier and how do you handle it?",
  ],
  "HR & Behavioral": [
    "Tell me about yourself.",
    "What are your greatest strengths and weaknesses?",
    "Where do you see yourself in 5 years?",
    "Why should we hire you?",
    "Describe a situation where you worked in a team.",
    "How do you handle pressure and tight deadlines?",
    "What motivates you?",
    "Describe a challenge you faced and how you overcame it.",
    "Why do you want to work at this company?",
    "Tell me about a time you showed leadership.",
    "How do you prioritize tasks when you have multiple deadlines?",
    "Tell me about a time you failed and what you learned.",
    "Are you a team player or do you prefer working alone?",
    "How do you handle criticism or negative feedback?",
    "What are your salary expectations?",
    "Do you have any questions for us?",
    "Tell me about a time you went above and beyond.",
    "How do you manage conflict with a teammate?",
    "What is your biggest professional achievement?",
    "Why are you leaving your current role/college project?",
  ],
  "Web Development": [
    "What is the difference between HTML, CSS, and JavaScript?",
    "What is React and why is it used?",
    "Explain the concept of Virtual DOM.",
    "What is the difference between useState and useEffect?",
    "What is responsive design?",
    "What is Tailwind CSS?",
    "What is REST API?",
    "What is the difference between localStorage and sessionStorage?",
    "What is CORS and why does it occur?",
    "Explain the event loop in JavaScript.",
    "What is async/await in JavaScript?",
    "What is the difference between == and === in JavaScript?",
    "What is NPM?",
    "What is Git and why is it used?",
    "What is the difference between margin and padding in CSS?",
    "What is flexbox?",
    "What is the difference between var, let, and const?",
    "What is a callback function?",
    "What is JSX in React?",
    "What are React props and state?",
  ],
}

function Questions() {
  const categories = Object.keys(QUESTIONS)
  const [selected, setSelected] = useState(categories[0])
  const [search, setSearch] = useState("")

  const filtered = QUESTIONS[selected].filter(q =>
    q.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      <h2 className="text-3xl font-bold mb-2 text-center text-white">
        Interview <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-400">Questions</span>
      </h2>
      <p className="text-white/40 text-center text-sm mb-8">{Object.values(QUESTIONS).flat().length}+ questions across {categories.length} categories</p>

      {/* Search */}
      <div className="mb-6">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="🔍 Search questions..."
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-violet-500 transition-all"
        />
      </div>

      {/* Category tabs */}
      <div className="flex gap-2 flex-wrap mb-6">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => { setSelected(c); setSearch("") }}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
              selected === c
                ? "bg-gradient-to-r from-violet-600 to-cyan-600 text-white shadow-lg shadow-violet-500/30"
                : "bg-white/5 text-white/50 border border-white/10 hover:bg-white/10 hover:text-white"
            }`}
          >
            {c} ({QUESTIONS[c].length})
          </button>
        ))}
      </div>

      {/* Questions list */}
      <div className="space-y-2">
        {filtered.length === 0 && (
          <div className="text-center text-white/40 py-8">No questions found 🔍</div>
        )}
        {filtered.map((q, i) => (
          <div key={i} className="group bg-white/[0.03] border border-white/5 rounded-xl px-5 py-4 text-white/80 hover:bg-white/10 hover:border-violet-500/30 hover:text-white transition-all duration-300 flex items-start gap-3">
            <span className="text-violet-500 font-bold text-sm mt-0.5 flex-shrink-0">{i + 1}.</span>
            <span className="text-sm leading-relaxed">{q}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Questions