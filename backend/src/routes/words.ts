import { Router } from "express";
import { wordModel } from "../models/Word";
import { DictionaryResponse } from "../../../shared/types";

const router = Router();

// GET /api/words - Get all words with pagination
router.get("/", async (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const sort = (req.query.sort as string) || "alphabetical";

    const result = await wordModel.getAll(page, limit, sort);

    const response: DictionaryResponse = {
      words: result.words,
      total: result.total,
      page,
      limit,
    };

    res.json(response);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching words",
      status: 500,
      timestamp: new Date().toISOString(),
    });
  }
});

// GET /api/words/alphabetical - Get all words in alphabetical order
router.get("/alphabetical", async (req, res) => {
  try {
    const words = await wordModel.getAlphabetically();
    res.json({ words });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching alphabetical words",
      status: 500,
      timestamp: new Date().toISOString(),
    });
  }
});

// GET /api/words/:id - Get a specific word by ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const word = await wordModel.getById(id);
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
      message: "Error fetching word",
      status: 500,
      timestamp: new Date().toISOString(),
    });
  }
});

export { router as wordsRouter };
