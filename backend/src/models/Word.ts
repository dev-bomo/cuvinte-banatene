import { v4 as uuidv4 } from "uuid";
import { database } from "../database/database";
import {
  Word,
  WordCreateRequest,
  WordUpdateRequest,
} from "../../../shared/types";

export class WordModel {
  async create(wordData: WordCreateRequest): Promise<Word> {
    const id = uuidv4();
    const now = new Date().toISOString();
    const examples = wordData.examples
      ? JSON.stringify(wordData.examples)
      : null;

    await database.run(
      `INSERT INTO words (id, word, definition, short_description, category, origin, examples, pronunciation, created_at, updated_at) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        wordData.word,
        wordData.definition,
        wordData.shortDescription,
        wordData.category || null,
        wordData.origin || null,
        examples,
        wordData.pronunciation || null,
        now,
        now,
      ]
    );

    return this.getById(id);
  }

  async getById(id: string): Promise<Word> {
    const word = (await database.get("SELECT * FROM words WHERE id = ?", [
      id,
    ])) as any;

    if (!word) {
      throw new Error("Word not found");
    }

    return this.mapDbWordToWord(word);
  }

  async getAll(
    page = 1,
    limit = 10,
    sort = "alphabetical"
  ): Promise<{ words: Word[]; total: number }> {
    let orderBy = "word ASC";
    if (sort === "created") {
      orderBy = "created_at DESC";
    }

    const offset = (page - 1) * limit;

    const words = (await database.all(
      `SELECT * FROM words ORDER BY ${orderBy} LIMIT ? OFFSET ?`,
      [limit, offset]
    )) as any[];

    const totalResult = (await database.get(
      "SELECT COUNT(*) as count FROM words"
    )) as any;
    const total = totalResult.count;

    return {
      words: words.map(this.mapDbWordToWord),
      total,
    };
  }

  async getAlphabetically(): Promise<Word[]> {
    const words = (await database.all(
      "SELECT * FROM words ORDER BY word ASC"
    )) as any[];

    return words.map(this.mapDbWordToWord);
  }

  async search(query: string): Promise<Word[]> {
    const searchTerm = `%${query.toLowerCase()}%`;
    const words = (await database.all(
      `SELECT * FROM words 
       WHERE LOWER(word) LIKE ? 
       OR LOWER(definition) LIKE ? 
       OR LOWER(short_description) LIKE ?
       ORDER BY word ASC`,
      [searchTerm, searchTerm, searchTerm]
    )) as any[];

    return words.map(this.mapDbWordToWord);
  }

  async update(id: string, updates: Partial<WordUpdateRequest>): Promise<Word> {
    const now = new Date().toISOString();
    const fields = [];
    const values = [];

    if (updates.word) {
      fields.push("word = ?");
      values.push(updates.word);
    }
    if (updates.definition) {
      fields.push("definition = ?");
      values.push(updates.definition);
    }
    if (updates.shortDescription) {
      fields.push("short_description = ?");
      values.push(updates.shortDescription);
    }
    if (updates.category !== undefined) {
      fields.push("category = ?");
      values.push(updates.category);
    }
    if (updates.origin !== undefined) {
      fields.push("origin = ?");
      values.push(updates.origin);
    }
    if (updates.examples !== undefined) {
      fields.push("examples = ?");
      values.push(updates.examples ? JSON.stringify(updates.examples) : null);
    }
    if (updates.pronunciation !== undefined) {
      fields.push("pronunciation = ?");
      values.push(updates.pronunciation);
    }

    if (fields.length === 0) {
      throw new Error("No fields to update");
    }

    fields.push("updated_at = ?");
    values.push(now);
    values.push(id);

    await database.run(
      `UPDATE words SET ${fields.join(", ")} WHERE id = ?`,
      values
    );

    return this.getById(id);
  }

  async delete(id: string): Promise<void> {
    await database.run("DELETE FROM words WHERE id = ?", [id]);
  }

  private mapDbWordToWord(dbWord: any): Word {
    return {
      id: dbWord.id,
      word: dbWord.word,
      definition: dbWord.definition,
      shortDescription: dbWord.short_description,
      category: dbWord.category,
      origin: dbWord.origin,
      examples: dbWord.examples ? JSON.parse(dbWord.examples) : undefined,
      pronunciation: dbWord.pronunciation,
      smileCount: dbWord.smile_count || 0,
      createdAt: new Date(dbWord.created_at),
      updatedAt: new Date(dbWord.updated_at),
    };
  }
}

export const wordModel = new WordModel();
