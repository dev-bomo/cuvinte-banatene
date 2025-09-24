import express, { Request, Response } from "express";
import { wordModel } from "../models/Word";
import { userSmileModel } from "../models/UserSmile";
import { authenticateToken, AuthenticatedRequest } from "../middleware/auth";
import { SmileRequest, SmileResponse } from "../../../shared/types";
import { database } from "../database/database";

const router = express.Router();

// POST /api/smiles - Add a smile to a word (public endpoint)
router.post("/", async (req: Request, res: Response) => {
  try {
    const { wordId }: SmileRequest = req.body;

    if (!wordId) {
      return res.status(400).json({
        message: "Word ID is required",
        status: 400,
        timestamp: new Date().toISOString(),
      });
    }

    // Check if word exists
    try {
      await wordModel.getById(wordId);
    } catch (error) {
      return res.status(404).json({
        message: "Word not found",
        status: 404,
        timestamp: new Date().toISOString(),
      });
    }

    // Increment smile count
    const now = new Date().toISOString();
    await database.run(
      "UPDATE words SET smile_count = smile_count + 1, updated_at = ? WHERE id = ?",
      [now, wordId]
    );

    // Get updated word to return new smile count
    const updatedWord = await wordModel.getById(wordId);

    const response: SmileResponse = {
      success: true,
      smileCount: updatedWord.smileCount,
      message: "Smile recorded successfully! 😊",
    };

    res.json(response);
  } catch (error: any) {
    console.error("Error adding smile:", error);
    res.status(500).json({
      message: "Internal server error",
      status: 500,
      timestamp: new Date().toISOString(),
    });
  }
});

// POST /api/smiles/user - Add a smile to a word (authenticated user)
router.post(
  "/user",
  authenticateToken,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { wordId }: SmileRequest = req.body;
      const userId = req.user!.id;

      if (!wordId) {
        return res.status(400).json({
          message: "Word ID is required",
          status: 400,
          timestamp: new Date().toISOString(),
        });
      }

      // Check if word exists
      try {
        await wordModel.getById(wordId);
      } catch (error) {
        return res.status(404).json({
          message: "Word not found",
          status: 404,
          timestamp: new Date().toISOString(),
        });
      }

      // Check if user has already smiled at this word
      const hasSmiled = await userSmileModel.hasUserSmiledAtWord(
        userId,
        wordId
      );
      if (hasSmiled) {
        return res.status(400).json({
          message: "You have already smiled at this word! 😊",
          status: 400,
          timestamp: new Date().toISOString(),
        });
      }

      // Add the smile
      await userSmileModel.addSmile(userId, wordId);

      // Get updated word to return new smile count
      const updatedWord = await wordModel.getById(wordId);

      const response: SmileResponse = {
        success: true,
        smileCount: updatedWord.smileCount,
        message: "Smile recorded successfully! 😊",
      };

      res.json(response);
    } catch (error: any) {
      console.error("Error adding user smile:", error);
      res.status(500).json({
        message: "Internal server error",
        status: 500,
        timestamp: new Date().toISOString(),
      });
    }
  }
);

// GET /api/smiles/user - Get user's smiled words
router.get(
  "/user",
  authenticateToken,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const userId = req.user!.id;
      const smiledWordIds = await userSmileModel.getUserSmiles(userId);

      res.json({
        smiledWordIds,
        count: smiledWordIds.length,
      });
    } catch (error: any) {
      console.error("Error getting user smiles:", error);
      res.status(500).json({
        message: "Internal server error",
        status: 500,
        timestamp: new Date().toISOString(),
      });
    }
  }
);

// DELETE /api/smiles/user/:wordId - Remove a smile from a word (authenticated user)
router.delete(
  "/user/:wordId",
  authenticateToken,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { wordId } = req.params;
      const userId = req.user!.id;

      // Check if user has smiled at this word
      const hasSmiled = await userSmileModel.hasUserSmiledAtWord(
        userId,
        wordId
      );
      if (!hasSmiled) {
        return res.status(400).json({
          message: "You haven't smiled at this word yet!",
          status: 400,
          timestamp: new Date().toISOString(),
        });
      }

      // Remove the smile
      await userSmileModel.removeSmile(userId, wordId);

      // Get updated word to return new smile count
      const updatedWord = await wordModel.getById(wordId);

      const response: SmileResponse = {
        success: true,
        smileCount: updatedWord.smileCount,
        message: "Smile removed successfully",
      };

      res.json(response);
    } catch (error: any) {
      console.error("Error removing user smile:", error);
      res.status(500).json({
        message: "Internal server error",
        status: 500,
        timestamp: new Date().toISOString(),
      });
    }
  }
);

export default router;
