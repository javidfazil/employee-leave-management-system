import Leave from "../models/Leave.js";
import { LEAVE_STATUS } from "../utils/constants.js";
import { decideLeave } from "./leaveService.js";

const requestStatuses = [LEAVE_STATUS.PENDING, LEAVE_STATUS.APPROVED, LEAVE_STATUS.REJECTED];

const getManagerSummary = async () => {
  const [pending, approved, rejected] = await Promise.all([
    Leave.countDocuments({ status: LEAVE_STATUS.PENDING }),
    Leave.countDocuments({ status: LEAVE_STATUS.APPROVED }),
    Leave.countDocuments({ status: LEAVE_STATUS.REJECTED }),
  ]);

  return { pending, approved, rejected };
};

const getManagerRequests = async (status) => {
  if (!requestStatuses.includes(status)) {
    const error = new Error("Invalid request status");
    error.statusCode = 400;
    throw error;
  }

  return Leave.find({ status })
    .populate("employee", "name email")
    .sort(status === LEAVE_STATUS.PENDING ? { createdAt: -1 } : { decisionDate: -1, updatedAt: -1 });
};

const decideManagerRequest = (leaveId, decision, managerRemark) =>
  decideLeave(leaveId, decision, managerRemark);

export { decideManagerRequest, getManagerRequests, getManagerSummary };
