import { useState, useEffect, useRef } from "react"
import { useMessages } from "../../hooks/useMessages"
import { Paperclip, Send } from "lucide-react"

function Message({ msg, currentUserId }) {
  const own = msg.userId === currentUserId

  return (
    <div className={`flex gap-2 items-end ${own ? "flex-row-reverse" : ""}`}>
      <img
        src={msg.userPhoto}
        alt={msg.userName}
        className="w-7 h-7 rounded-full flex-shrink-0 object-cover"
      />
      <div className={`flex flex-col gap-1 ${own ? "items-end" : "items-start"}`}>
        {!own && <p className="text-xs text-gray-400 dark:text-gray-500 px-1">{msg.userName}</p>}
        <div className={`px-3 py-2 rounded-2xl text-sm leading-relaxed max-w-xs lg:max-w-sm
          ${own
            ? "bg-orange-100 dark:bg-orange-900 text-orange-900 dark:text-orange-100 border border-orange-200 dark:border-orange-800"
            : "bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 border border-gray-200 dark:border-gray-700"}`}>
          {msg.text}
        </div>
        <p className="text-xs text-gray-400 dark:text-gray-500 px-1">
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
      <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-4 bg-green-50 dark:bg-gray-950">
        {loading && (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-400 text-sm">Cargando mensajes...</p>
          </div>
        )}
        {!loading && messages.length === 0 && (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <p className="text-2xl mb-2">👋</p>
              <p className="text-gray-400 text-sm">No hay mensajes aún</p>
              <p className="text-gray-400 text-xs mt-1">¡Sé el primero en escribir!</p>
            </div>
          </div>
        )}
        {messages.map(msg => (
          <Message key={msg.id} msg={msg} currentUserId={user?.uid} />
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="px-4 py-3 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 flex items-center gap-2">
        <div className="relative group">
          <button
            className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-300 dark:text-gray-600 cursor-not-allowed"
            disabled
          >
            <Paperclip size={16} />
          </button>
          <span className="absolute bottom-10 left-0 bg-gray-800 dark:bg-gray-700 text-white text-xs px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition whitespace-nowrap">
            Próximamente
          </span>
        </div>
        <input
          className="flex-1 bg-green-50 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-500 rounded-full px-4 py-2 text-sm outline-none border border-gray-200 dark:border-gray-700 focus:border-green-400 dark:focus:border-green-600 transition"
          placeholder="Escribe un mensaje..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && handleSend()}
        />
        <button
          onClick={handleSend}
          className="w-9 h-9 rounded-full bg-orange-500 hover:bg-orange-600 text-white flex items-center justify-center transition"
        >
          <Send size={15} />
        </button>
      </div>

    </div>
  )
}