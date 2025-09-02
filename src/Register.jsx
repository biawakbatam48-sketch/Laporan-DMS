import { useState } from "react"
import { supabase } from "./supabaseClient"

export default function Register() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [message, setMessage] = useState("")

  const handleRegister = async (e) => {
    e.preventDefault()

    // simpan user baru ke tabel users
    const { data, error } = await supabase
      .from("users")
      .insert([{ username, password }])

    if (error) {
      setMessage("❌ " + error.message)
    } else {
      setMessage("✅ User berhasil dibuat!")
      setUsername("")
      setPassword("")
    }
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold">Register</h2>
      <form onSubmit={handleRegister} className="space-y-2">
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="border p-2 w-full"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-2 w-full"
          required
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2">
          Register
        </button>
      </form>
      {message && <p className="mt-2">{message}</p>}
    </div>
  )
}
