import { useNavigate } from "react-router-dom";
import useWellStore from "../store/useWellStore";
import useAuthStore from "../store/useAuthStore";
import WellCard from "../components/WellCard";
import SummaryPill from "../components/SummaryPill";
import { useSocket } from "../hooks/useSocket";

export default function WellsOverview() {
  const wells = useWellStore((s) => s.wells);
  const navigate = useNavigate();
  const logout = useAuthStore((s) => s.logout);
  const user = useAuthStore((s) => s.user);
  useSocket();

  const sorted = [...wells].sort((a, b) => {
    const order = { critical: 0, normal: 1, offline: 2 };
    return (order[a.status] ?? 2) - (order[b.status] ?? 2);
  });

  const criticalCount = wells.filter((w) => w.status === "critical").length;
  const normalCount = wells.filter((w) => w.status === "normal").length;
  const offlineCount = wells.filter((w) => w.status === "offline").length;

  const isAdmin = user?.role === "admin";

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <div className="min-h-screen bg-[#0a0f1e] p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-white text-2xl font-bold">
            GREENPEG IIoT Monitoring Dashboard
          </h1>
          <p className="text-gray-400 text-sm">
            Oil and Gas Industry — Wells Overview
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* User info + role */}
          <div className="flex items-center gap-2">
            <span className="text-gray-400 text-xs">
              👤 {user?.name || user?.email || "User"}
            </span>
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

      <div className="flex gap-4 mb-8">
        <SummaryPill count={criticalCount} label="Critical" color="#ef4444" />
        <SummaryPill count={normalCount} label="Live" color="#22c55e" />
        <SummaryPill count={offlineCount} label="Offline" color="#6b7280" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {sorted.map((well) => (
          <WellCard
            key={well.id}
            well={well}
            onClick={() => navigate(`/well/${well.id}`)}
          />
        ))}
      </div>
    </div>
  );
}
