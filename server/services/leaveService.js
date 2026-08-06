import Leave from "../models/Leave.js";
import User from "../models/User.js";
import { ACTIVE_LEAVE_STATUSES, LEAVE_STATUS } from "../utils/constants.js";
import calculateLeaveDays, { toUtcDate } from "../utils/calculateLeaveDays.js";
import { notifyManagers, notifySafely, notifyUser } from "./notificationService.js";

const conflictError = (message) => {
  const error = new Error(message);
  error.statusCode = 409;
  return error;
};

const badRequestError = (message) => {
  const error = new Error(message);
  error.statusCode = 400;
  return error;
};

const notFoundError = (message) => {
  const error = new Error(message);
  error.statusCode = 404;
  return error;
};

const applyForLeave = async (employee, { leaveType, startDate, endDate, reason }) => {
  const normalizedStartDate = toUtcDate(startDate);
  const normalizedEndDate = toUtcDate(endDate);
  const totalDays = calculateLeaveDays(startDate, endDate);

  const overlappingLeave = await Leave.exists({
    employee: employee._id,
    status: { $in: ACTIVE_LEAVE_STATUSES },
    startDate: { $lte: normalizedEndDate },
    endDate: { $gte: normalizedStartDate },
  });

  if (overlappingLeave) {
    throw conflictError("Leave dates overlap with an existing pending or approved leave");
  }

  const [user, pendingLeaves] = await Promise.all([
    User.findById(employee._id).select("leaveBalance"),
    Leave.find({ employee: employee._id, leaveType, status: LEAVE_STATUS.PENDING })
      .select("totalDays")
      .lean(),
  ]);

  const reservedDays = pendingLeaves.reduce((sum, leave) => sum + leave.totalDays, 0);
  const availableDays = user.leaveBalance[leaveType] - reservedDays;

  if (totalDays > availableDays) {
    throw badRequestError(`Insufficient ${leaveType} leave balance`);
  }

  const leave = await Leave.create({
    employee: employee._id,
    leaveType,
    startDate: normalizedStartDate,
    endDate: normalizedEndDate,
    totalDays,
    reason: reason.trim(),
  });

  await notifySafely(() =>
    notifyManagers(`${employee.name} applied for ${totalDays} day(s) of ${leaveType} leave`)
  );

  return leave;
};

const getLeavesForEmployee = (employeeId) =>
  Leave.find({ employee: employeeId }).sort({ createdAt: -1 });

const getAllLeaveRequests = () =>
  Leave.find().populate("employee", "name email").sort({ createdAt: -1 });

const decideLeave = async (leaveId, decision, managerRemark) => {
  const status = decision === "approve" ? LEAVE_STATUS.APPROVED : LEAVE_STATUS.REJECTED;
  const trimmedRemark = managerRemark?.trim();

  const leave = await Leave.findOneAndUpdate(
    { _id: leaveId, status: LEAVE_STATUS.PENDING },
    { $set: { status, ...(trimmedRemark && { managerRemark: trimmedRemark }) } },
    { new: true }
  );

  if (!leave) {
    throw conflictError(`Only pending leaves can be ${decision}d`);
  }

  if (status === LEAVE_STATUS.APPROVED) {
    const balancePath = `leaveBalance.${leave.leaveType}`;
    const updatedUser = await User.findOneAndUpdate(
      { _id: leave.employee, [balancePath]: { $gte: leave.totalDays } },
      { $inc: { [balancePath]: -leave.totalDays } },
      { new: true }
    );

    if (!updatedUser) {
      // Balance changed between the pending check and now — roll the approval back.
      await Leave.findOneAndUpdate(
        { _id: leave._id, status: LEAVE_STATUS.APPROVED },
        { $set: { status: LEAVE_STATUS.PENDING }, $unset: { managerRemark: "" } }
      );

      throw badRequestError(`Insufficient ${leave.leaveType} leave balance`);
    }
  }

  await notifySafely(() =>
    notifyUser(leave.employee, `Your ${leave.leaveType} leave request has been ${status.toLowerCase()}`)
  );

  return leave;
};

const cancelLeaveForEmployee = async (employeeId, employeeName, leaveId) => {
  const leave = await Leave.findOne({ _id: leaveId, employee: employeeId });

  if (!leave) {
    throw notFoundError("Leave request not found");
  }

  if (![LEAVE_STATUS.PENDING, LEAVE_STATUS.APPROVED].includes(leave.status)) {
    throw conflictError("Only pending or approved leaves can be cancelled");
  }

  const previousStatus = leave.status;
  const cancelledLeave = await Leave.findOneAndUpdate(
    { _id: leave._id, employee: employeeId, status: previousStatus },
    { $set: { status: LEAVE_STATUS.CANCELLED } },
    { new: true }
  );

  if (!cancelledLeave) {
    throw conflictError("Leave status changed before it could be cancelled");
  }

  if (previousStatus === LEAVE_STATUS.APPROVED) {
    const balancePath = `leaveBalance.${cancelledLeave.leaveType}`;
    await User.findByIdAndUpdate(cancelledLeave.employee, { $inc: { [balancePath]: cancelledLeave.totalDays } });
  }

  await notifySafely(() =>
    notifyManagers(`${employeeName} cancelled a ${cancelledLeave.leaveType} leave request`)
  );

  return cancelledLeave;
};

const getEmployeesOnLeaveToday = () => {
  const todayStart = toUtcDate(new Date().toISOString().slice(0, 10));
  const todayEnd = new Date(todayStart.getTime() + 86_400_000 - 1);

  return Leave.find({
    status: LEAVE_STATUS.APPROVED,
    startDate: { $lte: todayEnd },
    endDate: { $gte: todayStart },
  })
    .populate("employee", "name email")
    .sort({ startDate: 1 });
};

export {
  applyForLeave,
  cancelLeaveForEmployee,
  decideLeave,
  getAllLeaveRequests,
  getEmployeesOnLeaveToday,
  getLeavesForEmployee,
};
