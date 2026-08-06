import { Router } from "express";

import {
  getEmployeeDashboard,
  getManagerDashboard,
} from "../controllers/dashboardController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = Router();

const requireManager = (req, res, next) => {
  if (req.user.role !== "manager") {
    return res.status(403).json({ message: "Manager access is required" });
  }

  next();
};

const requireEmployee = (req, res, next) => {
  if (req.user.role !== "employee") {
    return res.status(403).json({ message: "Employee access is required" });
  }

  next();
};

router.use(protect);

router.get("/employee", requireEmployee, getEmployeeDashboard);
router.get("/manager", requireManager, getManagerDashboard);

export default router;
