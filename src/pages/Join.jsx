import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { collection, query, where, getDocs, doc, updateDoc, arrayUnion } from "firebase/firestore"
import { db, auth, provider } from "../firebase"
import { signInWithPopup, onAuthStateChanged } from "firebase/auth"
import { Leaf } from "lucide-react"

export default function Join() {
  const { code } = useParams()
  const navigate = useNavigate()
  const [status, setStatus] = useState("loading")
  const [user, setUser] = useState(null)
  const [groupName, setGroupName] = useState("")

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u)
    })
    return unsub
  }, [])

  useEffect(() => {
    if (user) handleJoin(user)
  }, [user])

  async function handleJoin(u) {
    setStatus("joining")
    try {
      const q = query(collection(db, "groups"), where("code", "==", code.toUpperCase()))
      const snapshot = await getDocs(q)
      if (snapshot.empty) {
        setStatus("invalid")
        return
      }
      const groupDoc = snapshot.docs[0]
      const groupData = groupDoc.data()
      setGroupName(groupData.name)
      if (!groupData.members.includes(u.uid)) {
        await updateDoc(doc(db, "groups", groupDoc.id), {
          members: arrayUnion(u.uid)
        })
      }
      setStatus("success")
      setTimeout(() => navigate("/"), 2000)
    } catch (e) {
      setStatus("error")
    }
  }

  async function handleLogin() {
    try {
      await signInWithPopup(auth, provider)
    } catch (e) {
      setStatus("error")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 to-green-50 dark:from-gray-900 dark:to-gray-950 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-8 w-full max-w-sm text-center">

        <div className="w-11 h-11 bg-orange-500 rounded-xl flex items-center justify-center mx-auto mb-5">
          <Leaf size={20} className="text-white" />
        </div>

        <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-1">UniHub</h1>

        {status === "loading" && (
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-3">Verificando invitación...</p>
        )}

        {status === "joining" && (
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-3">Uniéndote al grupo...</p>
        )}

        {status === "success" && (
          <>
            <p className="text-sm text-green-600 font-medium mt-3">¡Te uniste a {groupName}!</p>
            <p className="text-xs text-gray-400 mt-1">Redirigiendo a la app...</p>
          </>
        )}

        {status === "invalid" && (
          <>
            <p className="text-sm text-red-500 font-medium mt-3">Código inválido</p>
            <p className="text-xs text-gray-400 mt-1">Este link de invitación no existe o expiró.</p>
            <button
              onClick={() => navigate("/")}
              className="mt-4 w-full py-2 bg-orange-500 text-white text-sm rounded-xl hover:bg-orange-600 transition"
            >
              Ir a UniHub
            </button>
          </>
        )}

        {status === "error" && (
          <p className="text-sm text-red-500 mt-3">Algo salió mal. Intenta de nuevo.</p>
        )}

        {!user && status !== "invalid" && (
          <>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-3 mb-4">
              Inicia sesión para unirte al grupo
            </p>
            <button
              onClick={handleLogin}
              className="w-full flex items-center justify-center gap-3 px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
            >
              <svg width="16" height="16" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continuar con Google
            </button>
          </>
        )}

      </div>
    </div>
  )
}