import Leave from "../models/Leave.js";
import Notification from "../models/Notification.js";
import User from "../models/User.js";

const pendingStatuses = ["Pending", "Approved"];

const toUtcDate = (date) => new Date(`${date}T00:00:00.000Z`);

const calculateTotalDays = (startDate, endDate) =>
  Math.round((toUtcDate(endDate) - toUtcDate(startDate)) / 86_400_000) + 1;

const createManagerNotifications = async (message) => {
  const managers = await User.find({ role: "manager" }).select("_id").lean();

  if (managers.length > 0) {
    await Notification.insertMany(
      managers.map(({ _id }) => ({ user: _id, message }))
    );
  }
};

const createUserNotification = async (user, message) => {
  await Notification.create({ user, message });
};

const notifySafely = async (createNotification) => {
  try {
    await createNotification();
  } catch (error) {
    console.error("Failed to create notification:", error.message);
  }
};

const requireManager = (req, res, next) => {
  if (req.user.role !== "manager") {
    return res.status(403).json({ message: "Manager access is required" });
  }

  next();
};

const applyLeave = async (req, res, next) => {
  try {
    const { leaveType, startDate, endDate, reason } = req.body;
    const normalizedStartDate = toUtcDate(startDate);
    const normalizedEndDate = toUtcDate(endDate);
    const totalDays = calculateTotalDays(startDate, endDate);

    const overlappingLeave = await Leave.exists({
      employee: req.user._id,
      status: { $in: pendingStatuses },
      startDate: { $lte: normalizedEndDate },
      endDate: { $gte: normalizedStartDate },
    });

    if (overlappingLeave) {
      return res.status(409).json({
        message: "Leave dates overlap with an existing pending or approved leave",
      });
    }

    const [user, pendingLeaves] = await Promise.all([
      User.findById(req.user._id).select("leaveBalance"),
      Leave.find({
        employee: req.user._id,
        leaveType,
        status: "Pending",
      })
        .select("totalDays")
        .lean(),
    ]);

    const reservedDays = pendingLeaves.reduce(
      (sum, leave) => sum + leave.totalDays,
      0
    );
    const availableDays = user.leaveBalance[leaveType] - reservedDays;

    if (totalDays > availableDays) {
      return res.status(400).json({
        message: `Insufficient ${leaveType} leave balance`,
      });
    }

    const leave = await Leave.create({
      employee: req.user._id,
      leaveType,
      startDate: normalizedStartDate,
      endDate: normalizedEndDate,
      totalDays,
      reason: reason.trim(),
    });

    await notifySafely(() =>
      createManagerNotifications(
        `${req.user.name} applied for ${totalDays} day(s) of ${leaveType} leave`
      )
    );

    return res.status(201).json({ leave });
  } catch (error) {
    next(error);
  }
};

const getMyLeaves = async (req, res, next) => {
  try {
    const leaves = await Leave.find({ employee: req.user._id }).sort({
      createdAt: -1,
    });

    res.status(200).json({ leaves });
  } catch (error) {
    next(error);
  }
};

const getAllLeaves = async (req, res, next) => {
  try {
    const leaves = await Leave.find()
      .populate("employee", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({ leaves });
  } catch (error) {
    next(error);
  }
};

const approveLeave = async (req, res, next) => {
  try {
    const managerRemark = req.body.managerRemark?.trim();
    const leave = await Leave.findOneAndUpdate(
      { _id: req.params.leaveId, status: "Pending" },
      {
        $set: {
          status: "Approved",
          ...(managerRemark && { managerRemark }),
        },
      },
      { new: true }
    );

    if (!leave) {
      return res.status(409).json({
        message: "Only pending leaves can be approved",
      });
    }

    const balancePath = `leaveBalance.${leave.leaveType}`;
    const updatedUser = await User.findOneAndUpdate(
      { _id: leave.employee, [balancePath]: { $gte: leave.totalDays } },
      { $inc: { [balancePath]: -leave.totalDays } },
      { new: true }
    );

    if (!updatedUser) {
      await Leave.findOneAndUpdate(
        { _id: leave._id, status: "Approved" },
        { $set: { status: "Pending" }, $unset: { managerRemark: "" } }
      );

      return res.status(400).json({
        message: `Insufficient ${leave.leaveType} leave balance`,
      });
    }

    await notifySafely(() =>
      createUserNotification(
        leave.employee,
        `Your ${leave.leaveType} leave request has been approved`
      )
    );

    return res.status(200).json({ leave });
  } catch (error) {
    next(error);
  }
};

const rejectLeave = async (req, res, next) => {
  try {
    const managerRemark = req.body.managerRemark?.trim();
    const leave = await Leave.findOneAndUpdate(
      { _id: req.params.leaveId, status: "Pending" },
      {
        $set: {
          status: "Rejected",
          ...(managerRemark && { managerRemark }),
        },
      },
      { new: true }
    );

    if (!leave) {
      return res.status(409).json({
        message: "Only pending leaves can be rejected",
      });
    }

    await notifySafely(() =>
      createUserNotification(
        leave.employee,
        `Your ${leave.leaveType} leave request has been rejected`
      )
    );

    return res.status(200).json({ leave });
  } catch (error) {
    next(error);
  }
};

const cancelLeave = async (req, res, next) => {
  try {
    const leave = await Leave.findOne({
      _id: req.params.leaveId,
      employee: req.user._id,
    });

    if (!leave) {
      return res.status(404).json({ message: "Leave request not found" });
    }

    if (!["Pending", "Approved"].includes(leave.status)) {
      return res.status(409).json({
        message: "Only pending or approved leaves can be cancelled",
      });
    }

    const previousStatus = leave.status;
    const cancelledLeave = await Leave.findOneAndUpdate(
      {
        _id: leave._id,
        employee: req.user._id,
        status: previousStatus,
      },
      { $set: { status: "Cancelled" } },
      { new: true }
    );

    if (!cancelledLeave) {
      return res.status(409).json({
        message: "Leave status changed before it could be cancelled",
      });
    }

    if (previousStatus === "Approved") {
      const balancePath = `leaveBalance.${cancelledLeave.leaveType}`;
      await User.findByIdAndUpdate(cancelledLeave.employee, {
        $inc: { [balancePath]: cancelledLeave.totalDays },
      });
    }

    await notifySafely(() =>
      createManagerNotifications(
        `${req.user.name} cancelled a ${cancelledLeave.leaveType} leave request`
      )
    );

    return res.status(200).json({ leave: cancelledLeave });
  } catch (error) {
    next(error);
  }
};

export {
  applyLeave,
  approveLeave,
  cancelLeave,
  getAllLeaves,
  getMyLeaves,
  rejectLeave,
  requireManager,
};
