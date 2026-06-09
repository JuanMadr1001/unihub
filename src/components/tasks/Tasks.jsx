import { useState } from "react"
import { useTasks } from "../../hooks/useTasks"
import { Plus, Circle, CheckCircle2, Calendar, X } from "lucide-react"

const priorityStyles = {
  alta:  { label: "Alta",  bg: "bg-orange-100 dark:bg-orange-900", text: "text-orange-800 dark:text-orange-300" },
  media: { label: "Media", bg: "bg-amber-100 dark:bg-amber-900",  text: "text-amber-800 dark:text-amber-300" },
  baja:  { label: "Baja",  bg: "bg-green-100 dark:bg-green-900",  text: "text-green-800 dark:text-green-300" },
}

export default function Tasks({ group, user }) {
  const { tasks, loading, addTask, toggleTask } = useTasks(group?.id)
  const [showForm, setShowForm] = useState(false)
  const [newTask, setNewTask] = useState({ title: "", due: "", priority: "media" })

  async function handleAdd() {
    if (!newTask.title.trim()) return
    await addTask(newTask.title, newTask.due, newTask.priority, user)
    setNewTask({ title: "", due: "", priority: "media" })
    setShowForm(false)
  }

  const pending = tasks.filter(t => !t.done)
  const done = tasks.filter(t => t.done)

  return (
    <div className="flex flex-col h-full bg-green-50 dark:bg-gray-950">

      {/* Toolbar */}
      <div className="px-5 py-3 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {loading
            ? "Cargando..."
            : `${pending.length} pendiente${pending.length !== 1 ? "s" : ""} · ${done.length} completada${done.length !== 1 ? "s" : ""}`}
        </p>
        <button
          onClick={() => setShowForm(v => !v)}
          className="flex items-center gap-1.5 text-sm text-orange-500 border border-orange-300 dark:border-orange-700 px-3 py-1.5 rounded-lg hover:bg-orange-50 dark:hover:bg-orange-900 transition"
        >
          <Plus size={14} />
          Nueva tarea
        </button>
      </div>

      {/* Formulario */}
      {showForm && (
        <div className="px-5 py-3 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 flex flex-col gap-2">
          <input
            className="w-full bg-green-50 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-500 rounded-lg px-3 py-2 text-sm outline-none border border-gray-200 dark:border-gray-700 focus:border-green-400 transition"
            placeholder="Nombre de la tarea..."
            value={newTask.title}
            onChange={e => setNewTask(p => ({ ...p, title: e.target.value }))}
            onKeyDown={e => e.key === "Enter" && handleAdd()}
            autoFocus
          />
          <div className="flex gap-2">
            <div className="flex-1 flex items-center gap-2 bg-green-50 dark:bg-gray-800 rounded-lg px-3 py-2 border border-gray-200 dark:border-gray-700 focus-within:border-green-400 transition">
              <Calendar size={13} className="text-gray-400 flex-shrink-0" />
              <input
                type="date"
                className="flex-1 bg-transparent text-sm outline-none text-gray-700 dark:text-gray-200"
                value={newTask.due}
                onChange={e => setNewTask(p => ({ ...p, due: e.target.value }))}
              />
            </div>
            <select
              className="flex-1 bg-green-50 dark:bg-gray-800 dark:text-gray-200 rounded-lg px-3 py-2 text-sm outline-none border border-gray-200 dark:border-gray-700 focus:border-green-400 transition"
              value={newTask.priority}
              onChange={e => setNewTask(p => ({ ...p, priority: e.target.value }))}
            >
              <option value="alta">Alta</option>
              <option value="media">Media</option>
              <option value="baja">Baja</option>
            </select>
            <button
              onClick={handleAdd}
              className="px-4 py-2 bg-orange-500 text-white text-sm rounded-lg hover:bg-orange-600 transition"
            >
              Agregar
            </button>
            <button
              onClick={() => setShowForm(false)}
              className="w-9 h-9 border border-gray-200 dark:border-gray-700 text-gray-400 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition flex items-center justify-center"
            >
              <X size={14} />
            </button>
          </div>
        </div>
      )}

      {/* Lista */}
      <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-2">
        {!loading && tasks.length === 0 && (
          <div className="flex items-center justify-center h-32">
            <div className="text-center">
              <p className="text-gray-400 text-sm">No hay tareas aún</p>
              <p className="text-gray-400 text-xs mt-1">Agrega la primera con el botón ↑</p>
            </div>
          </div>
        )}

        {/* Pendientes */}
        {pending.map(task => {
          const p = priorityStyles[task.priority] || priorityStyles.media
          return (
            <div key={task.id} className="flex items-start gap-3 px-4 py-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-green-300 dark:hover:border-green-600 transition">
              <button
                onClick={() => toggleTask(task.id, task.done)}
                className="text-gray-300 dark:text-gray-600 hover:text-green-500 transition mt-0.5 flex-shrink-0"
              >
                <Circle size={18} />
              </button>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800 dark:text-gray-100">{task.title}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 flex items-center gap-1">
                  {task.due && <><Calendar size={11} /> Vence {task.due} · </>}
                  {task.createdBy}
                </p>
              </div>
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full flex-shrink-0 ${p.bg} ${p.text}`}>
                {p.label}
              </span>
            </div>
          )
        })}

        {/* Completadas */}
        {done.length > 0 && (
          <>
            <p className="text-xs text-gray-400 uppercase tracking-widest mt-2 px-1">Completadas</p>
            {done.map(task => {
              const p = priorityStyles[task.priority] || priorityStyles.media
              return (
                <div key={task.id} className="flex items-start gap-3 px-4 py-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 opacity-50 transition">
                  <button
                    onClick={() => toggleTask(task.id, task.done)}
                    className="text-green-500 transition mt-0.5 flex-shrink-0"
                  >
                    <CheckCircle2 size={18} />
                  </button>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-400 dark:text-gray-500 line-through">{task.title}</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{task.createdBy}</p>
                  </div>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full flex-shrink-0 ${p.bg} ${p.text}`}>
                    {p.label}
                  </span>
                </div>
              )
            })}
          </>
        )}
      </div>

    </div>
  )
}