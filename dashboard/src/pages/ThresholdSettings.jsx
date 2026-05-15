import { useState } from "react";
import useWellStore from "../store/useWellStore";
import { ThresholdField } from "../components/ThresholdField";
function ThresholdSettings({ wellId, thresholds }) {
  const updateThresholds = useWellStore((state) => state.updateThresholds);

  // Local copy so inputs feel instant before saving
  const [local, setLocal] = useState({ ...thresholds });
  const [saved, setSaved] = useState(false);

  function handleChange(field, value) {
    setLocal((prev) => {
      const [sensor, minmax] = field.split(".");
      return {
        ...prev,
        [sensor]: { ...prev[sensor], [minmax]: value },
      };
    });
    setSaved(false);
  }

  function handleSave() {
    updateThresholds(wellId, local);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function handleReset() {
    const defaults = {
      downhole_pressure: { min: 1000, max: 5000 },
      downhole_temp: { min: 20, max: 120 },
    };
    setLocal(defaults);
    updateThresholds(wellId, defaults);
    setSaved(false);
  }

  return (
    <div className="bg-[#0f172a] border border-[#1e293b] rounded-xl p-5">
      <p className="text-green-400 text-xs font-bold mb-4 tracking-widest">
        THRESHOLD SETTINGS
      </p>

      <ThresholdField
        label="Downhole Pressure (psi)"
        fieldMin="downhole_pressure.min"
        fieldMax="downhole_pressure.max"
        values={local.downhole_pressure}
        onChange={handleChange}
      />

      <ThresholdField
        label="Downhole Temp (°C)"
        fieldMin="downhole_temp.min"
        fieldMax="downhole_temp.max"
        values={local.downhole_temp}
        onChange={handleChange}
      />

      <div className="flex gap-3 mt-2">
        <button
          onClick={handleSave}
          className="flex-1 bg-green-600 hover:bg-green-500 text-white text-sm font-bold py-2 rounded-lg transition-colors"
        >
          {saved ? "✓ Saved" : "Save Thresholds"}
        </button>
        <button
          onClick={handleReset}
          className="px-4 bg-[#1e293b] hover:bg-[#334155] text-gray-300 text-sm font-bold py-2 rounded-lg transition-colors"
        >
          Reset
        </button>
      </div>
    </div>
  );
}

export default ThresholdSettings;
