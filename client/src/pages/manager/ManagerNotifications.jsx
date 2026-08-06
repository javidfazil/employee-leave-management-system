import { useCallback, useEffect, useState } from "react";

import api from "../../api/api.js";
import EmptyState from "../../components/ui/EmptyState.jsx";
import LoadingSpinner from "../../components/ui/LoadingSpinner.jsx";
import useToast from "../../context/useToast.js";

const ManagerNotifications = () => {
  const { showToast } = useToast(); const [notifications, setNotifications] = useState([]); const [isLoading, setIsLoading] = useState(true);
  const loadNotifications = useCallback(async () => { try { setIsLoading(true); setNotifications((await api.get("/notifications")).data.notifications); } catch { showToast("Unable to load notifications."); } finally { setIsLoading(false); } }, [showToast]);
  useEffect(() => { void Promise.resolve().then(loadNotifications); }, [loadNotifications]);
  const markRead = async (id) => { try { await api.patch(`/notifications/${id}/read`); setNotifications((items) => items.map((item) => item._id === id ? { ...item, isRead: true } : item)); } catch { showToast("Unable to update notification."); } };
  return <section className="page"><div className="page-heading"><div><span className="eyebrow">MANAGER NOTIFICATIONS</span><h1>Notifications</h1><p>Stay informed about new employee leave requests.</p></div></div><section className="card notification-card">{isLoading ? <div className="loading-wrap"><LoadingSpinner /></div> : notifications.length ? <div className="notification-list">{notifications.map((notification) => <article className={`notification-item ${notification.isRead ? "" : "notification-item--unread"}`} key={notification._id}><div className="notification-item__marker" /><div><p>{notification.message}</p><small>{new Intl.DateTimeFormat("en", { dateStyle: "medium", timeStyle: "short" }).format(new Date(notification.createdAt))}</small></div>{!notification.isRead && <button className="text-button" type="button" onClick={() => markRead(notification._id)}>Mark read</button>}</article>)}</div> : <EmptyState title="You are all caught up" message="New leave request activity will appear here." />}</section></section>;
};

export default ManagerNotifications;
