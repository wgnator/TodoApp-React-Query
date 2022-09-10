import jwt, { Secret } from "jsonwebtoken";
import type { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { createError } from "../utils/responseUtils";

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization || "";
  if (!token) {
    return res.status(StatusCodes.FORBIDDEN).send(createError("Token Not Received"));
  }
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as Secret, (err, decoded) => {
    console.log("verifying access token");
    if (err) {
      console.log("verification error:", err);
      return res.status(StatusCodes.FORBIDDEN).send(createError("Invalid Token")); //invalid token
    }
    next();
  });
};
