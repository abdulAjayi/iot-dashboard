import { useEffect, useRef } from "react";
import useSensorStore from "../store/useSensorStore";
const ws_url = "ws://localhost:3000?type=dashboard"
export function useSocket() {
  const ws = useRef(null)
  const sensorData = useSensorStore((s) => s.setSensorData)
  const connected = useSensorStore((s) => s.setConnected)
  useEffect(() => {
     function connect() {
      ws.current = new WebSocket(ws_url)
      ws.current.onopen = () => {
        console.log("dashboard connected");
        connected(true)
      }
      ws.current.onmessage = async(e) => {
        console.log(JSON.parse(e.data));
        sensorData(JSON.parse(e.data))
      }
      ws.current.onclose = () => {
        console.log("dashboard reconnecting in 3s...");
        setTimeout(connect, 3000)
      }
    }
    connect()
    return () => {ws.current?.close()}
  }, [])
  const sendCommand = (field, value) => {
    if (ws.current.readyState === 1) {
      ws.current.send(JSON.stringify({type:"command", field, value}))
    }
  }
  return {sendCommand}
}