import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import WellsOverview from "./pages/WellsOverview";
import WellDashboard from "./components/WellDashboard";
import { useSocket } from "./hooks/useSocket";
function App() {
  useSocket();
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<WellsOverview />} />
        <Route path="/well/:wellId" element={<WellDashboard />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
