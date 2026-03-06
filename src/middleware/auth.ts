import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt";
import { UserModel } from "../models/User";

export interface AuthRequest extends Request {
  user?: {
    userId: string;
    email: string;
    role: string;
  };
}

export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");

    if (!token) {
      res.status(401).json({ success: false, message: "No token provided" });
      return;
    }

    let decoded;
    try {
      decoded = verifyToken(token);
    } catch (error) {
      res.status(401).json({ success: false, message: "Invalid or expired token" });
      return;
    }

    let user;
    try {
      user = await UserModel.findById(decoded.userId);
    } catch (error) {
      console.error("Database error in authentication:", error);
      res.status(500).json({ success: false, message: "Authentication service error" });
      return;
    }

    if (!user) {
      res.status(401).json({ success: false, message: "User not found" });
      return;
    }

    req.user = {
      userId: user.id,
      email: user.email,
      role: user.role,
    };

    next();
  } catch (error) {
    console.error("Unexpected error in authentication:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const authorize = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ success: false, message: "Unauthorized" });
      return;
    }

    if (!roles.includes(req.user.role)) {
      res.status(403).json({ success: false, message: "Forbidden" });
      return;
    }

    next();
  };
};
