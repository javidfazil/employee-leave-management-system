import { useCallback, useEffect, useState } from "react";

import api from "../api/api.js";
import EmptyState from "../components/ui/EmptyState.jsx";
import LoadingSpinner from "../components/ui/LoadingSpinner.jsx";
import useNotifications from "../context/useNotifications.js";
import useToast from "../context/useToast.js";

const Notifications = () => {
  const { showToast } = useToast();
  const { markAllNotificationsAsRead, markNotificationAsRead } = useNotifications();
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadNotifications = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data } = await api.get("/notifications");
      setNotifications(data.notifications);
    } catch { showToast("Unable to load notifications."); } finally { setIsLoading(false); }
  }, [showToast]);

  useEffect(() => {
    void Promise.resolve().then(loadNotifications);
  }, [loadNotifications]);

  const markAllRead = async () => {
    try {
      await markAllNotificationsAsRead();
      setNotifications((items) => items.map((item) => ({ ...item, isRead: true })));
      showToast("All notifications marked as read.");
    } catch {
      showToast("Unable to update notifications.");
    }
  };

  const markRead = async (id) => {
    try {
      await markNotificationAsRead(id);
      setNotifications((items) => items.map((item) => item._id === id ? { ...item, isRead: true } : item));
    } catch {
      showToast("Unable to mark the notification as read.");
    }
  };

  const remove = async (id) => {
    try {
      await api.delete(`/notifications/${id}`);
      setNotifications((items) => items.filter((item) => item._id !== id));
      showToast("Notification deleted.");
    } catch {
      showToast("Unable to delete the notification.");
    }
  };

  return <section className="page"><div className="page-heading"><div><span className="eyebrow">WORKFORCE COMMUNICATIONS</span><h1>Updates & Alerts</h1><p>Stay informed about leave activity and workplace updates.</p></div>{notifications.some((item) => !item.isRead) && <button className="button button--secondary" type="button" onClick={markAllRead}>Mark all as read</button>}</div><section className="card notification-card">{isLoading ? <div className="loading-wrap"><LoadingSpinner /></div> : notifications.length === 0 ? <EmptyState title="You are all caught up" message="New leave activity and workforce updates will appear here." /> : <div className="notification-list">{notifications.map((notification) => <article className={`notification-item ${notification.isRead ? "" : "notification-item--unread"}`} key={notification._id}><div className="notification-item__marker" /><div><p>{notification.message}</p><small>{new Intl.DateTimeFormat("en", { dateStyle: "medium", timeStyle: "short" }).format(new Date(notification.createdAt))}</small></div><div className="notification-item__actions">{!notification.isRead && <button className="text-button" type="button" onClick={() => markRead(notification._id)}>Mark read</button>}<button className="icon-button" type="button" aria-label="Delete notification" onClick={() => remove(notification._id)}>×</button></div></article>)}</div>}</section></section>;
};

export default Notifications;
