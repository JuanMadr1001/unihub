import { MessageCircle, Folder, CheckCircle, Search, Users } from "lucide-react"

const tabs = [
  { id: "chat",  label: "Chat",     icon: MessageCircle },
  { id: "files", label: "Archivos", icon: Folder },
  { id: "tasks", label: "Tareas",   icon: CheckCircle },
]

export default function Topbar({ group, activeTab, onTabChange }) {
  if (!group) return null

  return (
    <div className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">

      {/* Info del grupo */}
      <div className="flex items-center gap-3 px-5 py-3">
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-semibold flex-shrink-0 ${group.bg} ${group.text}`}>
          {group.name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase()}
        </div>
        <div className="flex-1">
          <h2 className="text-sm font-semibold text-gray-800 dark:text-gray-100">{group.name}</h2>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {group.subject || "Sin materia"} · <span className="text-emerald-600">● Drive conectado</span>
          </p>
        </div>
        <button className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition">
          <Search size={15} />
        </button>
        <button className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition">
          <Users size={15} />
        </button>
      </div>

      {/* Pestañas */}
      <div className="flex px-4">
        {tabs.map(tab => {
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex items-center gap-1.5 px-4 py-2.5 text-sm border-b-2 transition
                ${activeTab === tab.id
                  ? "border-orange-500 text-orange-500 font-medium"
                  : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"}`}
            >
              <Icon size={14} />
              {tab.label}
            </button>
          )
        })}
      </div>

    </div>
  )
}