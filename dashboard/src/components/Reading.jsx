export default function Reading({ label, value, unit }) {
  return (
    <div className="bg-[#1e293b] rounded-lg p-3">
      <div className="text-gray-400 text-xs mb-1">{label}</div>
      <div className="text-white font-semibold text-sm">
        {value !== undefined && value !== null ? `${value} ${unit}` : "--"}
      </div>
    </div>
  );
}
