import { useEffect, useRef } from "react";
// import useSensorStore from "../store/useSensorStore";
import useWellStore from "../store/useWellStore";
import useAuthStore from "../store/useAuthStore";
const ws_url = "wss://backslid-deflate-hangnail.ngrok-free.dev?type=dashboard";
export function useSocket() {
  const ws = useRef(null);
  const updateWellData = useWellStore((s) => s.updateWellData);
  const token = useAuthStore((s) => s.token);
  const setConnected = useWellStore((s) => s.setConnected);
  const setgatewayConnection = useWellStore((s) => s.setGatewayConnection);
  const setServerConnection = useWellStore((s) => s.setServerConnection);
  useEffect(() => {
    if (!token) return;
    function connect() {
      ws.current = new WebSocket(ws_url);
      ws.current.onopen = () => {
        setConnected(true);
      };
      ws.current.onmessage = async (e) => {
        const Data = JSON.parse(e.data);
        const { type, ...rest } = Data;
        const { wellId, ...sensorFields } = rest;

        if (type === "gateway_status") {
          setgatewayConnection(rest.gatewayConnection);
        }
        if (type === "server_status") {
          setServerConnection(rest.serverConnection);
          console.log(rest.serverConnection);
        }
        if (type === "sensor_data") {
          updateWellData(wellId, sensorFields);
          console.log(sensorFields);
        }
      };
      ws.current.onclose = () => {
        setConnected(false);
        if (token) setTimeout(connect, 3000);
      };
    }
    connect();
    return () => {
      ws.current?.close();
    };
  }, [token]);
  const sendCommand = (field, value, wellId = null) => {
    if (ws.current.readyState === 1) {
      ws.current.send(
        JSON.stringify({ type: "command", field, value, wellId }),
      );
    }
  };
  return { sendCommand };
}
