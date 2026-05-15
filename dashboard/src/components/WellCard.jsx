import Reading from "./Reading";

function statusColor(status) {
  if (status === "critical") return "#ef4444";
  if (status === "normal") return "#22c55e";
  return "#6b7280";
}

function statusLabel(status) {
  if (status === "critical") return "CRITICAL";
  if (status === "normal") return "LIVE";
  return "OFFLINE";
}

export default function WellCard({ well, onClick }) {
  const { name, wellId, macAddress, sensorData, status } = well;
  const color = statusColor(status);

  return (
    <div
      onClick={onClick}
      style={{ borderColor: color }}
      className="bg-[#0f172a] border-2 rounded-xl p-5 cursor-pointer
        hover:brightness-110 transition-all duration-200"
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-white font-bold text-lg">{name}</span>
        <span
          className="text-xs font-bold px-2 py-1 rounded-full"
          style={{ backgroundColor: color + "22", color }}
        >
          ● {statusLabel(status)}
        </span>
      </div>

      <div className="text-gray-400 text-xs mb-4 space-y-1">
        <div>
          Well ID: <span className="text-gray-200">{wellId}</span>
        </div>
        <div>
          MAC: <span className="text-gray-200">{macAddress}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Reading
          label="DH Pressure"
          value={sensorData?.downhole_pressure}
          unit="psi"
        />
        <Reading label="DH Temp" value={sensorData?.downhole_temp} unit="°C" />
        <Reading
          label="Flow Pressure"
          value={sensorData?.flow_line_pressure}
          unit="psi"
        />
        <Reading label="Battery" value={sensorData?.battery_level} unit="%" />
      </div>
    </div>
  );
}
