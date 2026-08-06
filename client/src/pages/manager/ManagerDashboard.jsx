import { Outlet } from "react-router-dom";
import { useEffect, useState } from "react";

import ManagerNavbar from "../../components/manager/ManagerNavbar.jsx";
import ManagerSidebar from "../../components/manager/ManagerSidebar.jsx";
import ManagerStats from "../../components/manager/ManagerStats.jsx";
import useToast from "../../context/useToast.js";
import { getDashboard } from "../../services/managerService.js";

export const ManagerPortalLayout = () => (
  <div className="app-shell manager-portal">
    <ManagerSidebar />
    <main className="app-shell__content">
      <ManagerNavbar />
      <Outlet />
    </main>
  </div>
);

// Manager Dashboard Home (/manager/dashboard) — overview only.
// Detailed request review lives on the Pending Requests page, not here.
const ManagerDashboard = () => {
  const { showToast } = useToast();
  const [summary, setSummary] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    (async () => {
      try {
        const dashboard = await getDashboard();
        if (isMounted) setSummary(dashboard.summary);
      } catch {
        if (isMounted) showToast("We could not load the manager dashboard. Please refresh.");
      } finally {
        if (isMounted) setIsLoading(false);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [showToast]);

  return (
    <section className="dashboard-page">
      <div className="page-heading dashboard-hero">
        <div>
          <span className="eyebrow">MANAGER DASHBOARD</span>
          <h1>Approval control center.</h1>
          <p>A snapshot of leave activity across your team.</p>
        </div>
      </div>
      {isLoading ? null : <ManagerStats summary={summary} />}
    </section>
  );
};

export default ManagerDashboard;
