import { Navigate, Route, Routes } from "react-router-dom";

import DashboardLayout from "./components/layout/DashboardLayout.jsx";
import ProtectedRoute from "./components/routing/ProtectedRoute.jsx";
import { useAuth } from "./context/AuthContext.jsx";
import EmployeeDashboard from "./pages/EmployeeDashboard.jsx";
import LeaveManagement from "./pages/LeaveManagement.jsx";
import Login from "./pages/Login.jsx";
import ManagerDashboard from "./pages/ManagerDashboard.jsx";
import Notifications from "./pages/Notifications.jsx";
import Profile from "./pages/Profile.jsx";
import Register from "./pages/Register.jsx";

const HomeRedirect = () => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <Navigate
      to={user.role === "manager" ? "/manager/dashboard" : "/employee/dashboard"}
      replace
    />
  );
};

const App = () => (
  <Routes>
    <Route path="/" element={<HomeRedirect />} />
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />

    <Route element={<ProtectedRoute allowedRoles={["employee"]} />}>
      <Route element={<DashboardLayout />}>
        <Route path="/employee/dashboard" element={<EmployeeDashboard />} />
      </Route>
    </Route>

    <Route element={<ProtectedRoute allowedRoles={["manager"]} />}>
      <Route element={<DashboardLayout />}>
        <Route path="/manager/dashboard" element={<ManagerDashboard />} />
      </Route>
    </Route>

    <Route element={<ProtectedRoute allowedRoles={["employee", "manager"]} />}>
      <Route element={<DashboardLayout />}>
        <Route path="/leaves" element={<LeaveManagement />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/profile" element={<Profile />} />
      </Route>
    </Route>

    <Route path="*" element={<HomeRedirect />} />
  </Routes>
);

export default App;
