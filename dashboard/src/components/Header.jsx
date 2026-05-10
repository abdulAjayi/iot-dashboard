import useSensorStore from "../store/useSensorStore";
 
export default function Header() {
  const connected = useSensorStore((s) => s.connected);
  const data      = useSensorStore((s) => s.sensorData);
  return (
    <div className="flex items-center justify-between
                    bg-gray-900 border-b border-green-800 px-6 py-4">
      <div>
        <h1 className="text-xl font-bold text-white">IoT Monitoring Dashboard</h1>
        <p className="text-xs text-gray-400">Oil and Gas — Downhole Operations</p>
      </div>
      <div className="flex items-center gap-3">
        <span className={`px-3 py-1 rounded-full text-xs font-bold
          ${connected ? "bg-green-600" : "bg-red-600"} text-white`}>
          {connected ? "● LIVE" : "● OFFLINE"}
        </span>
        {data && (
          <span className="text-xs text-gray-400">
            Last sync: {new Date(data.timestamp).toLocaleTimeString()}
          </span>
        )}
      </div>
    </div>
  );
}
