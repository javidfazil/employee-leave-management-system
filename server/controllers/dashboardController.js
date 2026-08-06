import asyncHandler from "../middleware/asyncHandler.js";
import { getEmployeeDashboardData, getManagerDashboardData } from "../services/dashboardService.js";

const getEmployeeDashboard = asyncHandler(async (req, res) => {
  const data = await getEmployeeDashboardData(req.user);
  res.status(200).json(data);
});

const getManagerDashboard = asyncHandler(async (req, res) => {
  const data = await getManagerDashboardData();
  res.status(200).json(data);
});

export { getEmployeeDashboard, getManagerDashboard };
