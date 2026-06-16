import { WebSocket } from "ws";
import { baselines, wells } from "./wellConfig.js";
import { fluctuate } from "./sensorUtils.js";
import { generateSensorData } from "./sensorUtils.js";
// const WS_URL = "wss://iot-dashboard-ve7n.onrender.com?type=gateway";
const WS_URL = "wss://backslid-deflate-hangnail.ngrok-free.dev?type=gateway";
// const WS_URL = "ws://localhost:3000?type=gateway";
// let interValid = null;
// let ws = null;
// function connect() {
//   if (ws) {
//     ws.terminate();
//   }
//   ws = new WebSocket(WS_URL);
//   ws.on("open", () => {
//     console.log("gateway connected successfully");

//     if (interValid) clearInterval(interValid);

//     interValid = setInterval(() => {
//       wells.forEach((well) => {
//         const sensorData = generateSensorData(well.id);
//         const payload = { type: "sensor_data", wellId: well.id, ...sensorData };

//         ws.send(JSON.stringify(payload));
//       });
//     }, 1000);
//   });
//   ws.on("message", (data) => {
//     const cmd = JSON.parse(data);
//     console.log("gateway command", cmd);
//   });
//   ws.on("close", () => {
//     console.log("gateway reconnecting in 3s...");
//     setTimeout(connect, 3000);
//   });
//   ws.on("error", (error) => {
//     console.log(error.message);
//     ws.terminate();
//   });
// }

let intervalId = null; // track it outside

function connect() {
  const ws = new WebSocket(WS_URL);

  ws.on("open", () => {
    console.log("gateway connected successfully");

    // Clear any existing interval before starting a new one
    if (intervalId) {
      clearInterval(intervalId);
    }

    intervalId = setInterval(() => {
      wells.forEach((well) => {
        const sensorData = generateSensorData(well.id);
        const payload = { type: "sensor_data", wellId: well.id, ...sensorData };
        ws.send(JSON.stringify(payload));
      });
    }, 1000);
  });

  ws.on("close", () => {
    console.log("gateway reconnecting in 3s...");
    clearInterval(intervalId); // stop sending when disconnected
    intervalId = null;
    setTimeout(connect, 3000);
  });

  ws.on("error", (error) => {
    console.log(error.message);
    clearInterval(intervalId);
    intervalId = null;
    ws.terminate();
  });
}
connect();
