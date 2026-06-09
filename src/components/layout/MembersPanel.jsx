import { useState } from "react"
import { X, Copy, Check, UserPlus } from "lucide-react"
import { useGroups } from "../../hooks/useGroups"

export default function MembersPanel({ group, user, onClose }) {
  const { joinGroup } = useGroups(user?.uid)
  const [copied, setCopied] = useState(false)
  const [joinCode, setJoinCode] = useState("")
  const [joinError, setJoinError] = useState("")
  const [joinSuccess, setJoinSuccess] = useState(false)
  const [joining, setJoining] = useState(false)

  const inviteLink = `${window.location.origin}/join/${group?.code}`

  function copyLink() {
    navigator.clipboard.writeText(inviteLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  async function handleJoin() {
    if (!joinCode.trim()) return
    setJoining(true)
    setJoinError("")
    const result = await joinGroup(joinCode, user?.uid)
    if (result.error) {
      setJoinError(result.error)
    } else {
      setJoinSuccess(true)
    }
    setJoining(false)
  }

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-40 z-20"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="fixed right-0 top-0 h-full w-80 bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-700 z-30 flex flex-col shadow-xl">

        {/* Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-100">Miembros</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-1 rounded-lg"
          >
            <X size={16} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-5">

          {/* Invitar */}
          <div>
            <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">Invitar al grupo</p>
            <div className="bg-green-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-3 flex flex-col gap-2">
              <p className="text-xs text-gray-500 dark:text-gray-400">Código del grupo</p>
              <div className="flex items-center gap-2">
                <span className="flex-1 text-lg font-mono font-bold text-gray-800 dark:text-gray-100 tracking-widest">
                  {group?.code}
                </span>
                <button
                  onClick={copyLink}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-500 hover:bg-orange-600 text-white text-xs rounded-lg transition"
                >
                  {copied ? <Check size={13} /> : <Copy size={13} />}
                  {copied ? "Copiado" : "Copiar link"}
                </button>
              </div>
              <p className="text-xs text-gray-400 dark:text-gray-500 break-all">{inviteLink}</p>
            </div>
          </div>

          {/* Unirse con código */}
          <div>
            <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">Unirse a otro grupo</p>
            <div className="flex gap-2">
              <input
                className="flex-1 bg-green-50 dark:bg-gray-800 dark:text-gray-100 rounded-lg px-3 py-2 text-sm outline-none border border-gray-200 dark:border-gray-700 focus:border-green-400 transition uppercase"
                placeholder="Código del grupo"
                value={joinCode}
                onChange={e => setJoinCode(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleJoin()}
                maxLength={6}
              />
              <button
                onClick={handleJoin}
                disabled={joining}
                className="flex items-center gap-1.5 px-3 py-2 bg-green-600 hover:bg-green-700 text-white text-sm rounded-lg transition disabled:opacity-50"
              >
                <UserPlus size={14} />
                Unirse
              </button>
            </div>
            {joinError && <p className="text-xs text-red-500 mt-1">{joinError}</p>}
            {joinSuccess && <p className="text-xs text-green-600 mt-1">¡Te uniste al grupo exitosamente!</p>}
          </div>

          {/* Lista de miembros */}
          <div>
            <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
              {group?.members?.length || 0} miembro{group?.members?.length !== 1 ? "s" : ""}
            </p>
            <div className="flex flex-col gap-2">
              {group?.members?.map((memberId, i) => (
                <div key={memberId} className="flex items-center gap-3 px-3 py-2 bg-green-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                  <div className="w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300 flex items-center justify-center text-xs font-semibold flex-shrink-0">
                    {i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-600 dark:text-gray-300 truncate">
                      {memberId === user?.uid ? `${user?.displayName} (tú)` : memberId}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </>
  )
}