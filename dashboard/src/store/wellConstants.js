export const defaultThresholds = {
  downhole_pressure: { min: 2000, max: 4500 },
  downhole_temp: { min: 50, max: 90 },
  tubing_head_pressure: { min: 800, max: 1600 },
  casing_pressure: { min: 500, max: 1200 },
  flow_line_pressure: { min: 300, max: 600 },
  flow_line_temp: { min: 30, max: 60 },
  battery_voltage: { min: 10, max: 14 },
  battery_level: { min: 20, max: 100 },
};

export const initialWells = [
  {
    id: "well-1",
    name: "UBIT BRAVO",
    macAddress: "00:1A:2B:3C:4D:5E",
    wellId: "GB-05",
  },
  {
    id: "well-2",
    name: "UBIT ALPHA",
    macAddress: "00:1A:2B:3C:4D:6F",
    wellId: "GA-03",
  },
  {
    id: "well-3",
    name: "UBIT CHARLIE",
    macAddress: "00:1A:2B:3C:4D:7A",
    wellId: "GC-01",
  },
  {
    id: "well-4",
    name: "UBIT GOLF",
    macAddress: "00:1A:2B:3C:4D:8B",
    wellId: "GG-02",
  },
  {
    id: "well-5",
    name: "UBIT HOTEL",
    macAddress: "00:1A:2B:3C:4D:9C",
    wellId: "GB-08",
  },
].map((well) => ({
  ...well,
  sensorData: null,
  history: [],
  status: "offline",
  thresholds: { ...defaultThresholds },
}));
