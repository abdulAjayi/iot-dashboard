import { useEffect, useRef } from "react";
// import useSensorStore from "../store/useSensorStore";
import useWellStore from "../store/useWellStore";
const ws_url = "ws://3.237.36.16:3000?type=dashboard";
export function useSocket() {
  const ws = useRef(null);
  const updateWellData = useWellStore((s) => s.updateWellData);
  const setConnected = useWellStore((s) => s.setConnected);
  const setgatewayConnection = useWellStore((s) => s.setGatewayConnection);
  const setServerConnection = useWellStore((s) => s.setServerConnection);
  useEffect(() => {
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
        setTimeout(connect, 3000);
      };
    }
    connect();
    return () => {
      // ws.current?.close();
    };
  }, []);
  const sendCommand = (field, value, wellId = null) => {
    if (ws.current.readyState === 1) {
      ws.current.send(
        JSON.stringify({ type: "command", field, value, wellId }),
      );
    }
  };
  return { sendCommand };
}
