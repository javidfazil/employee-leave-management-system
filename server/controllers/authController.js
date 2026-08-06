import asyncHandler from "../middleware/asyncHandler.js";
import { authenticateUser, formatUser, registerUser } from "../services/authService.js";

const register = asyncHandler(async (req, res) => {
  const authentication = await registerUser(req.body);
  res.status(201).json(authentication);
});

const login = asyncHandler(async (req, res) => {
  const authentication = await authenticateUser(req.body);
  res.status(200).json(authentication);
});

const getCurrentUser = (req, res) => {
  res.status(200).json({ user: formatUser(req.user) });
};

export { getCurrentUser, login, register };
