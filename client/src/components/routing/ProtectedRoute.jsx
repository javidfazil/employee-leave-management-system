import { Navigate, Outlet, useLocation } from "react-router-dom";

import useAuth from "../../context/useAuth.js";

const ProtectedRoute = ({ allowedRoles }) => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    const dashboardPath =
      user.role === "manager" ? "/manager/dashboard" : "/employee/dashboard";

    return <Navigate to={dashboardPath} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
