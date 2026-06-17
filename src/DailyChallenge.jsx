import { useState, useEffect } from "react"

const CHALLENGES = {
  Frontend: [
    { title: "Build a Todo App", desc: "Create a fully functional Todo app using React Hooks (useState, useEffect). Add, delete, and mark tasks as complete.", difficulty: "Easy" },
    { title: "Responsive Navbar", desc: "Build a mobile-responsive navbar with hamburger menu using only CSS/Tailwind. No JavaScript libraries allowed.", difficulty: "Easy" },
    { title: "Dark Mode Toggle", desc: "Implement a dark/light mode toggle that persists in localStorage. Use CSS variables for theming.", difficulty: "Medium" },
    { title: "Infinite Scroll", desc: "Build an infinite scroll component that loads 10 more items when user reaches bottom of the page.", difficulty: "Medium" },
    { title: "Drag & Drop Kanban", desc: "Create a Kanban board with drag-and-drop functionality using HTML5 Drag API. No external libraries.", difficulty: "Hard" },
    { title: "Custom Hook: useFetch", desc: "Write a reusable useFetch custom hook that handles loading, error, and data states for any API call.", difficulty: "Medium" },
    { title: "Animated Counter", desc: "Build a number counter that animates from 0 to target value when it enters the viewport using Intersection Observer.", difficulty: "Medium" },
    { title: "Form Validation", desc: "Create a multi-step form with real-time validation — email, password strength, phone number format.", difficulty: "Easy" },
    { title: "Image Lazy Loader", desc: "Implement lazy loading for images using Intersection Observer API. Show skeleton loader while loading.", difficulty: "Medium" },
    { title: "Mini Calendar", desc: "Build a calendar component from scratch showing current month, with ability to navigate months.", difficulty: "Hard" },
    { title: "Search with Debounce", desc: "Create a search input that calls an API only after user stops typing for 500ms (debounce).", difficulty: "Medium" },
    { title: "CSS Grid Layout", desc: "Build a Pinterest-style masonry grid layout using only CSS Grid. Make it responsive.", difficulty: "Easy" },
    { title: "Context API Cart", desc: "Build a shopping cart using React Context API — add, remove, update quantity, show total.", difficulty: "Hard" },
    { title: "Accordion Component", desc: "Create an accessible accordion/FAQ component with smooth animation. Only one item open at a time.", difficulty: "Easy" },
    { title: "Star Rating Widget", desc: "Build an interactive star rating component with hover effects and click to rate.", difficulty: "Easy" },
  ],
  Backend: [
    { title: "REST API with Express", desc: "Build a basic CRUD REST API for a 'books' resource using Node.js and Express. Add proper error handling.", difficulty: "Easy" },
    { title: "JWT Authentication", desc: "Implement JWT-based login/logout system with access token and refresh token.", difficulty: "Hard" },
    { title: "Rate Limiter", desc: "Build a rate limiter middleware that allows max 100 requests per IP per hour.", difficulty: "Medium" },
    { title: "File Upload API", desc: "Create an API endpoint that accepts image uploads, validates file type/size, and saves to disk.", difficulty: "Medium" },
    { title: "WebSocket Chat", desc: "Build a real-time chat server using WebSockets. Support multiple rooms.", difficulty: "Hard" },
    { title: "Database Pagination", desc: "Implement cursor-based pagination for a MongoDB collection with 10000+ documents.", difficulty: "Medium" },
    { title: "Email Queue", desc: "Build a job queue system that sends emails asynchronously using Bull and Redis.", difficulty: "Hard" },
    { title: "API Caching", desc: "Add Redis caching to an existing API endpoint. Cache should expire after 5 minutes.", difficulty: "Medium" },
    { title: "CSV Data Import", desc: "Build an API that accepts CSV file upload, validates data, and bulk inserts into database.", difficulty: "Medium" },
    { title: "Webhook Handler", desc: "Create a webhook receiver that validates HMAC signature and processes payment events.", difficulty: "Hard" },
  ],
  Cybersecurity: [
    { title: "Password Strength Checker", desc: "Build a tool that analyzes password strength — length, special chars, entropy score, common patterns.", difficulty: "Easy" },
    { title: "Caesar Cipher", desc: "Implement Caesar cipher encoder/decoder with brute force attack option to crack unknown shift.", difficulty: "Easy" },
    { title: "Port Scanner", desc: "Write a basic TCP port scanner in Python that checks which ports are open on a given IP.", difficulty: "Medium" },
    { title: "Hash Cracker", desc: "Build a dictionary attack tool that tries to crack MD5/SHA1 hashes using a wordlist.", difficulty: "Medium" },
    { title: "XSS Detector", desc: "Write a script that scans HTML input for common XSS payloads and sanitizes them.", difficulty: "Medium" },
    { title: "SQL Injection Demo", desc: "Build a vulnerable login page and then fix it — demonstrate parameterized queries vs string concat.", difficulty: "Hard" },
    { title: "Network Packet Analyzer", desc: "Use Python's scapy library to capture and analyze HTTP packets on localhost.", difficulty: "Hard" },
    { title: "2FA Implementation", desc: "Implement TOTP-based two factor authentication (like Google Authenticator) from scratch.", difficulty: "Hard" },
    { title: "SSL Certificate Checker", desc: "Build a tool that checks SSL certificate validity, expiry date, and cipher suites for any domain.", difficulty: "Medium" },
    { title: "Steganography Tool", desc: "Hide a secret message inside an image using LSB steganography in Python.", difficulty: "Medium" },
  ],
  "Data Science": [
    { title: "EDA on Titanic Dataset", desc: "Perform exploratory data analysis on Titanic dataset — missing values, distributions, correlations, visualizations.", difficulty: "Easy" },
    { title: "Linear Regression from Scratch", desc: "Implement linear regression using only NumPy (no sklearn). Train on housing price dataset.", difficulty: "Medium" },
    { title: "Text Sentiment Analysis", desc: "Build a sentiment classifier using TF-IDF + Logistic Regression on movie reviews dataset.", difficulty: "Medium" },
    { title: "K-Means Clustering", desc: "Implement K-Means from scratch and cluster customer data. Find optimal K using elbow method.", difficulty: "Hard" },
    { title: "Time Series Forecast", desc: "Predict next 30 days of stock prices using ARIMA model. Plot actual vs predicted.", difficulty: "Hard" },
    { title: "Image Classification", desc: "Train a CNN on CIFAR-10 dataset using TensorFlow/Keras. Achieve >70% accuracy.", difficulty: "Hard" },
    { title: "Data Cleaning Pipeline", desc: "Build a reusable data cleaning pipeline that handles missing values, outliers, and encoding.", difficulty: "Medium" },
    { title: "Dashboard with Plotly", desc: "Create an interactive dashboard with Plotly Dash showing COVID-19 statistics.", difficulty: "Medium" },
    { title: "Web Scraper", desc: "Scrape job listings from a website using BeautifulSoup. Save to CSV with title, company, salary.", difficulty: "Easy" },
    { title: "A/B Test Analysis", desc: "Analyze A/B test results using statistical hypothesis testing. Determine significance.", difficulty: "Medium" },
  ],
  "Full Stack": [
    { title: "Auth System", desc: "Build complete login/signup with JWT, protected routes in React, and Express backend.", difficulty: "Hard" },
    { title: "Real-time Notifications", desc: "Implement push notifications using WebSockets — user gets notified when someone likes their post.", difficulty: "Hard" },
    { title: "Blog CMS", desc: "Build a blog with markdown support, admin panel to create/edit posts, and public view.", difficulty: "Medium" },
    { title: "URL Shortener", desc: "Build a full-stack URL shortener with analytics — click count, location, device type.", difficulty: "Medium" },
    { title: "Chat Application", desc: "Build WhatsApp-style chat with rooms, online status, and message history in MongoDB.", difficulty: "Hard" },
  ],
  "DSA / Competitive": [
    { title: "Two Sum", desc: "Solve Two Sum in O(n) time using HashMap. Then solve its variant: Three Sum.", difficulty: "Easy" },
    { title: "Binary Search", desc: "Implement binary search iteratively and recursively. Solve: Find first and last position of element.", difficulty: "Easy" },
    { title: "Linked List Reversal", desc: "Reverse a linked list iteratively and recursively. Then: Reverse in groups of K.", difficulty: "Medium" },
    { title: "BFS & DFS", desc: "Implement BFS and DFS on a graph. Solve: Number of islands problem.", difficulty: "Medium" },
    { title: "Dynamic Programming", desc: "Solve 0/1 Knapsack using bottom-up DP. Then: Coin change problem.", difficulty: "Hard" },
    { title: "Stack Problems", desc: "Solve: Valid Parentheses, Next Greater Element, Min Stack — all in O(n).", difficulty: "Medium" },
    { title: "Tree Traversals", desc: "Implement inorder, preorder, postorder traversal iteratively (without recursion).", difficulty: "Hard" },
    { title: "Sliding Window", desc: "Solve: Longest substring without repeating characters, Maximum sum subarray of size K.", difficulty: "Medium" },
  ],
}

