import { useState } from "react"

const initialFiles = [
  { id: 1, name: "Parciales", type: "folder", items: 3, modified: "hace 2 días" },
  { id: 2, name: "Laboratorios", type: "folder", items: 5, modified: "hace 5 días" },
  { id: 3, name: "Apuntes_Parcial1_Calculo.pdf", type: "pdf", size: "2.4 MB", author: "Carlos Ríos", date: "14 mayo" },
  { id: 4, name: "Resumen_Series_Taylor.docx", type: "doc", size: "0.8 MB", author: "Tú", date: "hoy" },
  { id: 5, name: "Notas_Grupo_2025-1.xlsx", type: "sheet", size: "0.3 MB", author: "Luisa Vera", date: "10 mayo" },
]

const icons = {
  folder: { emoji: "📁", bg: "bg-amber-100", text: "text-amber-800" },
  pdf:    { emoji: "📄", bg: "bg-orange-100", text: "text-orange-700" },
  doc:    { emoji: "📝", bg: "bg-green-100",  text: "text-green-800" },
  sheet:  { emoji: "📊", bg: "bg-emerald-100", text: "text-emerald-800" },
}

export default function Files({ groupName }) {
  const [search, setSearch] = useState("")
  const [files, setFiles] = useState(initialFiles)

  const filtered = files.filter(f =>
    f.name.toLowerCase().includes(search.toLowerCase())
  )

  function handleUpload(e) {
    const file = e.target.files[0]
    if (!file) return
    const ext = file.name.split(".").pop().toLowerCase()
    const type = ext === "pdf" ? "pdf" : ext === "docx" || ext === "doc" ? "doc" : ext === "xlsx" ? "sheet" : "doc"
    setFiles(prev => [...prev, {
      id: Date.now(),
      name: file.name,
      type,
      size: (file.size / 1024 / 1024).toFixed(1) + " MB",
      author: "Tú",
      date: "ahora"
    }])
  }

  return (
    <div className="flex flex-col h-full bg-green-50">

      {/* Toolbar */}
      <div className="px-5 py-3 bg-white border-b border-gray-200 flex items-center gap-2">
        <input
          className="flex-1 bg-green-50 rounded-lg px-3 py-2 text-sm outline-none border border-gray-200 focus:border-green-400 transition"
          placeholder="Buscar archivos..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <label className="w-9 h-9 rounded-lg border border-gray-200 bg-white flex items-center justify-center cursor-pointer hover:bg-gray-50 transition text-base" title="Subir archivo">
          ⬆️
          <input type="file" className="hidden" onChange={handleUpload} />
        </label>
        <button className="w-9 h-9 rounded-lg border border-gray-200 bg-white flex items-center justify-center hover:bg-gray-50 transition text-base" title="Nueva carpeta">
          📂
        </button>
      </div>

      {/* Drive tag */}
      <div className="px-5 py-2">
        <span className="inline-flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-1.5">
          🟢 Drive: UniHub / {groupName}
          <span className="text-emerald-500 ml-1">↗</span>
        </span>
      </div>

      {/* Lista de archivos */}
      <div className="flex-1 overflow-y-auto px-5 pb-5 flex flex-col gap-2">
        {filtered.length === 0 && (
          <div className="flex items-center justify-center h-32 text-gray-400 text-sm">
            No se encontraron archivos
          </div>
        )}
        {filtered.map(f => {
          const icon = icons[f.type] || icons.doc
          return (
            <div key={f.id} className="flex items-center gap-3 px-4 py-3 bg-white rounded-xl border border-gray-200 hover:border-green-300 cursor-pointer transition">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0 ${icon.bg} ${icon.text}`}>
                {icon.emoji}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800 truncate">{f.name}</p>
                <p className="text-xs text-gray-500">
                  {f.type === "folder"
                    ? `${f.items} archivos · modificado ${f.modified}`
                    : `${f.size} · ${f.author} · ${f.date}`}
                </p>
              </div>
              {f.type === "folder" ? (
                <span className="text-gray-400 text-sm">›</span>
              ) : (
                <div className="flex gap-1">
                  <button className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition text-sm" title="Descargar">⬇️</button>
                  <button className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition text-sm" title="Abrir en Drive">↗️</button>
                </div>
              )}
            </div>
          )
        })}
      </div>

    </div>
  )
}