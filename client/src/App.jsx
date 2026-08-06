import { Navigate, Route, Routes } from "react-router-dom";

import DashboardLayout from "./components/layout/DashboardLayout.jsx";
import ProtectedRoute from "./components/routing/ProtectedRoute.jsx";
import useAuth from "./context/useAuth.js";
import EmployeeDashboard from "./pages/EmployeeDashboard.jsx";
import LeaveManagement from "./pages/LeaveManagement.jsx";
import Login from "./pages/Login.jsx";
import Notifications from "./pages/Notifications.jsx";
import Profile from "./pages/Profile.jsx";
import Register from "./pages/Register.jsx";
import RoleSelection from "./pages/RoleSelection.jsx";
import ManagerDashboardPage, { ManagerPortalLayout } from "./pages/manager/ManagerDashboard.jsx";
import ManagerRequests from "./pages/manager/ManagerRequests.jsx";
import RequestDetails from "./pages/manager/RequestDetails.jsx";
import ManagerEmployees from "./pages/manager/ManagerEmployees.jsx";
import EmployeeHistory from "./pages/manager/EmployeeHistory.jsx";
import ManagerNotifications from "./pages/manager/ManagerNotifications.jsx";
import ManagerProfile from "./pages/manager/ManagerProfile.jsx";

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
    <Route path="/login" element={<RoleSelection />} />
    <Route path="/login/:role" element={<Login />} />
    <Route path="/register" element={<Register />} />
    <Route path="/register/manager" element={<Register />} />

    <Route element={<ProtectedRoute allowedRoles={["employee"]} />}>
      <Route element={<DashboardLayout />}>
        <Route path="/employee/dashboard" element={<EmployeeDashboard />} />
        <Route path="/leaves" element={<LeaveManagement />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/profile" element={<Profile />} />
      </Route>
    </Route>

    <Route element={<ProtectedRoute allowedRoles={["manager"]} />}>
      <Route element={<ManagerPortalLayout />}>
        <Route path="/manager/dashboard" element={<ManagerDashboardPage />} />
        <Route path="/manager/requests" element={<ManagerRequests />} />
        <Route path="/manager/requests/:id" element={<RequestDetails />} />
        <Route path="/manager/employees" element={<ManagerEmployees />} />
        <Route path="/manager/employees/:employeeId/history" element={<EmployeeHistory />} />
        <Route path="/manager/notifications" element={<ManagerNotifications />} />
        <Route path="/manager/profile" element={<ManagerProfile />} />
      </Route>
    </Route>

    <Route path="*" element={<HomeRedirect />} />
  </Routes>
);

export default App;
