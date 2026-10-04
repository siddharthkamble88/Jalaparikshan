import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import {
  getAllNodes,
  getNodeById,
  ingestSensorReading,
  getNodeHistory,
  getAllAlerts,
  acknowledgeAlertInDb,
  resetDbToDefault,
} from "./src/db/database.js";
import { INITIAL_SYSTEM_STATUS, DEFAULT_THRESHOLDS } from "./src/data/mockData.js";
import { ParameterThreshold } from "./src/types.js";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  let thresholds: Record<string, ParameterThreshold> = JSON.parse(JSON.stringify(DEFAULT_THRESHOLDS));

  // --- API ROUTES ---

  // Health check
  app.get("/api/health", (req, res) => {
    res.json({
      status: "ok",
      service: "AquaSense IoT Backend (SQLite)",
      timestamp: new Date().toISOString(),
    });
  });

  // GET /api/nodes - Returns all nodes with latest readings from SQLite
  app.get("/api/nodes", (req, res) => {
    const nodes = getAllNodes();
    res.json({ success: true, count: nodes.length, data: nodes });
  });

  // GET /api/nodes/:id
  app.get("/api/nodes/:id", (req, res) => {
    const node = getNodeById(req.params.id);
    if (!node) {
      return res.status(404).json({ success: false, error: "Node not found" });
    }
    res.json({ success: true, data: node });
  });

  // GET /api/readings/latest
  app.get("/api/readings/latest", (req, res) => {
    const nodes = getAllNodes();
    const latestReadings = nodes.map(n => ({
      nodeId: n.id,
      nodeName: n.name,
      location: n.locationName,
      status: n.status,
      timestamp: n.lastSeen,
      readings: n.currentReadings,
      wqi: n.waterQualityIndex,
    }));
    res.json({ success: true, data: latestReadings });
  });

  // GET /api/readings/history
  app.get("/api/readings/history", (req, res) => {
    const nodeId = (req.query.nodeId as string) || "river";
    const hours = parseInt((req.query.hours as string) || "24", 10);
    const history = getNodeHistory(nodeId, hours);
    res.json({ success: true, nodeId, hours, count: history.length, data: history });
  });

  // GET /api/alerts
  app.get("/api/alerts", (req, res) => {
    const alerts = getAllAlerts();
    res.json({ success: true, count: alerts.length, data: alerts });
  });

  // POST /api/alerts/acknowledge
  app.post("/api/alerts/acknowledge", (req, res) => {
    const { alertId } = req.body;
    if (!alertId) {
      return res.status(400).json({ success: false, error: "Missing alertId" });
    }
    const success = acknowledgeAlertInDb(alertId);
    res.json({ success });
  });

  // -------------------------------------------------------------
  // PRIMARY INGESTION ENDPOINT: Receive data from ESP32 & sensors
  // Accepts: { nodeId, temperature, ph, turbidity, dissolvedOxygen, tds, conductivity }
  // -------------------------------------------------------------
  const handleIngest = (req: express.Request, res: express.Response) => {
    const { nodeId, temperature, ph, turbidity, dissolvedOxygen, tds, conductivity, timestamp } = req.body;

    if (temperature === undefined && ph === undefined && turbidity === undefined) {
      return res.status(400).json({
        success: false,
        error: "At least one sensor reading (e.g. temperature) is required",
      });
    }

    try {
      const result = ingestSensorReading({
        nodeId: nodeId || "ESP32-001",
        temperature: temperature !== undefined ? Number(temperature) : undefined,
        ph: ph !== undefined ? Number(ph) : undefined,
        turbidity: turbidity !== undefined ? Number(turbidity) : undefined,
        dissolvedOxygen: dissolvedOxygen !== undefined ? Number(dissolvedOxygen) : undefined,
        tds: tds !== undefined ? Number(tds) : undefined,
        conductivity: conductivity !== undefined ? Number(conductivity) : undefined,
        timestamp,
      });

      console.log(
        `📡 [ESP32 Ingestion] Node: ${result.node.id} (${result.node.name}) | Temp: ${result.node.currentReadings.temperature}°C | WQI: ${result.node.waterQualityIndex}`
      );

      res.json({
        success: true,
        message: "Reading successfully saved to SQLite",
        data: {
          node: result.node,
          newAlert: result.newAlert,
        },
      });
    } catch (err: any) {
      console.error("❌ Failed to ingest sensor reading:", err);
      res.status(500).json({ success: false, error: err.message });
    }
  };

  // Support both endpoint paths for convenience
  app.post("/api/external/temperature", handleIngest);
  app.post("/api/external/reading", handleIngest);

  // GET /api/thresholds
  app.get("/api/thresholds", (req, res) => {
    res.json({ success: true, data: thresholds });
  });

  // POST /api/thresholds
  app.post("/api/thresholds", (req, res) => {
    const { parameterKey, newThreshold } = req.body;
    if (thresholds[parameterKey] && newThreshold) {
      thresholds[parameterKey] = { ...thresholds[parameterKey], ...newThreshold };
      return res.json({ success: true, data: thresholds[parameterKey] });
    }
    res.status(400).json({ success: false, error: "Invalid threshold data" });
  });

  // POST /api/simulate/anomaly (Inject an anomaly for demonstration)
  app.post("/api/simulate/anomaly", (req, res) => {
    const { nodeId, type } = req.body;
    const targetNodeId = nodeId || "river";

    if (type === "turbidity_spike") {
      ingestSensorReading({ nodeId: targetNodeId, turbidity: 28.5 });
    } else if (type === "do_drop") {
      ingestSensorReading({ nodeId: targetNodeId, dissolvedOxygen: 3.2 });
    } else if (type === "reset") {
      resetDbToDefault();
    }

    res.json({
      success: true,
      message: `Simulated event: ${type}`,
      nodes: getAllNodes(),
      alerts: getAllAlerts(),
    });
  });

  // GET /api/system-status
  app.get("/api/system-status", (req, res) => {
    res.json({ success: true, data: INITIAL_SYSTEM_STATUS });
  });

  // GET /api/export/csv
  app.get("/api/export/csv", (req, res) => {
    const nodeId = (req.query.nodeId as string) || "river";
    const history = getNodeHistory(nodeId, 24);

    let csvContent = "Timestamp,NodeID,pH,Turbidity(NTU),Temp(C),DO(mg/L),TDS(ppm),Conductivity(uS/cm),WQI\n";
    history.forEach(r => {
      csvContent += `${r.timestamp},${r.nodeId},${r.ph},${r.turbidity},${r.temperature},${r.dissolvedOxygen},${r.tds},${r.conductivity},${r.waterQualityIndex}\n`;
    });

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", `attachment; filename=AquaSense_${nodeId}_readings.csv`);
    res.send(csvContent);
  });

  // --- VITE MIDDLEWARE OR PRODUCTION STATIC FILE SERVING ---
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`AquaSense IoT Server (SQLite Persistent) listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
