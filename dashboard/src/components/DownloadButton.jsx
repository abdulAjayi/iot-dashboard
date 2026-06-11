import { useState } from "react";
import useAuthStore from "../store/useAuthStore";

export default function DownloadButton() {
  const token = useAuthStore((s) => s.token);
  const [loading, setLoading] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [wellId, setWellId] = useState("");
  const [error, setError] = useState("");

  async function handleDownload() {
    if (!startDate || !endDate) {
      setError("Please select both start and end dates");
      return;
    }

    if (new Date(startDate) > new Date(endDate)) {
      setError("Start date cannot be after end date");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const params = new URLSearchParams({ startDate, endDate });
      if (wellId) params.append("wellId", wellId);

      const res = await fetch(
        `https://backslid-deflate-hangnail.ngrok-free.dev/api/readings/download?${params}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (res.status === 404) {
        setError("No readings found for this date range");
        return;
      }

      if (!res.ok) {
        setError("Failed to download. Admin access required.");
        return;
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `greenpeg-readings-${startDate}-to-${endDate}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-[#0f172a] border border-[#1e293b] rounded-xl p-5">
      <p className="text-green-400 text-xs font-bold mb-4 tracking-widest">
        DOWNLOAD READINGS
      </p>

      {error && (
        <p className="text-red-400 text-xs mb-3 bg-red-400/10 p-2 rounded-lg">
          {error}
        </p>
      )}

      <div className="flex flex-col gap-3">
        {/* Start Date */}
        <div>
          <label className="text-gray-400 text-xs mb-1 block">FROM</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full bg-[#1e293b] text-white rounded-lg px-4 py-2 text-sm outline-none border border-transparent focus:border-green-500"
          />
        </div>

        {/* End Date */}
        <div>
          <label className="text-gray-400 text-xs mb-1 block">TO</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full bg-[#1e293b] text-white rounded-lg px-4 py-2 text-sm outline-none border border-transparent focus:border-green-500"
          />
        </div>

        {/* Optional Well Filter */}
        <div>
          <label className="text-gray-400 text-xs mb-1 block">
            WELL ID (optional — leave empty for all wells)
          </label>
          <input
            type="text"
            value={wellId}
            onChange={(e) => setWellId(e.target.value)}
            placeholder="e.g. GB-05"
            className="w-full bg-[#1e293b] text-white rounded-lg px-4 py-2 text-sm outline-none border border-transparent focus:border-green-500"
          />
        </div>

        <button
          onClick={handleDownload}
          disabled={loading}
          className="w-full bg-green-600 hover:bg-green-500 disabled:opacity-50 text-white text-sm font-bold py-2 rounded-lg transition-colors mt-1"
        >
          {loading ? "Generating CSV..." : "⬇ Download CSV"}
        </button>
      </div>
    </div>
  );
}
