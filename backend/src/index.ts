import express from "express";
import cors from "cors";
import helmet from "helmet";
import path from "path";
import { wordsRouter } from "./routes/words";
import { searchRouter } from "./routes/search";
import { authRouter } from "./routes/auth";
import { adminRouter } from "./routes/admin";
import { usersRouter } from "./routes/users";
import smilesRouter from "./routes/smiles";
import { wordModel } from "./models/Word";
import { userModel } from "./models/User";
import { sampleWords } from "./data/words";

const app = express();
const PORT = process.env.PORT || 5002;

// Get directory paths (CommonJS)
const frontendDistPath = path.join(__dirname, "../../frontend/dist");

// Middleware
app.use(helmet({
  contentSecurityPolicy: false, // Allow inline scripts for Vite
}));
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/words", wordsRouter);
app.use("/api/search", searchRouter);
app.use("/api/auth", authRouter);
app.use("/api/admin", adminRouter);
app.use("/api/users", usersRouter);
app.use("/api/smiles", smilesRouter);

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use(
  (
    err: Error,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error(err.stack);
    res.status(500).json({
      message: "Something went wrong!",
      status: 500,
      timestamp: new Date().toISOString(),
    });
  }
);

// Serve static files from frontend/dist (in production)
if (process.env.NODE_ENV === "production") {
  app.use(express.static(frontendDistPath));
  
  // SPA fallback: serve index.html for all non-API routes
  app.get("*", (req, res, next) => {
    // Don't serve index.html for API routes
    if (req.path.startsWith("/api")) {
      return next();
    }
    res.sendFile(path.join(frontendDistPath, "index.html"));
  });
} else {
  // 404 handler for API routes in development
  app.use("/api/*", (req, res) => {
    res.status(404).json({
      message: "Route not found",
      status: 404,
      timestamp: new Date().toISOString(),
    });
  });
}

// Initialize database with sample data
async function initializeDatabase() {
  try {
    // Check if we have any words in the database
    const existingWords = await wordModel.getAll(1, 1);

    if (existingWords.total === 0) {
      console.log("Initializing database with sample words...");

      // Add sample words to database
      for (const word of sampleWords) {
        await wordModel.create({
          word: word.word,
          definition: word.definition,
          shortDescription: word.shortDescription,
          category: word.category,
          origin: word.origin,
          examples: word.examples,
          pronunciation: word.pronunciation,
        });
      }

      console.log(`Added ${sampleWords.length} sample words to database`);
    }

    // Check if we have any users
    const existingUsers = await userModel.getAll();

    if (existingUsers.length === 0) {
      console.log("Creating default admin user...");

      // Create default contributor user
      const contributor = await userModel.create({
        username: "contributor",
        email: "contributor@cuvintebanatene.ro",
        password: "contributor123",
      });

      // Create default admin user
      const admin = await userModel.create({
        username: "admin",
        email: "admin@cuvintebanatene.ro",
        password: "admin123",
      });

      // Update admin role
      await userModel.update(admin.id, { role: "admin" });

      console.log("Default users created:");
      console.log(
        "Contributor - Username: contributor, Password: contributor123"
      );
      console.log("Admin - Username: admin, Password: admin123");
    }
  } catch (error) {
    console.error("Error initializing database:", error);
  }
}

// Start server
app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);
  await initializeDatabase();
});
