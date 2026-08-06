import { Router } from "express";

import {
  getCurrentUser,
  login,
  register,
} from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";
import { validateLogin, validateRegister } from "../validations/authValidation.js";

const router = Router();

router.post("/register", validateRegister, register);
router.post("/login", validateLogin, login);
router.get("/me", protect, getCurrentUser);

export default router;
