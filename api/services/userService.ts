import { create, db } from "../models/db";
import type { User } from "../types/users";

export const createUser = async ({ email, password }: Pick<User, "email" | "password">) => {
  const newUser = create<User>({ email, password });

  db.data?.users.push(newUser);
  await db.write();

  return newUser;
};

export const findUser = (predicate: (user: User) => boolean) => {
  return db.data?.users.find(predicate);
};

export const writeRefreshToken = async (user: User, refreshToken: string) => {
  Object.assign(user, { ...user, refreshToken });
  await db.write();
  return refreshToken;
};
