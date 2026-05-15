import { useNavigate } from "react-router-dom";
import useWellStore from "../store/useWellStore";
import WellCard from "../components/WellCard";
import SummaryPill from "../components/SummaryPill";

export default function WellsOverview() {
  const wells = useWellStore((s) => s.wells);
  const navigate = useNavigate();

  const sorted = [...wells].sort((a, b) => {
    const order = { critical: 0, normal: 1, offline: 2 };
    return (order[a.status] ?? 2) - (order[b.status] ?? 2);
  });

  const criticalCount = wells.filter((w) => w.status === "critical").length;
  const normalCount = wells.filter((w) => w.status === "normal").length;
  const offlineCount = wells.filter((w) => w.status === "offline").length;

  return (
    <div className="min-h-screen bg-[#0a0f1e] p-6">
      <div className="mb-6">
        <h1 className="text-white text-2xl font-bold">
          GREENPEG IIoT Monitoring Dashboard
        </h1>
        <p className="text-gray-400 text-sm">
          Oil and Gas Industry — Wells Overview
        </p>
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
