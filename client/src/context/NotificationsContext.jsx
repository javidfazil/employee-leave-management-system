import { useCallback, useEffect, useMemo, useState } from "react";

import api from "../api/api.js";
import useAuth from "./useAuth.js";
import NotificationContext from "./notificationContext.js";

const NotificationsProvider = ({ children }) => {
  const { user } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);

  const refreshUnreadCount = useCallback(async () => {
    if (!user) {
      setUnreadCount(0);
      return;
    }

    const { data } = await api.get("/notifications");
    setUnreadCount(data.unreadCount || 0);
  }, [user]);

  useEffect(() => {
    void Promise.resolve().then(() => refreshUnreadCount()).catch(() => setUnreadCount(0));
  }, [refreshUnreadCount]);

  const markNotificationAsRead = useCallback(async (notificationId) => {
    const { data } = await api.patch(`/notifications/${notificationId}/read`);
    setUnreadCount((count) => Math.max(0, count - 1));
    return data.notification;
  }, []);

  const markAllNotificationsAsRead = useCallback(async () => {
    await api.patch("/notifications/read-all");
    setUnreadCount(0);
  }, []);

  const value = useMemo(() => ({
    unreadCount,
    refreshUnreadCount,
    markNotificationAsRead,
    markAllNotificationsAsRead,
  }), [markAllNotificationsAsRead, markNotificationAsRead, refreshUnreadCount, unreadCount]);

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
};

export { NotificationsProvider };
