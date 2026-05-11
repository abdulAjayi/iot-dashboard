import http from "http"
import { WebSocket } from "ws";
const PORT = process.env.PORT || 3000
http.createServer((req, res) => res.end("gateway running")).listen(PORT)
const WS_URL = "wss://iot-dashboard-ve7n.onrender.com?type=gateway"

function rand(min, max) {
    return +(min + Math.random() * (max-min)).toFixed(2)
}

function connect() {
    const ws = new WebSocket(WS_URL)
    ws.on("open", () => {
        console.log("gateway connected successfully");
        setInterval(() => {
            const payload = {
        downhole_pressure:    rand(3600, 4200),
        downhole_temp:        rand(62, 72),
        tubing_head_pressure: rand(1100, 1400),
        casing_pressure:      rand(850, 1000),
        flow_line_pressure:   rand(420, 500),
        flow_line_temp:       rand(38, 48),
        battery_voltage:      rand(11.5, 13.5),
        battery_level:        rand(75, 90),
        timestamp:            new Date().toISOString(),
            }
            ws.send(JSON.stringify(payload))
        }, 1000)
    })
    ws.on("message", (data) => {
        const cmd = JSON.parse(data)
        console.log("gateway command",cmd);
        
    })
    ws.on("close", () => {
        console.log("gateway reconnecting in 3s...");
        setTimeout(connect, 3000)
    })
    ws.on("error", (error) => {
        console.log(error.message);
        
    })
}
connect()