import type { Request, Response } from "express";
import * as userService from "../services/userService";
import jwt, { Secret } from "jsonwebtoken";
import { createAccessToken, createRefreshToken } from "../utils/authorizeUtils";
import { StatusCodes } from "http-status-codes";
import { createError } from "../utils/responseUtils";

export const handleRefreshAccessToken = (req: Request, res: Response) => {
  const cookies = req.cookies;
  console.log("cookies:", cookies);
  if (!cookies?.jwt)
    return res.status(StatusCodes.UNAUTHORIZED).send(createError("Refresh token not found in your cookie"));
  const refreshToken: string = cookies.jwt;

  const foundUser = userService.findUser((user) => user.refreshToken === refreshToken);
  if (!foundUser) return res.status(StatusCodes.FORBIDDEN).send(createError("User Not Found"));

  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET as Secret, (err, decoded) => {
    if (typeof decoded === "object" && Object.keys(decoded).includes("email"))
      if (err || foundUser?.email !== decoded["email"]) return res.status(StatusCodes.FORBIDDEN);
      else {
        if (decoded.exp && decoded.exp - new Date().getTime() / 1000 < 24 * 60 * 60 - 60) {
          const newRefreshToken = createRefreshToken(foundUser, "1d");
          res.cookie("jwt", newRefreshToken, {
            httpOnly: true,
            sameSite: "none",
            secure: true,
            maxAge: 24 * 60 * 60 * 1000,
          });
          console.log("refresh token renewed");
        }
        const accessToken = createAccessToken(foundUser.email);
        console.log("access token refreshed");
        res.status(StatusCodes.OK).json({ token: accessToken });
      }
  });
};
