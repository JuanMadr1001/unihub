const tabs = [
  { id: "chat", label: "Chat", icon: "💬" },
  { id: "files", label: "Archivos", icon: "📁" },
  { id: "tasks", label: "Tareas", icon: "✅" },
]

export default function Topbar({ group, activeTab, onTabChange }) {
  if (!group) return null

  return (
    <div className="border-b border-gray-200 bg-white">
      
      {/* Info del grupo */}
      <div className="flex items-center gap-3 px-5 py-3">
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-semibold flex-shrink-0 ${group.bg} ${group.text}`}>
          {group.initials}
        </div>
        <div className="flex-1">
          <h2 className="text-sm font-semibold text-gray-800">{group.name}</h2>
          <p className="text-xs text-gray-500">
            4 miembros · <span className="text-emerald-600">🟢 Drive conectado</span>
          </p>
        </div>
        <button className="text-gray-400 hover:text-gray-600 text-sm px-2">🔍</button>
        <button className="text-gray-400 hover:text-gray-600 text-sm px-2">👥</button>
      </div>

      {/* Pestañas */}
      <div className="flex px-4">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex items-center gap-1.5 px-4 py-2.5 text-sm border-b-2 transition
              ${activeTab === tab.id
                ? "border-orange-500 text-orange-500 font-medium"
                : "border-transparent text-gray-500 hover:text-gray-700"}`}
          >
            <span>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

    </div>
  )
}