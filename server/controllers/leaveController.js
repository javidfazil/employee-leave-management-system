import asyncHandler from "../middleware/asyncHandler.js";
import {
  applyForLeave,
  cancelLeaveForEmployee,
  decideLeave,
  getAllLeaveRequests,
  getLeavesForEmployee,
} from "../services/leaveService.js";

const applyLeave = asyncHandler(async (req, res) => {
  const leave = await applyForLeave(req.user, req.body);
  res.status(201).json({ leave });
});

const getMyLeaves = asyncHandler(async (req, res) => {
  const leaves = await getLeavesForEmployee(req.user._id);
  res.status(200).json({ leaves });
});

const getAllLeaves = asyncHandler(async (req, res) => {
  const leaves = await getAllLeaveRequests();
  res.status(200).json({ leaves });
});

const approveLeave = asyncHandler(async (req, res) => {
  const leave = await decideLeave(req.params.leaveId, "approve", req.body.managerRemark);
  res.status(200).json({ leave });
});

const rejectLeave = asyncHandler(async (req, res) => {
  const leave = await decideLeave(req.params.leaveId, "reject", req.body.managerRemark);
  res.status(200).json({ leave });
});

const cancelLeave = asyncHandler(async (req, res) => {
  const leave = await cancelLeaveForEmployee(req.user._id, req.user.name, req.params.leaveId);
  res.status(200).json({ leave });
});

export { applyLeave, approveLeave, cancelLeave, getAllLeaves, getMyLeaves, rejectLeave };
