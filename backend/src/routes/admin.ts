import { Router, Request, Response } from "express";
import { wordModel } from "../models/Word";
import {
  authenticateToken,
  requireContributor,
  requireAdmin,
  requireEmailVerification,
  AuthenticatedRequest,
} from "../middleware/auth";
import { WordCreateRequest, WordUpdateRequest } from "../../../shared/types";

const router = Router();

// Apply authentication and contributor middleware to all routes
router.use(authenticateToken);
router.use(requireContributor);

// POST /api/admin/words - Create new word (requires email verification)
router.post(
  "/words",
  requireEmailVerification,
  async (req: Request, res: Response) => {
    try {
      const wordData: WordCreateRequest = req.body;

      if (
        !wordData.word ||
        !wordData.definition ||
        !wordData.shortDescription
      ) {
        return res.status(400).json({
          message: "Word, definition, and short description are required",
          status: 400,
          timestamp: new Date().toISOString(),
        });
      }

      const word = await wordModel.create(wordData);
      res.status(201).json(word);
    } catch (error) {
      res.status(500).json({
        message: "Error creating word",
        status: 500,
        timestamp: new Date().toISOString(),
      });
    }
  }
);

// GET /api/admin/words - Get all words with pagination
router.get("/words", async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const sort = (req.query.sort as string) || "alphabetical";

    const result = await wordModel.getAll(page, limit, sort);
    res.json(result);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching words",
      status: 500,
      timestamp: new Date().toISOString(),
    });
  }
});

// GET /api/admin/words/:id - Get word by ID
router.get("/words/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const word = await wordModel.getById(id);
    res.json(word);
  } catch (error) {
    res.status(404).json({
      message: "Word not found",
      status: 404,
      timestamp: new Date().toISOString(),
    });
  }
});

// PUT /api/admin/words/:id - Update word (requires email verification)
router.put(
  "/words/:id",
  requireEmailVerification,
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const updates: Partial<WordUpdateRequest> = req.body;

      if (Object.keys(updates).length === 0) {
        return res.status(400).json({
          message: "No fields to update",
          status: 400,
          timestamp: new Date().toISOString(),
        });
      }

      const word = await wordModel.update(id, updates);
      res.json(word);
    } catch (error: any) {
      if (error.message === "Word not found") {
        return res.status(404).json({
          message: "Word not found",
          status: 404,
          timestamp: new Date().toISOString(),
        });
      }

      res.status(500).json({
        message: "Error updating word",
        status: 500,
        timestamp: new Date().toISOString(),
      });
    }
  }
);

// DELETE /api/admin/words/:id - Delete word (requires email verification)
router.delete(
  "/words/:id",
  requireEmailVerification,
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      await wordModel.delete(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({
        message: "Error deleting word",
        status: 500,
        timestamp: new Date().toISOString(),
      });
    }
  }
);

export { router as adminRouter };
