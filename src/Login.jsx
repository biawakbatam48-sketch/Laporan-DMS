import { useState } from "react";
import { supabase } from "./SupabaseClient";

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setMessage("❌ " + error.message);
    } else {
      setMessage("✅ Login berhasil");
      onLogin(data.user); // simpan user di state parent
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-2">Login</h2>
      <form onSubmit={handleLogin} className="space-y-2">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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
        <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">
          Login
        </button>
      </form>
      {message && <p className="mt-2">{message}</p>}
    </div>
  );
}
