// Seeds the database with a manager, a few employees, and sample leave
// requests/notifications so the app can be explored without manual signup.
// Run with: npm run seed  (drops existing users/leaves/notifications first)
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import mongoose from "mongoose";

import connectDB from "../config/db.js";
import Leave from "../models/Leave.js";
import Notification from "../models/Notification.js";
import User from "../models/User.js";
import { LEAVE_STATUS, ROLES } from "../utils/constants.js";
import calculateLeaveDays, { toUtcDate } from "../utils/calculateLeaveDays.js";

dotenv.config();

const SALT_ROUNDS = 12;
const DEFAULT_PASSWORD = "Password123!";

const daysFromToday = (offset) => {
  const date = new Date();
  date.setUTCDate(date.getUTCDate() + offset);
  return date.toISOString().slice(0, 10);
};

const seed = async () => {
  await connectDB();

  console.log("Clearing existing users, leaves, and notifications...");
  await Promise.all([User.deleteMany({}), Leave.deleteMany({}), Notification.deleteMany({})]);

  const hashedPassword = await bcrypt.hash(DEFAULT_PASSWORD, SALT_ROUNDS);

  console.log("Creating users...");
  const manager = await User.create({
    name: "Priya Manager",
    email: "manager@example.com",
    password: hashedPassword,
    role: ROLES.MANAGER,
  });

  const [alice, bob] = await User.insertMany([
    { name: "Alice Employee", email: "alice@example.com", password: hashedPassword, role: ROLES.EMPLOYEE },
    { name: "Bob Employee", email: "bob@example.com", password: hashedPassword, role: ROLES.EMPLOYEE },
  ]);

  console.log("Creating sample leave requests...");

  const pendingStart = daysFromToday(5);
  const pendingEnd = daysFromToday(6);
  const approvedStart = daysFromToday(-1);
  const approvedEnd = daysFromToday(1); // spans "today" so the manager dashboard shows it
  const rejectedStart = daysFromToday(10);
  const rejectedEnd = daysFromToday(10);

  const pendingLeave = await Leave.create({
    employee: alice._id,
    leaveType: "casual",
    startDate: toUtcDate(pendingStart),
    endDate: toUtcDate(pendingEnd),
    totalDays: calculateLeaveDays(pendingStart, pendingEnd),
    reason: "Family function",
    status: LEAVE_STATUS.PENDING,
  });

  const approvedLeave = await Leave.create({
    employee: bob._id,
    leaveType: "sick",
    startDate: toUtcDate(approvedStart),
    endDate: toUtcDate(approvedEnd),
    totalDays: calculateLeaveDays(approvedStart, approvedEnd),
    reason: "Fever",
    status: LEAVE_STATUS.APPROVED,
    managerRemark: "Get well soon",
  });
  await User.findByIdAndUpdate(bob._id, { $inc: { "leaveBalance.sick": -approvedLeave.totalDays } });

  await Leave.create({
    employee: alice._id,
    leaveType: "earned",
    startDate: toUtcDate(rejectedStart),
    endDate: toUtcDate(rejectedEnd),
    totalDays: calculateLeaveDays(rejectedStart, rejectedEnd),
    reason: "Trip",
    status: LEAVE_STATUS.REJECTED,
    managerRemark: "Team is short-staffed that week",
  });

  console.log("Creating sample notifications...");
  await Notification.insertMany([
    { user: manager._id, message: `${alice.name} applied for ${pendingLeave.totalDays} day(s) of casual leave` },
    { user: bob._id, message: "Your sick leave request has been approved" },
    { user: alice._id, message: "Your earned leave request has been rejected", isRead: true },
  ]);

  console.log("\nSeed complete. Login with:");
  console.log(`  Manager  -> manager@example.com / ${DEFAULT_PASSWORD}`);
  console.log(`  Employee -> alice@example.com   / ${DEFAULT_PASSWORD}`);
  console.log(`  Employee -> bob@example.com     / ${DEFAULT_PASSWORD}`);

  await mongoose.connection.close();
  process.exit(0);
};

seed().catch((error) => {
  console.error("Seeding failed:", error);
  process.exit(1);
});
