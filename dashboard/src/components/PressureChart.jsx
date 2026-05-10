import { LineChart, Line, XAxis, YAxis, CartesianGrid,
         Tooltip, Legend, ResponsiveContainer } from "recharts";
import useSensorStore from "../store/useSensorStore";
 
export default function PressureChart() {
  const history = useSensorStore((s) => s.history);
  const data = history.map((d) => ({
    time:          new Date(d.timestamp).toLocaleTimeString(),
    Downhole:      d.downhole_pressure,
    "Tubing Head": d.tubing_head_pressure,
    Casing:        d.casing_pressure,
    "Flow Line":   d.flow_line_pressure,
  }));
  return (
    <div className="bg-gray-900 border border-green-800 rounded-xl p-4">
      <h2 className="text-green-400 font-bold text-sm mb-3 uppercase tracking-wider">
        All Pressure Values (PSI) — Last 60s
      </h2>
      <ResponsiveContainer width="100%" height={260}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1f2d1f" />
          <XAxis dataKey="time" tick={{ fill:"#6b7280", fontSize:10 }}
                 interval="preserveStartEnd" />
          <YAxis domain={[0, 5000]} tick={{ fill:"#6b7280", fontSize:10 }} />
          <Tooltip contentStyle={{ background:"#111", border:"1px solid #166534" }} />
          <Legend />
          <Line type="monotone" dataKey="Downhole"    stroke="#22c55e" dot={false} />
          <Line type="monotone" dataKey="Tubing Head" stroke="#3b82f6" dot={false} />
          <Line type="monotone" dataKey="Casing"      stroke="#f59e0b" dot={false} />
          <Line type="monotone" dataKey="Flow Line"   stroke="#ef4444" dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
