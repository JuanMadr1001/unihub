import { useState } from "react"

const initialMessages = [
  { id: 1, name: "Ana Martínez", initials: "AN", bg: "bg-green-100", text: "text-green-900", content: "Hola! Alguien tiene apuntes del parcial 1? No pude ir a clase 😅", time: "10:22", own: false, type: "text" },
  { id: 2, name: "Carlos Ríos", initials: "CA", bg: "bg-amber-100", text: "text-amber-900", content: "Apuntes_Parcial1_Calculo.pdf", time: "10:35", own: false, type: "file", size: "2.4 MB" },
  { id: 3, name: "Luisa Vera", initials: "LU", bg: "bg-orange-100", text: "text-orange-900", content: "El parcial 2 incluye series de Taylor y convergencia. El profe dijo que habrá ejercicio de demostración.", time: "11:04", own: false, type: "text" },
  { id: 4, name: "Tú", initials: "TU", bg: "bg-green-100", text: "text-green-900", content: "Gracias! Acabo de subir el resumen que hice para repasar", time: "11:10", own: true, type: "text" },
]

function Message({ msg }) {
  const avatar = (
    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0 ${msg.bg} ${msg.text}`}>
      {msg.initials}
    </div>
  )

  const bubble = msg.type === "file" ? (
    <div className="flex items-center gap-2 px-3 py-2 rounded-2xl bg-white border border-gray-200 cursor-pointer hover:border-gray-300 transition max-w-xs">
      <div className="w-8 h-8 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center text-base flex-shrink-0">
        📄
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-gray-800 truncate">{msg.content}</p>
        <p className="text-xs text-gray-500">{msg.size} · guardado en Drive</p>
      </div>
      <span className="text-gray-400 text-sm">⬇️</span>
    </div>
  ) : (
    <div className={`px-3 py-2 rounded-2xl text-sm leading-relaxed max-w-xs lg:max-w-sm
      ${msg.own
        ? "bg-orange-100 text-orange-900 border border-orange-200"
        : "bg-white text-gray-800 border border-gray-200"}`}>
      {msg.content}
    </div>
  )

  return (
    <div className={`flex gap-2 items-end ${msg.own ? "flex-row-reverse" : ""}`}>
      {avatar}
      <div className={`flex flex-col gap-1 ${msg.own ? "items-end" : "items-start"}`}>
        <p className="text-xs text-gray-400 px-1">{msg.own ? "" : msg.name}</p>
        {bubble}
        <p className="text-xs text-gray-400 px-1">{msg.time}</p>
      </div>
    </div>
  )
}

export default function Chat() {
  const [messages, setMessages] = useState(initialMessages)
  const [input, setInput] = useState("")

  function sendMessage() {
    if (!input.trim()) return
    const now = new Date()
    const time = `${now.getHours()}:${String(now.getMinutes()).padStart(2, "0")}`
    setMessages(prev => [...prev, {
      id: Date.now(),
      name: "Tú",
      initials: "TU",
      bg: "bg-green-100",
      text: "text-green-900",
      content: input.trim(),
      time,
      own: true,
      type: "text"
    }])
    setInput("")
  }

  return (
    <div className="flex flex-col h-full">

      {/* Mensajes */}
      <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-4 bg-green-50">
        {messages.map(msg => (
          <Message key={msg.id} msg={msg} />
        ))}
      </div>

      {/* Input */}
      <div className="px-4 py-3 bg-white border-t border-gray-200 flex items-center gap-2">
        <button className="text-gray-400 hover:text-gray-600 text-xl px-1">📎</button>
        <input
          className="flex-1 bg-green-50 rounded-full px-4 py-2 text-sm outline-none border border-gray-200 focus:border-green-400 transition"
          placeholder="Escribe un mensaje..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && sendMessage()}
        />
        <button
          onClick={sendMessage}
          className="w-9 h-9 rounded-full bg-orange-500 hover:bg-orange-600 text-white flex items-center justify-center transition text-sm"
        >
          ➤
        </button>
      </div>

    </div>
  )
}