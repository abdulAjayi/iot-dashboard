import express, { json } from "express";
import { WebSocketServer } from "ws";
import http from "http";
const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

let gatewayClient = null;
let dashboardClients = new Set();

wss.on("connection", (ws, req) => {
  const param = new URL(req.url, "http://localhost").searchParams;
  const type = param.get("type");
  if (type === "gateway") {
    gatewayClient = ws;
    console.log("gateway has been connected successfully");
    ws.on("message", (data) => {
      dashboardClients.forEach((client) => {
        if (client.readyState === 1) {
          client.send(data.toString());
          client.send(
            JSON.stringify({ type: "gateway_status", gatewayConnection: true }),
          );
        }
      });
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
