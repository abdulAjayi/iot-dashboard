function Header({ wellName, status, sensorData, onBack }) {
  const isLive = status === "normal" || status === "critical";
  const lastSync = sensorData?.timestamp
    ? new Date(sensorData.timestamp).toLocaleTimeString()
    : "--";

  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-4">
        {onBack && (
          <button
            onClick={onBack}
            className="text-green-400 hover:text-green-300 text-sm transition-colors"
          >
            ← Overview
          </button>
        )}
        <div>
          <h1 className="text-white text-xl font-bold">
            GREENPEG IIoT Monitoring Dashboard
          </h1>
          <p className="text-gray-400 text-xs">
            Oil and Gas Industry
            {wellName ? ` — ${wellName}` : ""}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
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
      </div>
    </div>
  );
}

export default Header;
