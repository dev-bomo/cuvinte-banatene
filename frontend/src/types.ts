export interface Word {
  id: string;
  word: string;
  definition: string;
  shortDescription: string;
  category?: string;
  origin?: string;
  examples?: string[];
  pronunciation?: string;
  smileCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface WordSearchResult {
  word: Word;
  relevanceScore: number;
}

export interface DictionaryResponse {
  words: Word[];
  total: number;
  page: number;
  limit: number;
}

export interface SearchResponse {
  results: WordSearchResult[];
  total: number;
  query: string;
}

export interface ApiError {
  message: string;
  status: number;
  timestamp: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  role: "admin" | "contributor";
  emailVerified: boolean;
  emailVerificationToken?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface WordCreateRequest {
  word: string;
  definition: string;
  shortDescription: string;
  category?: string;
  origin?: string;
  examples?: string[];
  pronunciation?: string;
}

export interface WordUpdateRequest extends Partial<WordCreateRequest> {
  id: string;
}

export interface EmailVerificationRequest {
  token: string;
}

export interface ResendVerificationRequest {
  email: string;
}

export interface SmileRequest {
  wordId: string;
}

export interface SmileResponse {
  success: boolean;
  smileCount: number;
  message: string;
}
