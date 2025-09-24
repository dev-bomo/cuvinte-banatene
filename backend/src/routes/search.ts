import { Router } from "express";
import { wordModel } from "../models/Word";
import { SearchResponse, WordSearchResult } from "../../../shared/types";

const router = Router();

// GET /api/search?q=query - Search for words
router.get("/", async (req, res) => {
  try {
    const query = req.query.q as string;

    if (!query || query.trim().length === 0) {
      return res.status(400).json({
        message: "Search query is required",
        status: 400,
        timestamp: new Date().toISOString(),
      });
    }

    const results = await wordModel.search(query.trim());

    // Calculate relevance scores (simple implementation)
    const searchResults: WordSearchResult[] = results.map((word) => {
      let score = 0;
      const lowercaseQuery = query.toLowerCase();

      // Exact word match gets highest score
      if (word.word.toLowerCase() === lowercaseQuery) {
        score = 100;
      } else if (word.word.toLowerCase().startsWith(lowercaseQuery)) {
        score = 80;
      } else if (word.word.toLowerCase().includes(lowercaseQuery)) {
        score = 60;
      } else if (word.definition.toLowerCase().includes(lowercaseQuery)) {
        score = 40;
      } else if (word.shortDescription.toLowerCase().includes(lowercaseQuery)) {
        score = 20;
      }

      return {
        word,
        relevanceScore: score,
      };
    });

    // Sort by relevance score (highest first)
    searchResults.sort((a, b) => b.relevanceScore - a.relevanceScore);

    const response: SearchResponse = {
      results: searchResults,
      total: searchResults.length,
      query: query.trim(),
    };

    res.json(response);
  } catch (error) {
    res.status(500).json({
      message: "Error searching words",
      status: 500,
      timestamp: new Date().toISOString(),
    });
  }
});

export { router as searchRouter };
