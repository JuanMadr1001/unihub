import { useState, useEffect } from "react"
import { Routes, Route } from "react-router-dom"
import { onAuthStateChanged } from "firebase/auth"
import { auth } from "./firebase"
import Login from "./pages/Login"
import Join from "./pages/Join"
import Sidebar from "./components/layout/Sidebar"
import Topbar from "./components/layout/Topbar"
import Chat from "./components/chat/Chat"
import Files from "./components/files/Files"
import Tasks from "./components/tasks/Tasks"
import { Menu } from "lucide-react"

function MainApp({ user }) {
  const [activeGroup, setActiveGroup] = useState(null)
  const [activeTab, setActiveTab] = useState("chat")
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-950 overflow-hidden">
      <Sidebar
        activeGroup={activeGroup}
        onSelectGroup={setActiveGroup}
        user={user}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex-1 flex flex-col overflow-hidden min-w-0">

        {/* Barra móvil superior */}
        <div className="md:hidden flex items-center gap-3 px-4 py-3 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-gray-500 dark:text-gray-400"
          >
            <Menu size={20} />
          </button>
          <span className="text-sm font-semibold text-gray-800 dark:text-gray-100">
            {activeGroup ? activeGroup.name : "UniHub"}
          </span>
        </div>

        {activeGroup ? (
          <>
            <Topbar
              group={activeGroup}
              activeTab={activeTab}
              onTabChange={setActiveTab}
              user={user}
            />
            <div className="flex-1 overflow-hidden">
              {activeTab === "chat" && <Chat group={activeGroup} user={user} />}
              {activeTab === "files" && <Files group={activeGroup} user={user} />}
              {activeTab === "tasks" && <Tasks group={activeGroup} user={user} />}
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <p className="text-4xl mb-3">🌿</p>
              <p className="text-gray-500 dark:text-gray-400 text-sm">Selecciona un grupo para empezar</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u)
      setLoading(false)
    })
    return unsub
  }, [])

  if (loading) return (
    <div className="min-h-screen bg-green-50 dark:bg-gray-950 flex items-center justify-center">
      <p className="text-gray-400 text-sm">Cargando...</p>
    </div>
  )

  return (
    <Routes>
      <Route path="/join/:code" element={<Join />} />
      <Route path="*" element={user ? <MainApp user={user} /> : <Login />} />
    </Routes>
  )
}