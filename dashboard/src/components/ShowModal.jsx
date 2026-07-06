import { useState } from "react";
import {
  verifyPin,
  requestOTP,
  verifyOTP,
  setNewPin,
} from "../services/pinService";
import useAuthStore from "../store/useAuthStore";

const STEP = {
  PIN: "pin",
  OTP: "otp",
  NEW_PIN: "new_pin",
};

export default function ShowModal({
  setShowModal,
  sendCommand,
  setShutWell,
  shutWell,
  wellId,
}) {
  const token = useAuthStore((s) => s.token);

  const [step, setStep] = useState(STEP.PIN);
  const [pin, setPin] = useState("");
  const [showPin, setShowPin] = useState(false);
  const [otp, setOtp] = useState("");
  const [showOtp, setShowOtp] = useState(false);
  const [newPin, setNewPin_] = useState("");
  const [showNewPin, setShowNewPin] = useState(false);
  const [confirm, setConfirm] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [info, setInfo] = useState("");

  const reset = () => {
    setPin("");
    setOtp("");
    setNewPin_("");
    setConfirm("");
    setError("");
    setInfo("");
    setLoading(false);
  };

  async function handleVerifyPin() {
    if (pin.length !== 6) {
      setError("PIN must be 6 digits");
      return;
    }
    setLoading(true);
    setError("");
    try {
      // console.log(token);
      await verifyPin(pin, token);
      sendCommand("well_state", shutWell ? "open" : "shut", wellId);
      setShutWell(!!shutWell);
      setShowModal(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleRequestOTP() {
    setLoading(true);
    setError("");
    try {
      const data = await requestOTP(token);
      setInfo(`${data.sentTo.email ?? ""} ${data.sentTo.phone ?? ""}`.trim());
      setStep(STEP.OTP);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleVerifyOTP() {
    if (otp.length !== 6) {
      setError("OTP must be 6 digits");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await verifyOTP(otp, token);
      setStep(STEP.NEW_PIN);
      setInfo("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleSetNewPin() {
    if (newPin.length !== 6) {
      setError("PIN must be 6 digits");
      return;
    }
    if (newPin !== confirm) {
      setError("PINs do not match");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await setNewPin(newPin, token);
      setShowModal(false);
      reset();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  // Progress dots
  const dots = [STEP.PIN, STEP.OTP, STEP.NEW_PIN];
  const currentIndex = dots.indexOf(step);

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
      <div
        className="w-full max-w-sm rounded-2xl p-6"
        style={{ background: "#0f172a", border: "1px solid #1e293b" }}
      >
        {/* Progress dots */}
        <div className="flex gap-1.5 mb-6">
          {dots.map((s, i) => (
            <div
              key={s}
              className="h-1 flex-1 rounded-full transition-all duration-300"
              style={{
                background:
                  i < currentIndex
                    ? "#15803d"
                    : i === currentIndex
                      ? "#22c55e"
                      : "#1e293b",
              }}
            />
          ))}
        </div>

        {/* ── PIN SCREEN ── */}
        {step === STEP.PIN && (
          <>
            {/* Icon */}
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
              style={{
                background: shutWell
                  ? "rgba(34,197,94,0.1)"
                  : "rgba(239,68,68,0.1)",
                border: shutWell
                  ? "1px solid rgba(34,197,94,0.25)"
                  : "1px solid rgba(239,68,68,0.25)",
              }}
            >
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke={shutWell ? "#22c55e" : "#ef4444"}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </div>

            {/* Badge */}
            <div
              className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-md mb-3"
              style={{
                background: shutWell
                  ? "rgba(34,197,94,0.1)"
                  : "rgba(239,68,68,0.1)",
                color: shutWell ? "#4ade80" : "#f87171",
                border: shutWell
                  ? "1px solid rgba(34,197,94,0.2)"
                  : "1px solid rgba(239,68,68,0.2)",
              }}
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
              >
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                <line x1="12" y1="9" x2="12" y2="13" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
              {shutWell ? "Reinstate well" : "Critical action"}
            </div>

            <h3
              className="text-white font-semibold text-lg mb-1"
              style={{ letterSpacing: "-0.01em" }}
            >
              {shutWell ? "Reinstate well?" : "Shut well?"}
            </h3>
            <p
              className="text-sm mb-5"
              style={{ color: "#64748b", lineHeight: "1.5" }}
            >
              {shutWell
                ? "Enter your PIN to bring this well back online."
                : `Enter your PIN to confirm. This will halt production on ${wellId} immediately.`}
            </p>

            {/* PIN input */}
            <label
              className="block text-xs font-semibold mb-2 tracking-widest uppercase"
              style={{ color: "#475569" }}
            >
              Security PIN
            </label>
            <div className="relative mb-1.5">
              <input
                type={showPin ? "text" : "password"}
                inputMode="numeric"
                maxLength={6}
                value={pin}
                onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
                placeholder="......"
                autoFocus
                className="w-full rounded-xl text-center text-2xl tracking-widest text-white outline-none transition-all"
                style={{
                  background: "#0a0f1e",
                  border: `1.5px solid ${pin.length === 6 ? (shutWell ? "#22c55e" : "#ef4444") : "#1e293b"}`,
                  padding: "13px 44px 13px 16px",
                  fontFamily: "monospace",
                  letterSpacing: "12px",
                }}
                onFocus={(e) =>
                  (e.target.style.borderColor = shutWell
                    ? "#22c55e"
                    : "#ef4444")
                }
                onBlur={(e) =>
                  (e.target.style.borderColor =
                    pin.length === 6
                      ? shutWell
                        ? "#22c55e"
                        : "#ef4444"
                      : "#1e293b")
                }
              />
              <button
                onClick={() => setShowPin(!showPin)}
                className="absolute right-3 top-1/2 -translate-y-1/2"
                style={{
                  color: "#475569",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: "4px",
                }}
              >
                {showPin ? (
                  <svg
                    width="18"
                    height="18"
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
                    width="18"
                    height="18"
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

            {error && (
              <p
                className="text-xs mb-3 flex items-center gap-1.5"
                style={{ color: "#f87171" }}
              >
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
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                {error}
              </p>
            )}

            <button
              onClick={handleRequestOTP}
              disabled={loading}
              className="flex items-center gap-1.5 text-xs mb-5"
              style={{
                color: "#22c55e",
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: 0,
              }}
            >
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" />
              </svg>
              Forgot PIN? Reset via OTP
            </button>

            <div
              style={{
                height: "1px",
                background: "#1e293b",
                marginBottom: "1.25rem",
              }}
            />

            <div className="flex gap-2.5">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 py-3 rounded-xl text-sm font-medium transition-all"
                style={{
                  background: "#1e293b",
                  border: "1px solid #334155",
                  color: "#94a3b8",
                }}
                onMouseEnter={(e) => (e.target.style.background = "#263244")}
                onMouseLeave={(e) => (e.target.style.background = "#1e293b")}
              >
                Cancel
              </button>
              <button
                onClick={handleVerifyPin}
                disabled={loading || pin.length !== 6}
                className="flex-2 py-3 rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-2 transition-all disabled:opacity-40"
                style={{
                  background: shutWell ? "#16a34a" : "#dc2626",
                  border: "none",
                }}
              >
                {loading ? (
                  <svg
                    width="16"
                    height="16"
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
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    {shutWell ? (
                      <>
                        <polyline points="20 6 9 17 4 12" />
                      </>
                    ) : (
                      <>
                        <circle cx="12" cy="12" r="10" />
                        <line x1="8" y1="12" x2="16" y2="12" />
                      </>
                    )}
                  </svg>
                )}
                {loading
                  ? "Verifying..."
                  : shutWell
                    ? "Reinstate well"
                    : "Shut well"}
              </button>
            </div>
          </>
        )}

        {/* ── OTP SCREEN ── */}
        {step === STEP.OTP && (
          <>
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
              style={{
                background: "rgba(34,197,94,0.1)",
                border: "1px solid rgba(34,197,94,0.25)",
              }}
            >
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#22c55e"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
            </div>

            <div
              className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-md mb-3"
              style={{
                background: "rgba(34,197,94,0.1)",
                color: "#4ade80",
                border: "1px solid rgba(34,197,94,0.2)",
              }}
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
              >
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
              OTP sent
            </div>

            <h3
              className="text-white font-semibold text-lg mb-1"
              style={{ letterSpacing: "-0.01em" }}
            >
              Enter OTP
            </h3>
            <p
              className="text-sm mb-4"
              style={{ color: "#64748b", lineHeight: "1.5" }}
            >
              A 6-digit code was sent to your email and phone.
            </p>

            {info && (
              <div
                className="flex items-center gap-2 text-xs rounded-xl px-3 py-2.5 mb-4"
                style={{
                  background: "rgba(34,197,94,0.06)",
                  border: "1px solid rgba(34,197,94,0.15)",
                  color: "#4ade80",
                }}
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{ flexShrink: 0 }}
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                Sent to {info}
              </div>
            )}

            <label
              className="block text-xs font-semibold mb-2 tracking-widest uppercase"
              style={{ color: "#475569" }}
            >
              One-time code
            </label>
            <div className="relative mb-1.5">
              <input
                type={showOtp ? "text" : "password"}
                inputMode="numeric"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                placeholder="······"
                autoFocus
                className="w-full rounded-xl text-center text-2xl text-white outline-none transition-all"
                style={{
                  background: "#0a0f1e",
                  border: `1.5px solid ${otp.length === 6 ? "#22c55e" : "#1e3a2f"}`,
                  padding: "13px 44px 13px 16px",
                  fontFamily: "monospace",
                  letterSpacing: "12px",
                }}
                onFocus={(e) => (e.target.style.borderColor = "#22c55e")}
                onBlur={(e) =>
                  (e.target.style.borderColor =
                    otp.length === 6 ? "#22c55e" : "#1e3a2f")
                }
              />
              <button
                onClick={() => setShowOtp(!showOtp)}
                className="absolute right-3 top-1/2 -translate-y-1/2"
                style={{
                  color: "#475569",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: "4px",
                }}
              >
                {showOtp ? (
                  <svg
                    width="18"
                    height="18"
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
                    width="18"
                    height="18"
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

            {error && (
              <p
                className="text-xs mb-2 flex items-center gap-1.5"
                style={{ color: "#f87171" }}
              >
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
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                {error}
              </p>
            )}

            <p
              className="text-xs mb-5 flex items-center gap-1.5"
              style={{ color: "#475569" }}
            >
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              Expires in 10 minutes
            </p>

            <div
              style={{
                height: "1px",
                background: "#1e293b",
                marginBottom: "1.25rem",
              }}
            />

            <div className="flex gap-2.5">
              <button
                onClick={() => {
                  reset();
                  setStep(STEP.PIN);
                }}
                className="flex-1 py-3 rounded-xl text-sm font-medium transition-all"
                style={{
                  background: "#1e293b",
                  border: "1px solid #334155",
                  color: "#94a3b8",
                }}
                onMouseEnter={(e) => (e.target.style.background = "#263244")}
                onMouseLeave={(e) => (e.target.style.background = "#1e293b")}
              >
                Back
              </button>
              <button
                onClick={handleVerifyOTP}
                disabled={loading || otp.length !== 6}
                className="flex-2 py-3 rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-2 transition-all disabled:opacity-40"
                style={{ background: "#16a34a", border: "none" }}
              >
                {loading ? (
                  <svg
                    width="16"
                    height="16"
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
                    width="15"
                    height="15"
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
                {loading ? "Verifying..." : "Verify OTP"}
              </button>
            </div>
          </>
        )}

        {/* ── NEW PIN SCREEN ── */}
        {step === STEP.NEW_PIN && (
          <>
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
              style={{
                background: "rgba(34,197,94,0.1)",
                border: "1px solid rgba(34,197,94,0.25)",
              }}
            >
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#22c55e"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 9.9-1" />
              </svg>
            </div>

            <div
              className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-md mb-3"
              style={{
                background: "rgba(34,197,94,0.1)",
                color: "#4ade80",
                border: "1px solid rgba(34,197,94,0.2)",
              }}
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
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
              OTP verified
            </div>

            <h3
              className="text-white font-semibold text-lg mb-1"
              style={{ letterSpacing: "-0.01em" }}
            >
              Set new PIN
            </h3>
            <p
              className="text-sm mb-5"
              style={{ color: "#64748b", lineHeight: "1.5" }}
            >
              Choose a new 6-digit PIN for well operations.
            </p>

            <label
              className="block text-xs font-semibold mb-2 tracking-widest uppercase"
              style={{ color: "#475569" }}
            >
              New PIN
            </label>
            <div className="relative mb-3">
              <input
                type={showNewPin ? "text" : "password"}
                inputMode="numeric"
                maxLength={6}
                value={newPin}
                onChange={(e) => setNewPin_(e.target.value.replace(/\D/g, ""))}
                placeholder="••••••"
                autoFocus
                className="w-full rounded-xl text-center text-2xl text-white outline-none transition-all"
                style={{
                  background: "#0a0f1e",
                  border: `1.5px solid ${newPin.length === 6 ? "#22c55e" : "#1e3a2f"}`,
                  padding: "13px 44px 13px 16px",
                  fontFamily: "monospace",
                  letterSpacing: "12px",
                }}
                onFocus={(e) => (e.target.style.borderColor = "#22c55e")}
                onBlur={(e) =>
                  (e.target.style.borderColor =
                    newPin.length === 6 ? "#22c55e" : "#1e3a2f")
                }
              />
              <button
                onClick={() => setShowNewPin(!showNewPin)}
                className="absolute right-3 top-1/2 -translate-y-1/2"
                style={{
                  color: "#475569",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: "4px",
                }}
              >
                {showNewPin ? (
                  <svg
                    width="18"
                    height="18"
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
                    width="18"
                    height="18"
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

            <label
              className="block text-xs font-semibold mb-2 tracking-widest uppercase"
              style={{ color: "#475569" }}
            >
              Confirm PIN
            </label>
            <div className="relative mb-1.5">
              <input
                type={showConfirm ? "text" : "password"}
                inputMode="numeric"
                maxLength={6}
                value={confirm}
                onChange={(e) => setConfirm(e.target.value.replace(/\D/g, ""))}
                placeholder="••••••"
                className="w-full rounded-xl text-center text-2xl text-white outline-none transition-all"
                style={{
                  background: "#0a0f1e",
                  border: `1.5px solid ${confirm.length === 6 ? (confirm === newPin ? "#22c55e" : "#ef4444") : "#1e3a2f"}`,
                  padding: "13px 44px 13px 16px",
                  fontFamily: "monospace",
                  letterSpacing: "12px",
                }}
                onFocus={(e) => (e.target.style.borderColor = "#22c55e")}
                onBlur={(e) =>
                  (e.target.style.borderColor =
                    confirm.length === 6
                      ? confirm === newPin
                        ? "#22c55e"
                        : "#ef4444"
                      : "#1e3a2f")
                }
              />
              <button
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-1/2 -translate-y-1/2"
                style={{
                  color: "#475569",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: "4px",
                }}
              >
                {showConfirm ? (
                  <svg
                    width="18"
                    height="18"
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
                    width="18"
                    height="18"
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

            {error && (
              <p
                className="text-xs mb-2 flex items-center gap-1.5"
                style={{ color: "#f87171" }}
              >
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
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                {error}
              </p>
            )}

            <div
              style={{
                height: "1px",
                background: "#1e293b",
                margin: "1.25rem 0",
              }}
            />

            <div className="flex gap-2.5">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 py-3 rounded-xl text-sm font-medium"
                style={{
                  background: "#1e293b",
                  border: "1px solid #334155",
                  color: "#94a3b8",
                }}
                onMouseEnter={(e) => (e.target.style.background = "#263244")}
                onMouseLeave={(e) => (e.target.style.background = "#1e293b")}
              >
                Cancel
              </button>
              <button
                onClick={handleSetNewPin}
                disabled={
                  loading || newPin.length !== 6 || confirm.length !== 6
                }
                className="flex-2 py-3 rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-2 transition-all disabled:opacity-40"
                style={{ background: "#16a34a", border: "none" }}
              >
                {loading ? (
                  <svg
                    width="16"
                    height="16"
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
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                    <polyline points="17 21 17 13 7 13 7 21" />
                    <polyline points="7 3 7 8 15 8" />
                  </svg>
                )}
                {loading ? "Saving..." : "Save PIN"}
              </button>
            </div>
          </>
        )}

        <style>{`
          @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        `}</style>
      </div>
    </div>
  );
}
