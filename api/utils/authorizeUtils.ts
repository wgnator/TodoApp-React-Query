import jwt, { Secret } from "jsonwebtoken";
import * as userService from "../services/userService";
import { User } from "../types/users";

export const createAccessToken = (email: string) => {
  return jwt.sign({ email }, process.env.ACCESS_TOKEN_SECRET as Secret, {
    expiresIn: "30s",
  });
};
export const createRefreshToken = (user: User, expiresIn?: "1d" | undefined) => {
  const refreshToken = expiresIn
    ? jwt.sign({ email: user.email }, process.env.REFRESH_TOKEN_SECRET as Secret, {
        expiresIn: expiresIn,
      })
    : jwt.sign({ email: user.email }, process.env.REFRESH_TOKEN_SECRET as Secret);
  userService.writeRefreshToken(user, refreshToken);
  return refreshToken;
};
