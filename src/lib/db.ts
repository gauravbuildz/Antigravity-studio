export interface User {
  id: string;
  email: string;
  passwordHash: string;
}

// In-memory user database
export const users: User[] = [];
