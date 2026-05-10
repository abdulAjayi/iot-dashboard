const wellInfo = [
  { label: "Well ID",        value: "UML-42-W07" },
  { label: "Wellhead Name",  value: "Block 7A — Field Exp." },
  { label: "MAC Address",    value: "00:1A:2B:3C:4D:5E" }
]

export default function WellheadDetails() {
  return (
    <div className="bg-gray-900 border border-green-800 rounded-xl p-4">
      <h2 className="text-green-400 font-bold text-sm mb-3 uppercase tracking-wider">
        Wellhead Details
      </h2>
      <div className="grid grid-cols-3 gap-4 text-sm">
        {wellInfo.map(({label, value}) => (
          <div key={label}>
            <p className="text-gray-400 text-xs">{label}</p>
            <p className="text-white font-semibold">{value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
