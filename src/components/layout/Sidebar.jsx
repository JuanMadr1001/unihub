import { signOut } from "firebase/auth"
import { auth } from "../../firebase"

const groups = [
  { id: 1, name: "Cálculo III", initials: "CA", last: "Parcial 2 el viernes!", bg: "bg-green-100", text: "text-green-900", badge: 3 },
  { id: 2, name: "Circuitos Eléctricos", initials: "CI", last: "Subí el laboratorio 4", bg: "bg-amber-100", text: "text-amber-900", badge: 0 },
  { id: 3, name: "Física Moderna", initials: "FI", last: "¿Alguien tiene las notas?", bg: "bg-orange-100", text: "text-orange-900", badge: 1 },
  { id: 4, name: "Señales y Sistemas", initials: "SE", last: "Reunión mañana 3pm", bg: "bg-emerald-100", text: "text-emerald-900", badge: 0 },
]

export default function Sidebar({ activeGroup, onSelectGroup, user }) {
  return (
    <div className="w-56 min-w-56 h-full flex flex-col bg-green-50 border-r border-gray-200">
      
      {/* Header */}
      <div className="p-4 border-b border-gray-200 flex items-center gap-3">
        <div className="w-9 h-9 bg-orange-500 rounded-xl flex items-center justify-center text-white text-lg flex-shrink-0">
          🌿
        </div>
        <div>
          <h2 className="text-sm font-semibold text-gray-800">UniHub</h2>
          <p className="text-xs text-gray-500">Ing. Electrónica</p>
        </div>
      </div>

      {/* Nuevo grupo */}
      <div className="px-2 pt-3 pb-1">
        <button className="w-full py-2 rounded-lg border border-dashed border-green-400 text-green-800 text-xs flex items-center justify-center gap-1 hover:bg-green-100 transition">
          + Nuevo grupo
        </button>
      </div>

      {/* Lista de grupos */}
      <div className="px-1 flex-1 overflow-y-auto">
        <p className="text-xs text-gray-400 uppercase tracking-widest px-2 py-2">Mis grupos</p>
        {groups.map(g => (
          <div
            key={g.id}
            onClick={() => onSelectGroup(g)}
            className={`flex items-center gap-2 px-2 py-2 rounded-lg cursor-pointer mb-1 transition
              ${activeGroup?.id === g.id
                ? "bg-white border border-green-300 shadow-sm"
                : "hover:bg-white"}`}
          >
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-semibold flex-shrink-0 ${g.bg} ${g.text}`}>
              {g.initials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-800 truncate">{g.name}</p>
              <p className="text-xs text-gray-500 truncate">{g.last}</p>
            </div>
            {g.badge > 0 && (
              <span className="bg-orange-500 text-white text-xs font-medium px-1.5 py-0.5 rounded-full flex-shrink-0">
                {g.badge}
              </span>
            )}
          </div>
        ))}
      </div>

      
      {/* Footer usuario */}
<div className="p-3 border-t border-gray-200 flex items-center gap-2">
  <img
    src={user?.photoURL}
    alt="avatar"
    className="w-8 h-8 rounded-full flex-shrink-0"
  />
  <div className="flex-1 min-w-0">
    <p className="text-xs font-medium text-gray-800 truncate">{user?.displayName}</p>
    <p className="text-xs text-gray-500 truncate">{user?.email}</p>
  </div>
  <button
    onClick={() => signOut(auth)}
    className="text-gray-400 hover:text-red-400 transition text-sm"
    title="Cerrar sesión"
  >
    🚪
  </button>
</div>

    </div>
  )
}