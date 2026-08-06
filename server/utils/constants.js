const LEAVE_TYPES = ["casual", "sick", "earned"];

const LEAVE_STATUS = {
  PENDING: "Pending",
  APPROVED: "Approved",
  REJECTED: "Rejected",
  CANCELLED: "Cancelled",
};

const ACTIVE_LEAVE_STATUSES = [LEAVE_STATUS.PENDING, LEAVE_STATUS.APPROVED];

const ROLES = {
  EMPLOYEE: "employee",
  MANAGER: "manager",
};

const DEFAULT_LEAVE_BALANCE = {
  casual: 12,
  sick: 8,
  earned: 15,
};

export {
  ACTIVE_LEAVE_STATUSES,
  DEFAULT_LEAVE_BALANCE,
  LEAVE_STATUS,
  LEAVE_TYPES,
  ROLES,
};
