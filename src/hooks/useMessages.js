import { useState, useEffect } from "react"
import { collection, addDoc, onSnapshot, query, orderBy } from "firebase/firestore"
import { db } from "../firebase"

export function useMessages(groupId) {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!groupId) return

    const q = query(
      collection(db, "groups", groupId, "messages"),
      orderBy("createdAt", "asc")
    )

    const unsub = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      setMessages(data)
      setLoading(false)
    })

    return unsub
  }, [groupId])

  async function sendMessage(text, user) {
    if (!text.trim()) return
    await addDoc(collection(db, "groups", groupId, "messages"), {
      text,
      userId: user.uid,
      userName: user.displayName,
      userPhoto: user.photoURL,
      createdAt: new Date(),
    })
  }

  return { messages, loading, sendMessage }
}