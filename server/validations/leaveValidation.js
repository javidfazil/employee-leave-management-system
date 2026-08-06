import { LEAVE_TYPES } from "../utils/constants.js";
import { isPastDate } from "../utils/calculateLeaveDays.js";

const leaveTypes = LEAVE_TYPES;
const objectIdPattern = /^[a-f\d]{24}$/i;
const datePattern = /^\d{4}-\d{2}-\d{2}$/;

const sendValidationError = (res, message) =>
  res.status(400).json({ message });

const isValidDate = (value) =>
  typeof value === "string" &&
  datePattern.test(value) &&
  !Number.isNaN(new Date(`${value}T00:00:00.000Z`).getTime());

const validateApplyLeave = (req, res, next) => {
  const { leaveType, startDate, endDate, reason } = req.body;

  if (!leaveTypes.includes(leaveType)) {
    return sendValidationError(res, "Leave type must be casual, sick, or earned");
  }

  if (!isValidDate(startDate) || !isValidDate(endDate)) {
    return sendValidationError(res, "Start date and end date must be valid dates in YYYY-MM-DD format");
  }

  if (new Date(startDate) > new Date(endDate)) {
    return sendValidationError(res, "End date cannot be before start date");
  }

  if (isPastDate(startDate)) {
    return sendValidationError(res, "Leave cannot start on a past date");
  }
  if (typeof reason !== "string" || reason.trim().length === 0) {
    return sendValidationError(res, "Reason is required");
  }

  if (reason.trim().length > 1000) {
    return sendValidationError(res, "Reason cannot exceed 1000 characters");
  }

  next();
};

const validateLeaveId = (req, res, next) => {
  if (!objectIdPattern.test(req.params.leaveId)) {
    return sendValidationError(res, "Invalid leave ID");
  }

  next();
};

const validateLeaveListQuery = (req, res, next) => {
  const { fromDate, toDate, page, limit } = req.query;

  if ((fromDate && !isValidDate(fromDate)) || (toDate && !isValidDate(toDate))) {
    return sendValidationError(res, "Date filters must use YYYY-MM-DD format");
  }

  if (fromDate && toDate && new Date(fromDate) > new Date(toDate)) {
    return sendValidationError(res, "To date cannot be before from date");
  }

  if ((page && (!/^\d+$/.test(page) || Number(page) < 1)) || (limit && (!/^\d+$/.test(limit) || Number(limit) < 1))) {
    return sendValidationError(res, "Page and limit must be positive whole numbers");
  }

  next();
};

const validateManagerRemark = (req, res, next) => {
  const { managerRemark } = req.body;

  if (managerRemark !== undefined && typeof managerRemark !== "string") {
    return sendValidationError(res, "Manager remark must be a string");
  }

  if (managerRemark?.trim().length > 1000) {
    return sendValidationError(res, "Manager remark cannot exceed 1000 characters");
  }

  next();
};

export {
  validateApplyLeave,
  validateLeaveListQuery,
  validateLeaveId,
  validateManagerRemark,
};
