import Leave from "../models/Leave.js";
import { LEAVE_STATUS } from "../utils/constants.js";

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
    pendingRequests,
    approvedRequests,
    rejectedRequests,
    pendingLeaves,
    approvedLeaves,
    rejectedLeaves,
  ] = await Promise.all([
    Leave.countDocuments({ status: LEAVE_STATUS.PENDING }),
    Leave.countDocuments({ status: LEAVE_STATUS.APPROVED }),
    Leave.countDocuments({ status: LEAVE_STATUS.REJECTED }),
    Leave.find({ status: LEAVE_STATUS.PENDING }).populate("employee", "name email").sort({ createdAt: -1 }),
    Leave.find({ status: LEAVE_STATUS.APPROVED }).populate("employee", "name email").sort({ decisionDate: -1, updatedAt: -1 }),
    Leave.find({ status: LEAVE_STATUS.REJECTED }).populate("employee", "name email").sort({ decisionDate: -1, updatedAt: -1 }),
  ]);

  return {
    totals: {
      pendingRequests,
      approvedRequests,
      rejectedRequests,
    },
    pendingLeaves,
    approvedLeaves,
    rejectedLeaves,
  };
};

export { getEmployeeDashboardData, getManagerDashboardData };