const ROLES = Object.keys(CHALLENGES)
const STREAK_KEY = "prepai_streak"
const ROLE_KEY = "prepai_daily_role"

function getDayIndex(role) {
  const start = new Date("2024-01-01")
  const today = new Date()
  const diff = Math.floor((today - start) / (1000 * 60 * 60 * 24))
  return diff % CHALLENGES[role].length
}

function getTodayStr() {
  return new Date().toISOString().split("T")[0]
}

async function reviewSolution(challenge, solution, role) {
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
          content: `You are an enthusiastic and encouraging coding mentor. Review the submitted solution for a daily challenge and respond ONLY in this exact format:
APPRECIATION: (1 warm, personalized appreciation sentence — mention their effort and something specific about their solution)
SCORE: X/10
WHAT WORKED: (2 bullet points starting with • about what they did well)
IMPROVE: (1-2 bullet points starting with • about what could be better)
BADGE: (exactly one: 🏆 Champion or ⭐ Rising Star or 🔥 On Fire or 💡 Creative Thinker or 🚀 Fast Learner)
BADGE REASON: (1 sentence why they earned this badge)`
        },
        {
          role: "user",
          content: `Role: ${role}\nChallenge: ${challenge.title}\nChallenge Description: ${challenge.desc}\nSubmitted Solution:\n${solution}`
        }
      ]
    })
  })
  const data = await res.json()
  return data.choices[0].message.content
}

