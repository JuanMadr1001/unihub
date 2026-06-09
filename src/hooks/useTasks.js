import { useState, useEffect } from "react"
import { collection, addDoc, onSnapshot, query, orderBy, doc, updateDoc } from "firebase/firestore"
import { db } from "../firebase"

export function useTasks(groupId) {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!groupId) return

    const q = query(
      collection(db, "groups", groupId, "tasks"),
      orderBy("createdAt", "asc")
    )

    const unsub = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      setTasks(data)
      setLoading(false)
    })

    return unsub
  }, [groupId])

  async function addTask(title, due, priority, user) {
    if (!title.trim()) return
    await addDoc(collection(db, "groups", groupId, "tasks"), {
      title,
      due,
      priority,
      done: false,
      createdBy: user.displayName,
      userId: user.uid,
      createdAt: new Date(),
    })
  }

  async function toggleTask(taskId, currentDone) {
    const ref = doc(db, "groups", groupId, "tasks", taskId)
    await updateDoc(ref, { done: !currentDone })
  }

  return { tasks, loading, addTask, toggleTask }
}