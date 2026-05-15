import { create } from "zustand";
import { initialWells } from "./wellConstants";

function computeStatus(sensorData, thresholds) {
  if (!sensorData) return "offline";
  for (const [key, { min, max }] of Object.entries(thresholds)) {
    const value = sensorData[key];
    if (value === undefined) continue;
    if (value < min || value > max) return "critical";
  }
  return "normal";
}

const useWellStore = create((set) => ({
  wells: initialWells,
  connected: false,
  gatewayConnection: false,
  serverConnection: false,

  updateWellData: (wellId, data) =>
    set((state) => ({
      wells: state.wells.map((well) => {
        if (well.id !== wellId) return well;
        const newHistory = [...well.history.slice(-59), data];
        const newStatus = computeStatus(data, well.thresholds);
        return {
          ...well,
          sensorData: data,
          history: newHistory,
          status: newStatus,
        };
      }),
    })),

  updateThresholds: (wellId, newThresholds) =>
    set((state) => ({
      wells: state.wells.map((well) => {
        if (well.id !== wellId) return well;
        // Recompute status immediately with new thresholds
        const newStatus = computeStatus(well.sensorData, newThresholds);
        return { ...well, thresholds: newThresholds, status: newStatus };
      }),
    })),

  setConnected: (val) => set({ connected: val }),
  setGatewayConnection: (val) => set({ gatewayConnection: val }),
  setServerConnection: (val) => set({ serverConnection: val }),
}));

export default useWellStore;
