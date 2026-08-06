import { useState } from "react";
import { Outlet } from "react-router-dom";

import Sidebar from "./Sidebar.jsx";
import TopNavbar from "./TopNavbar.jsx";

const DashboardLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="app-shell">
      <Sidebar
        isCollapsed={isCollapsed}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
      {isSidebarOpen && (
        <button
          className="app-shell__overlay"
          type="button"
          aria-label="Close navigation"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
      <main className={`app-shell__content ${isCollapsed ? "app-shell__content--wide" : ""}`}>
        <TopNavbar
          onMenuClick={() => setIsSidebarOpen(true)}
          onSidebarToggle={() => setIsCollapsed((value) => !value)}
        />
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
