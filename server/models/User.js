import mongoose from "mongoose";

const leaveBalanceSchema = new mongoose.Schema(
  {
    casual: {
      type: Number,
      default: 12,
    },
    sick: {
      type: Number,
      default: 8,
    },
    earned: {
      type: Number,
      default: 15,
    },
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["employee", "manager"],
      default: "employee",
    },
    department: {
      type: String,
      trim: true,
      default: "",
    },
    leaveBalance: {
      type: leaveBalanceSchema,
      default: () => ({}),
    },
  },
  { timestamps: true }
);

// Managers are approvers, not leave-takers — they never carry a leave balance.
userSchema.pre("validate", function stripManagerLeaveBalance(next) {
  if (this.role === "manager") {
    this.leaveBalance = undefined;
  }
  next();
});

const User = mongoose.model("User", userSchema);

export default User;
