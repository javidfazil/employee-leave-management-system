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

import ManagerDashboardPage, {
  ManagerPortalLayout,
} from "./pages/manager/ManagerDashboard.jsx";

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

  if (user.role === "manager") {
    return <Navigate to="/manager/dashboard" replace />;
  }

  return <Navigate to="/employee/dashboard" replace />;
};


const App = () => {
  return (
    <Routes>

      {/* Home */}
      <Route path="/" element={<HomeRedirect />} />


      {/* Role Selection */}
      <Route path="/login" element={<RoleSelection />} />


      {/* Separate Login Pages */}
      <Route
        path="/login/employee"
        element={<Login />}
      />

      <Route
        path="/login/manager"
        element={<ManagerLogin />}
      />


      {/* Registration */}
      <Route
        path="/register"
        element={<Register />}
      />

      <Route
        path="/register/:role"
        element={<Register />}
      />


      {/* =========================
          EMPLOYEE ROUTES
          ========================= */}

      <Route
        element={
          <ProtectedRoute allowedRoles={["employee"]} />
        }
      >

        <Route element={<DashboardLayout />}>

          <Route
            path="/employee/dashboard"
            element={<EmployeeDashboard />}
          />

          <Route
            path="/leaves"
            element={<LeaveManagement />}
          />

          <Route
            path="/notifications"
            element={<Notifications />}
          />

          <Route
            path="/profile"
            element={<Profile />}
          />

        </Route>

      </Route>



      {/* =========================
          MANAGER ROUTES
          ========================= */}

      <Route
        element={
          <ProtectedRoute allowedRoles={["manager"]} />
        }
      >

        <Route element={<ManagerPortalLayout />}>

          <Route
            path="/manager/dashboard"
            element={<ManagerDashboardPage />}
          />


          <Route
            path="/manager/requests"
            element={<ManagerRequests />}
          />


          <Route
            path="/manager/requests/:id"
            element={<RequestDetails />}
          />


          <Route
            path="/manager/employees"
            element={<ManagerEmployees />}
          />


          <Route
            path="/manager/employees/:employeeId/history"
            element={<EmployeeHistory />}
          />


          <Route
            path="/manager/notifications"
            element={<ManagerNotifications />}
          />


          <Route
            path="/manager/profile"
            element={<ManagerProfile />}
          />

        </Route>

      </Route>



      {/* Unknown Routes */}
      <Route
        path="*"
        element={<HomeRedirect />}
      />

    </Routes>
  );
};


export default App;