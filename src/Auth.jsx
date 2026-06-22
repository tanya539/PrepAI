import { useState } from "react"
import { auth, googleProvider } from "./firebase"
import {
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "firebase/auth"
import { useEffect } from "react"

export function useAuth() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
      setLoading(false)
    })
    return unsubscribe
  }, [])

  return { user, loading }
}

function AuthModal({ onClose }) {
  const [mode, setMode] = useState("login") // "login" | "signup"
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleGoogleSignIn = async () => {
    setError("")
    setLoading(true)
    try {
      await signInWithPopup(auth, googleProvider)
      onClose()
    } catch (err) {
      setError(err.message.replace("Firebase: ", ""))
    }
    setLoading(false)
  }

  const handleEmailAuth = async () => {
    setError("")
    if (!email.trim() || !password.trim()) {
      setError("Please fill in all fields")
      return
    }
    setLoading(true)
    try {
      if (mode === "signup") {
        await createUserWithEmailAndPassword(auth, email, password)
      } else {
        await signInWithEmailAndPassword(auth, email, password)
      }
      onClose()
    } catch (err) {
      setError(err.message.replace("Firebase: ", ""))
    }
    setLoading(false)
  }

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[100] flex items-center justify-center p-4" onClick={onClose}>
      <div
        onClick={e => e.stopPropagation()}
        className="bg-[#2b1014] border border-white/10 rounded-3xl p-8 max-w-sm w-full relative shadow-2xl">

        <button onClick={onClose}
          className="absolute top-5 right-5 text-white/30 hover:text-white text-xl transition-all">
          ✕
        </button>

        {/* Logo */}
        <div className="flex items-center gap-2 mb-6">
          <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-amber-500 rounded-lg flex items-center justify-center text-white text-sm font-bold">P</div>
          <span className="text-white font-bold text-xl">PrepAI</span>
        </div>

        <h2 className="text-2xl font-black text-white mb-1">
          {mode === "login" ? "Welcome back 👋" : "Create your account"}
        </h2>
        <p className="text-white/40 text-sm mb-6">
          {mode === "login" ? "Login to continue your prep journey" : "Start your interview prep journey today"}
        </p>

        {/* Google Sign In */}
        <button
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 py-3 rounded-xl bg-white text-[#2b1014] font-semibold text-sm hover:bg-white/90 transition-all disabled:opacity-50 mb-4">
          <svg width="18" height="18" viewBox="0 0 18 18">
            <path fill="#4285F4" d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84c-.21 1.13-.84 2.08-1.8 2.72v2.26h2.92c1.7-1.57 2.68-3.88 2.68-6.62z"/>
            <path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.92-2.26c-.81.54-1.84.86-3.04.86-2.34 0-4.32-1.58-5.03-3.7H.96v2.33C2.44 15.98 5.48 18 9 18z"/>
            <path fill="#FBBC05" d="M3.97 10.72c-.18-.54-.28-1.12-.28-1.72s.1-1.18.28-1.72V4.95H.96A8.996 8.996 0 000 9c0 1.45.35 2.83.96 4.05l3.01-2.33z"/>
            <path fill="#EA4335" d="M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.58C13.46.89 11.43 0 9 0 5.48 0 2.44 2.02.96 4.95l3.01 2.33C4.68 5.16 6.66 3.58 9 3.58z"/>
          </svg>
          Continue with Google
        </button>

        {/* Divider */}
        <div className="flex items-center gap-3 mb-4">
          <div className="flex-1 h-px bg-white/10" />
          <span className="text-white/30 text-xs">OR</span>
          <div className="flex-1 h-px bg-white/10" />
        </div>

        {/* Email/Password fields */}
        <div className="space-y-3 mb-4">
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="Email address"
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/25 text-sm focus:outline-none focus:border-orange-500 transition-all"
          />
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Password"
            onKeyDown={e => e.key === "Enter" && handleEmailAuth()}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/25 text-sm focus:outline-none focus:border-orange-500 transition-all"
          />
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-2 mb-4 text-red-400 text-xs">
            {error}
          </div>
        )}

        <button
          onClick={handleEmailAuth}
          disabled={loading}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold text-sm shadow-lg shadow-orange-500/30 hover:scale-[1.02] transition-all disabled:opacity-50 mb-4">
          {loading ? "Please wait..." : mode === "login" ? "Login" : "Sign Up"}
        </button>

        <p className="text-center text-white/40 text-sm">
          {mode === "login" ? "Don't have an account? " : "Already have an account? "}
          <button
            onClick={() => { setMode(mode === "login" ? "signup" : "login"); setError("") }}
            className="text-orange-400 font-semibold hover:text-orange-300 transition-all">
            {mode === "login" ? "Sign Up" : "Login"}
          </button>
        </p>
      </div>
    </div>
  )
}

export function UserMenu({ user }) {
  const [open, setOpen] = useState(false)

  const handleLogout = async () => {
    await signOut(auth)
    setOpen(false)
  }

  return (
    <div className="relative">
      <button onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all">
        {user.photoURL ? (
          <img src={user.photoURL} alt="avatar" className="w-6 h-6 rounded-full" />
        ) : (
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center text-white text-xs font-bold">
            {user.email?.[0]?.toUpperCase() || "U"}
          </div>
        )}
        <span className="text-white text-sm font-medium hidden sm:block">
          {user.displayName || user.email?.split("@")[0]}
        </span>
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-2 w-48 bg-[#3a1a1f] border border-white/10 rounded-xl shadow-xl z-50 overflow-hidden">
            <div className="px-4 py-3 border-b border-white/10">
              <div className="text-white text-sm font-medium truncate">{user.displayName || "User"}</div>
              <div className="text-white/40 text-xs truncate">{user.email}</div>
            </div>
            <button onClick={handleLogout}
              className="w-full text-left px-4 py-3 text-red-400 text-sm hover:bg-white/5 transition-all">
              🚪 Logout
            </button>
          </div>
        </>
      )}
    </div>
  )
}

export default AuthModal