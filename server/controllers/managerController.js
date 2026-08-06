import asyncHandler from "../middleware/asyncHandler.js";
import { decideManagerRequest, getManagerRequests, getManagerSummary } from "../services/managerService.js";

const getDashboard = asyncHandler(async (_req, res) => {
  res.status(200).json({ summary: await getManagerSummary() });
});

const getRequests = asyncHandler(async (req, res) => {
  res.status(200).json({ requests: await getManagerRequests(req.query.status) });
});

const approveRequest = asyncHandler(async (req, res) => {
  const leave = await decideManagerRequest(req.params.leaveId, "approve", req.body.managerRemark);
  res.status(200).json({ leave });
});

const rejectRequest = asyncHandler(async (req, res) => {
  const leave = await decideManagerRequest(req.params.leaveId, "reject", req.body.managerRemark);
  res.status(200).json({ leave });
});

export { approveRequest, getDashboard, getRequests, rejectRequest };
