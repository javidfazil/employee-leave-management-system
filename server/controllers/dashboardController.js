import Leave from "../models/Leave.js";
import User from "../models/User.js";
import { getEmployeesOnLeaveToday } from "../services/leaveService.js";

const getEmployeeDashboard = async (req, res, next) => {
  try {
    const [pendingLeaves, approvedLeaves, rejectedLeaves, recentLeaves] =
      await Promise.all([
        Leave.countDocuments({ employee: req.user._id, status: "Pending" }),
        Leave.countDocuments({ employee: req.user._id, status: "Approved" }),
        Leave.countDocuments({ employee: req.user._id, status: "Rejected" }),
        Leave.find({ employee: req.user._id }).sort({ createdAt: -1 }).limit(5),
      ]);

    const { casual, sick, earned } = req.user.leaveBalance;

    res.status(200).json({
      leaveBalance: {
        casual,
        sick,
        earned,
        total: casual + sick + earned,
      },
      leaveCounts: {
        pending: pendingLeaves,
        approved: approvedLeaves,
        rejected: rejectedLeaves,
      },
      recentLeaves,
    });
  } catch (error) {
    next(error);
  }
};

const getManagerDashboard = async (req, res, next) => {
  try {
    const [
      totalEmployees,
      pendingRequests,
      approvedRequests,
      rejectedRequests,
      recentLeaves,
      employeesOnLeaveToday,
    ] = await Promise.all([
      User.countDocuments({ role: "employee" }),
      Leave.countDocuments({ status: "Pending" }),
      Leave.countDocuments({ status: "Approved" }),
      Leave.countDocuments({ status: "Rejected" }),
      Leave.find()
        .populate("employee", "name email")
        .sort({ createdAt: -1 })
        .limit(5),
      getEmployeesOnLeaveToday(),
    ]);

    res.status(200).json({
      totals: {
        employees: totalEmployees,
        pendingRequests,
        approvedRequests,
        rejectedRequests,
      },
      recentLeaves,
      employeesOnLeaveToday,
    });
  } catch (error) {
    next(error);
  }
};

export { getEmployeeDashboard, getManagerDashboard };
