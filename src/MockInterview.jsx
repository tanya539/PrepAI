import { useState, useEffect, useRef } from "react"

async function callAI(messages) {
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
          content: "You are a professional interviewer. Ask one interview question at a time. Start with Tell me about yourself. After each answer give 1 line feedback then ask next question. After 5 questions give overall feedback and a Score: X/10. Keep responses concise."
        },
        ...messages
      ]
    })
  })
  const data = await res.json()
  return data.choices[0].message.content
}

function speak(text) {
  window.speechSynthesis.cancel()
  const utter = new SpeechSynthesisUtterance(text)
  utter.rate = 0.95
  utter.pitch = 1
  utter.volume = 1
  const voices = window.speechSynthesis.getVoices()
  const english = voices.find(v => v.lang.startsWith("en"))
  if (english) utter.voice = english
  window.speechSynthesis.speak(utter)
}

function MockInterview() {
  const [started, setStarted] = useState(false)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [listening, setListening] = useState(false)
  const [cameraOn, setCameraOn] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const videoRef = useRef(null)
  const streamRef = useRef(null)
  const recognitionRef = useRef(null)
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, loading])

  // Camera
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false })
      streamRef.current = stream
      if (videoRef.current) videoRef.current.srcObject = stream
      setCameraOn(true)
    } catch (e) {
      alert("Camera permission denied!")
    }
  }

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop())
      streamRef.current = null
    }
    setCameraOn(false)
  }

  // Speech Recognition
  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) { alert("Speech recognition not supported! Use Chrome."); return }
    const recognition = new SpeechRecognition()
    recognition.lang = "en-US"
    recognition.continuous = false
    recognition.interimResults = false
    recognition.onresult = (e) => {
      const transcript = e.results[0][0].transcript
      setInput(prev => prev + " " + transcript)
      setListening(false)
    }
    recognition.onerror = () => setListening(false)
    recognition.onend = () => setListening(false)
    recognitionRef.current = recognition
    recognition.start()
    setListening(true)
  }

  const stopListening = () => {
    recognitionRef.current?.stop()
    setListening(false)
  }

  const startInterview = async () => {
    await startCamera()
    setStarted(true)
    setLoading(true)
    const reply = await callAI([{ role: "user", content: "Start the interview." }])
    setMessages([{ role: "assistant", content: reply }])
    setIsSpeaking(true)
    speak(reply)
    setTimeout(() => setIsSpeaking(false), 4000)
    setLoading(false)
  }

  const sendMessage = async () => {
    if (!input.trim() || loading) return
    const newMessages = [...messages, { role: "user", content: input.trim() }]
    setMessages(newMessages)
    setInput("")
    setLoading(true)
    const reply = await callAI(newMessages)
    setMessages([...newMessages, { role: "assistant", content: reply }])
    setIsSpeaking(true)
    speak(reply)
    setTimeout(() => setIsSpeaking(false), 5000)
    setLoading(false)
  }

  const endInterview = () => {
    window.speechSynthesis.cancel()
    stopCamera()
    setStarted(false)
    setMessages([])
    setInput("")
  }

  if (!started) {
    return (
      <div className="text-center py-10">
        <div className="text-6xl mb-4">🎙️</div>
        <h2 className="text-3xl font-bold text-white mb-3">
          Mock <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-400">Interview</span>
        </h2>
        <p className="text-white/40 mb-3">AI interviewer will ask questions & speak them aloud</p>
        <div className="flex justify-center gap-6 text-sm text-white/40 mb-10">
          <span>📹 Camera ON</span>
          <span>🔊 AI Voice</span>
          <span>🎤 Voice Answer</span>
          <span>⌨️ Type Answer</span>
        </div>
        <button onClick={startInterview}
          className="px-10 py-4 rounded-2xl bg-gradient-to-r from-violet-600 to-cyan-600 text-white font-bold text-lg shadow-2xl shadow-violet-500/40 hover:scale-105 transition-all duration-300">
          🎙️ Start Interview
        </button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">
          Mock <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-400">Interview</span>
        </h2>
        <button onClick={endInterview} className="px-4 py-2 rounded-xl bg-red-600/20 border border-red-500/30 text-red-400 text-sm hover:bg-red-600/40 transition-all">
          End Interview
        </button>
      </div>

      <div className="flex gap-4">
        {/* Camera */}
        <div className="relative w-48 h-36 rounded-2xl overflow-hidden border border-white/10 bg-slate-900 flex-shrink-0">
          <video ref={videoRef} autoPlay muted playsInline className="w-full h-full object-cover" />
          {!cameraOn && (
            <div className="absolute inset-0 flex items-center justify-center text-white/30 text-sm">No Camera</div>
          )}
          {isSpeaking && (
            <div className="absolute bottom-2 left-2 flex gap-1">
              {[1,2,3].map(i => (
                <div key={i} className="w-1 bg-violet-400 rounded-full animate-pulse" style={{ height: `${8 + i * 4}px` }} />
              ))}
            </div>
          )}
          <div className="absolute top-2 left-2 w-2 h-2 rounded-full bg-red-500 animate-pulse" />
        </div>

        {/* AI Speaking indicator */}
        <div className="flex-1 bg-white/[0.03] border border-white/5 rounded-2xl p-4 flex items-center justify-center">
          {isSpeaking ? (
            <div className="text-center">
              <div className="flex gap-1 justify-center mb-2">
                {[1,2,3,4,5].map(i => (
                  <div key={i} className="w-1.5 rounded-full bg-violet-400 animate-pulse" style={{ height: `${12 + i * 6}px`, animationDelay: `${i * 0.1}s` }} />
                ))}
              </div>
              <p className="text-violet-300 text-sm">AI is speaking...</p>
            </div>
          ) : (
            <p className="text-white/30 text-sm">🎙️ AI Interviewer Ready</p>
          )}
        </div>
      </div>

      {/* Chat */}
      <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
              m.role === "user"
                ? "bg-gradient-to-r from-violet-600 to-cyan-600 text-white"
                : "bg-white/10 text-white/90 border border-white/10"
            }`}>
              {m.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white/10 border border-white/10 rounded-2xl px-4 py-3 flex gap-1">
              {[1,2,3].map(i => (
                <div key={i} className="w-2 h-2 rounded-full bg-violet-400 animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
              ))}
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="flex gap-2">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your answer or use mic..."
          rows={2}
          className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 resize-none focus:outline-none focus:border-violet-500"
        />
        <div className="flex flex-col gap-2">
          <button
            onClick={listening ? stopListening : startListening}
            className={`px-4 py-2 rounded-xl font-semibold text-sm transition-all ${
              listening
                ? "bg-red-500 text-white animate-pulse"
                : "bg-white/10 text-white/70 hover:bg-violet-500/30 hover:text-white border border-white/10"
            }`}
          >
            {listening ? "🔴 Stop" : "🎤 Mic"}
          </button>
          <button
            onClick={sendMessage}
            disabled={loading || !input.trim()}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-600 text-white font-semibold text-sm disabled:opacity-40 hover:scale-105 transition-all"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  )
}

export default MockInterview