import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import useWellStore from "../store/useWellStore";

export default function BatteryChart({ history }) {
  const gatewayConnection = useWellStore((s) => s.gatewayConnection);
  const serverConnection = useWellStore((s) => s.serverConnection);
  const data = history.map((d) => ({
    time:
      serverConnection && gatewayConnection
        ? new Date(d.timestamp).toLocaleTimeString()
        : null,
    Voltage: serverConnection && gatewayConnection ? d.battery_voltage : null,
  }));
  return (
    <div className="bg-gray-900 border border-green-800 rounded-xl p-4">
      <h2 className="text-green-400 font-bold text-sm mb-3 uppercase tracking-wider">
        Battery Voltage (V) — Last 60s
      </h2>
      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="battGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#22c55e" stopOpacity={0.35} />
              <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#1f2d1f" />
          <XAxis
            dataKey="time"
            tick={{ fill: "#6b7280", fontSize: 10 }}
            interval="preserveStartEnd"
          />
          <YAxis domain={[0, 30]} tick={{ fill: "#6b7280", fontSize: 10 }} />
          <Tooltip
            contentStyle={{ background: "#111", border: "1px solid #166534" }}
          />
          <Area
            type="monotone"
            dataKey="Voltage"
            stroke="#22c55e"
            fill="url(#battGrad)"
            dot={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
