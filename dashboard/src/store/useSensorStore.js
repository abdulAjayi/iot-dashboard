import { create } from "zustand";
const useSensorStore = create((set) => ({
  sensorData: null,
  history: [],
  connected: false,
  gatewayConnection: false,
  serverConnection: false,
  setSensorData: (data) =>
    set((state) => ({
      sensorData: data,
      history: [...state.history.slice(-59), data],
    })),
  setConnected: (val) => set({ connected: val }),
  setgatewayConnection: (val) => set({ gatewayConnection: val }),
  setServerConnection: (val) => set({ serverConnection: val }),
}));
export default useSensorStore;
