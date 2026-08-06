import { Navigate, Route, Routes } from "react-router-dom";

import DashboardLayout from "./components/layout/DashboardLayout.jsx";
import ProtectedRoute from "./components/routing/ProtectedRoute.jsx";
import useAuth from "./context/useAuth.js";
import EmployeeDashboard from "./pages/EmployeeDashboard.jsx";
import LeaveManagement from "./pages/LeaveManagement.jsx";
import Login from "./pages/Login.jsx";
import ManagerLogin from "./pages/ManagerLogin.jsx";
import Notifications from "./pages/Notifications.jsx";
import Profile from "./pages/Profile.jsx";
import Register from "./pages/Register.jsx";
import RoleSelection from "./pages/RoleSelection.jsx";
import ManagerDashboardPage, { ManagerPortalLayout } from "./pages/manager/ManagerDashboard.jsx";
import PendingRequests from "./pages/manager/PendingRequests.jsx";
import ApprovedRequests from "./pages/manager/ApprovedRequests.jsx";
import RejectedRequests from "./pages/manager/RejectedRequests.jsx";
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
    <Route path="/login/employee" element={<Login />} />
    <Route path="/login/manager" element={<ManagerLogin />} />
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
        <Route path="/manager/pending-requests" element={<PendingRequests />} />
        <Route path="/manager/approved-requests" element={<ApprovedRequests />} />
        <Route path="/manager/rejected-requests" element={<RejectedRequests />} />
        <Route path="/manager/notifications" element={<ManagerNotifications />} />
        <Route path="/manager/profile" element={<ManagerProfile />} />
      </Route>
    </Route>

    <Route path="*" element={<HomeRedirect />} />
  </Routes>
);

export default App;
