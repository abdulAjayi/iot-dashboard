import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import WellsOverview from "./pages/WellsOverview";
import WellDashboard from "./components/WellDashboard";
import { useSocket } from "./hooks/useSocket";
import { ProtectedRoute } from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Register from "./pages/Register";
function App() {
  useSocket();
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <WellsOverview />
            </ProtectedRoute>
          }
        />
        <Route path="/well/:wellId" element={<WellDashboard />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
