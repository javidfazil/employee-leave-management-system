import asyncHandler from "../middleware/asyncHandler.js";
import {
  decideManagerRequest,
  getManagerEmployeeHistory,
  getManagerEmployees,
  getManagerEmployeesOnLeaveToday,
  getManagerRequestById,
  getManagerRequests,
  getManagerSummary,
} from "../services/managerService.js";

const getDashboard = asyncHandler(async (_req, res) => {
  res.status(200).json({ summary: await getManagerSummary() });
});

const getRequests = asyncHandler(async (req, res) => {
  res.status(200).json({ requests: await getManagerRequests(req.query.status) });
});

const getRequestById = asyncHandler(async (req, res) => {
  res.status(200).json({ request: await getManagerRequestById(req.params.leaveId) });
});

const approveRequest = asyncHandler(async (req, res) => {
  const leave = await decideManagerRequest(req.params.leaveId, "approve", req.body.managerRemark);
  res.status(200).json({ leave });
});

const rejectRequest = asyncHandler(async (req, res) => {
  const leave = await decideManagerRequest(req.params.leaveId, "reject", req.body.managerRemark);
  res.status(200).json({ leave });
});

const getEmployees = asyncHandler(async (_req, res) => {
  res.status(200).json({ employees: await getManagerEmployees() });
});

const getEmployeesOnLeaveToday = asyncHandler(async (_req, res) => {
  res.status(200).json({ employees: await getManagerEmployeesOnLeaveToday() });
});

const getEmployeeHistory = asyncHandler(async (req, res) => {
  res.status(200).json(await getManagerEmployeeHistory(req.params.employeeId));
});

export {
  approveRequest,
  getDashboard,
  getEmployeeHistory,
  getEmployees,
  getEmployeesOnLeaveToday,
  getRequestById,
  getRequests,
  rejectRequest,
};
