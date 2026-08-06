import Leave from "../models/Leave.js";
import User from "../models/User.js";
import { LEAVE_STATUS, ROLES } from "../utils/constants.js";
import { getEmployeesOnLeaveToday } from "./leaveService.js";

const getEmployeeDashboardData = async (user) => {
  const [pending, approved, rejected, recentLeaves] = await Promise.all([
    Leave.countDocuments({ employee: user._id, status: LEAVE_STATUS.PENDING }),
    Leave.countDocuments({ employee: user._id, status: LEAVE_STATUS.APPROVED }),
    Leave.countDocuments({ employee: user._id, status: LEAVE_STATUS.REJECTED }),
    Leave.find({ employee: user._id }).sort({ createdAt: -1 }).limit(5),
  ]);

  const { casual, sick, earned } = user.leaveBalance;

  return {
    leaveBalance: { casual, sick, earned, total: casual + sick + earned },
    leaveCounts: { pending, approved, rejected },
    recentLeaves,
  };
};

const getManagerDashboardData = async () => {
  const [
    totalEmployees,
    pendingRequests,
    approvedRequests,
    rejectedRequests,
    recentLeaves,
    employeesOnLeaveToday,
  ] = await Promise.all([
    User.countDocuments({ role: ROLES.EMPLOYEE }),
    Leave.countDocuments({ status: LEAVE_STATUS.PENDING }),
    Leave.countDocuments({ status: LEAVE_STATUS.APPROVED }),
    Leave.countDocuments({ status: LEAVE_STATUS.REJECTED }),
    Leave.find().populate("employee", "name email").sort({ createdAt: -1 }).limit(5),
    getEmployeesOnLeaveToday(),
  ]);

  return {
    totals: {
      employees: totalEmployees,
      pendingRequests,
      approvedRequests,
      rejectedRequests,
      onLeaveToday: employeesOnLeaveToday.length,
    },
    recentLeaves,
    employeesOnLeaveToday,
  };
};

export { getEmployeeDashboardData, getManagerDashboardData };
