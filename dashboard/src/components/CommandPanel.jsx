import { useState } from "react";
import { useSocket } from "../hooks/useSocket";

function CommandPanel({ wellId }) {
  const { sendCommand } = useSocket();

  const [pump, setPump] = useState(false);
  const [valve, setValve] = useState(false);
  const [flowRate, setFlowRate] = useState(50);
  const [pressure, setPressure] = useState(50);
  const [wellOpen, setWellOpen] = useState(true);
  const [showModal, setShowModal] = useState(false);

  function handleToggle(field, currentVal, setter) {
    const next = !currentVal;
    setter(next);
    sendCommand(field, next, wellId);
  }

  function handleSlider(field, value, setter) {
    setter(value);
    sendCommand(field, value, wellId);
  }

  function handleShutReinstate() {
    if (wellOpen) {
      setShowModal(true);
    } else {
      setWellOpen(true);
      sendCommand("well_state", "open", wellId);
    }
  }

  function confirmShut() {
    setWellOpen(false);
    sendCommand("well_state", "shut", wellId);
    setShowModal(false);
  }

  return (
    <>
      <div className="bg-[#0f172a] border border-[#1e293b] rounded-xl p-5">
        <p className="text-green-400 text-xs font-bold mb-4 tracking-widest">
          CONTROL PANEL
        </p>

        {/* Top row */}
        <div className="flex flex-wrap items-center gap-4 mb-5">
          <button
            onClick={handleShutReinstate}
            className={`px-4 py-2 rounded-lg text-white font-bold text-sm transition-colors ${
              wellOpen
                ? "bg-red-600 hover:bg-red-500"
                : "bg-green-600 hover:bg-green-500"
            }`}
          >
            {wellOpen ? "SHUT WELL" : "REINSTATE WELL"}
          </button>

          <span className="flex items-center gap-2 text-sm text-gray-300">
            <span
              className="w-2 h-2 rounded-full inline-block"
              style={{ backgroundColor: wellOpen ? "#22c55e" : "#ef4444" }}
            />
            {wellOpen ? "WELL FLOWING" : "WELL SHUT"}
          </span>

          <Toggle
            label="pump"
            value={pump}
            onToggle={() => handleToggle("pump", pump, setPump)}
          />
          <Toggle
            label="valve"
            value={valve}
            onToggle={() => handleToggle("valve", valve, setValve)}
          />
        </div>

        {/* Sliders */}
        <Slider
          label="Flow Rate"
          value={flowRate}
          onChange={(v) => handleSlider("flow_rate", v, setFlowRate)}
        />
        <Slider
          label="Pressure Setpoint"
          value={pressure}
          onChange={(v) => handleSlider("pressure_setpoint", v, setPressure)}
        />
      </div>

      {/* Confirm shut modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-[#0f172a] border border-red-600 rounded-xl p-6 max-w-sm w-full mx-4">
            <p className="text-white font-bold text-lg mb-2">Shut Well?</p>
            <p className="text-gray-400 text-sm mb-5">
              This will halt production on {wellId}. Are you sure?
            </p>
            <div className="flex gap-3">
              <button
                onClick={confirmShut}
                className="flex-1 bg-red-600 hover:bg-red-500 text-white font-bold py-2 rounded-lg"
              >
                Confirm Shut
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 bg-[#1e293b] hover:bg-[#334155] text-gray-300 font-bold py-2 rounded-lg"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function Toggle({ label, value, onToggle }) {
  return (
    <div className="flex items-center gap-2 text-sm text-gray-300">
      <span>{label}</span>
      <div
        onClick={onToggle}
        className={`w-10 h-5 rounded-full relative cursor-pointer transition-colors ${
          value ? "bg-green-500" : "bg-gray-600"
        }`}
      >
        <div
          className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${
            value ? "translate-x-5" : "translate-x-0.5"
          }`}
        />
      </div>
      <span className="text-xs text-gray-500">{value ? "ON" : "OFF"}</span>
    </div>
  );
}

function Slider({ label, value, onChange }) {
  return (
    <div className="mb-4">
      <div className="flex justify-between text-sm text-gray-300 mb-1">
        <span>{label}</span>
        <span className="text-green-400 font-bold">{value}</span>
      </div>
      <input
        type="range"
        min={0}
        max={100}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-green-500"
      />
    </div>
  );
}

export default CommandPanel;
