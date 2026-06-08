import { useState, useEffect, useRef } from "react"
import { useMessages } from "../../hooks/useMessages"

function Message({ msg, currentUserId }) {
  const own = msg.userId === currentUserId

  return (
    <div className={`flex gap-2 items-end ${own ? "flex-row-reverse" : ""}`}>
      <img
        src={msg.userPhoto}
        alt={msg.userName}
        className="w-7 h-7 rounded-full flex-shrink-0"
      />
      <div className={`flex flex-col gap-1 ${own ? "items-end" : "items-start"}`}>
        {!own && <p className="text-xs text-gray-400 px-1">{msg.userName}</p>}
        <div className={`px-3 py-2 rounded-2xl text-sm leading-relaxed max-w-xs lg:max-w-sm
          ${own
            ? "bg-orange-100 text-orange-900 border border-orange-200"
            : "bg-white text-gray-800 border border-gray-200"}`}>
          {msg.text}
        </div>
        <p className="text-xs text-gray-400 px-1">
          {msg.createdAt?.toDate?.()
            ? new Date(msg.createdAt.toDate()).toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit" })
            : ""}
        </p>
      </div>
    </div>
  )
}

export default function Chat({ group, user }) {
  const { messages, loading, sendMessage } = useMessages(group?.id)
  const [input, setInput] = useState("")
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  async function handleSend() {
    if (!input.trim()) return
    await sendMessage(input, user)
    setInput("")
  }

  return (
    <div className="flex flex-col h-full">

      {/* Mensajes */}
      <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-4 bg-green-50">
        {loading && <p className="text-xs text-gray-400 text-center">Cargando mensajes...</p>}
        {!loading && messages.length === 0 && (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-400 text-sm">No hay mensajes aún. ¡Sé el primero! 👋</p>
          </div>
        )}
        {messages.map(msg => (
          <Message key={msg.id} msg={msg} currentUserId={user?.uid} />
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="px-4 py-3 bg-white border-t border-gray-200 flex items-center gap-2">
        <button className="text-gray-400 hover:text-gray-600 text-xl px-1">📎</button>
        <input
          className="flex-1 bg-green-50 rounded-full px-4 py-2 text-sm outline-none border border-gray-200 focus:border-green-400 transition"
          placeholder="Escribe un mensaje..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && handleSend()}
        />
        <button
          onClick={handleSend}
          className="w-9 h-9 rounded-full bg-orange-500 hover:bg-orange-600 text-white flex items-center justify-center transition text-sm"
        >
          ➤
        </button>
      </div>

    </div>
  )
}