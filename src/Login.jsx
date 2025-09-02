import { useState } from "react"
import { supabase } from "./supabaseClient"

export default function Login({ onLogin }) {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [message, setMessage] = useState("")

  const handleLogin = async (e) => {
    e.preventDefault()

    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("username", username)
      .eq("password", password)
      .single()

    if (error || !data) {
      setMessage("❌ Username atau password salah")
    } else {
      setMessage("✅ Login berhasil")
      onLogin(data) // simpan data user di state parent
    }
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold">Login</h2>
      <form onSubmit={handleLogin} className="space-y-2">
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
        <button type="submit" className="bg-green-500 text-white px-4 py-2">
          Login
        </button>
      </form>
      {message && <p className="mt-2">{message}</p>}
    </div>
  )
}
