export interface User {
  id: string;
  email: string;
  password: string;
  createdAt: string;
  refreshToken: string;
}

export type UserInput = Pick<User, "email" | "password"> & { persistLogin: boolean };
