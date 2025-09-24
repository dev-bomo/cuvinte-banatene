import { v4 as uuidv4 } from "uuid";
import { database } from "../database/database";

export class UserSmileModel {
  async addSmile(userId: string, wordId: string): Promise<void> {
    const id = uuidv4();
    const now = new Date().toISOString();

    // First, increment the smile count for the word
    await database.run(
      "UPDATE words SET smile_count = smile_count + 1, updated_at = ? WHERE id = ?",
      [now, wordId]
    );

    // Then, record the user's smile
    await database.run(
      `INSERT INTO user_smiles (id, user_id, word_id, created_at) 
       VALUES (?, ?, ?, ?)`,
      [id, userId, wordId, now]
    );
  }

  async hasUserSmiledAtWord(userId: string, wordId: string): Promise<boolean> {
    const result = (await database.get(
      "SELECT id FROM user_smiles WHERE user_id = ? AND word_id = ?",
      [userId, wordId]
    )) as any;

    return !!result;
  }

  async getUserSmiles(userId: string): Promise<string[]> {
    const smiles = (await database.all(
      "SELECT word_id FROM user_smiles WHERE user_id = ? ORDER BY created_at DESC",
      [userId]
    )) as any[];

    return smiles.map((smile) => smile.word_id);
  }

  async removeSmile(userId: string, wordId: string): Promise<void> {
    const now = new Date().toISOString();

    // First, decrement the smile count for the word
    await database.run(
      "UPDATE words SET smile_count = smile_count - 1, updated_at = ? WHERE id = ? AND smile_count > 0",
      [now, wordId]
    );

    // Then, remove the user's smile record
    await database.run(
      "DELETE FROM user_smiles WHERE user_id = ? AND word_id = ?",
      [userId, wordId]
    );
  }
}

export const userSmileModel = new UserSmileModel();

