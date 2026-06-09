import { useState } from "react"
import { useFiles } from "../../hooks/useFiles"
import { Upload, FileText, FileSpreadsheet, File, ExternalLink, Search } from "lucide-react"

const icons = {
  pdf:   { icon: FileText,        bg: "bg-orange-100 dark:bg-orange-900", text: "text-orange-700 dark:text-orange-300" },
  doc:   { icon: FileText,        bg: "bg-green-100 dark:bg-green-900",   text: "text-green-800 dark:text-green-300" },
  sheet: { icon: FileSpreadsheet, bg: "bg-emerald-100 dark:bg-emerald-900", text: "text-emerald-800 dark:text-emerald-300" },
  other: { icon: File,            bg: "bg-gray-100 dark:bg-gray-700",     text: "text-gray-600 dark:text-gray-300" },
}

export default function Files({ group, user }) {
  const { files, loading, addFile } = useFiles(group?.id)
  const [search, setSearch] = useState("")

  function handleUpload(e) {
    const file = e.target.files[0]
    if (!file) return
    addFile(file, user)
  }

  const filtered = files.filter(f =>
    f.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="flex flex-col h-full bg-green-50 dark:bg-gray-950">

      {/* Toolbar */}
      <div className="px-5 py-3 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 flex items-center gap-2">
        <div className="flex-1 flex items-center gap-2 bg-green-50 dark:bg-gray-800 rounded-lg px-3 py-2 border border-gray-200 dark:border-gray-700 focus-within:border-green-400 transition">
          <Search size={14} className="text-gray-400 flex-shrink-0" />
          <input
            className="flex-1 bg-transparent text-sm outline-none text-gray-700 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500"
            placeholder="Buscar archivos..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <label
          className="w-9 h-9 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex items-center justify-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition text-gray-500 dark:text-gray-400"
          title="Subir archivo"
        >
          <Upload size={15} />
          <input type="file" className="hidden" onChange={handleUpload} />
        </label>
      </div>

      {/* Drive tag */}
      <div className="px-5 py-2">
        <span className="inline-flex items-center gap-1.5 text-xs text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900 border border-emerald-200 dark:border-emerald-700 rounded-lg px-3 py-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0" />
          Drive: UniHub / {group?.name}
          <ExternalLink size={11} className="ml-1" />
        </span>
      </div>

      {/* Lista */}
      <div className="flex-1 overflow-y-auto px-5 pb-5 flex flex-col gap-2">
        {loading && (
          <div className="flex items-center justify-center h-32">
            <p className="text-gray-400 text-sm">Cargando archivos...</p>
          </div>
        )}
        {!loading && filtered.length === 0 && (
          <div className="flex items-center justify-center h-32">
            <div className="text-center">
              <p className="text-gray-400 text-sm">
                {search ? "No se encontraron archivos" : "No hay archivos aún"}
              </p>
              {!search && <p className="text-gray-400 text-xs mt-1">Sube el primero con el botón ↑</p>}
            </div>
          </div>
        )}
        {filtered.map(f => {
          const style = icons[f.type] || icons.other
          const Icon = style.icon
          return (
            <div
              key={f.id}
              className="flex items-center gap-3 px-4 py-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-green-300 dark:hover:border-green-600 cursor-pointer transition"
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${style.bg} ${style.text}`}>
                <Icon size={20} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800 dark:text-gray-100 truncate">{f.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  {f.size} · {f.author} · {f.createdAt?.toDate?.()
                    ? new Date(f.createdAt.toDate()).toLocaleDateString("es-CO")
                    : "ahora"}
                </p>
              </div>
              <button
                className="w-8 h-8 rounded-lg border border-gray-200 dark:border-gray-700 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-700 transition text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                title="Abrir"
              >
                <ExternalLink size={14} />
              </button>
            </div>
          )
        })}
      </div>

    </div>
  )
}