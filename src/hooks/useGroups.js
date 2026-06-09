import { useState, useEffect } from "react"
import { collection, addDoc, onSnapshot, query, where, doc, updateDoc, arrayUnion, getDocs } from "firebase/firestore"
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
    const code = Math.random().toString(36).substring(2, 8).toUpperCase()
    await addDoc(collection(db, "groups"), {
      name,
      subject,
      semester,
      members: [userId],
      code,
      createdAt: new Date(),
    })
  }

  async function joinGroup(code, userId) {
    const q = query(collection(db, "groups"), where("code", "==", code.toUpperCase()))
    const snapshot = await getDocs(q)
    if (snapshot.empty) return { error: "Código inválido" }
    const groupDoc = snapshot.docs[0]
    if (groupDoc.data().members.includes(userId)) return { error: "Ya eres miembro" }
    await updateDoc(doc(db, "groups", groupDoc.id), {
      members: arrayUnion(userId)
    })
    return { success: true }
  }

  return { groups, loading, createGroup, joinGroup }
}