import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../store/useAuthStore";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export default function SetupPin() {
  const token = useAuthStore((s) => s.token);
  const navigate = useNavigate();
  const [pin, setPin] = useState("");
  const [showPin, setShowPin] = useState(false);
  const [confirm, setConfirm] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    if (pin.length !== 6) {
      setError("PIN must be 6 digits");
      return;
    }
    if (pin !== confirm) {
      setError("PINs do not match");
      return;
    }
    if (!email && !phone) {
      setError("Enter at least an email or phone number");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_URL}/auth/setup-pin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          pin,
          email: email || undefined,
          phoneNumber: phone || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const pinFilled = pin.length === 6;
  const confirmFilled = confirm.length === 6;
  const confirmMatches = confirmFilled && confirm === pin;
  const confirmMismatch = confirmFilled && confirm !== pin;

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ background: "#0a0f1e" }}
    >
      <div
        className="w-full rounded-xl p-5"
        style={{
          background: "#0f172a",
          border: "1px solid #1e293b",
          maxWidth: "340px",
        }}
      >
        {/* Icon */}
        <div
          className="w-9 h-9 rounded-lg flex items-center justify-center mb-3"
          style={{
            background: "rgba(34,197,94,0.1)",
            border: "1px solid rgba(34,197,94,0.25)",
          }}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#22c55e"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
        </div>

        <h1
          className="text-white font-semibold text-base mb-1"
          style={{ letterSpacing: "-0.01em" }}
        >
          Set up your PIN
        </h1>
        <p
          className="text-xs mb-4"
          style={{ color: "#64748b", lineHeight: "1.45" }}
        >
          Required for critical well operations and PIN recovery.
        </p>

        {/* PIN row */}
        <div className="flex gap-2 mb-3">
          <div className="flex-1">
            <label
              className="block text-[10px] font-semibold mb-1.5 tracking-wider uppercase"
              style={{ color: "#475569" }}
            >
              PIN
            </label>
            <div className="relative">
              <input
                type={showPin ? "text" : "password"}
                inputMode="numeric"
                maxLength={6}
                value={pin}
                onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
                placeholder="••••••"
                autoFocus
                className="w-full rounded-lg text-center text-white outline-none transition-all"
                style={{
                  background: "#0a0f1e",
                  border: `1px solid ${pinFilled ? "#22c55e" : "#1e293b"}`,
                  padding: "9px 30px 9px 10px",
                  fontFamily: "monospace",
                  fontSize: "15px",
                  letterSpacing: "4px",
                }}
                onFocus={(e) => (e.target.style.borderColor = "#22c55e")}
                onBlur={(e) =>
                  (e.target.style.borderColor = pinFilled
                    ? "#22c55e"
                    : "#1e293b")
                }
              />
              <button
                onClick={() => setShowPin(!showPin)}
                className="absolute right-2 top-1/2 -translate-y-1/2"
                style={{
                  color: "#475569",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: "2px",
                }}
              >
                {showPin ? (
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                ) : (
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <div className="flex-1">
            <label
              className="block text-[10px] font-semibold mb-1.5 tracking-wider uppercase"
              style={{ color: "#475569" }}
            >
              Confirm
            </label>
            <div className="relative">
              <input
                type={showConfirm ? "text" : "password"}
                inputMode="numeric"
                maxLength={6}
                value={confirm}
                onChange={(e) => setConfirm(e.target.value.replace(/\D/g, ""))}
                placeholder="••••••"
                className="w-full rounded-lg text-center text-white outline-none transition-all"
                style={{
                  background: "#0a0f1e",
                  border: `1px solid ${confirmMismatch ? "#ef4444" : confirmMatches ? "#22c55e" : "#1e293b"}`,
                  padding: "9px 30px 9px 10px",
                  fontFamily: "monospace",
                  fontSize: "15px",
                  letterSpacing: "4px",
                }}
                onFocus={(e) =>
                  (e.target.style.borderColor = confirmMismatch
                    ? "#ef4444"
                    : "#22c55e")
                }
                onBlur={(e) =>
                  (e.target.style.borderColor = confirmMismatch
                    ? "#ef4444"
                    : confirmMatches
                      ? "#22c55e"
                      : "#1e293b")
                }
              />
              <button
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-2 top-1/2 -translate-y-1/2"
                style={{
                  color: "#475569",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: "2px",
                }}
              >
                {showConfirm ? (
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                ) : (
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>

        <div
          style={{ height: "1px", background: "#1e293b", margin: "0.875rem 0" }}
        />

        {/* Email */}
        <label
          className="block text-[10px] font-semibold mb-1.5 tracking-wider uppercase"
          style={{ color: "#475569" }}
        >
          Email
        </label>
        <div className="relative mb-3">
          <svg
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#475569"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{
              position: "absolute",
              left: "10px",
              top: "50%",
              transform: "translateY(-50%)",
            }}
          >
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
            <polyline points="22,6 12,13 2,6" />
          </svg>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@greenpeg.com"
            className="w-full rounded-lg text-white text-xs outline-none transition-all"
            style={{
              background: "#0a0f1e",
              border: "1px solid #1e293b",
              padding: "9px 12px 9px 30px",
            }}
            onFocus={(e) => (e.target.style.borderColor = "#22c55e")}
            onBlur={(e) => (e.target.style.borderColor = "#1e293b")}
          />
        </div>

        {/* Phone */}
        {/* <label
          className="block text-[10px] font-semibold mb-1.5 tracking-wider uppercase"
          style={{ color: "#475569" }}
        >
          Phone
        </label> */}
        {/* <div className="relative mb-1.5">
          <svg
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#475569"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{
              position: "absolute",
              left: "10px",
              top: "50%",
              transform: "translateY(-50%)",
            }}
          >
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.36 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.34 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
          </svg>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+2348012345678"
            className="w-full rounded-lg text-white text-xs outline-none transition-all"
            style={{
              background: "#0a0f1e",
              border: "1px solid #1e293b",
              padding: "9px 12px 9px 30px",
            }}
            onFocus={(e) => (e.target.style.borderColor = "#22c55e")}
            onBlur={(e) => (e.target.style.borderColor = "#1e293b")}
          />
        </div> */}

        {/* <p className="text-[10px] mb-3" style={{ color: "#475569" }}>
          At least one is required for PIN recovery
        </p> */}

        {error && (
          <p
            className="text-[11px] mb-3 flex items-center gap-1"
            style={{ color: "#f87171" }}
          >
            <svg
              width="11"
              height="11"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ flexShrink: 0 }}
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            {error}
          </p>
        )}

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full py-2.5 rounded-lg text-xs font-semibold text-white flex items-center justify-center gap-1.5 transition-all disabled:opacity-40"
          style={{ background: "#16a34a", border: "none" }}
        >
          {loading ? (
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ animation: "spin 1s linear infinite" }}
            >
              <path d="M21 12a9 9 0 1 1-6.219-8.56" />
            </svg>
          ) : (
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          )}
          {loading ? "Saving..." : "Save PIN & continue"}
        </button>

        <style>{`
          @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        `}</style>
      </div>
    </div>
  );
}
