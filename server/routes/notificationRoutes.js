import { Router } from "express";

import {
  deleteNotification,
  getMyNotifications,
  markAllNotificationsAsRead,
  markNotificationAsRead,
} from "../controllers/notificationController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = Router();

router.use(protect);

router.get("/", getMyNotifications);
router.patch("/read-all", markAllNotificationsAsRead);
router.patch("/:notificationId/read", markNotificationAsRead);
router.delete("/:notificationId", deleteNotification);

export default router;
