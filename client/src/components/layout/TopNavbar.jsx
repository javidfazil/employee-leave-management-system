import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import api from "../../api/api.js";
import useAuth from "../../context/useAuth.js";
import ThemeToggle from "../ui/ThemeToggle.jsx";

const TopNavbar = ({ onMenuClick, onSidebarToggle }) => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    let isActive = true;

    const loadUnreadCount = async () => {
      try {
        const { data } = await api.get("/notifications");

        if (isActive) setUnreadCount(data.unreadCount || 0);
      } catch {
        if (isActive) setUnreadCount(0);
      }
    };

    void loadUnreadCount();

    return () => {
      isActive = false;
    };
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="topbar">
      <button className="topbar__menu topbar__menu--mobile" type="button" onClick={onMenuClick}>
        ☰
      </button>
      <button className="topbar__menu topbar__menu--desktop" type="button" onClick={onSidebarToggle}>☰</button>
      <div className="topbar__spacer" />
      <ThemeToggle className="theme-toggle--navbar" />
      <Link className="topbar__bell" to="/notifications" aria-label={`Notifications${unreadCount ? ` (${unreadCount} unread)` : ""}`}>
        ♢
        {unreadCount > 0 && <span className="topbar__notification-count">{unreadCount > 99 ? "99+" : unreadCount}</span>}
      </Link>
      <div className="topbar__profile">
        <span className="topbar__avatar">{user.name?.slice(0, 1).toUpperCase()}</span>
        <div>
          <strong>{user.name}</strong>
          <span>{user.role}</span>
        </div>
      </div>
      <button className="topbar__logout" type="button" onClick={handleLogout}>
        Sign Out
      </button>
    </header>
  );
};

export default TopNavbar;
