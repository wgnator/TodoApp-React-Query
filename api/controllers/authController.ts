import bcrypt from "bcrypt";
import type { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import * as userService from "../services/userService";
import { createError } from "../utils/responseUtils";
import { loginValidator, USER_VALIDATION_ERRORS } from "../utils/validator";
import { createAccessToken, createRefreshToken } from "../utils/authorizeUtils";

import type { UserInput } from "../types/users";

// 로그인
export const login = async (req: Request, res: Response) => {
  const { email, password, persistLogin }: UserInput = req.body;
  console.log("persistLogin:", persistLogin);
  const { isValid, message } = loginValidator({ email, password });
  if (!isValid) {
    return res.status(StatusCodes.BAD_REQUEST).send(createError(message));
  }
  const foundUser = userService.findUser((user) => user.email === email);
  const isMatch = foundUser ? await bcrypt.compare(password, foundUser.password) : false;
  console.log("foundUser:", foundUser, "isMatch:", isMatch);
  if (foundUser && isMatch) {
    const accessToken = createAccessToken(email);
    const refreshToken = createRefreshToken(foundUser, persistLogin ? undefined : "1d");
    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      sameSite: "none",
      secure: true,
      maxAge: 24 * 60 * 60 * 1000,
    });
    return res.status(StatusCodes.OK).send({
      message: "성공적으로 로그인 했습니다",
      userName: foundUser.email.split("@")[0],
      token: accessToken,
    });
  } else {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .send(createError(USER_VALIDATION_ERRORS.USER_NOT_FOUND));
  }
};

// 회원 가입
export const signUp = async (req: Request, res: Response) => {
  const { email, password }: UserInput = req.body;

  const { isValid, message } = loginValidator({ email, password });
  if (!isValid) {
    return res.status(StatusCodes.BAD_REQUEST).send(createError(message));
  }

  const existUser = userService.findUser((user) => user.email === email);
  if (existUser) {
    return res.status(StatusCodes.CONFLICT).send(createError(USER_VALIDATION_ERRORS.EXIST_USER));
  } else {
    const hashedPwd = await bcrypt.hash(password, 10);
    await userService.createUser({ email, password: hashedPwd });

    return res.status(StatusCodes.OK).send({
      message: "계정이 성공적으로 생성되었습니다",
    });
  }
};

export const logout = async (req: Request, res: Response) => {
  const cookies = req.cookies;
  console.log("cookies:", cookies);
  if (!cookies?.jwt)
    return res.status(StatusCodes.UNAUTHORIZED).send(createError("Refresh Token Unavailable"));
  const refreshToken: string = cookies.jwt;

  const foundUser = userService.findUser((user) => user.refreshToken === refreshToken);
  if (foundUser) userService.writeRefreshToken(foundUser, "");

  res.clearCookie("jwt", { httpOnly: true, sameSite: "none", secure: true });
  res.status(StatusCodes.NO_CONTENT).send();
};
