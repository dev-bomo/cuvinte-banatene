import { Router, Request, Response } from "express";
import { userModel } from "../models/User";
import {
  authenticateToken,
  requireAdmin,
  AuthenticatedRequest,
} from "../middleware/auth";
import { RegisterRequest } from "../../../shared/types";

const router = Router();

// Apply authentication and admin middleware to all routes
router.use(authenticateToken);
router.use(requireAdmin);

// GET /api/users - Get all users (admin only)
router.get("/", async (req: Request, res: Response) => {
  try {
    const users = await userModel.getAll();
    res.json(users);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching users",
      status: 500,
      timestamp: new Date().toISOString(),
    });
  }
});

// GET /api/users/:id - Get user by ID (admin only)
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = await userModel.getById(id);
    res.json(user);
  } catch (error: any) {
    if (error.message === "User not found") {
      return res.status(404).json({
        message: "User not found",
        status: 404,
        timestamp: new Date().toISOString(),
      });
    }

    res.status(500).json({
      message: "Error fetching user",
      status: 500,
      timestamp: new Date().toISOString(),
    });
  }
});

// POST /api/users - Create user (admin only)
router.post("/", async (req: Request, res: Response) => {
  try {
    const userData: RegisterRequest & { role?: "admin" | "contributor" } = req.body;

    if (!userData.username || !userData.email || !userData.password) {
      return res.status(400).json({
        message: "Username, email, and password are required",
        status: 400,
        timestamp: new Date().toISOString(),
      });
    }

    if (userData.password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters long",
        status: 400,
        timestamp: new Date().toISOString(),
      });
    }

    const user = await userModel.create(userData);
    
    // If role is specified, update it
    if (userData.role) {
      await userModel.update(user.id, { role: userData.role });
      user.role = userData.role;
    }

    res.status(201).json(user);
  } catch (error: any) {
    if (error.message.includes("UNIQUE constraint failed")) {
      return res.status(409).json({
        message: "Username or email already exists",
        status: 409,
        timestamp: new Date().toISOString(),
      });
    }

    res.status(500).json({
      message: "Error creating user",
      status: 500,
      timestamp: new Date().toISOString(),
    });
  }
});

// PUT /api/users/:id - Update user (admin only)
router.put("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updates: Partial<RegisterRequest & { role?: "admin" | "contributor" }> = req.body;

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        message: "No fields to update",
        status: 400,
        timestamp: new Date().toISOString(),
      });
    }

    // Don't allow updating password through this endpoint
    if (updates.password) {
      delete updates.password;
    }

    const user = await userModel.update(id, updates);
    res.json(user);
  } catch (error: any) {
    if (error.message === "User not found") {
      return res.status(404).json({
        message: "User not found",
        status: 404,
        timestamp: new Date().toISOString(),
      });
    }

    if (error.message.includes("UNIQUE constraint failed")) {
      return res.status(409).json({
        message: "Username or email already exists",
        status: 409,
        timestamp: new Date().toISOString(),
      });
    }

    res.status(500).json({
      message: "Error updating user",
      status: 500,
      timestamp: new Date().toISOString(),
    });
  }
});

// DELETE /api/users/:id - Delete user (admin only)
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    // Prevent admin from deleting themselves
    const currentUser = (req as AuthenticatedRequest).user;
    if (currentUser && currentUser.id === id) {
      return res.status(400).json({
        message: "Cannot delete your own account",
        status: 400,
        timestamp: new Date().toISOString(),
      });
    }

    await userModel.delete(id);
    res.status(204).send();
  } catch (error: any) {
    if (error.message === "User not found") {
      return res.status(404).json({
        message: "User not found",
        status: 404,
        timestamp: new Date().toISOString(),
      });
    }

    res.status(500).json({
      message: "Error deleting user",
      status: 500,
      timestamp: new Date().toISOString(),
    });
  }
});

export { router as usersRouter };
