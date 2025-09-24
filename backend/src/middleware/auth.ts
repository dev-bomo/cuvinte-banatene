import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { userModel } from "../models/User";
import { User } from "../../../shared/types";

const JWT_SECRET =
  process.env.JWT_SECRET || "your-secret-key-change-in-production";

export interface AuthenticatedRequest extends Request {
  user?: User;
}

export const authenticateToken = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({
      message: "Access token required",
      status: 401,
      timestamp: new Date().toISOString(),
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    const user = await userModel.getById(decoded.userId);
    req.user = user;
    next();
  } catch (error) {
    return res.status(403).json({
      message: "Invalid or expired token",
      status: 403,
      timestamp: new Date().toISOString(),
    });
  }
};

export const requireContributor = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  if (
    !req.user ||
    (req.user.role !== "admin" && req.user.role !== "contributor")
  ) {
    return res.status(403).json({
      message: "Contributor access required",
      status: 403,
      timestamp: new Date().toISOString(),
    });
  }
  next();
};

export const requireEmailVerification = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  if (!req.user) {
    return res.status(401).json({
      message: "Authentication required",
      status: 401,
      timestamp: new Date().toISOString(),
    });
  }

  if (!req.user.emailVerified) {
    return res.status(403).json({
      message: "Email verification required to perform this action",
      status: 403,
      timestamp: new Date().toISOString(),
    });
  }

  next();
};

export const requireAdmin = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({
      message: "Admin access required",
      status: 403,
      timestamp: new Date().toISOString(),
    });
  }
  next();
};

export const generateToken = (userId: string): string => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: "24h" });
};
