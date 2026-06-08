import { useState } from "react"
import Sidebar from "./components/layout/Sidebar"
import Topbar from "./components/layout/Topbar"
import Chat from "./components/chat/Chat"
import Files from "./components/files/Files"
import Tasks from "./components/tasks/Tasks"

export default function App() {
  const [activeGroup, setActiveGroup] = useState(null)
  const [activeTab, setActiveTab] = useState("chat")

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar activeGroup={activeGroup} onSelectGroup={setActiveGroup} />

      <div className="flex-1 flex flex-col overflow-hidden">
        {activeGroup ? (
          <>
            <Topbar
              group={activeGroup}
              activeTab={activeTab}
              onTabChange={setActiveTab}
            />
            <div className="flex-1 overflow-hidden">
              {activeTab === "chat" && <Chat />}
              {activeTab === "files" && <Files groupName={activeGroup.name} />}
              {activeTab === "tasks" && <Tasks />}
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