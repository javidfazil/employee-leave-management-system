import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import api from "../../api/api.js";
import useAuth from "../../context/useAuth.js";
import ThemeToggle from "../ui/ThemeToggle.jsx";

const ManagerNavbar = () => {
  const { user, logout } = useAuth();
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
    return () => { isActive = false; };
  }, []);

  return <header className="topbar manager-navbar"><span className="manager-navbar__title">Manager Portal</span><div className="topbar__spacer" /><ThemeToggle className="theme-toggle--navbar" /><Link className="topbar__bell" to="/manager/notifications" aria-label={`Manager notifications${unreadCount ? ` (${unreadCount} unread)` : ""}`}>♢{unreadCount > 0 && <span className="topbar__notification-count">{unreadCount > 99 ? "99+" : unreadCount}</span>}</Link><div className="topbar__profile"><span className="topbar__avatar">{user.name?.slice(0, 1).toUpperCase()}</span><div><strong>{user.name}</strong><span>manager</span></div></div><button className="topbar__logout" type="button" onClick={() => { logout(); navigate("/login"); }}>Sign Out</button></header>;
};

export default ManagerNavbar;
