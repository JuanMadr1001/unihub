import { useState } from "react"
import { signOut } from "firebase/auth"
import { auth } from "../../firebase"
import { useGroups } from "../../hooks/useGroups"
import { useTheme } from "../../context/ThemeContext"
import { Plus, LogOut, Leaf, Sun, Moon } from "lucide-react"

const colors = [
  { bg: "bg-green-100", text: "text-green-900" },
  { bg: "bg-amber-100", text: "text-amber-900" },
  { bg: "bg-orange-100", text: "text-orange-900" },
  { bg: "bg-emerald-100", text: "text-emerald-900" },
]

export default function Sidebar({ activeGroup, onSelectGroup, user }) {
  const { groups, loading, createGroup } = useGroups(user?.uid)
  const { dark, setDark } = useTheme()
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ name: "", subject: "", semester: "" })

  async function handleCreate() {
    if (!form.name.trim()) return
    await createGroup(form.name, form.subject, form.semester)
    setForm({ name: "", subject: "", semester: "" })
    setShowForm(false)
  }

  function getColor(index) {
    return colors[index % colors.length]
  }

  function getInitials(name) {
    return name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase()
  }

  return (
    <div className="w-56 min-w-56 h-full flex flex-col bg-green-50 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700">

      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center gap-3">
        <div className="w-9 h-9 bg-orange-500 rounded-xl flex items-center justify-center flex-shrink-0">
          <Leaf size={18} className="text-white" />
        </div>
        <div>
          <h2 className="text-sm font-semibold text-gray-800 dark:text-gray-100">UniHub</h2>
          <p className="text-xs text-gray-500 dark:text-gray-400">Ing. Electrónica</p>
        </div>
      </div>

      {/* Botón nuevo grupo */}
      <div className="px-2 pt-3 pb-1">
        <button
          onClick={() => setShowForm(v => !v)}
          className="w-full py-2 rounded-lg border border-dashed border-green-400 dark:border-green-700 text-green-800 dark:text-green-400 text-xs flex items-center justify-center gap-1.5 hover:bg-green-100 dark:hover:bg-green-900 transition"
        >
          <Plus size={13} />
          Nuevo grupo
        </button>
      </div>

      {/* Formulario nuevo grupo */}
      {showForm && (
        <div className="px-2 pb-2 flex flex-col gap-1.5">
          <input
            className="w-full bg-white dark:bg-gray-800 dark:text-gray-100 rounded-lg px-2 py-1.5 text-xs border border-gray-200 dark:border-gray-600 outline-none focus:border-green-400"
            placeholder="Nombre del grupo"
            value={form.name}
            onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
          />
          <input
            className="w-full bg-white dark:bg-gray-800 dark:text-gray-100 rounded-lg px-2 py-1.5 text-xs border border-gray-200 dark:border-gray-600 outline-none focus:border-green-400"
            placeholder="Materia"
            value={form.subject}
            onChange={e => setForm(p => ({ ...p, subject: e.target.value }))}
          />
          <input
            className="w-full bg-white dark:bg-gray-800 dark:text-gray-100 rounded-lg px-2 py-1.5 text-xs border border-gray-200 dark:border-gray-600 outline-none focus:border-green-400"
            placeholder="Semestre (ej: 2025-2)"
            value={form.semester}
            onChange={e => setForm(p => ({ ...p, semester: e.target.value }))}
          />
          <div className="flex gap-1">
            <button
              onClick={handleCreate}
              className="flex-1 py-1.5 bg-orange-500 text-white text-xs rounded-lg hover:bg-orange-600 transition"
            >
              Crear
            </button>
            <button
              onClick={() => setShowForm(false)}
              className="flex-1 py-1.5 border border-gray-200 dark:border-gray-600 text-gray-500 dark:text-gray-400 text-xs rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Lista de grupos */}
      <div className="px-1 flex-1 overflow-y-auto">
        <p className="text-xs text-gray-400 uppercase tracking-widest px-2 py-2">Mis grupos</p>
        {loading && <p className="text-xs text-gray-400 px-3">Cargando...</p>}
        {!loading && groups.length === 0 && (
          <p className="text-xs text-gray-400 px-3">No tienes grupos aún</p>
        )}
        {groups.map((g, i) => {
          const color = getColor(i)
          return (
            <div
              key={g.id}
              onClick={() => onSelectGroup({ ...g, ...color })}
              className={`flex items-center gap-2 px-2 py-2 rounded-lg cursor-pointer mb-1 transition
                ${activeGroup?.id === g.id
                  ? "bg-white dark:bg-gray-800 border border-green-300 dark:border-green-700 shadow-sm"
                  : "hover:bg-white dark:hover:bg-gray-800"}`}
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-semibold flex-shrink-0 ${color.bg} ${color.text}`}>
                {getInitials(g.name)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800 dark:text-gray-100 truncate">{g.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{g.subject || "Sin materia"}</p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-gray-200 dark:border-gray-700 flex items-center gap-2">
        <img
          src={user?.photoURL}
          alt="avatar"
          className="w-8 h-8 rounded-full flex-shrink-0"
        />
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-gray-800 dark:text-gray-100 truncate">{user?.displayName}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user?.email}</p>
        </div>
        <button
          onClick={() => setDark(v => !v)}
          title={dark ? "Modo claro" : "Modo oscuro"}
          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          {dark ? <Sun size={15} /> : <Moon size={15} />}
        </button>
        <button
          onClick={() => signOut(auth)}
          title="Cerrar sesión"
          className="text-gray-400 hover:text-red-400 transition p-1 rounded-lg hover:bg-red-50 dark:hover:bg-red-900"
        >
          <LogOut size={15} />
        </button>
      </div>

    </div>
  )
}