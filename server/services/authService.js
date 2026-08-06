import bcrypt from "bcryptjs";

import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";

const createServiceError = (message, statusCode) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

const formatUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  leaveBalance: user.leaveBalance,
});

const registerUser = async ({ name, email, password }) => {
  const normalizedEmail = email.trim().toLowerCase();
  const existingUser = await User.findOne({ email: normalizedEmail });

  if (existingUser) {
    throw createServiceError("An account with this email already exists", 409);
  }

  const user = await User.create({
    name: name.trim(),
    email: normalizedEmail,
    password: await bcrypt.hash(password, 12),
  });

  return { token: generateToken(user._id.toString()), user: formatUser(user) };
};

const authenticateUser = async ({ email, password }) => {
  const user = await User.findOne({ email: email.trim().toLowerCase() });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw createServiceError("Invalid email or password", 401);
  }

  return { token: generateToken(user._id.toString()), user: formatUser(user) };
};

export { authenticateUser, formatUser, registerUser };
