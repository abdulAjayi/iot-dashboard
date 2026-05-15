export function ThresholdField({ label, fieldMin, fieldMax, values, onChange }) {
  return (
    <div className="mb-4">
      <p className="text-gray-400 text-xs mb-2 tracking-widest uppercase">
        {label}
      </p>
      <div className="flex gap-3">
        <div className="flex-1">
          <label className="text-gray-500 text-xs">Min</label>
          <input
            type="number"
            value={values.min}
            onChange={(e) => onChange(fieldMin, Number(e.target.value))}
            className="
              w-full mt-1 bg-[#1e293b] text-white text-sm
              border border-[#334155] rounded-lg px-3 py-2
              focus:outline-none focus:border-green-500
            "
          />
        </div>
        <div className="flex-1">
          <label className="text-gray-500 text-xs">Max</label>
          <input
            type="number"
            value={values.max}
            onChange={(e) => onChange(fieldMax, Number(e.target.value))}
            className="
              w-full mt-1 bg-[#1e293b] text-white text-sm
              border border-[#334155] rounded-lg px-3 py-2
              focus:outline-none focus:border-green-500
            "
          />
        </div>
      </div>
    </div>
  );
}
