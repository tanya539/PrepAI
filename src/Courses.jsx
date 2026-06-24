import { useState } from "react"

const COURSES = [
  {
    id: 1,
    title: "Full Stack Web Development with AI",
    desc: "Master HTML, CSS, JavaScript, React, Node.js and build real projects with AI assistance.",
    thumbnail: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=400&h=220&fit=crop",
    instructor: "PrepAI Team",
    level: "Beginner",
    duration: "40h 30m",
    lessons: 280,
    price: 999,
    originalPrice: 5999,
    category: "Web Development",
    badge: "Bestseller",
    badgeColor: "bg-amber-400 text-black",
  },
  {
    id: 2,
    title: "Data Analytics with Python & AI",
    desc: "Learn data analysis, visualization, Pandas, NumPy, Power BI and land your first data job.",
    thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=220&fit=crop",
    instructor: "PrepAI Team",
    level: "Beginner",
    duration: "35h 15m",
    lessons: 210,
    price: 999,
    originalPrice: 4999,
    category: "Data Science",
    badge: "Featured",
    badgeColor: "bg-blue-500 text-white",
  },
  {
    id: 3,
    title: "Cybersecurity Fundamentals",
    desc: "Ethical hacking, network security, cryptography, CIA triad and real-world security tools.",
    thumbnail: "https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?w=400&h=220&fit=crop",
    instructor: "PrepAI Team",
    level: "Intermediate",
    duration: "28h 45m",
    lessons: 175,
    price: 999,
    originalPrice: 3999,
    category: "Cybersecurity",
    badge: "New",
    badgeColor: "bg-green-500 text-white",
  },
  {
    id: 4,
    title: "DSA & Placement Preparation",
    desc: "Arrays, linked lists, trees, graphs, dynamic programming — crack any tech interview.",
    thumbnail: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=400&h=220&fit=crop",
    instructor: "PrepAI Team",
    level: "Intermediate",
    duration: "45h 20m",
    lessons: 320,
    price: 999,
    originalPrice: 6999,
    category: "DSA",
    badge: "Top Rated",
    badgeColor: "bg-orange-500 text-white",
  },
  {
    id: 5,
    title: "Machine Learning with Python",
    desc: "Supervised, unsupervised learning, neural networks, scikit-learn and real ML projects.",
    thumbnail: "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=400&h=220&fit=crop",
    instructor: "PrepAI Team",
    level: "Advanced",
    duration: "38h 10m",
    lessons: 245,
    price: 999,
    originalPrice: 5499,
    category: "AI / ML",
    badge: "Hot",
    badgeColor: "bg-red-500 text-white",
  },
  {
    id: 6,
    title: "UI/UX Design Masterclass",
    desc: "Figma, user research, wireframing, prototyping — become a job-ready product designer.",
    thumbnail: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=220&fit=crop",
    instructor: "PrepAI Team",
    level: "Beginner",
    duration: "22h 30m",
    lessons: 148,
    price: 999,
    originalPrice: 3499,
    category: "Design",
    badge: "Popular",
    badgeColor: "bg-purple-500 text-white",
  },
]

const CATEGORIES = ["All", "Web Development", "Data Science", "Cybersecurity", "DSA", "AI / ML", "Design"]

function CourseCard({ course, onEnroll }) {
  const discount = Math.round(((course.originalPrice - course.price) / course.originalPrice) * 100)

  return (
    <div className="bg-[#1a0a0d] border border-white/10 rounded-2xl overflow-hidden hover:border-orange-500/40 hover:-translate-y-1 hover:shadow-2xl hover:shadow-orange-500/10 transition-all duration-300 group">
      <div className="relative">
        <img src={course.thumbnail} alt={course.title}
          className="w-full h-44 object-cover group-hover:scale-105 transition-all duration-500" />
        <div className="absolute top-3 left-3 flex gap-2">
          <span className={`text-xs font-black px-2 py-1 rounded-lg ${course.badgeColor}`}>
            {course.badge}
          </span>
          <span className="text-xs font-black px-2 py-1 rounded-lg bg-red-600 text-white">
            {discount}% OFF
          </span>
        </div>
      </div>

      <div className="p-5">
        <span className="text-orange-400 text-xs font-semibold uppercase tracking-wider">{course.category}</span>
        <h3 className="text-white font-bold text-base mt-1 mb-2 leading-snug line-clamp-2">{course.title}</h3>
        <p className="text-white/40 text-xs leading-relaxed mb-4 line-clamp-2">{course.desc}</p>

        <div className="flex items-center gap-4 text-white/30 text-xs mb-4">
          <span>👤 {course.instructor}</span>
          <span>📶 {course.level}</span>
        </div>
        <div className="flex items-center gap-4 text-white/30 text-xs mb-5">
          <span>⏱️ {course.duration}</span>
          <span>📚 {course.lessons} lessons</span>
        </div>

        <div className="flex items-center gap-3 mb-4">
          <span className="text-white font-black text-xl">₹{course.price.toLocaleString()}</span>
          <span className="text-white/30 text-sm line-through">₹{course.originalPrice.toLocaleString()}</span>
          <span className="text-green-400 text-xs font-bold">Save ₹{(course.originalPrice - course.price).toLocaleString()}</span>
        </div>

        <button onClick={() => onEnroll(course)}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold text-sm hover:scale-[1.02] hover:shadow-lg hover:shadow-orange-500/30 transition-all duration-300">
          Enroll Now →
        </button>
      </div>
    </div>
  )
}

