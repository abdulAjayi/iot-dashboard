import useSensorStore from "../store/useSensorStore";

export default function DataLog() {
  const history = useSensorStore((s) => s.history);
  const serverConnection = useSensorStore((s) => s.serverConnection);
  const gatewayConnection = useSensorStore((s) => s.gatewayConnection);
  const rows = [...history].reverse().slice(0, 10);
  const Connection = serverConnection && gatewayConnection;
  return (
    <div>
      {Connection && (
        <div className="bg-gray-900 border border-green-800 rounded-xl p-4">
          <h2 className="text-green-400 font-bold text-sm mb-3 uppercase tracking-wider">
            Data Log
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="text-gray-400 border-b border-gray-700">
                  {["Time", "DH Pressure", "DH Temp", "Battery", "Status"].map(
                    (h) => (
                      <th key={h} className="pb-2 pr-4">
                        {h}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody>
                {rows.map((d, i) => (
                  <tr
                    key={i}
                    className="border-b border-gray-800 text-gray-300"
                  >
                    <td className="py-1 pr-4">
                      {new Date(d.timestamp).toLocaleTimeString()}
                    </td>
                    <td className="py-1 pr-4">{d.downhole_pressure} psi</td>
                    <td className="py-1 pr-4">{d.downhole_temp} C</td>
                    <td className="py-1 pr-4">{d.battery_level}%</td>
                    <td className="py-1 text-green-400">SUCCESS</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