function DifficultyBadge({ level }) {
  const config = {
    Easy:   "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    Medium: "bg-amber-500/20 text-amber-400 border-amber-500/30",
    Hard:   "bg-red-500/20 text-red-400 border-red-500/30",
  }
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-bold border ${config[level]}`}>
      {level === "Easy" ? "🟢" : level === "Medium" ? "🟡" : "🔴"} {level}
    </span>
  )
}

function DailyChallenge() {
  const [role, setRole] = useState(() => localStorage.getItem(ROLE_KEY) || "Frontend")
  const [streak, setStreak] = useState(() => {
    try { return JSON.parse(localStorage.getItem(STREAK_KEY)) || { count: 0, lastDate: "" } } catch { return { count: 0, lastDate: "" } }
  })
  const [completed, setCompleted] = useState(() => streak.lastDate === getTodayStr())
  const [showSubmit, setShowSubmit] = useState(false)
  const [solution, setSolution] = useState("")
  const [reviewing, setReviewing] = useState(false)
  const [review, setReview] = useState(null)
  const [showCelebration, setShowCelebration] = useState(false)

  const challenge = CHALLENGES[role][getDayIndex(role)]

  useEffect(() => {
    localStorage.setItem(ROLE_KEY, role)
  }, [role])

  const handleComplete = () => {
    setShowSubmit(true)
  }

  const handleSubmit = async () => {
    if (!solution.trim()) return
    setReviewing(true)
    const result = await reviewSolution(challenge, solution, role)
    setReview(result)
    setReviewing(false)

    // Save streak
    const today = getTodayStr()
    const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0]
    let newCount = 1
    if (streak.lastDate === yesterday) newCount = streak.count + 1
    else if (streak.lastDate === today) newCount = streak.count
    const newStreak = { count: newCount, lastDate: today }
    setStreak(newStreak)
    localStorage.setItem(STREAK_KEY, JSON.stringify(newStreak))
    setCompleted(true)
    setShowCelebration(true)
    setTimeout(() => setShowCelebration(false), 4000)
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

  const r = parseSections(review)
  const reviewScore = r["SCORE"]?.match(/(\d+)/)?.[1]
  const streakColor = streak.count >= 7 ? "text-orange-400" : streak.count >= 3 ? "text-amber-400" : "text-white/60"

  return (
    <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-white">🎯 Daily AI Challenge</h3>
          <p className="text-white/40 text-xs mt-0.5">A new challenge every day based on your role</p>
        </div>
        <div className="text-center">
          <div className={`text-2xl font-black ${streakColor}`}>🔥 {streak.count}</div>
          <div className="text-white/30 text-xs">day streak</div>
        </div>
      </div>

      {/* Role selector */}
      <div>
        <label className="text-white/40 text-xs font-semibold uppercase tracking-wider block mb-2">Your Role</label>
        <div className="flex gap-2 flex-wrap">
          {ROLES.map(r => (
            <button key={r} onClick={() => { setRole(r); setShowSubmit(false); setReview(null) }}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                role === r
                  ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg"
                  : "bg-white/5 text-white/50 border border-white/10 hover:text-white"
              }`}>
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Challenge card */}
      <div className={`rounded-xl p-5 border transition-all ${completed ? "border-emerald-500/30 bg-emerald-500/5" : "border-orange-500/20 bg-orange-500/5"}`}>
        <div className="flex items-start justify-between gap-3 mb-3">
          <h4 className="text-white font-bold text-base">{challenge.title}</h4>
          <DifficultyBadge level={challenge.difficulty} />
        </div>
        <p className="text-white/60 text-sm leading-relaxed mb-4">{challenge.desc}</p>

        {!completed && !showSubmit && (
          <button onClick={handleComplete}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold text-sm shadow-lg shadow-orange-500/20 hover:scale-[1.02] transition-all">
            ✅ I've Completed This — Submit Solution
          </button>
        )}

        {completed && !showSubmit && (
          <div className="w-full py-3 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 font-bold text-sm text-center">
            🎉 Completed! Come back tomorrow for next challenge
          </div>
        )}
      </div>

      {/* Submit solution panel */}
      {showSubmit && !review && (
        <div className="bg-white/[0.03] border border-orange-500/20 rounded-xl p-5 space-y-4">
          <div>
            <label className="text-white/50 text-xs font-semibold uppercase tracking-wider block mb-2">
              📝 Paste Your Solution / Approach
            </label>
            <textarea
              value={solution}
              onChange={e => setSolution(e.target.value)}
              placeholder={`Paste your code or explain your approach here...\n\nExample:\n- I used useState to manage todo items\n- Added delete functionality with filter()\n- Used localStorage to persist data\n\nOr paste your actual code!`}
              rows={8}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 resize-none focus:outline-none focus:border-orange-500 transition-all text-sm font-mono"
            />
            <div className="text-right text-white/20 text-xs mt-1">{solution.length} characters</div>
          </div>

          <div className="flex gap-3">
            <button onClick={() => setShowSubmit(false)}
              className="flex-1 py-3 rounded-xl bg-white/5 border border-white/10 text-white/50 font-semibold text-sm hover:text-white transition-all">
              Cancel
            </button>
            <button onClick={handleSubmit} disabled={reviewing || !solution.trim()}
              className="flex-2 flex-1 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold text-sm shadow-lg hover:scale-[1.02] transition-all disabled:opacity-40 disabled:cursor-not-allowed">
              {reviewing ? "🤖 AI is reviewing..." : "🚀 Submit for AI Review"}
            </button>
          </div>

          {reviewing && (
            <div className="text-center py-2">
              <div className="flex gap-1 justify-center mb-2">
                {[1,2,3,4,5].map(i => (
                  <div key={i} className="w-2 h-2 rounded-full bg-orange-400 animate-bounce" style={{ animationDelay: `${i * 0.1}s` }} />
                ))}
              </div>
              <p className="text-white/40 text-xs">AI mentor is reviewing your solution...</p>
            </div>
          )}
        </div>
      )}

      {/* AI Review result */}
      {review && (
        <div className="space-y-4">
          {/* Celebration */}
          {showCelebration && (
            <div className="text-center py-3 animate-bounce">
              <span className="text-3xl">🎊</span>
              <p className="text-orange-400 font-bold text-sm mt-1">
                {streak.count === 1 ? "Amazing start! You did it!" : `${streak.count} day streak! You're unstoppable! 🔥`}
              </p>
            </div>
          )}

          {/* Badge */}
          {r["BADGE"] && (
            <div className="bg-gradient-to-r from-orange-500/10 to-amber-500/10 border border-orange-500/30 rounded-xl p-4 text-center">
              <div className="text-4xl mb-2">{r["BADGE"].split(" ")[0]}</div>
              <div className="text-white font-black text-lg">{r["BADGE"]}</div>
              {r["BADGE REASON"] && (
                <div className="text-white/50 text-xs mt-1">{r["BADGE REASON"]}</div>
              )}
            </div>
          )}

          {/* Score + Appreciation */}
          <div className="bg-white/[0.03] border border-white/10 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="text-white font-bold text-sm">🤖 AI Mentor Review</div>
              {reviewScore && (
                <span className="text-orange-400 font-black text-xl">{reviewScore}<span className="text-white/30 text-sm">/10</span></span>
              )}
            </div>
            {r["APPRECIATION"] && (
              <div className="text-white/70 text-sm leading-relaxed italic border-l-2 border-orange-500/40 pl-3">
                "{r["APPRECIATION"]}"
              </div>
            )}
          </div>

          {r["WHAT WORKED"] && (
            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4">
              <div className="text-emerald-400 font-semibold text-sm mb-2">✅ What Worked Well</div>
              <div className="text-white/70 text-sm whitespace-pre-line leading-relaxed">{r["WHAT WORKED"]}</div>
            </div>
          )}

          {r["IMPROVE"] && (
            <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4">
              <div className="text-amber-400 font-semibold text-sm mb-2">💡 How to Improve</div>
              <div className="text-white/70 text-sm whitespace-pre-line leading-relaxed">{r["IMPROVE"]}</div>
            </div>
          )}
        </div>
      )}

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Today's Role", value: role },
          { label: "Difficulty", value: challenge.difficulty },
          { label: "Streak", value: `${streak.count} days` },
        ].map((item, i) => (
          <div key={i} className="bg-white/[0.03] border border-white/10 rounded-xl p-3 text-center">
            <div className="text-white font-bold text-sm truncate">{item.value}</div>
            <div className="text-white/30 text-xs mt-0.5">{item.label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default DailyChallenge