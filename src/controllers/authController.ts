import { Response } from "express";
import { AuthRequest } from "../middleware/auth";
import { UserModel } from "../models/User";
import { generateToken } from "../utils/jwt";
import { asyncHandler, AppError } from "../middleware/errorHandler";

export const login = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { email, password } = req.body;

  const user = await UserModel.findByEmail(email);
  if (!user) {
    throw new AppError("Invalid email or password", 401);
  }

  const isPasswordValid = await UserModel.comparePassword(user, password);
  if (!isPasswordValid) {
    throw new AppError("Invalid email or password", 401);
  }

  const token = generateToken({
    userId: user.id,
    email: user.email,
    role: user.role,
  });

  res.status(200).json({
    success: true,
    message: "Login successful",
    token,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    },
  });
});

export const register = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { email, password, name } = req.body;

  const existingUser = await UserModel.findByEmail(email);
  if (existingUser) {
    throw new AppError("User already exists", 400);
  }

  const user = await UserModel.create({
    email,
    password,
    name,
    role: "admin",
  });

  const token = generateToken({
    userId: user.id,
    email: user.email,
    role: user.role,
  });

  res.status(201).json({
    success: true,
    message: "User created successfully",
    token,
    user,
  });
});

export const getMe = asyncHandler(async (req: AuthRequest, res: Response) => {
  const user = await UserModel.findById(req.user?.userId || "");
  if (!user) {
    throw new AppError("User not found", 404);
  }

  res.status(200).json({
    success: true,
    user,
  });
});
