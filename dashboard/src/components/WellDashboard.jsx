import { useParams, useNavigate } from "react-router-dom";
import useWellStore from "../store/useWellStore";
import MetricCard from "./MetricCard";
import PressureChart from "./PressureChart";
import TempChart from "./TempChart";
import BatteryChart from "./BatteryChart";
import DataLog from "./DataLog";
import CommandPanel from "./CommandPanel";
import ThresholdSettings from "../pages/ThresholdSettings";
import Header from "./Header";

function WellDashboard() {
  const { wellId } = useParams();
  const navigate = useNavigate();

  const well = useWellStore((state) =>
    state.wells.find((w) => w.id === wellId),
  );

  // If bad URL or well not found
  if (!well) {
    return (
      <div className="min-h-screen bg-[#0a0f1e] flex flex-col items-center justify-center gap-4">
        <p className="text-white text-xl">Well not found: {wellId}</p>
        <button
          onClick={() => navigate("/")}
          className="text-green-400 underline text-sm"
        >
          ← Back to Overview
        </button>
      </div>
    );
  }

  const {
    sensorData,
    history,
    status,
    thresholds,
    name,
    macAddress,
    wellId: wId,
  } = well;
  const isCritical = status === "critical";

  return (
    <div className="min-h-screen bg-[#0a0f1e] p-4">
      <Header
        wellName={name}
        wellId={wId}
        macAddress={macAddress}
        status={status}
        sensorData={sensorData}
        onBack={() => navigate("/")}
      />

      {/* Critical banner */}
      {isCritical && (
        <div className="bg-red-600 text-white text-center py-2 rounded-lg mb-4 font-bold tracking-wide animate-pulse">
          ⚠ CRITICAL THRESHOLD EXCEEDED — IMMEDIATE ATTENTION REQUIRED
        </div>
      )}

      {/* Wellhead details */}
      <div className="bg-[#0f172a] border border-[#1e293b] rounded-xl p-4 mb-4">
        <p className="text-green-400 text-xs font-bold mb-3 tracking-widest">
          WELLHEAD DETAILS
        </p>
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div>
            <p className="text-gray-400">Well ID</p>
            <p className="text-white font-semibold">{wId}</p>
          </div>
          <div>
            <p className="text-gray-400">Wellhead Name</p>
            <p className="text-white font-semibold">{name}</p>
          </div>
          <div>
            <p className="text-gray-400">MAC Address</p>
            <p className="text-white font-semibold">{macAddress}</p>
          </div>
        </div>
      </div>

      {/* Metric cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <MetricCard
          label="Downhole Pressure"
          value={sensorData?.downhole_pressure}
          unit="psi"
        />
        <MetricCard
          label="Downhole Temp"
          value={sensorData?.downhole_temp}
          unit="°C"
        />
        <MetricCard
          label="Tubing Head Pressure"
          value={sensorData?.tubing_head_pressure}
          unit="psi"
        />
        <MetricCard
          label="Casing Pressure"
          value={sensorData?.casing_pressure}
          unit="psi"
        />
        <MetricCard
          label="Flow Line Pressure"
          value={sensorData?.flow_line_pressure}
          unit="psi"
        />
        <MetricCard
          label="Flow Line Temp"
          value={sensorData?.flow_line_temp}
          unit="°C"
        />
        <MetricCard
          label="Battery Level"
          value={sensorData?.battery_level}
          unit="%"
        />
        <MetricCard
          label="Battery Voltage"
          value={sensorData?.battery_voltage}
          unit="V"
        />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        <PressureChart history={history} />
        <TempChart history={history} />
      </div>

      {/* Battery + Control panel row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        <BatteryChart history={history} />
        <CommandPanel wellId={wellId} />
      </div>

      {/* Threshold settings + Data log */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        <ThresholdSettings wellId={wellId} thresholds={thresholds} />
        <DataLog history={history} thresholds={thresholds} />
      </div>
    </div>
  );
}

export default WellDashboard;
