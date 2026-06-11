import express from "express";
import { prisma } from "../prisma/lib/prismaClient.js";
import { requireAuth } from "../middleware/authMiddleware.js";
const router = express.Router();

router.get("/download", requireAuth, async (req, res) => {
  const user = req.user;
  try {
    if (req.user.role !== "admin")
      return res.status(403).json({ error: "Admins only" });
    const { startDate, endDate, wellId } = req.query;

    // Build filter
    const where = {};

    // Date range filter
    if (startDate || endDate) {
      where.recordedAt = {};
      if (startDate) where.recordedAt.gte = new Date(startDate);
      if (endDate) {
        // include the full end date (until 23:59:59)
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        where.recordedAt.lte = end;
      }
    }

    // Filter by specific well if provided
    if (wellId) {
      where.well = { wellId };
    }

    const readings = await prisma.reading.findMany({
      where,
      orderBy: { recordedAt: "asc" },
      include: { well: true },
    });

    if (readings.length === 0) {
      return res
        .status(404)
        .json({ error: "No readings found for this date range" });
    }

    // Build CSV
    const headers = [
      "Well ID",
      "Downhole Pressure (psi)",
      "Downhole Temp (°C)",
      "Tubing Head Pressure (psi)",
      "Casing Pressure (psi)",
      "Flow Line Pressure (psi)",
      "Flow Line Temp (°C)",
      "Battery Voltage (V)",
      "Battery Level (%)",
      "Recorded At",
    ].join(",");

    const rows = readings.map((r) =>
      [
        r.well.wellId,
        r.downholePressure,
        r.downholeTemp,
        r.tubingHeadPressure,
        r.casingPressure,
        r.flowLinePressure,
        r.flowLineTemp,
        r.batteryVoltage,
        r.batteryLevel,
        new Date(r.recordedAt).toLocaleString(),
      ].join(","),
    );

    const csv = [headers, ...rows].join("\n");

    // filename includes date range
    const filename = `greenpeg-readings-${startDate || "all"}-to-${endDate || "now"}.csv`;

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", `attachment; filename=${filename}`);
    res.send(csv);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to generate CSV" });
  }
});

export default router;
