import Notification from "../models/Notification.js";
import User from "../models/User.js";

const createManagerNotifications = async (message) => {
  const managers = await User.find({ role: "manager" }).select("_id").lean();

  if (managers.length > 0) {
    await Notification.insertMany(managers.map(({ _id }) => ({ user: _id, message })));
  }
};

const createUserNotification = (user, message) => Notification.create({ user, message });

const notifySafely = async (createNotification) => {
  try {
    await createNotification();
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

export {
  createManagerNotifications,
  createUserNotification,
  getUserNotifications,
  notifySafely,
};
