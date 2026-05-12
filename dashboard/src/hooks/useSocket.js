import { useEffect, useRef } from "react";
import useSensorStore from "../store/useSensorStore";
const ws_url = "wss://iot-dashboard-ve7n.onrender.com?type=dashboard";
export function useSocket() {
  const ws = useRef(null);
  const sensorData = useSensorStore((s) => s.setSensorData);
  const connected = useSensorStore((s) => s.setConnected);
  const setgatewayConnection = useSensorStore((s) => s.setgatewayConnection);
  const setServerConnection = useSensorStore((s) => s.setServerConnection);
  useEffect(() => {
    function connect() {
      ws.current = new WebSocket(ws_url);
      ws.current.onopen = () => {
        console.log("dashboard connected");
        connected(true);
      };
      ws.current.onmessage = async (e) => {
        const Data = JSON.parse(e.data);
        if (Data.type === "gateway_status") {
          setgatewayConnection(Data.gatewayConnection);
        }
        if (Data.type === "server_status") {
          setServerConnection(Data.serverConnection);
          console.log(Data.serverConnection);
        }
        if (Data.type === "sensor_data") {
          sensorData(Data);
        }
      };
      ws.current.onclose = () => {
        connected(false);
        setTimeout(connect, 3000);
      };
    }
    connect();
    return () => {
      ws.current?.close();
    };
  }, []);
  const sendCommand = (field, value) => {
    if (ws.current.readyState === 1) {
      ws.current.send(JSON.stringify({ type: "command", field, value }));
    }
  };
  return { sendCommand };
}
