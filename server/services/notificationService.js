import Notification from "../models/Notification.js";
import User from "../models/User.js";
import { ROLES } from "../utils/constants.js";

const notifyManagers = async (message) => {
  const managers = await User.find({ role: ROLES.MANAGER }).select("_id").lean();

  if (managers.length > 0) {
    await Notification.insertMany(managers.map(({ _id }) => ({ user: _id, message })));
  }
};

const notifyUser = (userId, message) => Notification.create({ user: userId, message });

// Notification failures should never break the primary leave workflow, so
// callers fire-and-forget through this wrapper and just log on failure.
const notifySafely = async (notifyFn) => {
  try {
    await notifyFn();
  } catch (error) {
    console.error("Failed to create notification:", error.message);
  }
};

const getUserNotifications = async (userId) => {
  const [notifications, unreadCount] = await Promise.all([
    Notification.find({ user: userId }).sort({ createdAt: -1 }),
    Notification.countDocuments({ user: userId, isRead: false }),
  ]);

  return { notifications, unreadCount };
};

const markAsRead = (userId, notificationId) =>
  Notification.findOneAndUpdate(
    { _id: notificationId, user: userId },
    { $set: { isRead: true } },
    { new: true }
  );

const markAllAsRead = (userId) =>
  Notification.updateMany({ user: userId, isRead: false }, { $set: { isRead: true } });

const deleteUserNotification = (userId, notificationId) =>
  Notification.findOneAndDelete({ _id: notificationId, user: userId });

export {
  deleteUserNotification,
  getUserNotifications,
  markAllAsRead,
  markAsRead,
  notifyManagers,
  notifySafely,
  notifyUser,
};
