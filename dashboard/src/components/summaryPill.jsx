export default function SummaryPill({ count, label, color }) {
  return (
    <div
      className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold"
      style={{ backgroundColor: color + "22", color }}
    >
      <span className="text-lg font-bold">{count}</span> {label}
    </div>
  );
}
