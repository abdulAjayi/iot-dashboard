import useWellStore from "../store/useWellStore";
export default function MetricCard({ label, value, unit }) {
  const gatewayConnection = useWellStore((s) => s.gatewayConnection);

  const serverConnection = useWellStore((s) => s.serverConnection);

  return (
    <div className="bg-gray-900 border border-green-800 rounded-xl p-4">
      <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">
        {label}
      </p>
      <p className="text-3xl font-bold text-white">
        {value !== undefined &&
        value !== null &&
        gatewayConnection !== false &&
        serverConnection !== false
          ? value
          : "--"}
        <span className="text-sm text-gray-400 ml-1">{unit}</span>
      </p>
    </div>
  );
}
