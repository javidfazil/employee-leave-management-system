import Leave from "../models/Leave.js";

const toUtcDate = (date) => new Date(`${date}T00:00:00.000Z`);

const calculateLeaveDuration = (startDate, endDate) =>
  Math.round((toUtcDate(endDate) - toUtcDate(startDate)) / 86_400_000) + 1;

const getEmployeesOnLeaveToday = () => {
  const today = new Date();
  const todayStart = new Date(Date.UTC(
    today.getUTCFullYear(),
    today.getUTCMonth(),
    today.getUTCDate()
  ));

  return Leave.find({
    status: "Approved",
    startDate: { $lte: todayStart },
    endDate: { $gte: todayStart },
  })
    .populate("employee", "name email")
    .sort({ startDate: 1 });
};

export { calculateLeaveDuration, getEmployeesOnLeaveToday, toUtcDate };
