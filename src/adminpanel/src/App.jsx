import { Routes, Route, Navigate } from "react-router-dom";
import AdminLogin from "./admin/pages/Login.jsx";
import AdminLayout from "./admin/components/Layout.jsx";
import { AdminGuard } from "./admin/components/Guard.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route
        path="/admin/*"
        element={
          <AdminGuard>
            <AdminLayout />
          </AdminGuard>
        }
      />
      <Route path="*" element={<Navigate to="/admin" replace />} />
    </Routes>
  );
}
