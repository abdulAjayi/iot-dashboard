import express from "express";
import { WebSocketServer } from "ws";
import authRoutes from "./routes/auth.js";
import http from "http";
import { prisma } from "./prisma/lib/prismaClient.js";
import cors from "cors";
const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });
import readingsAuth from "./routes/readings.js";

// app.use(
//   cors({
//     origin: ["https://iot-dashboard-rouge-zeta.vercel.app"],
//     credentials: true,
//   }),
// );

// app.use(
//   cors({
//     origin: [
//       "https://iot-dashboard-rouge-zeta.vercel.app",
//       "https://backslid-deflate-hangnail.ngrok-free.dev",
//       "http://localhost:5173",
//     ],
//     methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
//     allowedHeaders: [
//       "Content-Type",
//       "Authorization",
//       "ngrok-skip-browser-warning",
//     ],
//     credentials: true,
//   }),
// );

app.use(
  cors({
    origin: [
      "https://iot-dashboard-rouge-zeta.vercel.app",
      "http://localhost:5173",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }),
);

app.use("/auth", authRoutes);
app.use("/api/readings", readingsAuth);

let gatewayClient = null;
let dashboardClients = new Set();

wss.on("connection", (ws, req) => {
  const param = new URL(req.url, "http://localhost").searchParams;
  const type = param.get("type");
  if (type === "gateway") {
    gatewayClient = ws;
    console.log("gateway has been connected successfully");
    ws.on("message", async (data) => {
      const dataString = data.toString();

      dashboardClients.forEach((client) => {
        if (client.readyState === 1) {
          client.send(dataString);
          client.send(
            JSON.stringify({ type: "gateway_status", gatewayConnection: true }),
          );
        }
      });
      //** */ SAVE THE PAYLOAD TO AWS RDS POSTGRESQL INSTANCE **//

      // try {
      //   const payload = JSON.parse(dataString);
      //   const {
      //     wellId,
      //     downhole_pressure,
      //     downhole_temp,
      //     tubing_head_pressure,
      //     casing_pressure,
      //     flow_line_pressure,
      //     flow_line_temp,
      //     battery_voltage,
      //     battery_level,
      //   } = payload;

      //   if (!wellId) return;

      //   ** create well inside db **//
      //   const well = await prisma.well.upsert({
      //     where: { wellId: wellId },
      //     update: {},
      //     create: { wellId: wellId },
      //   });
      //   ** create sensor readings from well **//
      //   await prisma.reading.create({
      //     data: {
      //       wellKey: well.id,
      //       downholePressure: downhole_pressure,
      //       downholeTemp: downhole_temp,
      //       tubingHeadPressure: tubing_head_pressure,
      //       casingPressure: casing_pressure,
      //       flowLinePressure: flow_line_pressure,
      //       flowLineTemp: flow_line_temp,
      //       batteryVoltage: battery_voltage,
      //       batteryLevel: battery_level,
      //     },
      //   });
      //   console.log(`Successfully saved telemetry for ${wellId} to AWS RDS`);
      // } catch (error) {
      //   console.error("Failed to parse or save gateway payload:", error);
      // }
    });
    ws.on("close", () => {
      gatewayClient = null;
      dashboardClients.forEach((client) => {
        if (client.readyState === 1) {
          client.send(
            JSON.stringify({
              type: "gateway_status",
              gatewayConnection: false,
            }),
          );
        }
      });
      console.log("gateway successfully disconnected");
    });
  } else if (type === "dashboard") {
    dashboardClients.add(ws);
    console.log("dashboard has been connected successfully");
    ws.send(
      JSON.stringify({
        type: "server_status",
        serverConnection: true,
      }),
    );
    ws.send(
      JSON.stringify({
        type: "gateway_status",
        gatewayConnection: gatewayClient?.readyState === 1,
      }),
    );
    ws.on("message", (data) => {
      if (gatewayClient?.readyState === 1) {
        gatewayClient.send(data);
      }
    });
    ws.on("close", () => {
      console.log("dashboard client deleted successfully");
      dashboardClients.delete(ws);
    });
  }
});

function shutDownServer() {
  dashboardClients.forEach((client) => {
    client.send(
      JSON.stringify({
        type: "server_status",
        serverConnection: false,
      }),
    );
  });
  wss.close(() => {
    server.close(() => {
      process.exit(0);
    });
  });
}
process.on("SIGINT", shutDownServer);
process.on("SIGTERM", shutDownServer);

server.listen(process.env.PORT || 3000, () => {
  console.log("server has successfully started");
});
