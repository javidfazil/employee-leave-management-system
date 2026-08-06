import { Router } from "express";

import { approveRequest, getDashboard, getRequests, rejectRequest } from "../controllers/managerController.js";
import { protect } from "../middleware/authMiddleware.js";
import { allowRoles } from "../middleware/roleMiddleware.js";
import { validateLeaveId, validateManagerRemark } from "../validations/leaveValidation.js";

const router = Router();

router.use(protect, allowRoles("manager"));
router.get("/dashboard", getDashboard);
router.get("/requests", getRequests);
router.patch("/requests/:leaveId/approve", validateLeaveId, validateManagerRemark, approveRequest);
router.patch("/requests/:leaveId/reject", validateLeaveId, validateManagerRemark, rejectRequest);

export default router;
