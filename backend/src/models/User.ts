import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import crypto from "crypto";
import { database } from "../database/database";
import { User, LoginRequest, RegisterRequest } from "../../../shared/types";

export class UserModel {
  async create(userData: RegisterRequest): Promise<User> {
    const id = uuidv4();
    const passwordHash = await bcrypt.hash(userData.password, 10);
    const emailVerificationToken = crypto.randomBytes(32).toString("hex");
    const now = new Date().toISOString();

    await database.run(
      `INSERT INTO users (id, username, email, password_hash, role, email_verified, email_verification_token, created_at, updated_at) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        userData.username,
        userData.email,
        passwordHash,
        "contributor",
        false,
        emailVerificationToken,
        now,
        now,
      ]
    );

    return this.getById(id);
  }

  async getById(id: string): Promise<User> {
    const user = (await database.get(
      "SELECT id, username, email, role, email_verified, email_verification_token, created_at, updated_at FROM users WHERE id = ?",
      [id]
    )) as any;

    if (!user) {
      throw new Error("User not found");
    }

    return {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      emailVerified: Boolean(user.email_verified),
      emailVerificationToken: user.email_verification_token,
      createdAt: new Date(user.created_at),
      updatedAt: new Date(user.updated_at),
    };
  }

  async getByUsername(
    username: string
  ): Promise<User & { passwordHash: string }> {
    const user = (await database.get(
      "SELECT id, username, email, password_hash, role, email_verified, email_verification_token, created_at, updated_at FROM users WHERE username = ?",
      [username]
    )) as any;

    if (!user) {
      throw new Error("User not found");
    }

    return {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      emailVerified: Boolean(user.email_verified),
      emailVerificationToken: user.email_verification_token,
      passwordHash: user.password_hash,
      createdAt: new Date(user.created_at),
      updatedAt: new Date(user.updated_at),
    };
  }

  async validatePassword(
    plainPassword: string,
    hashedPassword: string
  ): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }

  async getAll(): Promise<User[]> {
    const users = (await database.all(
      "SELECT id, username, email, role, email_verified, email_verification_token, created_at, updated_at FROM users ORDER BY created_at DESC"
    )) as any[];

    return users.map((user: any) => ({
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      emailVerified: Boolean(user.email_verified),
      emailVerificationToken: user.email_verification_token,
      createdAt: new Date(user.created_at),
      updatedAt: new Date(user.updated_at),
    }));
  }

  async update(
    id: string,
    updates: Partial<RegisterRequest & { role?: "admin" | "contributor" }>
  ): Promise<User> {
    const now = new Date().toISOString();
    const fields = [];
    const values = [];

    if (updates.username) {
      fields.push("username = ?");
      values.push(updates.username);
    }
    if (updates.email) {
      fields.push("email = ?");
      values.push(updates.email);
    }
    if (updates.password) {
      const passwordHash = await bcrypt.hash(updates.password, 10);
      fields.push("password_hash = ?");
      values.push(passwordHash);
    }
    if (updates.role) {
      fields.push("role = ?");
      values.push(updates.role);
    }

    if (fields.length === 0) {
      throw new Error("No fields to update");
    }

    fields.push("updated_at = ?");
    values.push(now);
    values.push(id);

    await database.run(
      `UPDATE users SET ${fields.join(", ")} WHERE id = ?`,
      values
    );

    return this.getById(id);
  }

  async delete(id: string): Promise<void> {
    await database.run("DELETE FROM users WHERE id = ?", [id]);
  }

  async verifyEmail(token: string): Promise<User> {
    const user = (await database.get(
      "SELECT id FROM users WHERE email_verification_token = ? AND email_verified = 0",
      [token]
    )) as any;

    if (!user) {
      throw new Error("Invalid or expired verification token");
    }

    const now = new Date().toISOString();
    await database.run(
      "UPDATE users SET email_verified = 1, email_verification_token = NULL, updated_at = ? WHERE id = ?",
      [now, user.id]
    );

    return this.getById(user.id);
  }

  async getByEmailVerificationToken(token: string): Promise<User> {
    const user = (await database.get(
      "SELECT id, username, email, role, email_verified, email_verification_token, created_at, updated_at FROM users WHERE email_verification_token = ?",
      [token]
    )) as any;

    if (!user) {
      throw new Error("Invalid verification token");
    }

    return {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      emailVerified: Boolean(user.email_verified),
      emailVerificationToken: user.email_verification_token,
      createdAt: new Date(user.created_at),
      updatedAt: new Date(user.updated_at),
    };
  }

  async resendVerificationToken(email: string): Promise<User> {
    const user = (await database.get(
      "SELECT id FROM users WHERE email = ? AND email_verified = 0",
      [email]
    )) as any;

    if (!user) {
      throw new Error("User not found or already verified");
    }

    const emailVerificationToken = crypto.randomBytes(32).toString("hex");
    const now = new Date().toISOString();

    await database.run(
      "UPDATE users SET email_verification_token = ?, updated_at = ? WHERE id = ?",
      [emailVerificationToken, now, user.id]
    );

    return this.getById(user.id);
  }
}

export const userModel = new UserModel();
