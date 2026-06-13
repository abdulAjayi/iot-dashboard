// import useAuthStore from "../store/useAuthStore";
// import { useNavigate } from "react-router-dom";

// function Header({ wellName, status, sensorData, onBack }) {
//   const isLive = status === "normal" || status === "critical";
//   const lastSync = sensorData?.timestamp
//     ? new Date(sensorData.timestamp).toLocaleTimeString()
//     : "--";
//   const logout = useAuthStore((s) => s.logout);
//   const user = useAuthStore((s) => s.user);
//   const navigate = useNavigate();

//   function handleLogout() {
//     logout();
//     navigate("/login");
//   }

//   const isAdmin = user?.role === "admin";

//   return (
//     <div className="flex items-center justify-between mb-4">
//       <div className="flex items-center gap-4">
//         {onBack && (
//           <button
//             onClick={onBack}
//             className="text-green-400 hover:text-green-300 text-sm transition-colors"
//           >
//             ← Overview
//           </button>
//         )}
//         <div>
//           <h1 className="text-white text-xl font-bold">
//             GREENPEG IIoT Monitoring Dashboard
//           </h1>
//           <p className="text-gray-400 text-xs">
//             Oil and Gas Industry
//             {wellName ? ` — ${wellName}` : ""}
//           </p>
//         </div>
//       </div>

//       <div className="flex items-center gap-3">
//         {/* Live status */}
//         <span
//           className="text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1"
//           style={{
//             backgroundColor: isLive ? "#22c55e22" : "#ef444422",
//             color: isLive ? "#22c55e" : "#ef4444",
//           }}
//         >
//           ● {isLive ? "LIVE" : "OFFLINE"}
//         </span>

//         <span className="text-gray-400 text-xs">Last sync: {lastSync}</span>

//         {/* Divider */}
//         <div className="w-px h-4 bg-gray-600" />

//         {/* User info + role */}
//         <div className="flex items-center gap-2">
//           <span className="text-gray-400 text-xs">
//             👤 {user?.name || user?.email || "User"}
//           </span>
//           <span
//             className="text-xs font-semibold px-2 py-0.5 rounded-full"
//             style={{
//               backgroundColor: isAdmin ? "#7c3aed22" : "#64748b22",
//               color: isAdmin ? "#a78bfa" : "#94a3b8",
//               border: `1px solid ${isAdmin ? "#7c3aed44" : "#64748b44"}`,
//             }}
//           >
//             {isAdmin ? "ADMIN" : "OPERATOR"}
//           </span>
//         </div>
//         <div className="w-px h-4 bg-gray-600" />

//         <button
//           onClick={handleLogout}
//           className="text-gray-400 hover:text-red-400 text-xs transition-colors px-2 py-1 rounded hover:bg-red-400/10"
//         >
//           Logout
//         </button>
//       </div>
//     </div>
//   );
// }
// export default Header;

import useAuthStore from "../store/useAuthStore";
import { useNavigate } from "react-router-dom";

function Header({ wellName, status, sensorData, onBack }) {
  const isLive = status === "normal" || status === "critical";
  const lastSync = sensorData?.timestamp
    ? new Date(sensorData.timestamp).toLocaleTimeString()
    : "--";
  const logout = useAuthStore((s) => s.logout);
  const user = useAuthStore((s) => s.user);
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  const isAdmin = user?.role === "admin";

  return (
    <div className="mb-4">
      {/* Row 1 — Back button + Logout */}
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              onClick={onBack}
              className="text-green-400 hover:text-green-300 text-sm transition-colors"
            >
              ← Overview
            </button>
          )}
        </div>

        {/* Logout always visible top right on mobile */}
        <button
          onClick={handleLogout}
          className="text-gray-400 hover:text-red-400 text-xs transition-colors px-2 py-1 rounded hover:bg-red-400/10 lg:hidden"
        >
          Logout
        </button>
      </div>

      {/* Row 2 — Title */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-white text-lg lg:text-xl font-bold">
            GREENPEG IIoT Monitoring Dashboard
          </h1>
          <p className="text-gray-400 text-xs">
            Oil and Gas Industry
            {wellName ? ` — ${wellName}` : ""}
          </p>
        </div>

        {/* Desktop only right side */}
        <div className="hidden lg:flex items-center gap-3">
          {/* Live status */}
          <span
            className="text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1"
            style={{
              backgroundColor: isLive ? "#22c55e22" : "#ef444422",
              color: isLive ? "#22c55e" : "#ef4444",
            }}
          >
            ● {isLive ? "LIVE" : "OFFLINE"}
          </span>

          <span className="text-gray-400 text-xs">Last sync: {lastSync}</span>

          <div className="w-px h-4 bg-gray-600" />

          <div className="flex items-center gap-2">
            <span className="text-gray-400 text-xs">👤 {user?.username}</span>
            <span
              className="text-xs font-semibold px-2 py-0.5 rounded-full"
              style={{
                backgroundColor: isAdmin ? "#7c3aed22" : "#64748b22",
                color: isAdmin ? "#a78bfa" : "#94a3b8",
                border: `1px solid ${isAdmin ? "#7c3aed44" : "#64748b44"}`,
              }}
            >
              {isAdmin ? "ADMIN" : "OPERATOR"}
            </span>
          </div>

          <div className="w-px h-4 bg-gray-600" />

          <button
            onClick={handleLogout}
            className="text-gray-400 hover:text-red-400 text-xs transition-colors px-2 py-1 rounded hover:bg-red-400/10"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Row 3 — Mobile only status bar */}
      <div className="flex items-center gap-3 mt-2 lg:hidden flex-wrap">
        <span
          className="text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1"
          style={{
            backgroundColor: isLive ? "#22c55e22" : "#ef444422",
            color: isLive ? "#22c55e" : "#ef4444",
          }}
        >
          ● {isLive ? "LIVE" : "OFFLINE"}
        </span>

        <span className="text-gray-400 text-xs">Last sync: {lastSync}</span>

        <div className="flex items-center gap-2">
          <span className="text-gray-400 text-xs">👤 {user?.username}</span>
          <span
            className="text-xs font-semibold px-2 py-0.5 rounded-full"
            style={{
              backgroundColor: isAdmin ? "#7c3aed22" : "#64748b22",
              color: isAdmin ? "#a78bfa" : "#94a3b8",
              border: `1px solid ${isAdmin ? "#7c3aed44" : "#64748b44"}`,
            }}
          >
            {isAdmin ? "ADMIN" : "OPERATOR"}
          </span>
        </div>
      </div>
    </div>
  );
}

export default Header;
