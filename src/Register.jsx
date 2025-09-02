import { useState } from "react";
import { supabase } from "./SupabaseClient";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setMessage("❌ " + error.message);
    } else {
      setMessage("✅ Registrasi berhasil! Silakan cek email untuk verifikasi.");
      setEmail("");
      setPassword("");
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-2">Register</h2>
      <form onSubmit={handleRegister} className="space-y-2">
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
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Register
        </button>
      </form>
      {message && <p className="mt-2">{message}</p>}
    </div>
  );
}
