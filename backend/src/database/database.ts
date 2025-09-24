import sqlite3 from "sqlite3";
import { promisify } from "util";
import path from "path";

const dbPath = path.join(__dirname, "../../data/dictionary.db");

export class Database {
  private db: sqlite3.Database;
  public run: (sql: string, params?: any[]) => Promise<any>;
  public get: (sql: string, params?: any[]) => Promise<any>;
  public all: (sql: string, params?: any[]) => Promise<any>;

  constructor() {
    this.db = new sqlite3.Database(dbPath);
    this.run = promisify(this.db.run.bind(this.db));
    this.get = promisify(this.db.get.bind(this.db));
    this.all = promisify(this.db.all.bind(this.db));
    this.init();
  }

  private init() {
    // Create users table
    this.db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        username TEXT UNIQUE NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        role TEXT NOT NULL DEFAULT 'user',
        email_verified BOOLEAN NOT NULL DEFAULT 0,
        email_verification_token TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create words table
    this.db.run(`
        CREATE TABLE IF NOT EXISTS words (
          id TEXT PRIMARY KEY,
          word TEXT NOT NULL,
          definition TEXT NOT NULL,
          short_description TEXT NOT NULL,
          category TEXT,
          origin TEXT,
          examples TEXT, -- JSON string
          pronunciation TEXT,
          smile_count INTEGER NOT NULL DEFAULT 0,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

    // Create user_smiles table to track which words each user has smiled at
    this.db.run(`
        CREATE TABLE IF NOT EXISTS user_smiles (
          id TEXT PRIMARY KEY,
          user_id TEXT NOT NULL,
          word_id TEXT NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
          FOREIGN KEY (word_id) REFERENCES words (id) ON DELETE CASCADE,
          UNIQUE(user_id, word_id)
        )
      `);

    // Add missing columns to existing users table (migration)
    this.addMissingColumns();

    // Create indexes for better performance
    this.db.run(`CREATE INDEX IF NOT EXISTS idx_words_word ON words(word)`);
    this.db.run(
      `CREATE INDEX IF NOT EXISTS idx_words_category ON words(category)`
    );
    this.db.run(
      `CREATE INDEX IF NOT EXISTS idx_users_username ON users(username)`
    );
  }

  private addMissingColumns() {
    // Check if email_verified column exists, if not add it
    this.db.all("PRAGMA table_info(users)", (err, rows) => {
      if (err) {
        console.error("Error checking table structure:", err);
        return;
      }

      const columns = rows as any[];
      const hasEmailVerified = columns.some(
        (col) => col.name === "email_verified"
      );
      const hasEmailVerificationToken = columns.some(
        (col) => col.name === "email_verification_token"
      );

      if (!hasEmailVerified) {
        this.db.run(
          "ALTER TABLE users ADD COLUMN email_verified BOOLEAN NOT NULL DEFAULT 0",
          (err) => {
            if (err) {
              console.error("Error adding email_verified column:", err);
            } else {
              console.log("Added email_verified column to users table");
            }
          }
        );
      }

      if (!hasEmailVerificationToken) {
        this.db.run(
          "ALTER TABLE users ADD COLUMN email_verification_token TEXT",
          (err) => {
            if (err) {
              console.error(
                "Error adding email_verification_token column:",
                err
              );
            } else {
              console.log(
                "Added email_verification_token column to users table"
              );
            }
          }
        );
      }
    });

    // Check if smile_count column exists in words table, if not add it
    this.db.all("PRAGMA table_info(words)", (err, rows) => {
      if (err) {
        console.error("Error checking words table structure:", err);
        return;
      }

      const columns = rows as any[];
      const hasSmileCount = columns.some((col) => col.name === "smile_count");

      if (!hasSmileCount) {
        this.db.run(
          "ALTER TABLE words ADD COLUMN smile_count INTEGER NOT NULL DEFAULT 0",
          (err) => {
            if (err) {
              console.error("Error adding smile_count column:", err);
            } else {
              console.log("Added smile_count column to words table");
            }
          }
        );
      }
    });
  }

  close() {
    this.db.close();
  }
}

export const database = new Database();
