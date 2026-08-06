import { Router } from "express";

import {
  deleteNotification,
  getMyNotifications,
  markAllNotificationsAsRead,
  markNotificationAsRead,
  validateNotificationId,
} from "../controllers/notificationController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = Router();

router.use(protect);

router.get("/", getMyNotifications);
router.patch("/read-all", markAllNotificationsAsRead);
router.patch("/:notificationId/read", validateNotificationId, markNotificationAsRead);
router.delete("/:notificationId", validateNotificationId, deleteNotification);

export default router;
