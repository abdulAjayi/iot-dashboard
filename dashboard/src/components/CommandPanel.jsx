import { useState } from "react";
import { useSocket } from "../hooks/useSocket";
import ShowModal from "./ShowModal";
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

  function openModal() {
    setShowModal(true);
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
            onClick={openModal}
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
          onChange={(v) => handleSlider("flow_rate", flowRate, setFlowRate)}
        />
        <Slider
          label="Pressure Setpoint"
          value={pressure}
          onChange={(v) =>
            handleSlider("pressure_setpoint", pressure, setPressure)
          }
        />
      </div>
      {/* Confirm shut modal */}
      {showModal && (
        <ShowModal
          setShowModal={setShowModal}
          sendCommand={sendCommand}
          wellId={wellId}
          setShutWell={setWellOpen}
          shutWell={!wellOpen}
        />
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
