import { useEffect, useRef, useState } from "react";

export default function Toast({ connected }) {
  const [visible, setVisible] = useState(false);
  const [hide, setHide] = useState(false);
  const prevConnected = useRef(null);
  useEffect(() => {
    if (prevConnected.current === null) {
      prevConnected.current = connected;
      return;
    }
    if (connected === prevConnected.current) return;
    prevConnected.current = connected;
    setHide(false);
    setVisible(true);
    const hideTimer = setTimeout(() => setHide(true), 2000);
    const removeTimer = setTimeout(() => setVisible(false), 2000);
    return () => {
      clearTimeout(hideTimer);
      clearTimeout(removeTimer);
    };
  }, [connected]);
  if (!visible) return null;
  return (
    <div
      className={`fixed top-0 left-1/2 -translate-x-1/2 z-50
      flex items-center gap-3 px-6 py-3 min-w-72
      bg-gray-950 border-x border-b rounded-b-xl
      transition-all duration-400
      ${hide ? "-translate-y-full opacity-0" : "translate-y-0 opacity-100"}
      ${
        connected
          ? "border-green-700 border-t-2 border-t-green-400"
          : "border-red-700 border-t-2 border-t-red-400"
      }`}
    >
      <span
        className={`w-2.5 h-2.5 rounded-full ${connected ? "bg-green-400" : "bg-red-400"}`}
      />
      <div>
        <p
          className={`text-sm font-semibold ${connected ? "text-green-400" : "text-red-400"}`}
        >
          {connected ? "Gateway connected" : "Gateway disconnected"}
        </p>
        <p className="text-xs text-gray-500">
          {connected ? "Live data stream active" : "Attempting to reconnect..."}
        </p>
      </div>
    </div>
  );
}
