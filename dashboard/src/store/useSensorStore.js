import { create } from "zustand";
const useSensorStore = create((set) => ({
    sensorData: null,
    history: [],
    connected: false,
    setSensorData: (data) => set((state) => ({
        sensorData: data,
        history:[...state.history.slice(-59), data]
    })),
    setConnected: (val) => set({connected: val})
}))
export default useSensorStore