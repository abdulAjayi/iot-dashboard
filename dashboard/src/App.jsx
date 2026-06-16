import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";
import WellsOverview from "./pages/WellsOverview";
import WellDashboard from "./components/WellDashboard";
import { ProtectedRoute } from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Register from "./pages/Register";
import useAuthStore from "./store/useAuthStore";

function App() {
  const { login, logout, token } = useAuthStore();
  useEffect(() => {
    async function restoreUser() {
      if (!token) return;
      try {
        const res = await fetch(
          "https://iot-dashboard-ve7n.onrender.com/auth/me",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        console.log(res);

        if (!res.ok) {
          logout();
          return;
        }
        const data = await res.json();
        login({ username: data.username, role: data.role }, token);
      } catch {
        logout();
      }
    }
    restoreUser();
  }, []);
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
