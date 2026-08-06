import { Router } from "express";

import {
  approveRequest,
  getDashboard,
  getEmployeeHistory,
  getEmployees,
  getEmployeesOnLeaveToday,
  getRequestById,
  getRequests,
  rejectRequest,
} from "../controllers/managerController.js";
import { protect } from "../middleware/authMiddleware.js";
import { allowRoles } from "../middleware/roleMiddleware.js";
import { validateLeaveId, validateManagerRemark } from "../validations/leaveValidation.js";

const router = Router();

router.use(protect, allowRoles("manager"));

router.get("/dashboard", getDashboard);

router.get("/requests", getRequests);
router.get("/requests/:leaveId", validateLeaveId, getRequestById);
router.put("/requests/:leaveId/approve", validateLeaveId, validateManagerRemark, approveRequest);
router.put("/requests/:leaveId/reject", validateLeaveId, validateManagerRemark, rejectRequest);

router.get("/employees", getEmployees);
router.get("/on-leave-today", getEmployeesOnLeaveToday);
router.get("/employees/:employeeId/leaves", getEmployeeHistory);

export default router;
