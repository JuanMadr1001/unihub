import { useState, useEffect } from "react"
import { collection, addDoc, onSnapshot, query, orderBy } from "firebase/firestore"
import { db } from "../firebase"

export function useFiles(groupId) {
  const [files, setFiles] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!groupId) return

    const q = query(
      collection(db, "groups", groupId, "files"),
      orderBy("createdAt", "asc")
    )

    const unsub = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      setFiles(data)
      setLoading(false)
    })

    return unsub
  }, [groupId])

  async function addFile(file, user) {
    const ext = file.name.split(".").pop().toLowerCase()
    const type = ext === "pdf" ? "pdf" : ext === "docx" || ext === "doc" ? "doc" : ext === "xlsx" ? "sheet" : "doc"
    await addDoc(collection(db, "groups", groupId, "files"), {
      name: file.name,
      type,
      size: (file.size / 1024 / 1024).toFixed(1) + " MB",
      author: user.displayName,
      userId: user.uid,
      createdAt: new Date(),
    })
  }

  return { files, loading, addFile }
}