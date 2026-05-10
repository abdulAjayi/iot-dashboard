import { useSocket } from "./hooks/useSocket";
import useSensorStore from "./store/useSensorStore";
import Header from "./components/header";
import WellheadDetails from "./components/WellheadDetails";
import MetricCard from "./components/MetricCard";
import PressureChart from "./components/PressureChart";
import TempChart from "./components/TempChart";
import BatteryChart from "./components/BatteryChart";
import CommandPanel from "./components/CommandPanel";
import DataLog from "./components/DataLog";
 
export default function App() {
  const { sendCommand } = useSocket();
  const data = useSensorStore((s) => s.sensorData);
 
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Header />
      <main className="p-4 flex flex-col gap-4">
        {/* Wellhead info */}
        <WellheadDetails />
        {/* Metric cards row 1 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <MetricCard label="Downhole Pressure"    value={data?.downhole_pressure}    unit="psi" />
          <MetricCard label="Downhole Temp"        value={data?.downhole_temp}        unit="C"   />
          <MetricCard label="Tubing Head Pressure" value={data?.tubing_head_pressure} unit="psi" />
          <MetricCard label="Casing Pressure"      value={data?.casing_pressure}      unit="psi" />
        </div>
        {/* Metric cards row 2 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <MetricCard label="Flow Line Pressure" value={data?.flow_line_pressure} unit="psi" />
          <MetricCard label="Flow Line Temp"     value={data?.flow_line_temp}     unit="C"   />
          <MetricCard label="Battery Level"      value={data?.battery_level}      unit="%"   />
          <MetricCard label="Battery Voltage"    value={data?.battery_voltage}    unit="V"   />
        </div>
        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <PressureChart />
          <TempChart />
        </div>
        {/* Battery and Commands */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <BatteryChart />
          <CommandPanel sendCommand={sendCommand} />
        </div>
        {/* Data log */}
        <DataLog />
      </main>
    </div>
  );
}