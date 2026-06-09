import { useState, useEffect } from "react"
import { onAuthStateChanged } from "firebase/auth"
import { auth } from "./firebase"
import Login from "./pages/Login"
import Sidebar from "./components/layout/Sidebar"
import Topbar from "./components/layout/Topbar"
import Chat from "./components/chat/Chat"
import Files from "./components/files/Files"
import Tasks from "./components/tasks/Tasks"

export default function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeGroup, setActiveGroup] = useState(null)
  const [activeTab, setActiveTab] = useState("chat")

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u)
      setLoading(false)
    })
    return unsub
  }, [])

  if (loading) return (
    <div className="min-h-screen bg-green-50 flex items-center justify-center">
      <p className="text-gray-400 text-sm">Cargando...</p>
    </div>
  )

  if (!user) return <Login />

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar activeGroup={activeGroup} onSelectGroup={setActiveGroup} user={user} />

      <div className="flex-1 flex flex-col overflow-hidden">
        {activeGroup ? (
          <>
            <Topbar
              group={activeGroup}
              activeTab={activeTab}
              onTabChange={setActiveTab}
            />
            <div className="flex-1 overflow-hidden">
              {activeTab === "chat" && <Chat group={activeGroup} user={user} />}
              {activeTab === "files" && <Files groupName={activeGroup.name} />}
              {activeTab === "tasks" && <Tasks group={activeGroup} user={user} />}
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="text-4xl mb-3">🌿</div>
              <p className="text-gray-500 text-sm">Selecciona un grupo para empezar</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}