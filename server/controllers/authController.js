import { authenticateUser, formatUser, registerUser } from "../services/authService.js";

const register = async (req, res, next) => {
  try {
    const authentication = await registerUser(req.body);
    return res.status(201).json(authentication);
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const authentication = await authenticateUser(req.body);
    return res.status(200).json(authentication);
  } catch (error) {
    next(error);
  }
};

const getCurrentUser = (req, res) => {
  res.status(200).json({ user: formatUser(req.user) });
};

export { getCurrentUser, login, register };
