import { Router } from "express";

import {
  applyLeave,
  cancelLeave,
  getMyLeaves,
} from "../controllers/leaveController.js";
import { protect } from "../middleware/authMiddleware.js";
import { allowRoles } from "../middleware/roleMiddleware.js";
import {
  validateApplyLeave,
  validateLeaveListQuery,
  validateLeaveId,
} from "../validations/leaveValidation.js";

const router = Router();

router.use(protect);

// Employee leave actions intentionally live outside the manager portal.
router.post("/", allowRoles("employee"), validateApplyLeave, applyLeave);
router.get("/my", allowRoles("employee"), validateLeaveListQuery, getMyLeaves);
router.patch("/:leaveId/cancel", allowRoles("employee"), validateLeaveId, cancelLeave);

export default router;
