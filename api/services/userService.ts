import { create, db } from "../models/db";
import type { User } from "../types/users";

export const createUser = async ({ email, password }: Pick<User, "email" | "password">) => {
  const newUser = create<User>({ email, password });
  if (db.data) {
    db.data.users.push(newUser);
    db.data.todos[newUser.id] = [];
    await db.write();
    return newUser;
  } else throw new Error("DB접속에 문제가 있습니다.");
};

export const findUser = (predicate: (user: User) => boolean) => {
  return db.data?.users.find(predicate);
};

export const writeRefreshToken = async (user: User, refreshToken: string) => {
  Object.assign(user, { ...user, refreshToken });
  await db.write();
  return refreshToken;
};
