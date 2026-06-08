import { useState, useEffect } from "react"
import { collection, addDoc, onSnapshot, query, where } from "firebase/firestore"
import { db } from "../firebase"

export function useGroups(userId) {
  const [groups, setGroups] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!userId) return

    const q = query(
      collection(db, "groups"),
      where("members", "array-contains", userId)
    )

    const unsub = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      setGroups(data)
      setLoading(false)
    })

    return unsub
  }, [userId])

  async function createGroup(name, subject, semester) {
    if (!name.trim()) return
    await addDoc(collection(db, "groups"), {
      name,
      subject,
      semester,
      members: [userId],
      createdAt: new Date(),
    })
  }

  return { groups, loading, createGroup }
}