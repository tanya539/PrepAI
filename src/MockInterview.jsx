import { useState, useRef, useEffect } from "react"

async function callAI(messages, field) {
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
          content: `You are a professional interviewer conducting a mock interview for a ${field || "general"} student/candidate. Ask one relevant interview question at a time based on this field. Start with 'Tell me about yourself.' After each answer give 1 line feedback then ask next question relevant to ${field || "their field"}. After 5 questions give overall feedback and a Score: X/10.`
        },
        ...messages
      ]
    })
  })
  const data = await res.json()
  return data.choices[0].message.content
}

function speak(text) {
  if (!window.speechSynthesis) return
  window.speechSynthesis.cancel()
  const utterance = new SpeechSynthesisUtterance(text)
  utterance.rate = 1
  utterance.pitch = 1
  window.speechSynthesis.speak(utterance)
}

function MockInterview({ field }) {
  const [started, setStarted] = useState(false)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [cameraOn, setCameraOn] = useState(false)
  const [listening, setListening] = useState(false)
  const [voiceSupported, setVoiceSupported] = useState(true)

  const videoRef = useRef(null)
  const streamRef = useRef(null)
  const recognitionRef = useRef(null)

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) {
      setVoiceSupported(false)
      return
    }
    const recognition = new SpeechRecognition()
    recognition.continuous = false
    recognition.interimResults = false
    recognition.lang = "en-US"

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript
      setInput((prev) => (prev ? prev + " " + transcript : transcript))
    }
    recognition.onend = () => setListening(false)
    recognition.onerror = () => setListening(false)

    recognitionRef.current = recognition

    return () => {
      recognition.stop()
    }
  }, [])

  const toggleCamera = async () => {
    if (cameraOn) {
      streamRef.current?.getTracks().forEach((t) => t.stop())
      streamRef.current = null
      setCameraOn(false)
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true })
        streamRef.current = stream
        if (videoRef.current) videoRef.current.srcObject = stream
        setCameraOn(true)
      } catch (err) {
        alert("Camera access denied or not available.")
      }
    }
  }

  const toggleListening = () => {
    if (!recognitionRef.current) return
    if (listening) {
      recognitionRef.current.stop()
      setListening(false)
    } else {
      recognitionRef.current.start()
      setListening(true)
    }
  }

  useEffect(() => {
    return () => {
      streamRef.current?.getTracks().forEach((t) => t.stop())
    }
  }, [])

  const startInterview = async () => {
    setStarted(true)
    setLoading(true)
    const reply = await callAI([{ role: "user", content: "Start the interview." }], field)
    setMessages([{ role: "assistant", content: reply }])
    setLoading(false)
    speak(reply)
  }

  const sendMessage = async () => {
    if (!input.trim() || loading) return
    const newMessages = [...messages, { role: "user", content: input }]
    setMessages(newMessages)
    setInput("")
    setLoading(true)
    const reply = await callAI(newMessages, field)
    setMessages([...newMessages, { role: "assistant", content: reply }])
    setLoading(false)
    speak(reply)
  }

  if (!started) {
    return (
      <div className="text-center max-w-md mx-auto">
        <h2 className="text-3xl font-bold mb-4">
          Mock <span className="text-emerald-400">Interview</span>
        </h2>
        {field && (
          <p className="text-slate-400 mb-2">
            Field: <span className="text-emerald-400 font-semibold">{field}</span>
          </p>
        )}
        <p className="text-slate-400 mb-6">Turn on your camera to begin the interview</p>

        <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden aspect-video flex items-center justify-center mb-4">
          {cameraOn ? (
            <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
          ) : (
            <div className="text-slate-500 text-sm text-center px-4">
              📷 Camera is off
            </div>
          )}
        </div>

        <button
          onClick={toggleCamera}
          className={`w-full py-2 rounded-xl font-semibold transition-all mb-4 ${
            cameraOn
              ? "bg-red-500/20 border border-red-500/40 text-red-400 hover:bg-red-500/30"
              : "bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/30"
          }`}
        >
          {cameraOn ? "Turn Off Camera" : "Turn On Camera"}
        </button>

        <button
          onClick={startInterview}
          disabled={!cameraOn}
          className="bg-emerald-500 hover:bg-emerald-400 text-[#06120f] px-8 py-3 rounded-xl font-semibold text-lg w-full disabled:opacity-40 disabled:cursor-not-allowed"
        >
          🎤 Start Interview
        </button>
        {!cameraOn && (
          <p className="text-slate-500 text-xs mt-2">Camera must be on to start</p>
        )}
      </div>
    )
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">
        Mock <span className="text-emerald-400">Interview</span>
        {field && <span className="text-slate-400 text-base ml-2">— {field}</span>}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <div className="space-y-4 mb-6">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-xl rounded-2xl px-5 py-3 text-sm leading-relaxed ${
                  m.role === "user"
                    ? "bg-emerald-500 text-[#06120f]"
                    : "bg-slate-800 text-slate-200"
                }`}>
                  {m.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="text-slate-400 text-sm">AI is thinking...</div>
            )}
          </div>

          <div className="flex gap-3">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your answer or use the mic..."
              rows={3}
              className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 resize-none focus:outline-none focus:border-emerald-500"
            />
            <div className="flex flex-col gap-2">
              {voiceSupported && (
                <button
                  onClick={toggleListening}
                  className={`px-4 py-2 rounded-xl font-semibold transition-all ${
                    listening
                      ? "bg-red-500 text-white animate-pulse"
                      : "bg-slate-700 text-white hover:bg-slate-600"
                  }`}
                  title="Speak your answer"
                >
                  🎙️
                </button>
              )}
              <button
                onClick={sendMessage}
                disabled={loading || !input.trim()}
                className="bg-emerald-500 hover:bg-emerald-400 text-[#06120f] px-4 py-2 rounded-xl font-semibold disabled:opacity-40"
              >
                Send
              </button>
            </div>
          </div>
          {!voiceSupported && (
            <p className="text-slate-500 text-xs mt-2">🎙️ Voice input not supported in this browser. Try Chrome.</p>
          )}
        </div>

        <div>
          <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden aspect-video flex items-center justify-center mb-3">
            {cameraOn ? (
              <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
            ) : (
              <div className="text-slate-500 text-sm text-center px-4">
                📷 Camera is off
              </div>
            )}
          </div>
          <button
            onClick={toggleCamera}
            className={`w-full py-2 rounded-xl font-semibold transition-all ${
              cameraOn
                ? "bg-red-500/20 border border-red-500/40 text-red-400 hover:bg-red-500/30"
                : "bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/30"
            }`}
          >
            {cameraOn ? "Turn Off Camera" : "Turn On Camera"}
          </button>
          <p className="text-slate-500 text-xs mt-3 text-center">
            🔊 AI questions are read aloud automatically
          </p>
        </div>
      </div>
    </div>
  )
}

export default MockInterview