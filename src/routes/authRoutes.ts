import express from "express";
import {
  login,
  register,
  getMe,
} from "../controllers/authController";
import { authenticate } from "../middleware/auth";
import { loginValidator, registerValidator } from "../validators/authValidator";
import { validate } from "../middleware/validation";

const router = express.Router();

router.post("/login", validate(loginValidator), login);
router.post("/register", validate(registerValidator), register);
router.get("/me", authenticate, getMe);

export default router;

