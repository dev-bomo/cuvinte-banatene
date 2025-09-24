import { Router, Request, Response } from "express";
import { userModel } from "../models/User";
import { emailService } from "../services/emailService";
import {
  generateToken,
  authenticateToken,
  AuthenticatedRequest,
} from "../middleware/auth";
import {
  LoginRequest,
  RegisterRequest,
  LoginResponse,
  EmailVerificationRequest,
  ResendVerificationRequest,
} from "../../../shared/types";

const router = Router();

// POST /api/auth/login - Login user
router.post("/login", async (req: Request, res: Response) => {
  try {
    const { username, password }: LoginRequest = req.body;

    if (!username || !password) {
      return res.status(400).json({
        message: "Username and password are required",
        status: 400,
        timestamp: new Date().toISOString(),
      });
    }

    const user = await userModel.getByUsername(username);
    const isValidPassword = await userModel.validatePassword(
      password,
      user.passwordHash
    );

    if (!isValidPassword) {
      return res.status(401).json({
        message: "Invalid credentials",
        status: 401,
        timestamp: new Date().toISOString(),
      });
    }

    const token = generateToken(user.id);
    const { passwordHash, ...userWithoutPassword } = user;

    const response: LoginResponse = {
      token,
      user: userWithoutPassword,
    };

    res.json(response);
  } catch (error) {
    res.status(401).json({
      message: "Invalid credentials",
      status: 401,
      timestamp: new Date().toISOString(),
    });
  }
});

// POST /api/auth/register - Register new contributor user (public)
router.post("/register", async (req: Request, res: Response) => {
  try {
    const { username, email, password }: RegisterRequest = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({
        message: "Username, email, and password are required",
        status: 400,
        timestamp: new Date().toISOString(),
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters long",
        status: 400,
        timestamp: new Date().toISOString(),
      });
    }

    const user = await userModel.create({ username, email, password });

    // Send verification email
    try {
      await emailService.sendVerificationEmail(
        user.email,
        user.username,
        user.emailVerificationToken!
      );
    } catch (error) {
      console.error("Failed to send verification email:", error);
      // Continue with registration even if email fails
    }

    const token = generateToken(user.id);

    const response: LoginResponse = {
      token,
      user,
    };

    res.status(201).json(response);
  } catch (error: any) {
    if (error.message.includes("UNIQUE constraint failed")) {
      return res.status(409).json({
        message: "Username or email already exists",
        status: 409,
        timestamp: new Date().toISOString(),
      });
    }

    res.status(500).json({
      message: "Error creating contributor account",
      status: 500,
      timestamp: new Date().toISOString(),
    });
  }
});

// GET /api/auth/me - Get current user
router.get(
  "/me",
  authenticateToken,
  async (req: AuthenticatedRequest, res: Response) => {
    res.json(req.user);
  }
);

// POST /api/auth/verify-email - Verify email address
router.post("/verify-email", async (req: Request, res: Response) => {
  try {
    const { token }: EmailVerificationRequest = req.body;

    if (!token) {
      return res.status(400).json({
        message: "Verification token is required",
        status: 400,
        timestamp: new Date().toISOString(),
      });
    }

    const user = await userModel.verifyEmail(token);

    // Send welcome email
    try {
      await emailService.sendWelcomeEmail(user.email, user.username);
    } catch (error) {
      console.error("Failed to send welcome email:", error);
      // Continue even if welcome email fails
    }

    res.json({
      message: "Email verified successfully",
      user,
    });
  } catch (error: any) {
    res.status(400).json({
      message: error.message || "Invalid verification token",
      status: 400,
      timestamp: new Date().toISOString(),
    });
  }
});

// POST /api/auth/resend-verification - Resend verification email
router.post("/resend-verification", async (req: Request, res: Response) => {
  try {
    const { email }: ResendVerificationRequest = req.body;

    if (!email) {
      return res.status(400).json({
        message: "Email is required",
        status: 400,
        timestamp: new Date().toISOString(),
      });
    }

    const user = await userModel.resendVerificationToken(email);

    // Send verification email
    try {
      await emailService.sendVerificationEmail(
        user.email,
        user.username,
        user.emailVerificationToken!
      );
    } catch (error) {
      console.error("Failed to send verification email:", error);
      return res.status(500).json({
        message: "Failed to send verification email",
        status: 500,
        timestamp: new Date().toISOString(),
      });
    }

    res.json({
      message: "Verification email sent successfully",
    });
  } catch (error: any) {
    res.status(400).json({
      message: error.message || "Failed to resend verification email",
      status: 400,
      timestamp: new Date().toISOString(),
    });
  }
});

// POST /api/auth/logout - Logout (client-side token removal)
router.post("/logout", (req: Request, res: Response) => {
  res.json({ message: "Logged out successfully" });
});

export { router as authRouter };
