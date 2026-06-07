import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import useAuthStore from "../store/useAuthStore";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const login = useAuthStore((s) => s.login);
  const navigate = useNavigate();

  async function handleLogin() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("http://3.237.36.16:3000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok) return setError(data.error);
      login({ username: data.username, role: data.role }, data.token);
      navigate("/");
    } catch {
      setError("Something went wrong. Try again.");
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0f1e] flex items-center justify-center">
      <div className="bg-[#0f172a] border border-[#1e293b] rounded-xl p-8 w-full max-w-md">
        <h1 className="text-white text-2xl font-bold mb-1">GREENPEG IIoT</h1>
        <p className="text-gray-400 text-sm mb-8">Sign in to your account</p>

        {error && (
          <p className="text-red-400 text-sm mb-4 bg-red-400/10 p-3 rounded-lg">
            {error}
          </p>
        )}

        <div className="flex flex-col gap-4">
          <div>
            <label className="text-gray-400 text-xs mb-1 block">USERNAME</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-[#1e293b] text-white rounded-lg px-4 py-3 text-sm outline-none border border-transparent focus:border-green-500"
              placeholder="Enter your username"
            />
          </div>

          <div>
            <label className="text-gray-400 text-xs mb-1 block">PASSWORD</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              className="w-full bg-[#1e293b] text-white rounded-lg px-4 py-3 text-sm outline-none border border-transparent focus:border-green-500"
              placeholder="Enter your password"
            />
          </div>

          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-500 disabled:opacity-50 text-white font-bold py-3 rounded-lg transition-colors mt-2"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>

          <p className="text-gray-400 text-sm text-center">
            Don't have an account?{" "}
            <Link to="/register" className="text-green-400 hover:underline">
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
