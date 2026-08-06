const MS_PER_DAY = 86_400_000;

const toUtcDate = (date) => new Date(`${date}T00:00:00.000Z`);

const isPastDate = (date) => {
  const today = new Date();
  const todayUtc = new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()));

  return toUtcDate(date) < todayUtc;
};

const calculateLeaveDays = (startDate, endDate) =>
  Math.round((toUtcDate(endDate) - toUtcDate(startDate)) / MS_PER_DAY) + 1;

export { isPastDate, toUtcDate };
export default calculateLeaveDays;
