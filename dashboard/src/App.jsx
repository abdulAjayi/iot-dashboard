import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";
import { useEffect } from "react";
import WellsOverview from "./pages/WellsOverview";
import WellDashboard from "./components/WellDashboard";
import { ProtectedRoute } from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Register from "./pages/Register";
import useAuthStore from "./store/useAuthStore";
import SetupPin from "./pages/SetupPin";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

function AppRoutes() {
  const { login, logout, token } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    async function restoreUser() {
      if (!token) return;
      try {
        const res = await fetch(`${API_URL}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          logout();
          return;
        }
        const data = await res.json();
        login({ username: data.username, role: data.role }, token);
        navigate("/");
      } catch {
        logout();
      }
    }
    restoreUser();
  }, []);

  return (
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
      <Route
        path="/setup-pin"
        element={
          <ProtectedRoute>
            <SetupPin />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}
