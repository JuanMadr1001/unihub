import { useState } from "react"

const initialTasks = [
  { id: 1, title: "Estudiar series de Taylor para el parcial", group: "Cálculo III", due: "16 mayo", priority: "alta", done: false },
  { id: 2, title: "Entregar informe laboratorio 4", group: "Circuitos Eléctricos", due: "20 mayo", priority: "media", done: false },
  { id: 3, title: "Revisar capítulo 5 de Hayt", group: "Circuitos Eléctricos", due: "22 mayo", priority: "baja", done: false },
  { id: 4, title: "Subir apuntes del primer corte", group: "Cálculo III", due: "", priority: "baja", done: true },
]

const priorityStyles = {
  alta:  { label: "Alta",  bg: "bg-orange-100", text: "text-orange-800" },
  media: { label: "Media", bg: "bg-amber-100",  text: "text-amber-800" },
  baja:  { label: "Baja",  bg: "bg-green-100",  text: "text-green-800" },
}

export default function Tasks() {
  const [tasks, setTasks] = useState(initialTasks)
  const [showForm, setShowForm] = useState(false)
  const [newTask, setNewTask] = useState({ title: "", due: "", priority: "media" })

  function toggleTask(id) {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t))
  }

  function addTask() {
    if (!newTask.title.trim()) return
    setTasks(prev => [...prev, {
      id: Date.now(),
      title: newTask.title.trim(),
      group: "Manual",
      due: newTask.due,
      priority: newTask.priority,
      done: false,
    }])
    setNewTask({ title: "", due: "", priority: "media" })
    setShowForm(false)
  }

  const pending = tasks.filter(t => !t.done)
  const done = tasks.filter(t => t.done)

  return (
    <div className="flex flex-col h-full bg-green-50">

      {/* Toolbar */}
      <div className="px-5 py-3 bg-white border-b border-gray-200 flex items-center justify-between">
        <p className="text-sm text-gray-500">
          {pending.length} pendiente{pending.length !== 1 ? "s" : ""} · {done.length} completada{done.length !== 1 ? "s" : ""}
        </p>
        <button
          onClick={() => setShowForm(v => !v)}
          className="flex items-center gap-1 text-sm text-orange-500 border border-orange-300 px-3 py-1.5 rounded-lg hover:bg-orange-50 transition"
        >
          + Nueva tarea
        </button>
      </div>

      {/* Formulario nueva tarea */}
      {showForm && (
        <div className="px-5 py-3 bg-white border-b border-gray-200 flex flex-col gap-2">
          <input
            className="w-full bg-green-50 rounded-lg px-3 py-2 text-sm outline-none border border-gray-200 focus:border-green-400 transition"
            placeholder="Nombre de la tarea..."
            value={newTask.title}
            onChange={e => setNewTask(p => ({ ...p, title: e.target.value }))}
            onKeyDown={e => e.key === "Enter" && addTask()}
            autoFocus
          />
          <div className="flex gap-2">
            <input
              type="date"
              className="flex-1 bg-green-50 rounded-lg px-3 py-2 text-sm outline-none border border-gray-200 focus:border-green-400 transition"
              value={newTask.due}
              onChange={e => setNewTask(p => ({ ...p, due: e.target.value }))}
            />
            <select
              className="flex-1 bg-green-50 rounded-lg px-3 py-2 text-sm outline-none border border-gray-200 focus:border-green-400 transition"
              value={newTask.priority}
              onChange={e => setNewTask(p => ({ ...p, priority: e.target.value }))}
            >
              <option value="alta">Alta</option>
              <option value="media">Media</option>
              <option value="baja">Baja</option>
            </select>
            <button
              onClick={addTask}
              className="px-4 py-2 bg-orange-500 text-white text-sm rounded-lg hover:bg-orange-600 transition"
            >
              Agregar
            </button>
            <button
              onClick={() => setShowForm(false)}
              className="px-3 py-2 border border-gray-200 text-sm rounded-lg hover:bg-gray-50 transition text-gray-500"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Lista de tareas */}
      <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-2">

        {/* Pendientes */}
        {pending.map(task => {
          const p = priorityStyles[task.priority]
          return (
            <div key={task.id} className="flex items-start gap-3 px-4 py-3 bg-white rounded-xl border border-gray-200 hover:border-green-300 transition">
              <button
                onClick={() => toggleTask(task.id)}
                className="w-5 h-5 rounded-full border-2 border-gray-300 flex items-center justify-center flex-shrink-0 mt-0.5 hover:border-green-500 transition"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800">{task.title}</p>
                <p className="text-xs text-gray-500 mt-0.5">
                  {task.due && `📅 Vence ${task.due} · `}{task.group}
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
              const p = priorityStyles[task.priority]
              return (
                <div key={task.id} className="flex items-start gap-3 px-4 py-3 bg-white rounded-xl border border-gray-100 opacity-50 transition">
                  <button
                    onClick={() => toggleTask(task.id)}
                    className="w-5 h-5 rounded-full bg-green-500 border-2 border-green-500 flex items-center justify-center flex-shrink-0 mt-0.5"
                  >
                    <span className="text-white text-xs">✓</span>
                  </button>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-400 line-through">{task.title}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{task.group}</p>
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