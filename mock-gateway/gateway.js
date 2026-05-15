import { WebSocket } from "ws";
import { baselines } from "./wellConfig";
import { wells } from "./wellConfig";
import { fluctuate } from "./sensorUtils";
import { generateSensorData } from "./sensorUtils";
// const WS_URL = "wss://iot-dashboard-ve7n.onrender.com?type=gateway";
const WS_URL = "ws://localhost:3000?type=gateway";

function connect() {
  const ws = new WebSocket(WS_URL);
  ws.on("open", () => {
    console.log("gateway connected successfully");
    setInterval(() => {
      wells.forEach((well) => {
        const sensorData = generateSensorData(well.id);
        const payload = { type: "sensor_data", wellId: well.id, ...sensorData };
        ws.send(JSON.stringify(payload));
        console.log(`[Gateway] Sent data for ${well.name} (${well.id})`);
      });
    }, 1000);
  });
  ws.on("message", (data) => {
    const cmd = JSON.parse(data);
    console.log("gateway command", cmd);
  });
  ws.on("close", () => {
    console.log("gateway reconnecting in 3s...");
    setTimeout(connect, 3000);
  });
  ws.on("error", (error) => {
    console.log(error.message);
    ws.terminate();
  });
}
connect();
