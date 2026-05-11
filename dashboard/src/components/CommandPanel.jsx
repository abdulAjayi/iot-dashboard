import { useState } from "react";
import ShowModal from "./ShowModal";

export default function CommandPanel({ sendCommand }) {
  const [pump, setPump] = useState(false);
  const [valve, setValve] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [flowRate, setFlowRate] = useState(50);
  const [pressure, setPressure] = useState(50);
  const [shutWell, setShutWell] = useState(false);

  const toggle = (field, current, setter) => {
    if (current === null) {
      console.log(current);

      setter(true);
    }
    console.log(current);

    const next = !current;
    setter(next);
    sendCommand(field, next);
  };

  const slide = (field, value, setter) => {
    setter(+value);
    sendCommand(field, +value);
  };

  const toggles = [
    // {label:"shut-well", state:shotWell, setter:setShotWell, field:"shut-well"},
    { label: "pump", state: pump, setter: setPump, field: "pump" },
    { label: "valve", state: valve, setter: setValve, field: "valve" },
  ];

  const sliders = [
    ["Flow Rate", flowRate, setFlowRate, "flow_rate"],
    ["Pressure Setpoint", pressure, setPressure, "pressure_setpoint"],
  ];

  return (
    <div>
      {showModal && (
        <ShowModal
          setShowModal={setShowModal}
          sendCommand={sendCommand}
          setShutWell={setShutWell}
        />
      )}
      <div className="bg-gray-900 border border-green-800 rounded-xl p-4">
        <h2 className="text-green-400 font-bold text-sm mb-4 uppercase tracking-wider">
          Control Panel
        </h2>
        <div className="flex gap-8 mb-5 items-center">
          <button
            disabled={shutWell}
            onClick={() => setShowModal(true)}
            className={`px-6 py-2 bg-red-700 hover:bg-red-600 border border-red-400
             text-white font-bold rounded-lg uppercase tracking-wider
             ${shutWell ? "bg-gray-700 border-gray-600 text-gray-500 cursor-not-allowed opacity-50" : "bg-red-700 hover:bg-red-600 border-red-400 text-white"}
             `}
          >
            {shutWell ? "Well Shut" : "Shut Well"}
          </button>
          <div className="flex items-center gap-3">
            <span
              className={`w-2.5 h-2.5 rounded-full ${shutWell ? "bg-red-500" : "bg-green-500"}`}
            />
            <span className="text-xs text-gray-400">
              {shutWell ? "WELL SHUT-IN" : "WELL FLOWING"}
            </span>
          </div>
          {toggles.map(({ label, state, setter, field }) => (
            <div key={field} className="flex items-center gap-2">
              <span className="text-sm text-gray-300">{label}</span>
              <button
                onClick={() => toggle(field, state, setter)}
                className={`w-12 h-6 rounded-full transition-colors
                ${state ? "bg-green-500" : "bg-gray-600"}`}
              >
                <span
                  className={`block w-5 h-5 bg-white rounded-full shadow
                transition-transform ml-0.5
                ${state ? "translate-x-6" : "translate-x-0"}`}
                />
              </button>
              <span
                className={`text-xs font-bold
              ${state ? "text-green-400" : "text-gray-500"}`}
              >
                {state ? "ON" : "OFF"}
              </span>
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-4">
          {sliders.map(([label, val, setter, field]) => (
            <div key={field}>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-300">{label}</span>
                <span className="text-green-400 font-bold">{val}</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={val}
                onChange={(e) => slide(field, e.target.value, setter)}
                className="w-full accent-green-500"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
