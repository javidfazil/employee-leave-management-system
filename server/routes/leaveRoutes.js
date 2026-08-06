import { Router } from "express";

import {
  applyLeave,
  approveLeave,
  cancelLeave,
  getAllLeaves,
  getMyLeaves,
  rejectLeave,
} from "../controllers/leaveController.js";
import { protect } from "../middleware/authMiddleware.js";
import { allowRoles } from "../middleware/roleMiddleware.js";
import {
  validateApplyLeave,
  validateLeaveId,
  validateManagerRemark,
} from "../validations/leaveValidation.js";

const router = Router();

router.use(protect);

router.post("/", validateApplyLeave, applyLeave);
router.get("/my", getMyLeaves);
router.get("/", allowRoles("manager"), getAllLeaves);
router.patch(
  "/:leaveId/approve",
  allowRoles("manager"),
  validateLeaveId,
  validateManagerRemark,
  approveLeave
);
router.patch(
  "/:leaveId/reject",
  allowRoles("manager"),
  validateLeaveId,
  validateManagerRemark,
  rejectLeave
);
router.patch("/:leaveId/cancel", validateLeaveId, cancelLeave);

export default router;
