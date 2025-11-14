import axios from "axios";
import {
  Word,
  DictionaryResponse,
  SearchResponse,
  User,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  WordCreateRequest,
  WordUpdateRequest,
  SmileResponse,
} from "../types";

// Use environment variable for API URL, fallback to relative path for development
const API_BASE_URL = import.meta.env.VITE_API_URL || "/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const wordsApi = {
  // Get all words with pagination
  getWords: async (
    page = 1,
    limit = 10,
    sort = "alphabetical"
  ): Promise<DictionaryResponse> => {
    const response = await api.get(
      `/words?page=${page}&limit=${limit}&sort=${sort}`
    );
    return response.data;
  },

  // Get all words in alphabetical order
  getWordsAlphabetically: async (): Promise<{ words: Word[] }> => {
    const response = await api.get("/words/alphabetical");
    return response.data;
  },

  // Get a specific word by ID
  getWordById: async (id: string): Promise<Word> => {
    const response = await api.get(`/words/${id}`);
    return response.data;
  },

  // Search for words
  searchWords: async (query: string): Promise<SearchResponse> => {
    const response = await api.get(`/search?q=${encodeURIComponent(query)}`);
    return response.data;
  },
};

export const authApi = {
  // Login user
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    const response = await api.post("/auth/login", credentials);
    return response.data;
  },

  // Register user
  register: async (userData: RegisterRequest): Promise<LoginResponse> => {
    const response = await api.post("/auth/register", userData);
    return response.data;
  },

  // Get current user
  getCurrentUser: async (token: string): Promise<User> => {
    const response = await api.get("/auth/me", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  // Logout
  logout: async (): Promise<void> => {
    await api.post("/auth/logout");
  },

  // Verify email
  verifyEmail: async (
    token: string
  ): Promise<{ message: string; user: User }> => {
    const response = await api.post("/auth/verify-email", { token });
    return response.data;
  },

  // Resend verification email
  resendVerification: async (email: string): Promise<{ message: string }> => {
    const response = await api.post("/auth/resend-verification", { email });
    return response.data;
  },
};

// Smile API
export const smileApi = {
  // Add smile to word (public - for anonymous users)
  addSmile: async (wordId: string): Promise<SmileResponse> => {
    const response = await api.post("/smiles", { wordId });
    return response.data;
  },

  // Add smile to word (authenticated user)
  addUserSmile: async (
    wordId: string,
    token: string
  ): Promise<SmileResponse> => {
    const response = await api.post(
      "/smiles/user",
      { wordId },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  },

  // Get user's smiled words
  getUserSmiles: async (
    token: string
  ): Promise<{ smiledWordIds: string[]; count: number }> => {
    const response = await api.get("/smiles/user", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  // Remove smile from word (authenticated user)
  removeUserSmile: async (
    wordId: string,
    token: string
  ): Promise<SmileResponse> => {
    const response = await api.delete(`/smiles/user/${wordId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },
};

export const adminApi = {
  // Create word
  createWord: async (
    wordData: WordCreateRequest,
    token: string
  ): Promise<Word> => {
    const response = await api.post("/admin/words", wordData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  // Get all words (admin)
  getWords: async (
    page = 1,
    limit = 10,
    sort = "alphabetical",
    token: string
  ): Promise<{ words: Word[]; total: number }> => {
    const response = await api.get(
      `/admin/words?page=${page}&limit=${limit}&sort=${sort}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  },

  // Get word by ID (admin)
  getWordById: async (id: string, token: string): Promise<Word> => {
    const response = await api.get(`/admin/words/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  // Update word
  updateWord: async (
    id: string,
    updates: Partial<WordUpdateRequest>,
    token: string
  ): Promise<Word> => {
    const response = await api.put(`/admin/words/${id}`, updates, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  // Delete word
  deleteWord: async (id: string, token: string): Promise<void> => {
    await api.delete(`/admin/words/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },
};

export const usersApi = {
  // Get all users (admin only)
  getUsers: async (token: string): Promise<User[]> => {
    const response = await api.get("/users", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  // Get user by ID (admin only)
  getUserById: async (id: string, token: string): Promise<User> => {
    const response = await api.get(`/users/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  // Create user (admin only)
  createUser: async (
    userData: RegisterRequest & { role?: "admin" | "contributor" },
    token: string
  ): Promise<User> => {
    const response = await api.post("/users", userData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  // Update user (admin only)
  updateUser: async (
    id: string,
    updates: Partial<RegisterRequest & { role?: "admin" | "contributor" }>,
    token: string
  ): Promise<User> => {
    const response = await api.put(`/users/${id}`, updates, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  // Delete user (admin only)
  deleteUser: async (id: string, token: string): Promise<void> => {
    await api.delete(`/users/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },
};

export default api;