function CourseModal({ course, onClose }) {
  if (!course) return null
  const discount = Math.round(((course.originalPrice - course.price) / course.originalPrice) * 100)

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4" onClick={onClose}>
      <div onClick={e => e.stopPropagation()}
        className="bg-[#1a0a0d] border border-white/10 rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl">
        <img src={course.thumbnail} alt={course.title} className="w-full h-48 object-cover" />
        <div className="p-6">
          <div className="flex items-center gap-2 mb-2">
            <span className={`text-xs font-black px-2 py-1 rounded-lg ${course.badgeColor}`}>{course.badge}</span>
            <span className="text-xs font-black px-2 py-1 rounded-lg bg-red-600 text-white">{discount}% OFF</span>
          </div>
          <h2 className="text-white font-black text-xl mb-2">{course.title}</h2>
          <p className="text-white/50 text-sm mb-4 leading-relaxed">{course.desc}</p>

          <div className="grid grid-cols-2 gap-3 mb-5">
            {[
              { label: "Duration", value: course.duration, icon: "⏱️" },
              { label: "Lessons", value: `${course.lessons} lessons`, icon: "📚" },
              { label: "Level", value: course.level, icon: "📶" },
              { label: "Instructor", value: course.instructor, icon: "👤" },
            ].map((item, i) => (
              <div key={i} className="bg-white/5 rounded-xl p-3">
                <div className="text-white/40 text-xs mb-0.5">{item.icon} {item.label}</div>
                <div className="text-white text-sm font-semibold">{item.value}</div>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-3 mb-5">
            <span className="text-white font-black text-2xl">₹{course.price.toLocaleString()}</span>
            <span className="text-white/30 line-through">₹{course.originalPrice.toLocaleString()}</span>
            <span className="text-green-400 text-sm font-bold">You save ₹{(course.originalPrice - course.price).toLocaleString()}</span>
          </div>

          <div className="flex gap-3">
            <button onClick={onClose}
              className="flex-1 py-3 rounded-xl bg-white/5 border border-white/10 text-white/60 font-semibold text-sm hover:text-white transition-all">
              Close
            </button>
            <button
              className="flex-2 flex-1 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold text-sm hover:scale-[1.02] shadow-lg shadow-orange-500/30 transition-all">
              💳 Pay ₹{course.price.toLocaleString()} & Enroll
            </button>
          </div>
          <p className="text-white/20 text-xs text-center mt-3">🔒 Secure payment • Lifetime access • Certificate included</p>
        </div>
      </div>
    </div>
  )
}

function Courses() {
  const [activeCategory, setActiveCategory] = useState("All")
  const [selectedCourse, setSelectedCourse] = useState(null)
  const [search, setSearch] = useState("")

  const filtered = COURSES.filter(c => {
    const matchCat = activeCategory === "All" || c.category === activeCategory
    const matchSearch = c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.desc.toLowerCase().includes(search.toLowerCase())
    return matchCat && matchSearch
  })

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-300 text-xs font-semibold mb-4 tracking-widest uppercase">
          🎓 Premium Courses
        </div>
        <h2 className="text-4xl font-black text-white mb-3">
          Learn. Build. <span className="bg-gradient-to-r from-orange-400 to-amber-300 bg-clip-text text-transparent">Get Hired.</span>
        </h2>
        <p className="text-white/40 text-base max-w-xl mx-auto">Industry-relevant courses designed to get you job-ready fast.</p>
      </div>

      <div className="relative max-w-md mx-auto mb-8">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30">🔍</span>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search courses..."
          className="w-full bg-white/5 border border-white/10 rounded-2xl pl-10 pr-4 py-3 text-white placeholder-white/25 text-sm focus:outline-none focus:border-orange-500 transition-all"
        />
      </div>

      <div className="flex gap-2 flex-wrap justify-center mb-10">
        {CATEGORIES.map(cat => (
          <button key={cat} onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
              activeCategory === cat
                ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg"
                : "bg-white/5 text-white/50 border border-white/10 hover:text-white"
            }`}>
            {cat}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 text-white/30">No courses found 😕</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(course => (
            <CourseCard key={course.id} course={course} onEnroll={setSelectedCourse} />
          ))}
        </div>
      )}

      {selectedCourse && (
        <CourseModal course={selectedCourse} onClose={() => setSelectedCourse(null)} />
      )}
    </div>
  )
}

export default Courses