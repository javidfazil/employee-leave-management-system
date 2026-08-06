import Leave from "../models/Leave.js";
import User from "../models/User.js";
import { LEAVE_STATUS, ROLES } from "../utils/constants.js";
import { decideLeave, getEmployeesOnLeaveToday } from "./leaveService.js";

const requestStatuses = [LEAVE_STATUS.PENDING, LEAVE_STATUS.APPROVED, LEAVE_STATUS.REJECTED];

const notFoundError = (message) => {
  const error = new Error(message);
  error.statusCode = 404;
  return error;
};

const getManagerSummary = async () => {
  const [pending, approved, rejected, onLeaveToday] = await Promise.all([
    Leave.countDocuments({ status: LEAVE_STATUS.PENDING }),
    Leave.countDocuments({ status: LEAVE_STATUS.APPROVED }),
    Leave.countDocuments({ status: LEAVE_STATUS.REJECTED }),
    getEmployeesOnLeaveToday(),
  ]);

  return { pending, approved, rejected, onLeaveToday: onLeaveToday.length };
};

const getManagerRequests = async (status) => {
  if (!requestStatuses.includes(status)) {
    const error = new Error("Invalid request status");
    error.statusCode = 400;
    throw error;
  }

  return Leave.find({ status })
    .populate("employee", "name email department")
    .sort(status === LEAVE_STATUS.PENDING ? { createdAt: -1 } : { decisionDate: -1, updatedAt: -1 });
};

// Full detail view for the "when manager clicks a request" screen —
// includes the employee's department and current leave balance alongside the request.
const getManagerRequestById = async (leaveId) => {
  const leave = await Leave.findById(leaveId).populate(
    "employee",
    "name email department leaveBalance"
  );

  if (!leave) {
    throw notFoundError("Leave request not found");
  }

  return leave;
};

const decideManagerRequest = (leaveId, decision, managerRemark) =>
  decideLeave(leaveId, decision, managerRemark);

// Employee directory — every registered employee account, newest first is not required,
// so list alphabetically for easy scanning.
const getManagerEmployees = () =>
  User.find({ role: ROLES.EMPLOYEE }).select("name email department leaveBalance createdAt").sort({ name: 1 });

const getManagerEmployeeHistory = async (employeeId) => {
  const employee = await User.findOne({ _id: employeeId, role: ROLES.EMPLOYEE }).select(
    "name email department leaveBalance createdAt"
  );

  if (!employee) {
    throw notFoundError("Employee not found");
  }

  const leaves = await Leave.find({ employee: employeeId }).sort({ createdAt: -1 });

  return { employee, leaves };
};

export {
  decideManagerRequest,
  getManagerEmployeeHistory,
  getManagerEmployees,
  getManagerRequestById,
  getManagerRequests,
  getManagerSummary,
};
