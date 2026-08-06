import asyncHandler from "../middleware/asyncHandler.js";
import {
  deleteUserNotification,
  getUserNotifications,
  markAllAsRead,
  markAsRead,
} from "../services/notificationService.js";

const objectIdPattern = /^[a-f\d]{24}$/i;

const validateNotificationId = (req, res, next) => {
  if (!objectIdPattern.test(req.params.notificationId)) {
    return res.status(400).json({ message: "Invalid notification ID" });
  }
  next();
};

const getMyNotifications = asyncHandler(async (req, res) => {
  const result = await getUserNotifications(req.user._id);
  res.status(200).json(result);
});

const markNotificationAsRead = asyncHandler(async (req, res) => {
  const notification = await markAsRead(req.user._id, req.params.notificationId);

  if (!notification) {
    return res.status(404).json({ message: "Notification not found" });
  }

  res.status(200).json({ notification });
});

const markAllNotificationsAsRead = asyncHandler(async (req, res) => {
  const result = await markAllAsRead(req.user._id);
  res.status(200).json({ modifiedCount: result.modifiedCount });
});

const deleteNotification = asyncHandler(async (req, res) => {
  const notification = await deleteUserNotification(req.user._id, req.params.notificationId);

  if (!notification) {
    return res.status(404).json({ message: "Notification not found" });
  }

  res.status(204).send();
});

export {
  deleteNotification,
  getMyNotifications,
  markAllNotificationsAsRead,
  markNotificationAsRead,
  validateNotificationId,
};
