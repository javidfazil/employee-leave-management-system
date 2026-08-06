import { Router } from "express";

import {
  getEmployeeDashboard,
  getManagerDashboard,
} from "../controllers/dashboardController.js";
import { protect } from "../middleware/authMiddleware.js";
import { allowRoles } from "../middleware/roleMiddleware.js";

const router = Router();

router.use(protect);

router.get("/employee", allowRoles("employee"), getEmployeeDashboard);
router.get("/manager", allowRoles("manager"), getManagerDashboard);

export default router;
