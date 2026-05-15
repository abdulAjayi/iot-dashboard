import { baselines } from "./wellConfig";
export function fluctuate(base, range) {
  return parseFloat((base + (Math.random() * range * 2 - range)).toFixed(2));
}

export function generateSensorData(wellId) {
  const b = baselines[wellId];
  return {
    downhole_pressure: fluctuate(b.downhole_pressure, 50),
    downhole_temp: fluctuate(b.downhole_temp, 2),
    tubing_head_pressure: fluctuate(b.tubing_head_pressure, 30),
    casing_pressure: fluctuate(b.casing_pressure, 20),
    flow_line_pressure: fluctuate(b.flow_line_pressure, 15),
    flow_line_temp: fluctuate(b.flow_line_temp, 1),
    battery_voltage: fluctuate(b.battery_voltage, 0.1),
    battery_level: fluctuate(b.battery_level, 1),
    timestamp: new Date().toISOString(),
  };
}
